import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
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

    // Récupérer toutes les conversations de l'utilisateur
    const { data: messages, error } = await supabase
      .from('encrypted_messages')
      .select(`
        *,
        sender:sender_id(id, email),
        recipient:recipient_id(id, email)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération conversations:', error);
      return NextResponse.json({ error: 'Erreur récupération' }, { status: 500 });
    }

    // Organiser par conversation
    const conversationsMap = new Map();
    
    messages.forEach((msg: any) => {
      const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender;
      
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          userId: otherUser.id,
          userName: otherUser.email?.split('@')[0] || 'Utilisateur',
          lastMessage: msg.encrypted_content.substring(0, 50) + '...',
          lastMessageDate: msg.created_at,
          unread: msg.recipient_id === user.id && !msg.read_at
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Erreur API conversations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}