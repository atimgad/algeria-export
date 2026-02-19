# scripts/import_adapte_structure_reelle.py
import os
import json
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

print("="*80)
print("🏢 IMPORT ADAPTÉ À LA STRUCTURE RÉELLE")
print("="*80)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

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
print("\n📥 Adaptation à la structure réelle...")
lots = []
lot_actuel = []
total = len(entreprises)

for i, e in enumerate(entreprises, 1):
    # Convertir les listes en chaînes
    telephone = e.get('telephones', [])
    telephone = telephone[0] if telephone else None
    
    email = e.get('emails', [])
    email = email[0] if email else None
    
    # Créer l'entrée avec les colonnes RÉELLES de votre table
    entreprise = {
        'nom': e.get('nom', '')[:500],
        'secteur': e.get('secteur', ''),
        'Wilaya': e.get('wilaya', ''),
        'adresse': e.get('adresse', ''),
        'telephone': telephone,
        'emil': email,  # Note: c'est 'emil' pas 'email' dans votre table
        'produits': '',  # À remplir si disponible
        'source': 'import_2024_nouveau',
        'created_at': datetime.now().isoformat()
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
try:
    verif = supabase.table('exporters').select('*', count='exact').execute()
    print(f"📊 Entreprises en base: {verif.count}")
except Exception as e:
    print(f"❌ Erreur vérification: {e}")

print("\n" + "="*80)
print("✅ IMPORT TERMINÉ")
print("="*80)