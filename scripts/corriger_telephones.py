import json
import re
import os

# Configuration
INPUT_FILE = "pour_analyse_ia/donnees_pour_ia.json"
OUTPUT_FILE = "pour_analyse_ia/donnees_pour_ia_corrige.json"

def corriger_telephone_algerie(tel):
    """Corrige un numéro de téléphone au format Algérie (+213)"""
    if not tel or not isinstance(tel, str):
        return tel
    
    # Nettoyer le numéro
    tel_propre = re.sub(r'[\s\-\.\(\)]', '', tel)
    
    # Déjà au bon format
    if tel_propre.startswith('+213'):
        return tel
    
    # Format avec 0 (ex: 0550123456)
    if tel_propre.startswith('0') and len(tel_propre) == 10:
        return f"+213 {tel_propre[1:4]} {tel_propre[4:7]} {tel_propre[7:]}"
    
    # Format mobile sans indicatif (9 chiffres)
    if len(tel_propre) == 9 and tel_propre[0] in ['5', '6', '7']:
        return f"+213 {tel_propre[:3]} {tel_propre[3:6]} {tel_propre[6:]}"
    
    # Format fixe (8 chiffres)
    if len(tel_propre) == 8:
        return f"+213 {tel_propre[:2]} {tel_propre[2:5]} {tel_propre[5:]}"
    
    return tel

def corriger_tous_telephones():
    """Charge le JSON, corrige tous les téléphones et sauvegarde"""
    
    print("\n📞 CORRECTION DES NUMÉROS DE TÉLÉPHONE")
    print("="*60)
    
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Fichier non trouvé: {INPUT_FILE}")
        return
    
    # Charger les données
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ Fichier chargé: {INPUT_FILE}")
    print(f"📊 {len(data['entites'])} entités à traiter")
    
    compteur = 0
    for entite in data['entites']:
        if 'contacts' in entite and 'tels' in entite['contacts']:
            tels_originaux = entite['contacts']['tels'].copy()
            entite['contacts']['tels'] = [
                corriger_telephone_algerie(tel) 
                for tel in entite['contacts']['tels']
            ]
            if tels_originaux != entite['contacts']['tels']:
                compteur += len(entite['contacts']['tels'])
    
    # Sauvegarder
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {compteur} numéros corrigés")
    print(f"✅ Fichier sauvegardé: {OUTPUT_FILE}")
    print("="*60)

if __name__ == "__main__":
    corriger_tous_telephones()