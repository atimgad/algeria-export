# scripts/reimportation_complete.py
import os
import json
import sys
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime
import uuid

print("="*70)
print("🚀 RÉIMPORTATION COMPLÈTE - 1298 ENTREPRISES")
print("="*70)

# 1. CHARGEMENT CONFIG
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# 2. LIRE LE FICHIER INITIAL
print("\n📖 Lecture du fichier original...")
try:
    with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
        entreprises = json.load(f)
    print(f"✅ {len(entreprises)} entreprises chargées")
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/private/entreprises_brutes.json")
    sys.exit(1)

# 3. SUPPRESSION TOTALE (sécurisée)
print("\n🗑️  SUPPRESSION TOTALE DE LA TABLE")
confirm = input("Tapez 'SUPPRIMER' pour confirmer la suppression définitive: ")

if confirm != "SUPPRIMER":
    print("❌ Annulé")
    sys.exit(0)

print("\nSuppression en cours...")
try:
    # Supprimer toutes les lignes
    supabase.table('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("✅ Table vidée avec succès")
except Exception as e:
    print(f"❌ Erreur lors de la suppression: {e}")
    sys.exit(1)

# 4. RÉIMPORTATION
print("\n📥 DÉBUT DE L'IMPORTATION")
print("="*70)

succes = 0
erreurs = []
lots = []

# Préparer les lots de 100 entreprises (limite Supabase)
for i in range(0, len(entreprises), 100):
    lots.append(entreprises[i:i+100])

print(f"📦 {len(lots)} lots à importer (100 entreprises par lot)")

for idx, lot in enumerate(lots, 1):
    print(f"\n📦 Lot {idx}/{len(lots)}...")
    
    # Préparer les données pour l'insertion
    a_inserer = []
    for e in lot:
        # Nettoyage des données
        entreprise_propre = {
            'name': e.get('name', '').strip(),
            'nif': e.get('nif', '').strip() or None,
            'nis': e.get('nis', '').strip() or None,
            'address': e.get('address', '').strip() or None,
            'phone': e.get('phone', '').strip() or None,
            'email': e.get('email', '').strip() or None,
            'website': e.get('website', '').strip() or None,
            'activity_sector': e.get('secteur_activite', '').strip() or None,
            'wilaya': e.get('wilaya', '').strip() or None,
            'source_file': 'import_2024_nouveau',
            'created_at': datetime.now().isoformat(),
            'is_duplicate': False
        }
        a_inserer.append(entreprise_propre)
    
    try:
        # Insertion par lot
        result = supabase.table('exporters').insert(a_inserer).execute()
        succes += len(result.data)
        print(f"   ✅ {len(result.data)} entreprises importées")
    except Exception as e:
        erreurs.append(f"Lot {idx}: {str(e)}")
        print(f"   ❌ Erreur: {e}")

# 5. RAPPORT FINAL
print("\n" + "="*70)
print("📊 RAPPORT FINAL D'IMPORTATION")
print("="*70)
print(f"\n✅ Succès: {succes} entreprises")
print(f"❌ Erreurs: {len(erreurs)}")
print(f"📁 Fichier source: {len(entreprises)} entreprises")

if erreurs:
    print("\nDétail des erreurs:")
    for err in erreurs[:5]:  # Max 5 erreurs
        print(f"   • {err}")

# Sauvegarde du rapport
rapport = {
    "date": datetime.now().isoformat(),
    "source": "entreprises_brutes.json",
    "total_source": len(entreprises),
    "importes": succes,
    "erreurs": erreurs
}

with open('data/private/rapport_import_final.json', 'w', encoding='utf-8') as f:
    json.dump(rapport, f, ensure_ascii=False, indent=2)

print(f"\n💾 Rapport sauvegardé: data/private/rapport_import_final.json")

# 6. VÉRIFICATION FINALE
print("\n🔍 VÉRIFICATION FINALE")
verif = supabase.table('exporters').select('*', count='exact').execute()
print(f"📌 Entreprises en base après import: {verif.count}")

if verif.count == len(entreprises):
    print("✅ SUCCÈS TOTAL - Toutes les entreprises sont importées")
else:
    print(f"⚠️  Attention: {len(entreprises) - verif.count} entreprises manquantes")

print("\n" + "="*70)
print("✅ PROCESSUS TERMINÉ")
print("="*70)