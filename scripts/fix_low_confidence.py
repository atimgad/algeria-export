import requests
import time

SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Corrections basées sur les noms d'entreprises
CORRECTIONS = {
    "AFITEX ALGERIE": "BTP & Matériaux de Construction",  # Solutions géosynthétiques
    "BORHANE BIOLINE EXPORT": "BTP & Matériaux de Construction",  # Marbre
    "BOUREBA IMPORT EXPORT": "Agriculture & Agroalimentaire",  # Oignons
    "BOUROUINA LARBI": "Agriculture & Agroalimentaire",  # Céréales
    "BRITISH AMERICAN TOBACCO ALGERIE": "Agriculture & Agroalimentaire",  # Tabac
    "CAN HYGIENE": "Papier & Carton",  # Articles hygiéniques
    "CAP CIGLEB FISH EXPORT": "Pêche & Aquaculture",
    "CASA": "Agriculture & Agroalimentaire",  # Miel
    "CASBAH": "Agriculture & Agroalimentaire",  # Vinaigre, sauces
    "CEVA SANTE ANIMALE": "Industrie Chimique & Pharmaceutique",  # Médicaments vétérinaires
    "FABRICATION DE DERIVES DE COTON-FADERCO": "Textile, Cuir & Mode",
    "FABRICATION DES EQUIPEMENTS COLLECTIFS": "Mécanique & Équipements Industriels",
    "FABRICATION LAITON ET ROBINETTERIE-FLR": "BTP & Matériaux de Construction",
    "FABRIQUE DEMBALLAGES AVICOLES BELKHICHEN": "Plastique & Emballage",
    "BATIFIX": "BTP & Matériaux de Construction",
    "BAWABAT LIWA IMPORT EXPORT": "Agriculture & Agroalimentaire",  # Dattes
    "BEJAIA LIEGE-BL": "Bois, Liège & Ameublement",
    "BEKA LUBE ALGERIE": "Mécanique & Équipements Industriels",  # Lubrification industrielle
    "BELAHOUEL DAHMANE BOUNOUA ENTREPRISE": "Mécanique & Équipements Industriels",
    "BELHADI TUILERIE BRIQUETERIE BOUZEG": "BTP & Matériaux de Construction",
    "BENBDELHALIM MOKADDEM FOUZI-BFM": "Agriculture & Agroalimentaire",  # Dattes
    "BG CONCEPT": "BTP & Matériaux de Construction",  # Marbre
    "BIOGALENIC": "Industrie Chimique & Pharmaceutique",
    "BIONOOR": "Agriculture & Agroalimentaire",  # Dattes bio
    "BISMA DISTRIBUTION IMPORT EXPORT": "Électronique & Électroménager",
    "BISTIKA": "Agriculture & Agroalimentaire",
    "BM SANTE": "Industrie Chimique & Pharmaceutique",
    "BOIKO": "Mécanique & Équipements Industriels",  # Matériel démonstration
    "BOISSONS KHOUAS KNIAA": "Eaux Minérales & Boissons",
    "DJENANE CHREA EXP": "Agriculture & Agroalimentaire",  # Dattes, grenade
    "DJOUDI INDUSTRIE": "Mécanique & Équipements Industriels",
    "DOKA ALGERIE": "Mécanique & Équipements Industriels",  # Coffrages
    "DRILTEC": "Mécanique & Équipements Industriels",  # Forage
    "DYDO": "Agriculture & Agroalimentaire",  # Confiserie
    "DZAL": "Métallurgie & Sidérurgie",  # Aluminium
    "ECOPACK": "Plastique & Emballage",
    "MAKA FAOUZI EXPORT": "Agriculture & Agroalimentaire",  # Dattes
    "MARE THALASSA LTD": "Pêche & Aquaculture",
    "CHEIKH BOUAMAMA IMPORT EXPORT": "Agriculture & Agroalimentaire",  # Dattes
    "CHIPALGI": "Agriculture & Agroalimentaire",  # Chips
    "CILAS": "BTP & Matériaux de Construction",  # Ciment
    "CMZ DESIGN": "Électronique & Électroménager",  # Haut-parleurs
    "COGITELA ALGERIE": "Plastique & Emballage",  # Films polyester
    "COGRAL": "Agriculture & Agroalimentaire",  # Huiles
    "COLLOCORK": "Bois, Liège & Ameublement",
}

print("="*60)
print("🔧 CORRECTION DES CAS FAIBLES")
print("="*60)

success = 0
errors = 0

for nom, secteur in CORRECTIONS.items():
    print(f"\n🔍 Recherche: {nom}")
    
    search = requests.get(
        f"{SUPABASE_URL}/rest/v1/exporters",
        headers=HEADERS,
        params={
            "select": "id,name,activity_sector",
            "name": f"ilike.{nom}",
            "limit": 5
        }
    )
    
    if search.status_code == 200 and search.json():
        for item in search.json():
            print(f"   ✓ Trouvé: {item['name']}")
            
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
    
    time.sleep(0.3)

print("\n" + "="*60)
print(f"📊 RÉSULTAT: {success} corrigées, {errors} erreurs")
print("="*60)