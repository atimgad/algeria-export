import requests
import time

SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Corrections manuelles des produits manquants
PRODUCTS_UPDATE = {
    "SATEREX": ["produits électroniques", "produits électroménagers", "produits pneumatiques"],
    "SOCIETE ALGERIENNE DE ZINC": ["zinc", "alliages"],
    "THEVEST CONDITIONNEMENT": ["carreaux céramique"],
    "WLI ALGERIA": ["dattes"],
    "PEPSI": ["boissons gazeuses"],
    "ALGEMATCO STEEL": ["acier", "produits métallurgiques"],
    "ARCODYM": ["machines d'emballage"],
    "ATLAS COPCO ALGERIE": ["compresseurs", "équipements industriels"],
    "CORSMA IMPORT EXPORT": ["articles plastique"],
    "AMARIUS": ["caroube"],
    "PALMARS": ["dattes"],
    "PLAST ECO BISKRA": ["dattes"],
    "CHAMIA EL QODS": ["halwa chamia"],
    "DULCESOL MAGHREB": ["madeleines"],
    "EDHAOUAKA EL DJAZAIRIA": ["épices"],
    "EXPORT NAIL": ["huile d'olive"],
    "FALAIT-TARTINO": ["produits laitiers"],
    "FALCO": ["bonbons", "halwa", "loukoum"],
    "FAZIA EXPORT": ["confiture", "salade", "harissa", "huile d'olive"],
    "SIPADES-NOUARA": ["flans", "crèmes dessert", "cacao"],
    "SOALTUBI": ["biscuits"],
    "BAB EL FETH": ["poissons", "crustacés"],
    "CAP AFRICA": ["poissons"],
    "CAP DE GARDE": ["crustacés"],
    "EDEN CARBE": ["poissons", "fruits de mer"],
    "EL KALA MAREE": ["poissons"],
    "ENTREPRISE MENOUR EXPORT": ["escargots"],
    "FINTA PECHE": ["crustacés", "poissons", "poulpes"],
    "HEALTY FOOD": ["poissons"],
    "KHALDI MOHAMED": ["poulpes"],
    "ORAN PECHE": ["poissons"],
    "DE PECHE-SMALEP": ["crevettes"],
    "YACEF CRUSTASEY": ["poulpes"],
    "AFRICAINE PAPER MILLS": ["serviettes hygiéniques"],
    "RECYCLAGE": ["matériaux recyclés"],
    "LIL ASMIDA": ["engrais", "urée"],
    "ARGILEV ALGERIE": ["masques d'argile"],
    "ASRAR EL DJAMEL": ["produits cosmétiques"],
    "ALGERIA": ["produits agroalimentaires"],
    "BAZICOS ALGERIE": ["parfums", "déodorants"],
    "BEAUTY LAB": ["cosmétiques", "huiles", "crèmes"],
    "BEKER LABORATOIRES": ["médicaments"],
    "BIOCARE": ["médicaments"],
    "CENTRE E ALGERIE": ["peintures"],
    "CENTRE RADIOTHERAPIE ONCOLOGIE": ["équipements médicaux"],
}

print("="*60)
print("🔄 MISE À JOUR DES PRODUITS MANQUANTS")
print("="*60)

success = 0
errors = 0

for nom, produits in PRODUCTS_UPDATE.items():
    print(f"\n🔍 Recherche: {nom}")
    
    search = requests.get(
        f"{SUPABASE_URL}/rest/v1/exporters",
        headers=HEADERS,
        params={
            "select": "id,name",
            "name": f"ilike.{nom}%",
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
                json={"products": produits}
            )
            
            if update.status_code == 204:
                print(f"   ✅ Produits ajoutés: {produits}")
                success += 1
            else:
                print(f"   ❌ Erreur {update.status_code}")
                errors += 1
            
            time.sleep(0.2)
    else:
        print(f"   ⚠️ Non trouvé")
    
    time.sleep(0.3)

print("\n" + "="*60)
print(f"📊 RÉSULTAT: {success} mises à jour, {errors} erreurs")
print("="*60)