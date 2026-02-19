# scripts/import_final_array.py
import os
import json
import uuid
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

print("="*80)
print("🏢 IMPORT FINAL - FORMAT ARRAY CORRIGÉ")
print("="*80)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

# Charger les entreprises
print("\n📖 Lecture du fichier entreprises...")
with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
    entreprises = json.load(f)
print(f"✅ {len(entreprises)} entreprises chargées")

# Préparer l'import
print("\n📥 Adaptation à la structure...")
lots = []
lot_actuel = []
total = len(entreprises)

for i, e in enumerate(entreprises, 1):
    # Convertir les listes en chaînes simples
    telephone = e.get('telephones', [])
    telephone = telephone[0] if telephone else None
    
    email = e.get('emails', [])
    email = email[0] if email else None
    
    # Pour la colonne products (type ARRAY)
    produits = e.get('produits', [])
    if not produits:
        produits = []  # Array vide
    
    # Créer l'entrée avec les colonnes EXACTES
    entreprise = {
        'id': str(uuid.uuid4()),
        'name': e.get('nom', '')[:500],
        'activity_sector': e.get('secteur', ''),
        'wilaya': e.get('wilaya', ''),
        'address': e.get('adresse', ''),
        'phone': telephone,
        'email': email,
        'products': produits,  # Directement la liste, pas json.dumps()
        'source_file': 'import_2024_nouveau',
        'created_at': datetime.now().isoformat(),
        'is_duplicate': False,
        'can_export': True
    }
    
    # Ajouter description si présente (dans exporter_notes)
    if e.get('description'):
        entreprise['exporter_notes'] = e.get('description')[:1000]
    
    lot_actuel.append(entreprise)
    
    if len(lot_actuel) >= 100 or i == total:
        lots.append(lot_actuel)
        lot_actuel = []
    
    if i % 100 == 0:
        print(f"   • {i}/{total} préparées...")

print(f"\n📦 {len(lots)} lots à importer")

# Importer
print("\n🚀 Début de l'import...")
succes = 0
erreurs = []

for idx, lot in enumerate(lots, 1):
    try:
        result = supabase.table('exporters').insert(lot).execute()
        succes += len(lot)
        print(f"✅ Lot {idx}/{len(lots)}: {len(lot)} entreprises importées")
    except Exception as e:
        erreurs.append(f"Lot {idx}: {str(e)[:200]}")
        print(f"❌ Lot {idx}: échec - {str(e)[:100]}")

# Rapport final
print("\n" + "="*80)
print("📊 RAPPORT FINAL")
print("="*80)
print(f"✅ Importées: {succes} entreprises")
print(f"❌ Échecs: {len(erreurs)} lots")
print(f"📁 Total source: {total} entreprises")

if erreurs:
    print("\nDétail des erreurs:")
    for err in erreurs[:5]:
        print(f"   • {err}")

# Vérification
print("\n🔍 Vérification finale...")
verif = supabase.table('exporters').select('*', count='exact').execute()
print(f"📊 Entreprises en base: {verif.count}")

print("\n" + "="*80)
print("✅ IMPORT TERMINÉ")
print("="*80)