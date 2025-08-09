import { NextResponse } from 'next/server'

export function middleware(req) {
  if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()
  const auth = req.headers.get('authorization') || ''
  const [type, token] = auth.split(' ')
  if (type !== 'Basic' || !token) {
    return new Response('Auth required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin"' } })
  }
  let u = '', p = ''
  try {
    const decoded = globalThis.atob(token) || ''
    const i = decoded.indexOf(':')
    u = i >= 0 ? decoded.slice(0, i) : ''
    p = i >= 0 ? decoded.slice(i + 1) : ''
  } catch (_) {}
  if (u !== process.env.ADMIN_USER || p !== process.env.ADMIN_PASS) return new Response('Forbidden', { status: 403 })
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
