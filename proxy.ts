import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  
  // Détection des bots
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.match(/bot|crawler|spider|scraper|selenium|puppet|headless/i)) {
    return new NextResponse('Accès interdit', { status: 403 });
  }
  
  // Log de sécurité
  console.log(`[SECURITY] ${request.ip || 'unknown'} - ${request.nextUrl.pathname}`);
  
  return response;
}

export const config = {
  matcher: [
    '/api/messages/:path*',
    '/dashboard/:path*',
    '/rfq/:path*'
  ],
};