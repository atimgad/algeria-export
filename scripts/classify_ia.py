import os
import psycopg2
import pandas as pd
from transformers import pipeline
import socket
import warnings
warnings.filterwarnings('ignore')

# Configuration directe avec résolution DNS
try:
    host_ip = socket.gethostbyname('db.uoaafekflbksvkzulclt.supabase.co')
    print(f"✅ DNS résolu: {host_ip}")
except:
    host_ip = '13.38.176.27'  # IP de fallback
    print(f"⚠️ Utilisation IP de secours: {host_ip}")

DB_CONFIG = {
    'host': host_ip,
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
    'password': 'sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22'
}

print("🚀 Chargement du modèle IA...")
classifier = pipeline("zero-shot-classification", 
                     model="facebook/bart-large-mnli")
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
    except:
        return "Autres Secteurs", 0.5

def main():
    print("="*60)
    print("🤖 CLASSIFICATION IA")
    print("="*60)
    
    try:
        print("🔄 Connexion...")
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Connecté")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return
    
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM exporters")
    total = cursor.fetchone()[0]
    print(f"📊 Total entreprises: {total}")
    
    cursor.execute("""
        SELECT id, name, products 
        FROM exporters 
        WHERE activity_sector IS NULL 
           OR activity_sector = 'Autres Secteurs'
        LIMIT 100
    """)
    
    entreprises = cursor.fetchall()
    
    for i, (id_, nom, produits) in enumerate(entreprises, 1):
        if produits and isinstance(produits, str):
            try:
                produits = eval(produits) if produits.startswith('[') else []
            except:
                produits = []
        
        secteur, confiance = classifier_entreprise(nom, produits)
        
        cursor.execute("""
            UPDATE exporters 
            SET activity_sector = %s,
                confidence_score = %s,
                classification_method = 'ia',
                needs_review = %s,
                last_classified = NOW()
            WHERE id = %s
        """, (secteur, confiance, confiance < 0.8, id_))
        
        print(f"   {i}/{len(entreprises)} - {nom[:30]}... → {secteur}")
        
        if i % 10 == 0:
            conn.commit()
    
    conn.commit()
    print("✅ Terminé")

if __name__ == "__main__":
    main()