# scripts/reset_complet.py
import os
from supabase import create_client
from dotenv import load_dotenv

print("="*80)
print("🔄 RESET COMPLET - SUPPRESSION EN CASCADE")
print("="*80)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

# 1. SUPPRIMER D'ABORD LES TABLES LIÉES
print("\n🗑️  Suppression des tables liées...")
try:
    # Supprimer commission_promotions
    supabase.table('commission_promotions').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("✅ commission_promotions vidé")
except Exception as e:
    print(f"⚠️  {e}")

# 2. MAINTENANT SUPPRIMER EXPORTERS
print("\n🗑️  Suppression des entreprises...")
try:
    supabase.table('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("✅ exporters vidé")
except Exception as e:
    print(f"❌ {e}")
    exit()

# 3. IMPORTER LES 1249 UNIQUES
print("\n📥 Import des entreprises uniques...")
import json
import uuid
from datetime import datetime

# Charger le fichier
with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
    entreprises = json.load(f)

# Filtrer les doublons
noms_vus = set()
uniques = []
for e in entreprises:
    nom = e.get('nom', '')
    if nom and nom not in noms_vus:
        noms_vus.add(nom)
        uniques.append(e)

print(f"📊 {len(uniques)} entreprises uniques à importer")

# Importer par lots
succes = 0
lots = []
lot = []

for i, e in enumerate(uniques, 1):
    telephone = e.get('telephones', [])
    telephone = telephone[0] if telephone else None
    email = e.get('emails', [])
    email = email[0] if email else None
    
    entreprise = {
        'id': str(uuid.uuid4()),
        'name': e.get('nom', '')[:500],
        'activity_sector': e.get('secteur', ''),
        'wilaya': e.get('wilaya', ''),
        'address': e.get('adresse', ''),
        'phone': telephone,
        'email': email,
        'products': e.get('produits', []),
        'source_file': 'import_2024_nouveau',
        'created_at': datetime.now().isoformat(),
        'is_duplicate': False,
        'can_export': True
    }
    
    lot.append(entreprise)
    
    if len(lot) >= 100 or i == len(uniques):
        result = supabase.table('exporters').insert(lot).execute()
        succes += len(lot)
        print(f"✅ Lot {len(lots)+1}: {len(lot)} importées")
        lots.append(lot)
        lot = []

print(f"\n✅ Total: {succes} entreprises importées")