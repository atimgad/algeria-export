# scripts/check_structure.py
from supabase import create_client
from dotenv import load_dotenv
import os

print("="*50)
print("🔍 VÉRIFICATION STRUCTURE TABLE EXPORTERS")
print("="*50)

load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# Méthode 1: Essayer de récupérer un enregistrement
print("\n📋 Méthode 1: Lecture d'un échantillon...")
try:
    result = supabase.table('exporters').select('*').limit(1).execute()
    if result.data:
        print("✅ Colonnes trouvées:")
        for col in result.data[0].keys():
            print(f"   • {col}")
    else:
        print("⚠️ Table vide - pas de données pour voir la structure")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Méthode 2: Via une requête d'insertion qui échoue
print("\n📋 Méthode 2: Analyse via erreur d'insertion...")
try:
    test_data = {"test_column": "test_value"}
    supabase.table('exporters').insert(test_data).execute()
except Exception as e:
    error_msg = str(e)
    print(f"✅ Message d'erreur reçu:")
    print(f"   {error_msg}")
    
    # Essayer d'extraire les colonnes du message d'erreur
    if "Could not find the" in error_msg:
        print("\n⚠️ La table existe mais les colonnes sont inconnues")
    elif "duplicate key" in error_msg:
        print("✅ La table a des contraintes de clé")

print("\n" + "="*50)
print("✅ VÉRIFICATION TERMINÉE")
print("="*50)