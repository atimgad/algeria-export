import requests
import time

SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Corrections manuelles des erreurs de classification
CORRECTIONS = {
    "BANQUISE MEDOC": "Agriculture & Agroalimentaire",
    "ALFON": "Métallurgie & Sidérurgie",
    "ALGERIAN QATARI STEEL-AQS": "Métallurgie & Sidérurgie",
    "AUBERGE DE LA MADELEINE": "Agriculture & Agroalimentaire",
    "ATM MOBILIS": "Télécommunications",
    "BORDJ MENAIL POISSONNERIE": "Pêche & Aquaculture",
    "ACTEMIUM SOLAR": "Énergie & Mines",
    "ALGERIAN ANIMAL HEALTH PRODUCT-AAHP": "Industrie Chimique & Pharmaceutique",
    "ACILA GEPACO ALGERIE": "Agriculture & Agroalimentaire",  # Correction du nom et secteur
    "AL SHARIKA EL DJAZAIRIA EL OMANIA LIL AS": "Industrie Chimique & Pharmaceutique",  # Engrais
    "ALARBI ET FILS TRANSFORMATION ET RECYCLA": "Plastique & Emballage",
    "ALFISH": "Pêche & Aquaculture",
    "BARCELONESA ALGERIE": "Industrie Chimique & Pharmaceutique",
    "GICA": "BTP & Matériaux de Construction",
    "MECANIQUE DZ": "Mécanique & Équipements Industriels",
    "SAIDAL": "Industrie Chimique & Pharmaceutique",
    "SNTA": "Agriculture & Agroalimentaire",  # Tabac
    "ABB": "Électronique & Électroménager",
    "ABCA": "Agriculture & Agroalimentaire",  # Graines de caroube
    "AFC RECYCLAGE": "Plastique & Emballage",
    "AFIA INTERNATIONAL ALGERIA": "Agriculture & Agroalimentaire",  # Huiles
    "AGENCE NAT. DE LARTISANAT TRAD.-ANART": "Artisanat",
    "AGRIPLAST": "Agriculture & Agroalimentaire",
    "AL BEKKARI": "Agriculture & Agroalimentaire",  # Dattes
    "AUTOMOTIVE ENGINEERING ET DEVELOPMENT": "Mécanique & Équipements Industriels",
    "BACHICOO": "Textile, Cuir & Mode",
    "BAHAA EDDINE EDITION DIFFUSION": "Édition",
    "ALGERIAN LEATHER INTERNATIONAL": "Textile, Cuir & Mode",
    "ALKA FILMS": "Plastique & Emballage",
    "ALL PLAST": "Plastique & Emballage",
    "ALPA": "Agriculture & Agroalimentaire",  # Chamia
    "ALPHYT-ALGERIENNE DES PHYTOSANITAIRES": "Agriculture & Agroalimentaire",
    "ALSEV": "Métallurgie & Sidérurgie",
    "ALTISA": "Services",
    "ALTRASID": "Métallurgie & Sidérurgie",
    "ALVER": "BTP & Matériaux de Construction",  # Verre
    "ALZYME": "Agriculture & Agroalimentaire",  # Farine
    "AMSAMTEX IMPORT EXPORT": "Textile, Cuir & Mode",
    "AROMAD": "Agriculture & Agroalimentaire",
    "AROMES DALGERIE": "Agriculture & Agroalimentaire",
    "ARSO BOUCHERIT": "Agriculture & Agroalimentaire",  # Dattes
    "ASMA CARROSSERIE INDUSTRIEL": "Mécanique & Équipements Industriels",
    "ATLAS BOTTLING CORPORATION-ABC PEPSI": "Eaux Minérales & Boissons",
    "AUDEX AUTOMOTIVE": "Mécanique & Équipements Industriels"
}

print("="*60)
print("🔧 CORRECTION MANUELLE DES ERREURS")
print("="*60)

success = 0
errors = 0
not_found = 0

for nom, secteur in CORRECTIONS.items():
    print(f"\n🔍 Recherche: {nom}")
    
    # Chercher l'entreprise avec LIKE
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
            print(f"   Trouvé: {item['name']} (actuellement: {item['activity_sector']})")
            
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
print("📊 RÉSULTAT DES CORRECTIONS")
print(f"   ✅ Réussies: {success}")
print(f"   ❌ Erreurs: {errors}")
print(f"   ⚠️ Non trouvés: {not_found}")
print("="*60)