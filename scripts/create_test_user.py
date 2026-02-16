import requests
import json

SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Créer un utilisateur de test
test_user = {
    "email": "test@algeriaexport.com",
    "password": "Test123456!",
    "email_confirm": True
}

print("🚀 Création d'un utilisateur de test...")

# Inscription
response = requests.post(
    f"{SUPABASE_URL}/auth/v1/signup",
    headers=HEADERS,
    json=test_user
)

if response.status_code == 200:
    print("✅ Utilisateur créé avec succès")
    print(f"📧 Email: {test_user['email']}")
    print(f"🔑 Mot de passe: {test_user['password']}")
else:
    print(f"❌ Erreur: {response.status_code}")
    print(response.json())