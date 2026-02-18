import json
import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv('.env.local')

supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

print("\n" + "="*70)
print("📦 IMPORT DES NOUVELLES ENTREPRISES")
print("="*70)

# Charger les nouvelles entreprises
with open("data/private/entreprises_brutes.json", "r", encoding="utf-8") as f:
    entreprises = json.load(f)

print(f"📊 {len(entreprises)} entreprises à importer")

stats = {
    "importees": 0,
    "erreurs": 0
}

for idx, e in enumerate(entreprises, 1):
    nom = e.get("nom", "").strip()
    if not nom:
        continue
    
    # Préparer les données avec les BONNES colonnes
    data = {
        "name": nom[:255],
        "activity_sector": e.get("secteur", "Non classé"),
        "wilaya": e.get("wilaya", ""),
        "address": e.get("adresse", "").strip()[:500],
        "phone": ", ".join(e.get("telephones", []))[:100],
        "email": ", ".join(e.get("emails", []))[:255],
        "company_type": e.get("statut", ""),
        "verified": False,
        "source_file": "import_2024_nouveau",
        "created_at": datetime.now().isoformat()
    }
    
    try:
        result = supabase.table("exporters").insert(data).execute()
        stats["importees"] += 1
        print(f"✅ [{idx}] Importé: {nom[:50]}")
    except Exception as err:
        stats["erreurs"] += 1
        print(f"❌ [{idx}] Erreur: {nom[:50]} - {str(err)[:100]}")

print("\n" + "="*70)
print(f"📊 RÉSULTAT:")
print(f"   ✅ Importées: {stats['importees']}")
print(f"   ❌ Erreurs: {stats['erreurs']}")
print("="*70)