# scripts/import_references.py
import psycopg2
from dotenv import load_dotenv
import os
import csv

print("="*60)
print("📚 IMPORT DES TABLES DE RÉFÉRENCE")
print("="*60)

load_dotenv('.env.local')

# Connexion à la base
conn = psycopg2.connect(
    host=os.getenv('SUPABASE_HOST'),
    database=os.getenv('SUPABASE_DB'),
    user=os.getenv('SUPABASE_USER'),
    password=os.getenv('SUPABASE_PASSWORD'),
    port=os.getenv('SUPABASE_PORT', '5432')
)
conn.autocommit = True
cursor = conn.cursor()

# 1. WILAYAS
print("\n📌 Import des wilayas...")
try:
    with open('data/wilayas_algerie.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            cursor.execute("""
                INSERT INTO wilayas (id, code, name_fr, name_ar, region)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (code) DO NOTHING
            """, (
                row.get('id'), 
                row['code'], 
                row['name_fr'], 
                row.get('name_ar', ''), 
                row.get('region', '')
            ))
            count += 1
        print(f"✅ {count} wilayas importées")
except Exception as e:
    print(f"❌ Erreur wilayas: {e}")

# 2. SECTEURS
print("\n📌 Import des secteurs...")
try:
    with open('data/secteurs_activite.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            cursor.execute("""
                INSERT INTO sectors (code, name_fr, name_en)
                VALUES (%s, %s, %s)
                ON CONFLICT (code) DO NOTHING
            """, (
                row['code'], 
                row['name_fr'], 
                row.get('name_en', '')
            ))
            count += 1
        print(f"✅ {count} secteurs importés")
except Exception as e:
    print(f"❌ Erreur secteurs: {e}")

# 3. STATUTS JURIDIQUES
print("\n📌 Import des statuts juridiques...")
try:
    with open('data/statuts_juridiques.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            cursor.execute("""
                INSERT INTO legal_statuses (code, name_fr, name_ar, abbreviation)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (code) DO NOTHING
            """, (
                row['code'], 
                row['name_fr'], 
                row.get('name_ar', ''), 
                row.get('abbreviation', '')
            ))
            count += 1
        print(f"✅ {count} statuts importés")
except Exception as e:
    print(f"❌ Erreur statuts: {e}")

cursor.close()
conn.close()
print("\n" + "="*60)
print("✅ IMPORT DES RÉFÉRENCES TERMINÉ")
print("="*60)