import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/admin')) {
        let response = NextResponse.next({
            request: {
                headers: req.headers,
            },
        })

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return req.cookies.getAll().map(cookie => ({
                            name: cookie.name,
                            value: cookie.value,
                        }))
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            req.cookies.set({
                                name,
                                value,
                                ...options,
                            })
                            response = NextResponse.next({
                                request: {
                                    headers: req.headers,
                                },
                            })
                            response.cookies.set({
                                name,
                                value,
                                ...options,
                            })
                        })
                    },
                },
            }
        )

        const {
            data: { session },
        } = await supabase.auth.getSession()

        // Protect admin routes
        if (pathname !== '/admin/login' && pathname !== '/admin/setup') {
            if (!session) {
                // Redirect to login if not authenticated
                return NextResponse.redirect(new URL('/admin/login', req.url))
            }

            // Check if user is admin
            const isAdmin = session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
            if (!isAdmin) {
                // Redirect to unauthorized page if not admin
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }
        }

        // Redirect authenticated users away from login page
        if (pathname === '/admin/login' && session) {
            const isAdmin = session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
            if (isAdmin) {
                return NextResponse.redirect(new URL('/admin/dashboard', req.url))
            }
        }

        return response
    }

    // For other routes (API, etc.), proceed normally
    return NextResponse.next({
        request: {
            headers: req.headers,
        },
    })
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
