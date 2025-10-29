import type { Metadata } from "next";
import { Open_Sans, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { AlertProvider } from "@/contexts/AlertContext";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Capitalia Web",
  description: "Capitalia Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${robotoSlab.variable} antialiased`}
      >
        <AuthProvider>
          <AlertProvider>
            <ConditionalHeader />
            {children}
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
