import requests

SUPABASE_URL = "https://uoaafekflbksvkzulclt.supabase.co"
SUPABASE_KEY = "sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

print("🔍 ENTREPRISES AVEC CONFIANCE < 0.7")
print("="*60)

response = requests.get(
    f"{SUPABASE_URL}/rest/v1/exporters",
    headers=HEADERS,
    params={
        "select": "name,activity_sector,confidence_score",
        "confidence_score": "lt.0.7",
        "limit": 100
    }
)

if response.status_code == 200:
    data = response.json()
    if data:
        for x in data:
            if x.get('activity_sector'):
                print(f"{x['name'][:40]:<40} → {x['activity_sector'][:25]} ({x['confidence_score']:.2f})")
        print(f"\n✅ Total: {len(data)} entreprises")
    else:
        print("🎉 Aucune entreprise avec confiance < 0.7 !")
else:
    print(f"❌ Erreur: {response.status_code}")