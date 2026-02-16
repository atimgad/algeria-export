import os
import requests
import time
from transformers import pipeline
import warnings
warnings.filterwarnings('ignore')

# Configuration API Supabase
SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

print("="*60)
print("🚀 CLASSIFICATION IA - NEC PLUS ULTRA")
print("="*60)

print("\n🔄 Chargement du modèle IA...")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print("✅ Modèle chargé")

SECTEURS = [
    "Eaux Minérales & Boissons",
    "Huiles Alimentaires",
    "Lubrifiants & Produits Pétroliers",
    "Agriculture & Agroalimentaire",
    "Industrie Chimique & Pharmaceutique",
    "Plastique & Emballage",
    "BTP & Matériaux de Construction",
    "Métallurgie & Sidérurgie",
    "Énergie & Mines",
    "Électronique & Électroménager",
    "Textile, Cuir & Mode",
    "Mécanique & Équipements Industriels",
    "Pêche & Aquaculture",
    "Bois, Liège & Ameublement",
    "Papier & Carton",
    "Services",
    "Autres Secteurs"
]

def classifier_entreprise(nom, produits):
    texte = f"{nom} { ' '.join(produits[:3]) if produits else ''}".lower()
    
    # Règles prioritaires
    if 'huile' in texte and 'moteur' in texte:
        return "Lubrifiants & Produits Pétroliers", 1.0
    if 'huile' in texte and 'lubrifiant' in texte:
        return "Lubrifiants & Produits Pétroliers", 1.0
    if 'huile' in texte and 'olive' in texte:
        return "Huiles Alimentaires", 1.0
    if 'eau' in texte and 'minérale' in texte:
        return "Eaux Minérales & Boissons", 1.0
    if 'datte' in texte or 'deglet' in texte:
        return "Agriculture & Agroalimentaire", 1.0
    
    try:
        resultat = classifier(texte, SECTEURS)
        return resultat['labels'][0], resultat['scores'][0]
    except Exception as e:
        print(f"⚠️ Erreur IA: {e}")
        return "Autres Secteurs", 0.5

def main():
    print("\n🔄 Récupération des entreprises non classifiées...")
    
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/exporters",
        headers=HEADERS,
        params={
            "select": "id,name,products",
            "activity_sector": "eq.Autres secteurs",
            "limit": 1000
        }
    )
    
    if response.status_code != 200:
        print(f"❌ Erreur API: {response.status_code}")
        print(response.text)
        return
    
    entreprises = response.json()
    print(f"📊 {len(entreprises)} entreprises à classifier")
    
    if len(entreprises) == 0:
        print("✅ Aucune entreprise à classifier")
        return
    
    print("\n🚀 Début de la classification...\n")
    
    for i, e in enumerate(entreprises, 1):
        produits = e.get('products', [])
        if isinstance(produits, str):
            try:
                produits = eval(produits) if produits.startswith('[') else []
            except:
                produits = []
        
        secteur, confiance = classifier_entreprise(e['name'], produits)
        
        update_response = requests.patch(
            f"{SUPABASE_URL}/rest/v1/exporters",
            headers=HEADERS,
            params={"id": f"eq.{e['id']}"},
            json={
                "activity_sector": secteur,
                "confidence_score": confiance,
                "classification_method": "ia",
                "needs_review": confiance < 0.8,
                "last_classified": "now()"
            }
        )
        
        if update_response.status_code == 204:
            print(f"   ✅ {i}/{len(entreprises)} - {e['name'][:40]:<40} → {secteur[:30]} ({confiance:.2f})")
        else:
            print(f"   ❌ {i}/{len(entreprises)} - Erreur {update_response.status_code}: {update_response.text}")
        
        time.sleep(0.2)
    
    print("\n" + "="*60)
    print("✅ CLASSIFICATION TERMINÉE")
    print("="*60)

if __name__ == "__main__":
    main()