# scripts/diagnostic_complet.py
import os
import csv
import json
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

print("="*80)
print("🔬 DIAGNOSTIC COMPLET - NIVEAU EXPERT")
print("="*80)

# 1. CONNEXION
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

print(f"\n📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("="*80)

# 2. ANALYSE DES TABLES EXISTANTES
print("\n📋 1. TABLES EXISTANTES DANS SUPABASE")
print("-"*60)

tables_testees = [
    'wilayas', 'sectors', 'legal_statuses', 'company_types',
    'exporters', 'companies', 'profiles', 'users'
]

tables_existantes = []

for table in tables_testees:
    try:
        result = supabase.table(table).select('*', count='exact').limit(1).execute()
        print(f"✅ {table}: {result.count} enregistrements")
        tables_existantes.append(table)
    except Exception as e:
        if "Could not find the table" in str(e):
            print(f"❌ {table}: n'existe pas")
        else:
            print(f"⚠️ {table}: {str(e)[:50]}")

# 3. ANALYSE DE LA TABLE EXPORTERS (si existe)
print("\n📋 2. ANALYSE DE LA TABLE PRINCIPALE")
print("-"*60)

if 'exporters' in tables_existantes:
    try:
        # Structure
        sample = supabase.table('exporters').select('*').limit(1).execute()
        if sample.data:
            colonnes = list(sample.data[0].keys())
            print(f"\n✅ Structure de 'exporters' ({len(colonnes)} colonnes):")
            for i, col in enumerate(sorted(colonnes)[:10], 1):  # 10 premières
                print(f"   {i:2d}. {col}")
            if len(colonnes) > 10:
                print(f"   ... et {len(colonnes)-10} autres")
        
        # Comptage par source
        total = supabase.table('exporters').select('*', count='exact').execute()
        print(f"\n📊 Total: {total.count} entreprises")
        
        if total.count > 0:
            sources = {}
            data = supabase.table('exporters').select('source_file').execute()
            for item in data.data:
                src = item.get('source_file')
                if src is None:
                    src = 'NULL'
                sources[src] = sources.get(src, 0) + 1
            
            print("\n📊 Répartition par source:")
            for src, count in sources.items():
                print(f"   • {src}: {count}")
                
    except Exception as e:
        print(f"❌ Erreur: {e}")
else:
    print("⚠️ Table 'exporters' non trouvée")

# 4. ANALYSE DES FICHIERS CSV
print("\n📋 3. ANALYSE DES FICHIERS CSV")
print("-"*60)

fichiers_csv = [
    ('data/wilayas_algerie.csv', 'wilayas'),
    ('data/secteurs_activite.csv', 'secteurs'),
    ('data/statuts_juridiques.csv', 'statuts')
]

for chemin, nom in fichiers_csv:
    print(f"\n📄 {nom}:")
    try:
        with open(chemin, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            try:
                en_tete = next(reader)
                print(f"   ✅ Fichier trouvé")
                print(f"   📌 Colonnes ({len(en_tete)}): {', '.join(en_tete)}")
                
                # Compter les lignes
                lignes = sum(1 for _ in reader)
                print(f"   📊 Lignes de données: {lignes}")
                
            except StopIteration:
                print(f"   ⚠️ Fichier vide")
    except FileNotFoundError:
        print(f"   ❌ Fichier non trouvé")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

# 5. ANALYSE DU FICHIER ENTREPRISES
print("\n📋 4. ANALYSE DU FICHIER ENTREPRISES")
print("-"*60)

try:
    with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        print(f"✅ Fichier trouvé: {len(data)} entreprises")
        
        if data and len(data) > 0:
            print(f"\n📌 Structure du premier élément:")
            for key, value in data[0].items():
                print(f"   • {key}: {type(value).__name__}")
                
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/private/entreprises_brutes.json")
except Exception as e:
    print(f"❌ Erreur: {e}")

# 6. SYNTHÈSE ET RECOMMANDATIONS
print("\n" + "="*80)
print("📋 SYNTHÈSE EXPERT")
print("="*80)

print("\n🔴 PROBLÈMES IDENTIFIÉS:")
print("   1. Tables de référence non créées ou mal nommées")
print("   2. Fichiers CSV à vérifier (colonnes inconnues)")
print("   3. Structure de la base à clarifier")

print("\n🟢 PLAN D'ACTION RECOMMANDÉ:")
print("   ÉTAPE 1: Créer les tables de référence avec les bonnes colonnes")
print("   ÉTAPE 2: Adapter les scripts aux noms de colonnes réels")
print("   ÉTAPE 3: Importer les données")

print("\n" + "="*80)
print("✅ DIAGNOSTIC TERMINÉ")
print("="*80)