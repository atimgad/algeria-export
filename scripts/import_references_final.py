# scripts/import_references_final.py
import os
import csv
from supabase import create_client
from dotenv import load_dotenv

print("="*60)
print("📚 IMPORT DES RÉFÉRENCES - VERSION FINALE")
print("="*60)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

# 1. WILAYAS
print("\n📌 Import des wilayas...")
try:
    with open('data/wilayas_algerie.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        wilayas = []
        for row in reader:
            wilayas.append({
                'code': row['code'].strip(),
                'nom_wilaya': row['nom_wilaya'].strip()
            })
    
    if wilayas:
        result = supabase.table('wilayas').upsert(wilayas).execute()
        print(f"✅ {len(wilayas)} wilayas importées")
        
        # Vérification
        verif = supabase.table('wilayas').select('*', count='exact').execute()
        print(f"📊 Total en base: {verif.count}")
        
except Exception as e:
    print(f"❌ Erreur: {e}")

# 2. SECTEURS
print("\n📌 Import des secteurs...")
try:
    with open('data/secteurs_activite.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        secteurs = []
        for row in reader:
            secteurs.append({
                'code': row['code'].strip(),
                'secteur': row['secteur'].strip()
            })
    
    if secteurs:
        result = supabase.table('sectors').upsert(secteurs).execute()
        print(f"✅ {len(secteurs)} secteurs importés")
        
        verif = supabase.table('sectors').select('*', count='exact').execute()
        print(f"📊 Total en base: {verif.count}")
        
except Exception as e:
    print(f"❌ Erreur: {e}")

# 3. STATUTS JURIDIQUES
print("\n📌 Import des statuts juridiques...")
try:
    with open('data/statuts_juridiques.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        statuts = []
        for row in reader:
            statuts.append({
                'code': row['code'].strip(),
                'sigle': row.get('sigle', '').strip(),
                'libelle': row['libelle'].strip()
            })
    
    if statuts:
        result = supabase.table('legal_statuses').upsert(statuts).execute()
        print(f"✅ {len(statuts)} statuts importés")
        
        verif = supabase.table('legal_statuses').select('*', count='exact').execute()
        print(f"📊 Total en base: {verif.count}")
        
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n" + "="*60)
print("✅ IMPORT TERMINÉ")
print("="*60)