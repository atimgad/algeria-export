# scripts/nettoyage_total.py
import os
import json
import sys
from supabase import create_client
from dotenv import load_dotenv

print("="*60)
print("🧹 NETTOYAGE TOTAL - REPARTIR PROPRE")
print("="*60)

# 1. CHARGEMENT CONFIG
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# 2. LIRE LE FICHIER INITIAL
print("\n📖 Lecture du fichier initial...")
try:
    with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
        entreprises = json.load(f)
    print(f"✅ {len(entreprises)} entreprises dans le fichier original")
except FileNotFoundError:
    print("❌ Fichier non trouvé: data/private/entreprises_brutes.json")
    sys.exit(1)

# 3. ÉTAT ACTUEL DE LA BASE
print("\n📊 État actuel de la base:")
total = supabase.table('exporters').select('*', count='exact').execute()
print(f"   Total entreprises en base: {total.count}")

# 4. MENU
print("\n" + "="*60)
print("📋 MENU PRINCIPAL")
print("="*60)
print("1. 🗑️  TOUT SUPPRIMER et réimporter les 1298 entreprises")
print("2. ➕ Ajouter les manquantes (conserver l'existant)")
print("3. 🔍 Mode analyse seulement (ne rien modifier)")
print("4. ❌ QUITTER sans rien faire")

choix = input("\n👉 Votre choix (1/2/3/4) ? ")

if choix == "1":
    print("\n⚠️  ATTENTION: Vous allez TOUT supprimer !")
    confirm = input("Tapez 'OUI' pour confirmer: ")
    if confirm == "OUI":
        print("🗑️  Suppression en cours...")
        supabase.table('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("✅ Table vidée")
        print("📥 Prêt pour réimportation")
    else:
        print("❌ Annulé")
        
elif choix == "2":
    print("\n🔍 Analyse des manquantes...")
    existant = supabase.table('exporters').select('name').execute()
    noms_existants = {e['name'] for e in existant.data}
    
    manquantes = [e for e in entreprises if e.get('name') not in noms_existants]
    print(f"✅ {len(manquantes)} entreprises à ajouter")
    
    with open('data/private/manquantes.json', 'w', encoding='utf-8') as f:
        json.dump(manquantes, f, ensure_ascii=False, indent=2)
    print("💾 Liste sauvegardée dans data/private/manquantes.json")
    
elif choix == "3":
    print("\n🔍 MODE ANALYSE")
    print(f"   Fichier original: {len(entreprises)} entreprises")
    print(f"   Base actuelle: {total.count} entreprises")
    print(f"   Différence: {len(entreprises) - total.count} entreprises")
    
elif choix == "4":
    print("\n👋 Au revoir")
    sys.exit(0)
    
else:
    print("\n❌ Choix invalide")

print("\n" + "="*60)
print("✅ FIN DU SCRIPT")
print("="*60)