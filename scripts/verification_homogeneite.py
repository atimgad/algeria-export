# scripts/verification_homogeneite.py
import os
import json
from supabase import create_client
from dotenv import load_dotenv

print("="*80)
print("🔍 VÉRIFICATION D'HOMOGÉNÉITÉ - ANALYSE COMPLÈTE")
print("="*80)

load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# 1. ANALYSE DE LA TABLE EXPORTERS
print("\n📋 1. ANALYSE DE LA TABLE EXPORTERS")
print("-"*50)

# Récupérer un échantillon
sample = supabase.table('exporters').select('*').limit(1).execute()
if sample.data:
    colonnes = list(sample.data[0].keys())
    print(f"\n✅ {len(colonnes)} colonnes trouvées:")
    for i, col in enumerate(sorted(colonnes), 1):
        print(f"   {i:2d}. {col}")
else:
    print("❌ Table vide ou inexistante")

# 2. ANALYSE DU FICHIER SOURCE
print("\n📁 2. ANALYSE DU FICHIER SOURCE")
print("-"*50)

try:
    with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
        source = json.load(f)
    
    print(f"\n✅ {len(source)} entreprises dans le fichier")
    
    # Analyser la structure du premier élément
    if source:
        premier = source[0]
        print(f"\n📊 Structure du fichier source:")
        for key, value in premier.items():
            print(f"   • {key}: {type(value).__name__}")
            
except FileNotFoundError:
    print("❌ Fichier source non trouvé")

# 3. COMPARAISON STRUCTURE vs SOURCE
print("\n🔄 3. ANALYSE DE CORRESPONDANCE")
print("-"*50)

print("\n🔍 QUESTIONS À RÉSOUDRE:")
print("   1. Les colonnes de la DB correspondent-elles aux champs du fichier?")
print("   2. Y a-t-il des colonnes obligatoires manquantes?")
print("   3. Les types de données sont-ils cohérents?")
print("   4. Faut-il créer des tables de référence (wilayas, statuts, secteurs)?")

# 4. VÉRIFICATION DES CONTRAINTES
print("\n🔗 4. VÉRIFICATION DES CONTRAINTES")
print("-"*50)

tables_connues = [
    'exporters',
    'exporter_status_history',
    'commission_promotions',
    'liaison_requests',
    'proofs',
    'messages'
]

print("\nTables existantes et leurs relations:")
for table in tables_connues:
    try:
        count = supabase.table(table).select('*', count='exact').execute()
        print(f"   • {table}: {count.count} enregistrements")
    except:
        print(f"   • {table}: ❌ n'existe pas")

print("\n" + "="*80)
print("✅ VÉRIFICATION TERMINÉE - ANALYSEZ LES RÉSULTATS")
print("="*80)
print("\n👉 MAINANT, dites-moi ce qui ne va pas et je corrigerai")