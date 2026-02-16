import { NextResponse } from 'next/server';
import { verifyNIF } from '@/lib/nif-verification';

export async function POST(request: Request) {
  try {
    const { nif, forceRefresh } = await request.json();

    if (!nif) {
      return NextResponse.json(
        { error: 'NIF requis' },
        { status: 400 }
      );
    }

    const result = await verifyNIF({ nif }, { forceRefresh });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur API NIF:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}