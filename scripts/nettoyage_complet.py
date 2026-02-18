import json
import re
from collections import defaultdict
import os

# Configuration
INPUT_FILE = "pour_analyse_ia/donnees_pour_ia_corrige.json"
OUTPUT_FILE = "pour_analyse_ia/donnees_pour_ia_final.json"
RAPPORT_FILE = "pour_analyse_ia/rapport_nettoyage.txt"

# Mots à supprimer (entités fantômes)
MOTS_FANTOMES = [
    "Le", "Nos", "Together,", "Elaboré", "Site", "Au", "Dans", "At", "In", "?",
    "EXPORTATEUR", "1er EXPORTATEUR ALGÉRIEN", "Crédits", "Subscribing",
    "e", "commerce", "étrangers", "operations", "u", "de", "des", "à", "et",
    "politique", "export", "evaluation", "répertoire", "Published", "Édité"
]

# Règles de reclassification
RECLASSIFICATION = {
    "Site": "Site web",
    "Crédits": "Finance",
    "Index": "Index",
    "Tél:": "Contact",
    "Fax:": "Contact"
}

def supprimer_fantomes(entites):
    """Supprime les entités qui sont des mots fantômes"""
    gardees = []
    supprimees = 0
    
    for e in entites:
        nom = e.get('nom', '').strip()
        if len(nom) < 3 or nom in MOTS_FANTOMES or nom.startswith(('http', 'www', '@')):
            supprimees += 1
            continue
        gardees.append(e)
    
    return gardees, supprimees

def detecter_doublons(entites):
    """Détecte les doublons basés sur le nom normalisé"""
    groupes = defaultdict(list)
    
    for e in entites:
        nom = e.get('nom', '').upper()
        # Normaliser le nom (enlever les caractères spéciaux)
        nom_normalise = re.sub(r'[^A-Z0-9]', '', nom)
        if len(nom_normalise) > 5:
            groupes[nom_normalise].append(e)
    
    # Garder la meilleure version de chaque doublon
    uniques = []
    doublons_trouves = 0
    
    for key, groupe in groupes.items():
        if len(groupe) == 1:
            uniques.append(groupe[0])
        else:
            doublons_trouves += len(groupe) - 1
            # Garder l'entrée avec le plus d'informations
            meilleure = max(groupe, key=lambda x: (
                len(x.get('contacts', {}).get('emails', [])),
                len(x.get('contacts', {}).get('tels', [])),
                len(x.get('description', ''))
            ))
            uniques.append(meilleure)
    
    return uniques, doublons_trouves

def reclassifier(entites):
    """Reclassifie les entités mal catégorisées"""
    reclasses = 0
    
    for e in entites:
        categorie = e.get('categorie', '')
        nom = e.get('nom', '').upper()
        
        # Détecter les vraies entreprises dans la catégorie "Port"
        if categorie == "Port" and any(mot in nom for mot in ["SARL", "SPA", "EURL", "IMPORT", "EXPORT"]):
            e['categorie'] = "ENTREPRISE"
            e['type_entite'] = "entreprise"
            reclasses += 1
        
        # Détecter les index
        if "PAGE" in nom or any(str(i) in nom for i in range(100, 300)):
            e['categorie'] = "Index"
            e['type_entite'] = "index"
            reclasses += 1
    
    return entites, reclasses

def valider_emails(entites):
    """Valide et corrige les emails"""
    pattern_email = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    emails_invalides = 0
    
    for e in entites:
        if 'contacts' in e and 'emails' in e['contacts']:
            emails_valides = []
            for email in e['contacts']['emails']:
                if pattern_email.match(email):
                    emails_valides.append(email)
                else:
                    emails_invalides += 1
            e['contacts']['emails'] = emails_valides
    
    return entites, emails_invalides

def generer_rapport(stats):
    """Génère un rapport texte du nettoyage"""
    with open(RAPPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("RAPPORT DE NETTOYAGE COMPLET\n")
        f.write("="*60 + "\n\n")
        
        f.write(f"📊 STATISTIQUES:\n")
        f.write(f"   • Entités avant: {stats['avant']}\n")
        f.write(f"   • Entités fantômes supprimées: {stats['fantomes']}\n")
        f.write(f"   • Doublons fusionnés: {stats['doublons']}\n")
        f.write(f"   • Entités reclassifiées: {stats['reclasses']}\n")
        f.write(f"   • Emails invalides supprimés: {stats['emails_invalides']}\n")
        f.write(f"   • Entités après: {stats['apres']}\n\n")
        
        f.write("="*60 + "\n")
        f.write("✅ NETTOYAGE TERMINÉ\n")
        f.write("="*60 + "\n")

def main():
    print("\n" + "="*60)
    print("🧹 NETTOYAGE COMPLET DES DONNÉES")
    print("="*60)
    
    # Charger les données
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Fichier non trouvé: {INPUT_FILE}")
        return
    
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    stats = {'avant': len(data['entites'])}
    print(f"\n📊 Entités avant nettoyage: {stats['avant']}")
    
    # 1. Supprimer les fantômes
    data['entites'], stats['fantomes'] = supprimer_fantomes(data['entites'])
    print(f"   ✅ {stats['fantomes']} entités fantômes supprimées")
    
    # 2. Détecter et fusionner les doublons
    data['entites'], stats['doublons'] = detecter_doublons(data['entites'])
    print(f"   ✅ {stats['doublons']} doublons fusionnés")
    
    # 3. Reclassifier
    data['entites'], stats['reclasses'] = reclassifier(data['entites'])
    print(f"   ✅ {stats['reclasses']} entités reclassifiées")
    
    # 4. Valider les emails
    data['entites'], stats['emails_invalides'] = valider_emails(data['entites'])
    print(f"   ✅ {stats['emails_invalides']} emails invalides supprimés")
    
    stats['apres'] = len(data['entites'])
    print(f"\n📊 Entités après nettoyage: {stats['apres']}")
    
    # Sauvegarder
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Générer rapport
    generer_rapport(stats)
    
    print("\n" + "="*60)
    print(f"✅ NETTOYAGE TERMINÉ!")
    print(f"📁 Fichier final: {OUTPUT_FILE}")
    print(f"📁 Rapport: {RAPPORT_FILE}")
    print("="*60)

if __name__ == "__main__":
    main()