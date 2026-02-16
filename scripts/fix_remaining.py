import requests
import time

SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Corrections pour les 100 entreprises restantes
CORRECTIONS = {
    "ALE": "Agriculture & Agroalimentaire",
    "proj": "Services",
    "projects to develop and grow internation": "Services",
    "Ambassade d'E": "Services",
    "MADRID E": "Services",
    "FABRIQUE DEMBALLAGES AVICOLES BELKHICHEN": "Plastique & Emballage",
    "CONFITA PLUS": "Agriculture & Agroalimentaire",  # Confitures
    "CONTINENTAL PHARM": "Industrie Chimique & Pharmaceutique",
    "COSIDER LAFARGE PLATRES ALGERIE-COLPA": "BTP & Matériaux de Construction",  # Plâtre
    "CRUSTAL": "Pêche & Aquaculture",  # Fruits de mer
    "DANOR": "Agriculture & Agroalimentaire",  # Dattes
    "DAR ECHIHAB DEDITION ET DE DISTRIBUTION": "Édition",
    "DIVINDUS CAPREF": "Bois, Liège & Ameublement",  # Préfabriqué
    "DJAOUHARAT TITRI LITANMIA EL MOSTADAMA": "Agriculture & Agroalimentaire",
    "DJEFFAL NABIL IMPORT EXPORT": "Agriculture & Agroalimentaire",  # Dattes
    "DJEN DJEN FISHING": "Pêche & Aquaculture",
    "EXPORTAS FOOD EXPORT": "Agriculture & Agroalimentaire",
    "FABS": "Papier & Carton",  # Papeterie
    "EL DJAWHARA BOUDOUKHA": "Services",  # Produits ménagers
    "EL FALAH IMPORT EXPORT": "Agriculture & Agroalimentaire",
    "EL FALAK": "Agriculture & Agroalimentaire",
    "EL KALA FISH": "Pêche & Aquaculture",
    "EL NAKHLA EL DJAMILA IMPORT EXPORT": "Agriculture & Agroalimentaire",
    "EL NOURASI CORPORATION": "BTP & Matériaux de Construction",  # Carreaux
    "EL WEJDENE": "Agriculture & Agroalimentaire",  # Miel, pâtes
    "SOCOTHYD": "Industrie Chimique & Pharmaceutique",  # Produits pharmaceutiques
    "ENTREPRISE DE PLATRE ET DERIVES - EPD": "BTP & Matériaux de Construction",
    "ENTREPRISE DE TRANSF.DE LIEGE ROUIKHA-ET": "Bois, Liège & Ameublement",
    "ENTREPRISE NATIONALE DE GEOPHYSIQUE-ENAG": "Énergie & Mines",
    "ENTREPRISE NATIONALE DE GRANULATS-ENG": "BTP & Matériaux de Construction",
    "DE CONTRLE-AMC": "Électronique & Électroménager",  # Appareils de mesure
    "ENPEC": "Électronique & Électroménager",  # Batteries
    "ENTREPRISE NATIONALE DES SELS-ENASEL": "Agriculture & Agroalimentaire",  # Sel
    "EPIDEK BEJAIA": "Industrie Chimique & Pharmaceutique",  # Peintures
    "ETABLISSEMENT KIARED": "Agriculture & Agroalimentaire",  # Huile d'olive
    "EXIMERE": "Pêche & Aquaculture",
    "EXP UNITED": "Métallurgie & Sidérurgie",  # Ferraille
    "EXPORT TRADE OF ALGERIAN PRODUCT ETAP": "Papier & Carton",  # Articles de bureau
    "GNMC": "BTP & Matériaux de Construction",  # Plafonds, peintures
    "GOLDEN TIGER": "Papier & Carton",  # Carton
    "GRANDE VINAIGRERIE CONSTANTINOISE-GVC": "Agriculture & Agroalimentaire",  # Vinaigre
    "GRANDS MOULINS DAHMANI": "Agriculture & Agroalimentaire",  # Farine
    "GREEN OIL NUTRITION": "Agriculture & Agroalimentaire",  # Dattes
    "GROUPE GEICA": "Services",  # Études, contrôle
    "GROUPE GICA": "BTP & Matériaux de Construction",  # Ciment
    "GROUPE INDUSTRIEL SIDI BENDEHIBA-GISB": "Électronique & Électroménager",  # Câbles
    "MARTUR ALGERIA AUTOMOTIVE SEATING AN": "Mécanique & Équipements Industriels",  # Sièges auto
    "MATELAS ATLAS": "Textile, Cuir & Mode",  # Literie
    "SOCIETE GENERALE MARITIME-GEMA": "Services",  # Transport maritime
    "SOCIETE INDUSTRIELLE BOIS ET LIEGE-SIBL": "Bois, Liège & Ameublement",
    "EQUIPEMENTS DE COLLECTIVITES-SIMAFE": "Mécanique & Équipements Industriels",  # Équipement froid
    "FARAS INTERNATIONAL": "Papier & Carton",  # Enveloppes
    "FATIMA BAY EXPORT": "Pêche & Aquaculture",
    "FEL PECHE": "Pêche & Aquaculture",
    "FIDEL NEOCE": "Agriculture & Agroalimentaire",  # Miel de dattes
    "FILTRANS": "Services",  # Transport
    "FIRST FEET": "Agriculture & Agroalimentaire",  # Poulet congelé
    "FONCE CYCLE AZZEDINE": "Textile, Cuir & Mode",  # Laine
    "FRAMNET": "Services",  # Coiffure
    "FRM": "Mécanique & Équipements Industriels",  # Pièces auto
    "FRSK IMP EXP": "Agriculture & Agroalimentaire",
    "GAYA PRODUIT": "Eaux Minérales & Boissons",
    "GBK FOOD": "Agriculture & Agroalimentaire",
    "GECOTRIM": "Plastique & Emballage",
    "GENERAL PLAST": "Plastique & Emballage",
    "GENERALE CONDIMENTAIRE ALGERIE": "Papier & Carton",
    "GEOTRANS": "Services",  # Transport
    "GHAZAIL TAHAR ETPBH": "Textile, Cuir & Mode",  # Couvertures
    "INTERSURVEY": "Services",  # Désinfection
    "IZNOSA ALGERIE": "Plastique & Emballage",  # Déchets plastique
    "JIJEL IMPORT EXPORT": "Pêche & Aquaculture",
    "JIJEL LIEGE ETANCHEITE-JLE": "Bois, Liège & Ameublement",
    "KAMELO FOOD": "Agriculture & Agroalimentaire",
    "KANI PAP": "Papier & Carton",
    "KERBAA ABDELKARIM": "Agriculture & Agroalimentaire",
    "KETANSHINGLES": "BTP & Matériaux de Construction",
    "KHIR BLADI EXPORT": "Agriculture & Agroalimentaire",
    "MATS ALGERIE": "Industrie Chimique & Pharmaceutique",  # Savons
    "SOCIETE MIXTE ALGERO E": "Pêche & Aquaculture",
    "GROUPE SEMOULERIE INDUST.DE LA MITIDJA-S": "Agriculture & Agroalimentaire",
    "GROUPE THIKA": "Industrie Chimique & Pharmaceutique",  # Détergents
    "GUERA PLAST": "Plastique & Emballage",
    "HADDOUD SALIM": "Agriculture & Agroalimentaire",
    "HAMPTON ALGERIA": "Agriculture & Agroalimentaire",  # Dattes
    "HAYATI IMPORT EXPORT": "Agriculture & Agroalimentaire",
    "HELISON PRODUCTION": "Énergie & Mines",  # Gaz
    "HEROUAL IMENE": "Électronique & Électroménager",  # Éclairage
    "HIGH TECH SECURITY": "Électronique & Électroménager",  # Sécurité
    "HUASHENG USINE": "Métallurgie & Sidérurgie",  # Fils d'acier
    "HUBBARD ALGERIE": "Agriculture & Agroalimentaire",  # Poussins
    "HYDROTOBATO": "Agriculture & Agroalimentaire",
    "IBN FAHR IMPORT EXPORT": "Agriculture & Agroalimentaire",
    "IBRAHIM ET FILS - IFRI": "Eaux Minérales & Boissons",
    "IDEAL IMPRESSION": "Services",  # Impression
    "IMPEX UNIVERSAL BUSINESS": "Agriculture & Agroalimentaire",
    "INDUSTRIES MEDICOCHIRURGICALES-IMC": "Industrie Chimique & Pharmaceutique",
    "LITERIE MAGHREBINE LIT.MAG": "Textile, Cuir & Mode",  # Literie
    "LU ALGERIE": "Agriculture & Agroalimentaire",  # Biscuits
    "MAGHARET EL MORDJANE ALGERIA": "Artisanat",  # Corail
    "MAISON COUTURE FINESSE": "Textile, Cuir & Mode",
}

print("="*60)
print("🔧 CORRECTION DES 100 DERNIERS CAS")
print("="*60)

success = 0
errors = 0
not_found = 0

for nom, secteur in CORRECTIONS.items():
    print(f"\n🔍 Recherche: {nom}")
    
    search = requests.get(
        f"{SUPABASE_URL}/rest/v1/exporters",
        headers=HEADERS,
        params={
            "select": "id,name,activity_sector",
            "name": f"ilike.{nom}%",
            "limit": 5
        }
    )
    
    if search.status_code == 200 and search.json():
        for item in search.json():
            print(f"   ✓ Trouvé: {item['name'][:40]}")
            
            update = requests.patch(
                f"{SUPABASE_URL}/rest/v1/exporters",
                headers=HEADERS,
                params={"id": f"eq.{item['id']}"},
                json={
                    "activity_sector": secteur,
                    "needs_review": False,
                    "confidence_score": 1.0,
                    "classification_method": "manuel"
                }
            )
            
            if update.status_code == 204:
                print(f"   ✅ → {secteur}")
                success += 1
            else:
                print(f"   ❌ Erreur {update.status_code}")
                errors += 1
            
            time.sleep(0.2)
    else:
        print(f"   ⚠️ Non trouvé")
        not_found += 1
    
    time.sleep(0.3)

print("\n" + "="*60)
print("📊 RÉSULTAT FINAL")
print(f"   ✅ Corrigées: {success}")
print(f"   ❌ Erreurs: {errors}")
print(f"   ⚠️ Non trouvés: {not_found}")
print("="*60)