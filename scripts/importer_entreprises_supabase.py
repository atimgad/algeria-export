import json
import csv
import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

# Charger les variables d'environnement
load_dotenv('.env.local')

# Connexion Supabase
supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

print("\n" + "="*70)
print("🏗️ IMPORT DES ENTREPRISES VERS SUPABASE")
print("="*70)

# Charger les entreprises depuis notre fichier privé
fichier_entreprises = "data/private/entreprises_brutes.json"

if not os.path.exists(fichier_entreprises):
    print(f"❌ Fichier non trouvé: {fichier_entreprises}")
    exit(1)

with open(fichier_entreprises, "r", encoding="utf-8") as f:
    entreprises = json.load(f)

print(f"📊 {len(entreprises)} entreprises chargées")

# Statistiques
stats = {
    "total": len(entreprises),
    "importees": 0,
    "deja_presentes": 0,
    "erreurs": 0
}

# Pour chaque entreprise
for idx, e in enumerate(entreprises, 1):
    nom = e.get("nom", "").strip()
    if not nom:
        stats["erreurs"] += 1
        continue
    
    # Vérifier si l'entreprise existe déjà
    existing = supabase.table("exporters").select("*").eq("name", nom).execute()
    
    if len(existing.data) > 0:
        print(f"⏭️  [{idx}/{stats['total']}] Déjà présent: {nom[:50]}")
        stats["deja_presentes"] += 1
        continue
    
    # Préparer les données
    data = {
        "name": nom[:255],
        "sector": e.get("secteur", "Non classé"),
        "legal_status": e.get("statut", ""),
        "wilaya": e.get("wilaya", ""),
        "address": e.get("adresse", "").strip()[:500],
        "phone": ", ".join(e.get("telephones", []))[:100],
        "email": ", ".join(e.get("emails", []))[:255],
        "source": "import_2024",
        "verified": False,
        "created_at": datetime.now().isoformat()
    }
    
    # Insérer
    try:
        result = supabase.table("exporters").insert(data).execute()
        stats["importees"] += 1
        print(f"✅ [{idx}/{stats['total']}] Importé: {nom[:50]}")
    except Exception as err:
        stats["erreurs"] += 1
        print(f"❌ [{idx}/{stats['total']}] Erreur: {nom[:50]} - {err}")

print("\n" + "="*70)
print("📊 RÉSULTAT DE L'IMPORT")
print("="*70)
print(f"✅ Importées: {stats['importees']}")
print(f"⏭️  Déjà présentes: {stats['deja_presentes']}")
print(f"❌ Erreurs: {stats['erreurs']}")
print(f"📊 Total: {stats['total']}")
print("="*70)

# Sauvegarde du rapport
rapport = {
    "date": datetime.now().isoformat(),
    "stats": stats
}

with open("data/private/rapport_import.json", "w", encoding="utf-8") as f:
    json.dump(rapport, f, indent=2)

print(f"\n📁 Rapport sauvegardé: data/private/rapport_import.json")