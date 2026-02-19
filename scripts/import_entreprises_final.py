# scripts/import_entreprises_final.py
import os
import json
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime
import uuid

print("="*80)
print("🏢 IMPORT DES 1298 ENTREPRISES - VERSION FINALE")
print("="*80)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

# Charger les références en mémoire
print("\n📚 Chargement des références...")

# Wilayas
w = supabase.table('wilayas').select('code, id').execute()
wilayas_map = {item['code']: item['id'] for item in w.data}
print(f"✅ {len(wilayas_map)} wilayas chargées")

# Secteurs
s = supabase.table('sectors').select('secteur, id').execute()
secteurs_map = {item['secteur'].lower(): item['id'] for item in s.data}
print(f"✅ {len(secteurs_map)} secteurs chargés")

# Statuts
st = supabase.table('legal_statuses').select('libelle, id').execute()
statuts_map = {item['libelle'].lower(): item['id'] for item in st.data}
print(f"✅ {len(statuts_map)} statuts chargés")

# Charger les entreprises
print("\n📖 Lecture du fichier entreprises...")
try:
    with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
        entreprises = json.load(f)
    print(f"✅ {len(entreprises)} entreprises chargées")
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/private/entreprises_brutes.json")
    exit(1)

# Préparer l'import par lots
print("\n📥 Préparation de l'import...")
lots = []
lot_actuel = []
total = len(entreprises)

for i, e in enumerate(entreprises, 1):
    # Convertir les listes en chaînes
    telephone = e.get('telephones', [])
    telephone = telephone[0] if telephone else None
    
    email = e.get('emails', [])
    email = email[0] if email else None
    
    # Créer l'entrée
    entreprise = {
        'id': str(uuid.uuid4()),
        'name': e.get('nom', '')[:500],
        'nif': None,
        'nis': None,
        'address': e.get('adresse', ''),
        'phone': telephone,
        'email': email,
        'activity_sector': e.get('secteur', ''),
        'wilaya': e.get('wilaya', ''),
        'description': e.get('description', ''),
        'source_file': 'import_2024_nouveau',
        'created_at': datetime.now().isoformat(),
        'is_duplicate': False
    }
    
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
        erreurs.append(f"Lot {idx}: {str(e)[:100]}")
        print(f"❌ Lot {idx}: échec - {str(e)[:50]}")

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