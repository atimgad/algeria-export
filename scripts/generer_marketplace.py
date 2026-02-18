import pandas as pd
import os

# Configuration
OUTPUT_DIR = "output_marketplace"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("\n" + "="*70)
print("🏪 GÉNÉRATION DU FICHIER MARKETPLACE")
print("="*70)

# Structure du DataFrame final
colonnes = [
    "id_unique",
    "categorie_principale",
    "sous_categorie",
    "nom",
    "nom_en",
    "nom_ar",
    "adresse",
    "wilaya",
    "code_postal",
    "pays",
    "telephone",
    "fax",
    "email",
    "site_web",
    "contact_personne",
    "latitude",
    "longitude",
    "description",
    "produits_services",
    "statut_juridique",
    "date_creation",
    "page_source",
    "langue",
    "tags",
    "visible_site"
]

# Créer un DataFrame vide
df = pd.DataFrame(columns=colonnes)

print(f"\n✅ Structure prête: {len(colonnes)} colonnes")
print("📋 Colonnes disponibles:")
for i, col in enumerate(colonnes, 1):
    print(f"  {i:2d}. {col}")

# Sauvegarder le fichier Excel (vide pour l'instant)
fichier_sortie = os.path.join(OUTPUT_DIR, "MARKETPLACE_ALGERIA_EXPORT.xlsx")
df.to_excel(fichier_sortie, index=False)

print(f"\n✅ Fichier Excel créé: {fichier_sortie}")
print(f"📊 {len(df)} entités pour l'instant (fichier vierge)")
print("\n" + "="*70)
print("📋 FICHIER PRÊT À ÊTRE REMPLI")
print("="*70)
print("\nProchaine étape: Ajouter les 1 461 entités")
print("Tapez 'oui' pour continuer")