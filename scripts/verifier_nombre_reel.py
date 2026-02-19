# scripts/verifier_nombre_reel.py
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv('.env.local')
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# Requête avec count exact
result = supabase.table('exporters').select('*', count='exact').execute()
print(f"\n📊 NOMBRE RÉEL (count exact): {result.count}")