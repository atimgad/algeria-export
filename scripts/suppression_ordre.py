# scripts/suppression_ordre.py
import os
from supabase import create_client
from dotenv import load_dotenv

print("="*70)
print("🗑️  SUPPRESSION DANS L'ORDRE - RESPECT DES CONTRAINTES")
print("="*70)

load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# 1. D'abord, lister toutes les tables qui référencent exporters
print("\n🔍 Recherche des tables liées...")
tables_connues = [
    'exporter_status_history',
    'liaison_requests',
    'proofs',
    'favorites',
    'contact_requests'
]

for table in tables_connues:
    try:
        count = supabase.table(table).select('*', count='exact').execute()
        if count.count > 0:
            print(f"📌 {table}: {count.count} enregistrements")
    except:
        pass

print("\n⚠️  ATTENTION: La suppression va supprimer les données dans cet ordre:")
print("   1. exporter_status_history (lié à exporters)")
print("   2. exporters (la table principale)")

confirm = input("\nTapez 'SUPPRIMER' pour continuer: ")

if confirm != "SUPPRIMER":
    print("❌ Annulé")
    exit()

# 2. Supprimer d'abord les données liées
print("\n🗑️  Suppression des historiques...")
try:
    supabase.table('exporter_status_history').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("✅ exporter_status_history vidé")
except Exception as e:
    print(f"⚠️  {e}")

# 3. Maintenant on peut supprimer exporters
print("\n🗑️  Suppression des entreprises...")
try:
    supabase.table('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("✅ exporters vidé")
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n✅ Prêt pour la réimportation")