import basicAuth from 'basic-auth'

export function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const user = basicAuth(req)
    if (!user || user.name !== process.env.ADMIN_USER || user.pass !== process.env.ADMIN_PASS) {
      return new Response('Auth Required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
      })
    }
  }
}

export const config = { matcher: ['/admin/:path*'] }
