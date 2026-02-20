# scripts/import_expert_unicite.py
import os
import json
import uuid
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime
from collections import defaultdict

print("="*80)
print("🏆 IMPORT EXPERT - GESTION DES CONTRAINTES D'UNICITÉ")
print("="*80)

# Connexion
load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)
print("✅ Connecté à Supabase")

# 1. RÉCUPÉRER LES NOMS EXISTANTS
print("\n🔍 Récupération des noms déjà en base...")
try:
    existants = supabase.table('exporters').select('name').execute()
    noms_existants = {e['name'] for e in existants.data}
    print(f"✅ {len(noms_existants)} noms déjà en base")
except:
    noms_existants = set()
    print("⚠️ Aucun nom existant trouvé")

# 2. CHARGER LES ENTREPRISES
print("\n📖 Lecture du fichier entreprises...")
with open('data/private/entreprises_brutes.json', 'r', encoding='utf-8') as f:
    entreprises = json.load(f)
print(f"✅ {len(entreprises)} entreprises chargées")

# 3. ANALYSER LES DOUBLONS DANS LE FICHIER
print("\n📊 Analyse des doublons dans le fichier...")
nom_compteur = defaultdict(int)
for e in entreprises:
    nom = e.get('nom', '')
    if nom:
        nom_compteur[nom] += 1

doublons_fichier = {nom: count for nom, count in nom_compteur.items() if count > 1}
print(f"⚠️ {len(doublons_fichier)} noms en double dans le fichier source")
if len(doublons_fichier) > 0:
    print("Exemples de doublons:")
    for nom, count in list(doublons_fichier.items())[:3]:
        print(f"   • '{nom[:50]}...' apparaît {count} fois")

# 4. PRÉPARER L'IMPORT AVEC GESTION DES DOUBLONS
print("\n📥 Préparation avec gestion d'unicité...")
lots = []
lot_actuel = []
total = len(entreprises)
importes = 0
ignores = 0
compteur_noms = defaultdict(int)

for i, e in enumerate(entreprises, 1):
    nom = e.get('nom', '')
    
    # Vérifier si ce nom existe déjà (en base ou déjà importé)
    compteur_noms[nom] += 1
    occurrence = compteur_noms[nom]
    
    # Décider quoi faire
    if nom in noms_existants:
        # Nom déjà en base - on ignore
        ignores += 1
        statut = "IGNORÉ (déjà en base)"
    elif occurrence > 1:
        # C'est un doublon dans le fichier - on garde le premier, on ignore les autres
        if occurrence == 1:
            # Premier - on importe
            telephone = e.get('telephones', [])
            telephone = telephone[0] if telephone else None
            
            email = e.get('emails', [])
            email = email[0] if email else None
            
            entreprise = {
                'id': str(uuid.uuid4()),
                'name': nom[:500],
                'activity_sector': e.get('secteur', ''),
                'wilaya': e.get('wilaya', ''),
                'address': e.get('adresse', ''),
                'phone': telephone,
                'email': email,
                'products': e.get('produits', []),
                'source_file': 'import_2024_nouveau',
                'created_at': datetime.now().isoformat(),
                'is_duplicate': False,
                'can_export': True
            }
            
            if e.get('description'):
                entreprise['exporter_notes'] = e.get('description')[:1000]
            
            lot_actuel.append(entreprise)
            importes += 1
            statut = "IMPORTÉ (premier du lot)"
        else:
            ignores += 1
            statut = f"IGNORÉ (doublon #{occurrence} dans fichier)"
    else:
        # Nouveau nom unique - on importe
        telephone = e.get('telephones', [])
        telephone = telephone[0] if telephone else None
        
        email = e.get('emails', [])
        email = email[0] if email else None
        
        entreprise = {
            'id': str(uuid.uuid4()),
            'name': nom[:500],
            'activity_sector': e.get('secteur', ''),
            'wilaya': e.get('wilaya', ''),
            'address': e.get('adresse', ''),
            'phone': telephone,
            'email': email,
            'products': e.get('produits', []),
            'source_file': 'import_2024_nouveau',
            'created_at': datetime.now().isoformat(),
            'is_duplicate': False,
            'can_export': True
        }
        
        if e.get('description'):
            entreprise['exporter_notes'] = e.get('description')[:1000]
        
        lot_actuel.append(entreprise)
        importes += 1
        statut = "IMPORTÉ"
    
    if len(lot_actuel) >= 100:
        lots.append(lot_actuel)
        lot_actuel = []
    
    if i % 100 == 0:
        print(f"   • {i}/{total} traités - {importes} à importer, {ignores} ignorés")

# Ajouter le dernier lot
if lot_actuel:
    lots.append(lot_actuel)

print(f"\n📦 {len(lots)} lots à importer ({importes} entreprises uniques sur {total})")

# 5. IMPORTER
print("\n🚀 Début de l'import...")
succes = 0
erreurs = []

for idx, lot in enumerate(lots, 1):
    try:
        if lot:  # Éviter les lots vides
            result = supabase.table('exporters').insert(lot).execute()
            succes += len(lot)
            print(f"✅ Lot {idx}/{len(lots)}: {len(lot)} entreprises importées")
    except Exception as e:
        erreurs.append(f"Lot {idx}: {str(e)[:200]}")
        print(f"❌ Lot {idx}: échec - {str(e)[:100]}")

# 6. RAPPORT FINAL
print("\n" + "="*80)
print("📊 RAPPORT FINAL")
print("="*80)
print(f"📁 Fichier source: {total} entreprises")
print(f"✅ À importer (uniques): {importes} entreprises")
print(f"⏭️  Ignorés (doublons/déjà présents): {ignores} entreprises")
print(f"📦 Lots créés: {len(lots)}")
print(f"✅ Importés avec succès: {succes} entreprises")
print(f"❌ Lots en échec: {len(erreurs)}")

if erreurs:
    print("\nDétail des erreurs:")
    for err in erreurs[:5]:
        print(f"   • {err}")

# 7. VÉRIFICATION FINALE
print("\n🔍 Vérification finale...")
verif = supabase.table('exporters').select('*', count='exact').execute()
print(f"📊 Total entreprises en base: {verif.count}")

print("\n" + "="*80)
print("✅ IMPORT EXPERT TERMINÉ")
print("="*80)