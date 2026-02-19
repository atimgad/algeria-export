# scripts/suppression_nucleaire.py
import os
from supabase import create_client
from dotenv import load_dotenv
import time

print("="*80)
print("💣 SUPPRESSION NUCLÉAIRE - CASCADE TOTALE")
print("="*80)

load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# 1. LISTE COMPLÈTE des tables qui peuvent référencer exporters
tables_dependantes = [
    'exporter_status_history',
    'commission_promotions',
    'liaison_requests',
    'proofs',
    'favorites',
    'contact_requests',
    'messages',
    'notifications',
    'audit_logs',
    'product_requests',
    'quotes',
    'orders',
    'reviews'
]

print("\n🔍 VÉRIFICATION DES TABLES AVEC DONNÉES:")
tables_non_vides = []

for table in tables_dependantes:
    try:
        count = supabase.table(table).select('*', count='exact').execute()
        if count.count > 0:
            print(f"📌 {table}: {count.count} enregistrements")
            tables_non_vides.append(table)
        else:
            print(f"✅ {table}: vide")
    except Exception as e:
        print(f"⚠️  {table}: {str(e)[:50]}")

print("\n" + "="*80)
print("⚠️  ATTENTION DANGER MAXIMUM ⚠️")
print(f"{len(tables_non_vides)} tables non vides vont être supprimées")
for t in tables_non_vides:
    print(f"   - {t}")

print("\n🔴 CETTE ACTION EST IRRÉVERSIBLE")
confirm = input("\nTapez 'SUPPRESSION TOTALE' en majuscules pour confirmer: ")

if confirm != "SUPPRESSION TOTALE":
    print("❌ Annulé")
    exit()

# 2. SUPPRESSION EN ORDRE INVERSE (des plus dépendantes aux moins)
print("\n💥 DÉBUT DE LA SUPPRESSION EN CASCADE")

ordre_suppression = [
    'commission_promotions',
    'exporter_status_history',
    'liaison_requests', 
    'proofs',
    'favorites',
    'contact_requests',
    'messages',
    'notifications',
    'audit_logs',
    'product_requests',
    'quotes',
    'orders',
    'reviews'
]

for table in ordre_suppression:
    try:
        print(f"\n🗑️  Suppression de {table}...")
        # Supprimer toutes les lignes
        supabase.table(table).delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print(f"   ✅ {table} vidé")
        time.sleep(0.5)  # Pause pour laisser le temps à la DB
    except Exception as e:
        print(f"   ⚠️  {table}: {str(e)[:100]}")

# 3. MAINTENANT ON PEUT SUPPRIMER EXPORTERS
print("\n" + "="*80)
print("🎯 SUPPRESSION FINALE DE EXPORTERS")
print("="*80)

try:
    result = supabase.table('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print(f"✅ SUCCÈS - {len(result.data)} entreprises supprimées")
except Exception as e:
    print(f"❌ Erreur finale: {e}")
    
# 4. VÉRIFICATION FINALE
print("\n" + "="*80)
print("🔍 VÉRIFICATION FINALE")
print("="*80)

try:
    reste = supabase.table('exporters').select('*', count='exact').execute()
    print(f"📊 Entreprises restantes: {reste.count}")
    
    if reste.count == 0:
        print("✅ BASE PROPRE - Prêt pour réimportation")
    else:
        print("⚠️  Il reste des entreprises - une contrainte persiste")
except:
    pass

print("\n" + "="*80)
print("✅ PROCESSUS TERMINÉ")
print("="*80)