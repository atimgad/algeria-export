import pandas as pd

print("\n" + "="*70)
print("🔍 DIAGNOSTIC DU FICHIER EXCEL BRUT")
print("="*70)

# Charger le fichier
df = pd.read_excel("exportateurs-word.xlsx", header=None)
print(f"📊 Dimensions: {df.shape[0]} lignes, {df.shape[1]} colonnes")

# Afficher les 20 premières lignes
print("\n📋 PREMIÈRES LIGNES DU FICHIER:")
print("-" * 50)
for i in range(min(20, len(df))):
    valeur = str(df.iloc[i, 0]) if pd.notna(df.iloc[i, 0]) else "VIDE"
    print(f"{i+1:3d}. {valeur[:100]}")

print("\n" + "="*70)