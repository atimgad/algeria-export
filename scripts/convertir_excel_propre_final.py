import pandas as pd
import re

print("\n" + "="*70)
print("🔄 CONVERSION FINALE DU FICHIER EXCEL")
print("="*70)

# Charger le fichier Excel brut
df_brut = pd.read_excel("exportateurs-word.xlsx")
print(f"📊 Fichier brut chargé: {len(df_brut)} lignes, {len(df_brut.columns)} colonnes")

# Afficher les noms des colonnes
print(f"📋 Colonnes: {list(df_brut.columns)}")

# Structure du nouveau DataFrame
colonnes = [
    "id_unique",
    "categorie",
    "nom",
    "telephone",
    "fax",
    "email",
    "site_web",
    "adresse",
    "wilaya"
]

df_propre = pd.DataFrame(columns=colonnes)

# Expressions régulières
pattern_tel = re.compile(r'Tél:?\s*([+\d\s().-]+)', re.IGNORECASE)
pattern_fax = re.compile(r'Fax:?\s*([+\d\s().-]+)', re.IGNORECASE)
pattern_email = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
pattern_web = re.compile(r'(?:https?://)?(?:www\.)?([\w-]+\.\w+(?:\.\w+)?)')
pattern_wilaya = re.compile(r'(Alger|Oran|Constantine|Annaba|Blida|Sétif|Tizi Ouzou|Béjaïa|Biskra|Batna|Djelfa|Tlemcen|Sidi Bel Abbès|Mostaganem|Mascara|Chlef|Laghouat|Oum El Bouaghi|Béchar|Bouira|Tamanrasset|Tébessa|Tiaret|Jijel|Saïda|Skikda|Guelma|Médéa|M\'Sila|Ouargla|El Bayadh|Illizi|Bordj Bou Arreridj|Boumerdès|El Tarf|Tindouf|Tissemsilt|El Oued|Khenchela|Souk Ahras|Tipaza|Mila|Aïn Defla|Naâma|Aïn Témouchent|Ghardaïa|Relizane)')

compteur = 0

# La colonne 0 semble être des numéros, la colonne 1 est le texte
colonne_texte = df_brut.columns[1]  # Deuxième colonne

for index, row in df_brut.iterrows():
    texte = str(row[colonne_texte]) if pd.notna(row[colonne_texte]) else ""
    
    if len(texte) < 20 or texte.strip().startswith("N°"):
        continue
    
    # Détecter la catégorie
    categorie = "Autre"
    if "MINISTERE" in texte.upper():
        categorie = "Ministère"
    elif "CHAMBRE" in texte.upper():
        categorie = "Chambre"
    elif "BANQUE" in texte.upper():
        categorie = "Banque"
    elif "ASSURANCE" in texte.upper():
        categorie = "Assurance"
    elif "TRANSPORT" in texte.upper():
        categorie = "Transport"
    elif "PORT" in texte.upper():
        categorie = "Port"
    elif "AMBASSADE" in texte.upper():
        categorie = "Ambassade"
    elif "HOTEL" in texte.upper():
        categorie = "Hôtel"
    elif "SARL" in texte.upper() or "SPA" in texte.upper() or "EURL" in texte.upper():
        categorie = "Entreprise"
    
    # Extraire le nom (première ligne)
    lignes = [l.strip() for l in texte.split('\n') if l.strip()]
    nom = lignes[0] if lignes else texte[:100]
    
    # Nettoyer le nom
    nom = re.sub(r'^\d+\s+', '', nom)
    nom = re.sub(r'^[•·●]\s*', '', nom)
    
    # Extraire les infos
    tel = pattern_tel.search(texte)
    fax = pattern_fax.search(texte)
    emails = pattern_email.findall(texte)
    sites = pattern_web.findall(texte)
    wilaya = pattern_wilaya.search(texte)
    
    # Créer l'entrée
    entite = {
        "id_unique": f"ENT_{compteur+1:04d}",
        "categorie": categorie,
        "nom": nom[:200],
        "telephone": tel.group(1) if tel else "",
        "fax": fax.group(1) if fax else "",
        "email": emails[0] if emails else "",
        "site_web": sites[0] if sites else "",
        "adresse": texte[:500],
        "wilaya": wilaya.group(1) if wilaya else ""
    }
    
    df_propre = pd.concat([df_propre, pd.DataFrame([entite])], ignore_index=True)
    compteur += 1
    
    if compteur % 100 == 0:
        print(f"   {compteur} entités converties...")

# Sauvegarder
df_propre.to_excel("exportateurs-word-propre.xlsx", index=False)

print(f"\n📊 {compteur} entités converties en format colonnes")
print("\n📊 RÉPARTITION PAR CATÉGORIE:")
for cat, nb in df_propre['categorie'].value_counts().items():
    print(f"   • {cat}: {nb}")

print("\n" + "="*70)
print("✅ CONVERSION TERMINÉE!")
print("📁 Fichier: exportateurs-word-propre.xlsx")
print("="*70)