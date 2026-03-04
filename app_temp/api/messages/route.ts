import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { recipientId, encryptedContent, iv, salt } = await request.json();

    if (!recipientId || !encryptedContent || !iv) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('encrypted_messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        encrypted_content: encryptedContent,
        iv: iv,
        salt: salt || null
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur insertion message:', error);
      return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
    }

    return NextResponse.json({ message: data });
  } catch (error) {
    console.error('Erreur API messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les messages entre l'utilisateur connecté et l'autre utilisateur
    const { data: messages, error } = await supabase
      .from('encrypted_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur récupération messages:', error);
      return NextResponse.json({ error: 'Erreur récupération' }, { status: 500 });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Erreur API messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}