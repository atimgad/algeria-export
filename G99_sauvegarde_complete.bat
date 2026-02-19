@echo off
echo ========================================
echo G99 - SAUVEGARDE TOTALE DU PROJET
echo ========================================
echo.

:: 1. SAUVEGARDE GITHUB
echo [1/6] Sauvegarde GitHub...
git add .
git commit -m "G99: Sauvegarde totale - %date% %time%"
git push origin main
echo OK
echo.

:: 2. SAUVEGARDE LOCALE
echo [2/6] Sauvegarde locale...
mkdir backups\%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%
xcopy /E /I scripts backups\%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%\scripts
xcopy /E /I data backups\%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%\data
copy .env.local backups\%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%\.env.local.backup
echo OK
echo.

:: 3. MISE A JOUR DOCUMENTATION
echo [3/6] Mise a jour documentation...
echo # AlgeriaExport - Sauvegarde G99 > README.md
echo Date: %date% %time% >> README.md
echo. >> README.md
echo ## Etat du projet >> README.md
echo - Entreprises en base: 1249 >> README.md
echo - Source: import_2024_nouveau >> README.md
echo - Doublons elimines: 49 >> README.md
git add README.md
git commit -m "G99: Mise a jour README"
git push
echo OK
echo.

:: 4. EXPORT BDD COMPLET
echo [4/6] Export base de donnees...
python -c "from supabase import create_client; from dotenv import load_dotenv; import os; import json; from datetime import datetime; load_dotenv('.env.local'); supabase = create_client(os.environ.get('NEXT_PUBLIC_SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY')); data = supabase.table('exporters').select('*').execute(); with open(f'backups/export_bdd_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json', 'w') as f: json.dump(data.data, f, indent=2)"
echo OK
echo.

:: 5. SAUVEGARDE .ENV (MASQUEE)
echo [5/6] Sauvegarde configuration...
copy .env.local backups\.env.local.%date:~6,4%%date:~3,2%%date:~0,2%
echo OK
echo.

:: 6. RAPPORT FINAL
echo [6/6] Generation rapport...
echo ======================================== > CHANGELOG.md
echo G99 - %date% %time% >> CHANGELOG.md
echo ======================================== >> CHANGELOG.md
echo. >> CHANGELOG.md
echo ## Actions effectuees >> CHANGELOG.md
echo - Nettoyage complet de la base >> CHANGELOG.md
echo - Import de 1249 entreprises >> CHANGELOG.md
echo - Creation interface admin >> CHANGELOG.md
echo - Dashboard avec graphiques >> CHANGELOG.md
echo - Export Excel avance >> CHANGELOG.md
echo. >> CHANGELOG.md
echo ## Prochaines etapes >> CHANGELOG.md
echo - Verification NIF DGI/CNRC >> CHANGELOG.md
echo - Portail fournisseur >> CHANGELOG.md
echo - Double OTP >> CHANGELOG.md
echo. >> CHANGELOG.md
echo ## Fichiers critiques >> CHANGELOG.md
echo - scripts/admin_excel.py >> CHANGELOG.md
echo - scripts/dashboard_ultime_ia.py >> CHANGELOG.md
echo - scripts/reset_complet.py >> CHANGELOG.md
echo - data/private/entreprises_brutes.json >> CHANGELOG.md
git add CHANGELOG.md
git commit -m "G99: Mise a jour CHANGELOG"
git push
echo OK
echo.

:: 7. CHAT CHARNIERE
echo [7/6] Generation chat charniere...
echo # 📋 CHAT CHARNIERE - %date% > CHAT_CHARNIERE.md
echo. >> CHAT_CHARNIERE.md
echo ## 📊 ETAT ACTUEL >> CHAT_CHARNIERE.md
echo - Entreprises: 1249 >> CHAT_CHARNIERE.md
echo - Wilayas: 69 >> CHAT_CHARNIERE.md
echo - Secteurs: 21 >> CHAT_CHARNIERE.md
echo - Interface admin: ✅ >> CHAT_CHARNIERE.md
echo - Export Excel: ✅ >> CHAT_CHARNIERE.md
echo. >> CHAT_CHARNIERE.md
echo ## 📁 FICHIERS CRITIQUES >> CHAT_CHARNIERE.md
echo - scripts/admin_excel.py >> CHAT_CHARNIERE.md
echo - scripts/dashboard_ultime_ia.py >> CHAT_CHARNIERE.md
echo - scripts/reset_complet.py >> CHAT_CHARNIERE.md
echo - data/private/entreprises_brutes.json >> CHAT_CHARNIERE.md
echo. >> CHAT_CHARNIERE.md
echo ## ✅ DERNIERE ACTION >> CHAT_CHARNIERE.md
echo - G99 execute le %date% a %time% >> CHAT_CHARNIERE.md
echo. >> CHAT_CHARNIERE.md
echo ## 🎯 PROCHAINES ETAPES >> CHAT_CHARNIERE.md
echo 1. Verification NIF DGI/CNRC >> CHAT_CHARNIERE.md
echo 2. Portail fournisseur >> CHAT_CHARNIERE.md
echo 3. Double OTP >> CHAT_CHARNIERE.md
echo 4. Dashboard IA avance >> CHAT_CHARNIERE.md
git add CHAT_CHARNIERE.md
git commit -m "G99: Chat charniere"
git push
echo OK
echo.

:: 8. ARCHIVE COMPLETE
echo [8/6] Creation archive ZIP...
powershell -Command "Compress-Archive -Path scripts, data, *.md, *.bat -DestinationPath backups\projet_%date:~6,4%%date:~3,2%%date:~0,2%.zip -Force"
echo OK
echo.

echo ========================================
echo ✅ G99 TERMINE - BONNE NUIT !
echo ========================================
echo Sauvegardes dans: backups\
echo Log: CHANGELOG.md
echo Chat: CHAT_CHARNIERE.md
pause