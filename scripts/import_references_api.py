# scripts/import_references_api.py
import os
import csv
from supabase import create_client
from dotenv import load_dotenv

print("="*60)
print("📚 IMPORT DES TABLES DE RÉFÉRENCE VIA API")
print("="*60)

# Charger les variables d'environnement
load_dotenv('.env.local')

# Récupérer les clés depuis le fichier .env.local
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print(f"🔌 Connexion à Supabase...")
supabase = create_client(url, key)
print("✅ Connecté")

# ===========================================
# 1. IMPORT DES WILAYAS
# ===========================================
print("\n📌 Import des wilayas...")
try:
    with open('data/wilayas_algerie.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        wilayas = []
        for row in reader:
            wilayas.append({
                'id': int(row.get('id', 0)),
                'code': row['code'].strip(),
                'name_fr': row['name_fr'].strip(),
                'name_ar': row.get('name_ar', '').strip(),
                'region': row.get('region', '').strip()
            })
    
    if wilayas:
        # Upsert pour éviter les doublons
        result = supabase.table('wilayas').upsert(wilayas).execute()
        print(f"✅ {len(wilayas)} wilayas importées")
    else:
        print("⚠️ Aucune wilaya trouvée")
        
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/wilayas_algerie.csv")
except Exception as e:
    print(f"❌ Erreur: {e}")

# ===========================================
# 2. IMPORT DES SECTEURS
# ===========================================
print("\n📌 Import des secteurs...")
try:
    with open('data/secteurs_activite.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        secteurs = []
        for row in reader:
            secteurs.append({
                'code': row['code'].strip(),
                'name_fr': row['name_fr'].strip(),
                'name_en': row.get('name_en', '').strip()
            })
    
    if secteurs:
        result = supabase.table('sectors').upsert(secteurs).execute()
        print(f"✅ {len(secteurs)} secteurs importés")
    else:
        print("⚠️ Aucun secteur trouvé")
        
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/secteurs_activite.csv")
except Exception as e:
    print(f"❌ Erreur: {e}")

# ===========================================
# 3. IMPORT DES STATUTS JURIDIQUES
# ===========================================
print("\n📌 Import des statuts juridiques...")
try:
    with open('data/statuts_juridiques.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        statuts = []
        for row in reader:
            statuts.append({
                'code': row['code'].strip(),
                'name_fr': row['name_fr'].strip(),
                'name_ar': row.get('name_ar', '').strip(),
                'abbreviation': row.get('abbreviation', '').strip()
            })
    
    if statuts:
        result = supabase.table('legal_statuses').upsert(statuts).execute()
        print(f"✅ {len(statuts)} statuts importés")
    else:
        print("⚠️ Aucun statut trouvé")
        
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/statuts_juridiques.csv")
except Exception as e:
    print(f"❌ Erreur: {e}")

# ===========================================
# 4. RÉCAPITULATIF
# ===========================================
print("\n" + "="*60)
print("📊 RÉCAPITULATIF")
print("="*60)

try:
    # Vérification wilayas
    w = supabase.table('wilayas').select('*', count='exact').execute()
    print(f"✅ Wilayas en base: {w.count}")
    
    # Vérification secteurs
    s = supabase.table('sectors').select('*', count='exact').execute()
    print(f"✅ Secteurs en base: {s.count}")
    
    # Vérification statuts
    l = supabase.table('legal_statuses').select('*', count='exact').execute()
    print(f"✅ Statuts en base: {l.count}")
    
except Exception as e:
    print(f"❌ Erreur vérification: {e}")

print("\n" + "="*60)
print("✅ IMPORT TERMINÉ")
print("="*60)