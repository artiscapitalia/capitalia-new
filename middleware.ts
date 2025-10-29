import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import type { SupabaseClient } from '@supabase/supabase-js'

// Default language and supported languages cache
const DEFAULT_LANGUAGE = 'en'
let supportedLanguages: string[] = []
let lastLanguageFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getSupportedLanguages(supabase: SupabaseClient): Promise<string[]> {
  const now = Date.now()
  
  // Return cached languages if still valid
  if (supportedLanguages.length > 0 && now - lastLanguageFetch < CACHE_DURATION) {
    return supportedLanguages
  }
  
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('code')
      .eq('is_active', true)
    
    if (!error && data) {
      supportedLanguages = data.map((lang: { code: string }) => lang.code)
      lastLanguageFetch = now
      return supportedLanguages
    }
  } catch (error) {
    console.error('Error fetching supported languages:', error)
  }
  
  // Fallback to default language
  return [DEFAULT_LANGUAGE]
}

function isLanguagePath(pathname: string): { isLangPath: boolean; lang?: string; restPath?: string } {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) {
    return { isLangPath: false }
  }
  
  const firstSegment = segments[0]
  
  // Check if first segment looks like a language code (2-5 chars, lowercase)
  if (/^[a-z]{2,5}(-[a-z]{2,4})?$/.test(firstSegment)) {
    return {
      isLangPath: true,
      lang: firstSegment,
      restPath: segments.length > 1 ? '/' + segments.slice(1).join('/') : '/'
    }
  }
  
  return { isLangPath: false }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
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

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle language-based routing for non-admin, non-api routes
  if (!pathname.startsWith('/admin') && 
      !pathname.startsWith('/api') && 
      !pathname.startsWith('/_next') &&
      !pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp)$/)) {
    
    const supportedLangs = await getSupportedLanguages(supabase)
    const { isLangPath, lang, restPath } = isLanguagePath(pathname)
    
    if (isLangPath && lang) {
      // Check if the language is supported
      if (!supportedLangs.includes(lang)) {
        // Redirect to default language with same path
        const redirectUrl = new URL(`/${DEFAULT_LANGUAGE}${restPath || '/'}`, req.url)
        return NextResponse.redirect(redirectUrl)
      }
    } else if (pathname === '/' || pathname === '') {
      // Root path - redirect to default language
      const redirectUrl = new URL(`/${DEFAULT_LANGUAGE}/`, req.url)
      return NextResponse.redirect(redirectUrl)
    } else if (!isLangPath) {
      // Path without language prefix - redirect to default language
      const redirectUrl = new URL(`/${DEFAULT_LANGUAGE}${pathname}`, req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && 
      pathname !== '/admin/login' && 
      pathname !== '/admin/setup') {
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
