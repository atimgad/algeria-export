// middleware.js
import { NextResponse } from 'next/server'

const defaultLocale = 'fr'
const locales = ['fr', 'en', 'de', 'it', 'es', 'ar', 'ru', 'zh', 'ja', 'ko', 'th', 'id', 'ms', 'hi', 'pt', 'sw', 'ha', 'yo', 'ig', 'am', 'so']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Vérifier si le chemin a déjà une locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (pathnameHasLocale) return NextResponse.next()
  
  // Rediriger vers la locale par défaut
  const url = new URL(`/${defaultLocale}${pathname}`, request.url)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}