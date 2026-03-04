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

    const { data: { user } } = await supabase.auth.getUser();
    
    const { supplierId, productId, buyerName, buyerEmail, buyerCompany, buyerPhone, quantity, unit, deadline, specifications, customFields } = await request.json();

    if (!supplierId || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('rfqs')
      .insert({
        supplier_id: supplierId,
        product_id: productId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_company: buyerCompany,
        buyer_phone: buyerPhone,
        quantity,
        unit,
        deadline,
        specifications,
        custom_fields: customFields,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur insertion RFQ:', error);
      return NextResponse.json({ error: 'Erreur création RFQ' }, { status: 500 });
    }

    return NextResponse.json({ rfq: data });
  } catch (error) {
    console.error('Erreur API RFQ:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');

    if (!supplierId) {
      return NextResponse.json({ error: 'supplierId requis' }, { status: 400 });
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

    const { data: rfqs, error } = await supabase
      .from('rfqs')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération RFQs:', error);
      return NextResponse.json({ error: 'Erreur récupération' }, { status: 500 });
    }

    return NextResponse.json({ rfqs });
  } catch (error) {
    console.error('Erreur API RFQ:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}