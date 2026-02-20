import { NextRequest, NextResponse } from 'next/server';
import { verifyNIF } from '@/lib/nif-verification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nif } = body;

    if (!nif || typeof nif !== 'string') {
      return NextResponse.json(
        { error: 'NIF invalide ou manquant' },
        { status: 400 }
      );
    }

    // Création d'un objet de requête conforme au type NIFVerificationRequest
    const verificationRequest = {
      nif: nif,
      userId: 'api-user',
      timestamp: new Date().toISOString()
    };

    const result = await verifyNIF(nif, verificationRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur API NIF:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification du NIF' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'API de vérification NIF - Utilisez POST avec un body { nif: "votre_nif" }',
      version: '1.0.0',
      status: 'active'
    },
    { status: 200 }
  );
}