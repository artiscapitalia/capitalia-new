"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type AlertType = "success" | "error" | "info" | "confirm";

export type AlertPosition = "top" | "bottom";

export type AlertOptions = {
    type: AlertType;
    message: string;
    position?: AlertPosition; // default: "bottom"
    durationMs?: number; // auto-dismiss for non-confirm
    onConfirm?: () => void;
    onCancel?: () => void;
};

type AlertItem = AlertOptions & { id: string };

type AlertContextValue = {
    showAlert: (options: AlertOptions) => string; // returns id
    dismissAlert: (id: string) => void;
    alerts: AlertItem[];
};

const AlertContext = createContext<AlertContextValue | null>(null);

export const useAlert = (): AlertContextValue => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert must be used within AlertProvider");
    return ctx;
};

const createId = (): string => Math.random().toString(36).slice(2, 9);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const timersRef = useRef<Record<string, number>>({});

    const dismissAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
        const t = timersRef.current[id];
        if (t) {
            clearTimeout(t);
            delete timersRef.current[id];
        }
    }, []);

    const showAlert = useCallback((options: AlertOptions) => {
        const id = createId();
        const alert: AlertItem = { id, ...options };
        setAlerts((prev) => [...prev, alert]);

        if (options.type !== "confirm") {
            const duration = options.durationMs ?? 3000;
            const timer = window.setTimeout(() => dismissAlert(id), duration);
            timersRef.current[id] = timer;
        }

        return id;
    }, [dismissAlert]);

    const value = useMemo(() => ({ showAlert, dismissAlert, alerts }), [showAlert, dismissAlert, alerts]);

    const topAlerts = alerts.filter((alert) => (alert.position ?? "bottom") === "top");
    const bottomAlerts = alerts.filter((alert) => (alert.position ?? "bottom") === "bottom");

    return (
        <AlertContext.Provider value={value}>
            {children}
            {/* Container renders alerts at top */}
            {topAlerts.length > 0 && (
                <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex w-full justify-center px-4">
                    <div className="flex max-w-md flex-col gap-2 w-full">
                        {topAlerts.map((alert) => (
                            <AlertItemView key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />
                        ))}
                    </div>
                </div>
            )}
            {/* Container renders alerts at bottom */}
            {bottomAlerts.length > 0 && (
                <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex w-full justify-center px-4">
                    <div className="flex max-w-md flex-col gap-2 w-full">
                        {bottomAlerts.map((alert) => (
                            <AlertItemView key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />
                        ))}
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};

const AlertItemView: React.FC<{ alert: AlertItem; onDismiss: () => void }> = ({ alert, onDismiss }) => {
    const { type, message, onConfirm, onCancel } = alert;

    const baseColor =
        type === "success" ? "bg-green-600" :
            type === "error" ? "bg-red-600" :
                type === "info" ? "bg-blue-600" :
                    "bg-black"; // confirm

    return (
        <div className={`pointer-events-auto ${baseColor} text-white rounded-lg px-4 py-3 flex items-center justify-between gap-3`}>
            <div className="text-sm leading-snug">{message}</div>
            {type === "confirm" ? (
                <div className="flex items-center gap-2">
                    <button
                        className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs"
                        onClick={() => { onConfirm?.(); onDismiss(); }}
                    >
                        Confirm
                    </button>
                    <button
                        className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs"
                        onClick={() => { onCancel?.(); onDismiss(); }}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    className="rounded-full bg-white/10 hover:bg-white/20 px-2 py-1 text-xs"
                    onClick={onDismiss}
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

