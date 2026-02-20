# scripts/reset_and_import.py
import os
import json
import uuid
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

print("="*80)
print("🔄 RESET + IMPORT DES 1249 ENTREPRISES UNIQUES")
print("="*80)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

# 1. VIDER LA TABLE
print("\n🗑️  Suppression de toutes les entreprises existantes...")
confirm = input("Tape 'OUI' pour confirmer la suppression: ")

if confirm == "OUI":
    try:
        supabase.table('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("✅ Table vidée")
    except Exception as e:
        print(f"❌ Erreur suppression: {e}")
        exit()
else:
    print("❌ Annulé")
    exit()

# 2. CHARGER LE FICHIER
print("\n📖 Lecture du fichier...")
with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
    entreprises = json.load(f)
print(f"✅ {len(entreprises)} entreprises dans fichier")

# 3. GARDER LES UNIQUES
print("\n🔍 Filtrage des doublons...")
noms_vus = set()
uniques = []

for e in entreprises:
    nom = e.get('nom', '')
    if nom and nom not in noms_vus:
        noms_vus.add(nom)
        uniques.append(e)

print(f"✅ {len(uniques)} entreprises uniques à importer")
print(f"⏭️  {len(entreprises) - len(uniques)} doublons ignorés")

# 4. PRÉPARER L'IMPORT
print("\n📥 Préparation...")
lots = []
lot_actuel = []
total = len(uniques)

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
    
    if e.get('description'):
        entreprise['exporter_notes'] = e.get('description')[:1000]
    
    lot_actuel.append(entreprise)
    
    if len(lot_actuel) >= 100 or i == total:
        lots.append(lot_actuel)
        lot_actuel = []
    
    if i % 100 == 0:
        print(f"   • {i}/{total} préparées...")

print(f"\n📦 {len(lots)} lots à importer")

# 5. IMPORTER
print("\n🚀 Début de l'import...")
succes = 0

for idx, lot in enumerate(lots, 1):
    try:
        result = supabase.table('exporters').insert(lot).execute()
        succes += len(lot)
        print(f"✅ Lot {idx}/{len(lots)}: {len(lot)} entreprises importées")
    except Exception as e:
        print(f"❌ Lot {idx}: {str(e)[:100]}")

print(f"\n✅ Total importé: {succes} entreprises")

# 6. VÉRIFICATION
print("\n🔍 Vérification...")
verif = supabase.table('exporters').select('*', count='exact').execute()
print(f"📊 Entreprises en base: {verif.count}")