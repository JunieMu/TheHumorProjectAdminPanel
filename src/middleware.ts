import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/login'
  const isAuthCallback = request.nextUrl.pathname === '/auth/callback'
  const isAccessDeniedPage = request.nextUrl.pathname === '/access-denied'

  // If user is not logged in and not on login/auth pages, redirect to login
  if (!user && !isLoginPage && !isAuthCallback && !isAccessDeniedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in, check if they are superadmin
  if (user && !isAuthCallback && !isAccessDeniedPage) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_superadmin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_superadmin) {
      // If not superadmin and not already on access-denied, redirect
      if (!isAccessDeniedPage) {
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }
    } else if (isLoginPage) {
      // If superadmin is on login page, redirect to dashboard
      return NextResponse.redirect(new URL('/', request.url))
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
