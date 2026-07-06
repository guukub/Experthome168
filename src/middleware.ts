import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Protect /admin routes (except /admin/login)
  const isAuthAdmin = request.cookies.get('auth_admin')?.value === 'true'
  // Also support the old demo_admin cookie during transition
  const isDemoAdmin = request.cookies.get('demo_admin')?.value === 'true'
  const isLoggedIn = isAuthAdmin || isDemoAdmin

  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in admin away from login page
  if (request.nextUrl.pathname === '/admin/login' && isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
