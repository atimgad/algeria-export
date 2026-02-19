import json
from supabase import create_client
from dotenv import load_dotenv
import os
from collections import Counter

load_dotenv('.env.local')

supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

print("\n" + "="*70)
print("🔍 ANALYSE DES 49 ERREURS D'IMPORT")
print("="*70)

# Charger les entreprises originales
with open("data/private/entreprises_brutes.json", "r", encoding="utf-8") as f:
    toutes = json.load(f)
print(f"📊 Total original: {len(toutes)}")

# Compter les importées
importees = supabase.table("exporters")\
    .select("count", count="exact")\
    .eq("source_file", "import_2024_nouveau")\
    .execute()
nb_importees = importees.count

print(f"✅ Importées: {nb_importees}")
print(f"❌ Erreurs attendues: {len(toutes) - nb_importees}")

# Identifier les potentielles erreurs
erreurs_potentielles = []
for e in toutes:
    nom = e.get("nom", "")
    if not nom:
        continue
    
    # Vérifier si l'entreprise existe en base
    existante = supabase.table("exporters")\
        .select("id")\
        .eq("name", nom)\
        .execute()
    
    if len(existante.data) == 0:
        erreurs_potentielles.append(e)

print(f"\n📊 {len(erreurs_potentielles)} entreprises non trouvées en base")

# Statistiques sur les erreurs
statuts = Counter()
secteurs = Counter()
wilayas = Counter()

for e in erreurs_potentielles:
    statuts[e.get("statut", "Inconnu")] += 1
    secteurs[e.get("secteur", "Non classé")] += 1
    wilayas[e.get("wilaya", "Inconnue")] += 1

print("\n📊 RÉPARTITION PAR STATUT:")
for statut, count in statuts.most_common(10):
    print(f"   • {statut}: {count}")

print("\n📊 RÉPARTITION PAR SECTEUR:")
for secteur, count in secteurs.most_common(10):
    print(f"   • {secteur}: {count}")

print("\n📊 TOP 10 DES ERREURS (exemples):")
for i, e in enumerate(erreurs_potentielles[:10], 1):
    print(f"\n{i}. {e.get('nom', 'Sans nom')[:100]}")
    print(f"   Statut: {e.get('statut', '')}")
    print(f"   Secteur: {e.get('secteur', '')}")

# Sauvegarde
with open("data/private/erreurs_import.json", "w", encoding="utf-8") as f:
    json.dump({
        "total_erreurs": len(erreurs_potentielles),
        "statuts": dict(statuts),
        "secteurs": dict(secteurs),
        "entreprises": erreurs_potentielles[:50]  # Limiter pour lisibilité
    }, f, ensure_ascii=False, indent=2)

print(f"\n📁 Rapport sauvegardé: data/private/erreurs_import.json")
print("="*70)