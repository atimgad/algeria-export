import json
import re
import os

# Fichiers
INPUT = "pour_analyse_ia/donnees_pour_ia_corrige.json"
OUTPUT = "pour_analyse_ia/donnees_propres.json"

# STATUTS JURIDIQUES ALGÉRIENS (À CONSERVER ABSOLUMENT)
STATUTS = [
    "EURL", "SARL", "SPA", "SPAS", "SNC", "SCS", "SCA", "GIE", "SCOP", "EI",
    "E.U.R.L", "S.A.R.L", "S.P.A", "S.N.C", "S.C.S", "S.C.A"
]

# Mots à SUPPRIMER (fantômes)
FANTOMES = [
    "Le", "Nos", "Together", "Elaboré", "Site", "Au", "Dans", "At", "In", "?",
    "1er", "Crédits", "Subscribing", "e", "u", "de", "des", "à", "et",
    "Page", "Pages", "Voir", "Index", "Sommaire", "Liste", "TABLE"
]

print("\n" + "="*60)
print("🧹 NETTOYAGE AVEC STATUTS JURIDIQUES ALGÉRIENS")
print("="*60)

# Charger
with open(INPUT, 'r', encoding='utf-8') as f:
    data = json.load(f)

avant = len(data['entites'])
gardees = []
supprimees = 0

for e in data['entites']:
    nom = e.get('nom', '').strip()
    nom_upper = nom.upper()
    
    # CRITÈRES DE GARDE :
    garder = False
    
    # 1. Contient un statut juridique algérien ?
    for s in STATUTS:
        if s in nom_upper:
            garder = True
            print(f"✅ Gardé (statut {s}): {nom[:50]}")
            break
    
    # 2. Contient @ ou .com ou .dz ?
    if not garder and ('@' in nom or '.com' in nom.lower() or '.dz' in nom.lower()):
        garder = True
        print(f"✅ Gardé (contact): {nom[:50]}")
    
    # 3. Nom long (> 5) et première lettre majuscule ?
    if not garder and len(nom) > 5 and nom[0].isupper():
        garder = True
        print(f"✅ Gardé (nom long): {nom[:50]}")
    
    # 4. Est-ce un mot fantôme ?
    if nom in FANTOMES or len(nom) < 3:
        garder = False
    
    if garder:
        gardees.append(e)
    else:
        supprimees += 1
        print(f"🗑️ Supprimé: {nom[:50]}")

# Sauvegarder
data['entites'] = gardees
with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n" + "="*60)
print(f"📊 Avant: {avant} entités")
print(f"📊 Après: {len(gardees)} entités")
print(f"🗑️ Supprimées: {supprimees}")
print(f"✅ Fichier: {OUTPUT}")
print("="*60)