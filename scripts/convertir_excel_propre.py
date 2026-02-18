import pandas as pd
import json
import re
from pathlib import Path

print("\n" + "="*70)
print("🔄 CONVERSION DU FICHIER EXCEL EN FORMAT COLONNES")
print("="*70)

# Charger le fichier Excel brut
df_brut = pd.read_excel("exportateurs-word.xlsx")
print(f"📊 Fichier brut chargé: {len(df_brut)} lignes")

# Structure du nouveau DataFrame
colonnes = [
    "id_unique",
    "categorie",
    "sous_categorie",
    "nom",
    "adresse",
    "wilaya",
    "code_postal",
    "pays",
    "telephone",
    "fax",
    "email",
    "site_web",
    "contact",
    "description",
    "produits",
    "statut_juridique",
    "page_source"
]

df_propre = pd.DataFrame(columns=colonnes)

# Expressions régulières pour extraire les informations
pattern_tel = re.compile(r'Tél:?\s*([+\d\s().-]+)', re.IGNORECASE)
pattern_fax = re.compile(r'Fax:?\s*([+\d\s().-]+)', re.IGNORECASE)
pattern_email = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
pattern_web = re.compile(r'(?:https?://)?(?:www\.)?([\w-]+\.\w+(?:\.\w+)?)')
pattern_wilaya = re.compile(r'(Alger|Oran|Constantine|Annaba|Blida|Sétif|Tizi Ouzou|Béjaïa|Biskra|Batna|Djelfa|Tlemcen|Sidi Bel Abbès|Mostaganem|Mascara|Chlef|Laghouat|Oum El Bouaghi|Béchar|Bouira|Tamanrasset|Tébessa|Tiaret|Jijel|Saïda|Skikda|Guelma|Médéa|M\'Sila|Ouargla|El Bayadh|Illizi|Bordj Bou Arreridj|Boumerdès|El Tarf|Tindouf|Tissemsilt|El Oued|Khenchela|Souk Ahras|Tipaza|Mila|Aïn Defla|Naâma|Aïn Témouchent|Ghardaïa|Relizane|Timimoun|Bordj Badji Mokhtar|Ouled Djellal|Béni Abbès|In Salah|In Guezzam|Touggourt|Djanet|El Meghaier|El Meniaa)')

compteur = 0
categorie_actuelle = "Non classé"

for index, row in df_brut.iterrows():
    texte = str(row.iloc[0]) if len(row) > 0 else ""
    if not texte or len(texte) < 10:
        continue
    
    # Détecter les catégories
    if "MINISTERE" in texte.upper() or "MINISTRY" in texte.upper():
        categorie_actuelle = "Ministère"
    elif "CHAMBRE" in texte.upper():
        categorie_actuelle = "Chambre"
    elif "BANQUE" in texte.upper() or "BANK" in texte.upper():
        categorie_actuelle = "Banque"
    elif "ASSURANCE" in texte.upper() or "INSURANCE" in texte.upper():
        categorie_actuelle = "Assurance"
    elif "TRANSPORT" in texte.upper() or "AERIEN" in texte.upper() or "MARITIME" in texte.upper():
        categorie_actuelle = "Transport"
    elif "PORT" in texte.upper():
        categorie_actuelle = "Port"
    elif "AMBASSADE" in texte.upper() or "EMBASSY" in texte.upper():
        categorie_actuelle = "Ambassade"
    elif "HOTEL" in texte.upper():
        categorie_actuelle = "Hôtel"
    elif "AGENCE DE VOYAGES" in texte.upper() or "TRAVEL AGENCY" in texte.upper():
        categorie_actuelle = "Agence de voyages"
    elif "SARL" in texte.upper() or "SPA" in texte.upper() or "EURL" in texte.upper():
        categorie_actuelle = "Entreprise"
    
    # Extraire le nom (première ligne significative)
    lignes = [l for l in texte.split('\n') if l.strip()]
    nom = lignes[0] if lignes else ""
    
    # Nettoyer le nom
    nom = re.sub(r'^\d+\s+', '', nom)
    nom = re.sub(r'^[•·●]\s*', '', nom)
    
    # Extraire les informations
    tel = pattern_tel.search(texte)
    fax = pattern_fax.search(texte)
    emails = pattern_email.findall(texte)
    sites = pattern_web.findall(texte)
    wilaya = pattern_wilaya.search(texte)
    
    # Déterminer le statut juridique
    statut = ""
    if "SARL" in nom.upper():
        statut = "SARL"
    elif "SPA" in nom.upper():
        statut = "SPA"
    elif "EURL" in nom.upper():
        statut = "EURL"
    elif "SNC" in nom.upper():
        statut = "SNC"
    
    # Créer l'entrée
    entite = {
        "id_unique": f"{categorie_actuelle[:3].upper()}_{compteur+1:04d}",
        "categorie": categorie_actuelle,
        "sous_categorie": "",
        "nom": nom[:200],
        "adresse": texte[:500],
        "wilaya": wilaya.group(1) if wilaya else "",
        "code_postal": "",
        "pays": "Algérie",
        "telephone": tel.group(1) if tel else "",
        "fax": fax.group(1) if fax else "",
        "email": emails[0] if emails else "",
        "site_web": sites[0] if sites else "",
        "contact": "",
        "description": "",
        "produits": "",
        "statut_juridique": statut,
        "page_source": ""
    }
    
    df_propre = pd.concat([df_propre, pd.DataFrame([entite])], ignore_index=True)
    compteur += 1
    
    if compteur % 100 == 0:
        print(f"   {compteur} entités traitées...")

# Sauvegarder le fichier propre
fichier_sortie = "exportateurs-word-propre.xlsx"
df_propre.to_excel(fichier_sortie, index=False)

print(f"\n📊 {compteur} entités converties en format colonnes")
print(f"✅ Fichier sauvegardé: {fichier_sortie}")

# Statistiques par catégorie
print("\n📊 RÉPARTITION PAR CATÉGORIE:")
stats = df_propre['categorie'].value_counts()
for cat, nb in stats.items():
    print(f"   • {cat}: {nb}")

print("\n" + "="*70)
print("✅ CONVERSION TERMINÉE!")
print(f"📁 Ouvre le fichier: {fichier_sortie}")
print("="*70)