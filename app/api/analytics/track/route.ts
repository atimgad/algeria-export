import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fonction pour hasher l'IP (anonymisation)
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'default-salt')).digest('hex').slice(0, 32);
}

// Détection du type d'appareil
function getDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

export async function POST(request: NextRequest) {
  try {
    const { path, title } = await request.json();
    
    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const sessionId = request.headers.get('x-session-id') || crypto.randomUUID();

    const pageView = {
      path,
      title,
      referrer,
      user_agent: userAgent,
      ip_hash: hashIP(ip.split(',')[0].trim()),
      session_id: sessionId,
      device_type: getDeviceType(userAgent),
      created_at: new Date().toISOString()
    };

    // Insertion asynchrone (ne bloque pas la réponse)
    await supabase.from('page_views').insert(pageView);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}