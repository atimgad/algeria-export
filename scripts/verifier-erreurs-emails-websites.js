// scripts/verifier-erreurs-emails-websites.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 🔍 FONCTIONS DE VALIDATION
// ============================================
function validateEmail(email) {
  if (!email) return { valid: false, reason: 'vide' };
  
  const problems = [];
  
  // Email vide ou trop court
  if (email.length < 5) problems.push('trop_court');
  
  // Pas de @
  if (!email.includes('@')) problems.push('pas_de_@');
  
  // Plusieurs @
  if ((email.match(/@/g) || []).length > 1) problems.push('plusieurs_@');
  
  // Pas de point après le @
  if (email.includes('@') && !email.split('@')[1]?.includes('.')) {
    problems.push('pas_de_point_apres_@');
  }
  
  // Caractères spéciaux interdits
  if (/[^a-zA-Z0-9@._-]/.test(email)) problems.push('caracteres_invalides');
  
  // Espaces
  if (/\s/.test(email)) problems.push('contient_espaces');
  
  // Format général incorrect
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) && email.includes('@') && email.includes('.')) {
    problems.push('format_incorrect');
  }
  
  return {
    valid: problems.length === 0,
    problems: problems
  };
}

function validateWebsite(url) {
  if (!url) return { valid: false, reason: 'vide' };
  
  const problems = [];
  
  // Pas de protocole
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    problems.push('pas_de_protocole');
  }
  
  // Pas de point
  if (!url.includes('.')) problems.push('pas_de_point');
  
  // Espaces
  if (/\s/.test(url)) problems.push('contient_espaces');
  
  // Caractères spéciaux
  if (/[^a-zA-Z0-9.:/\-_]/.test(url)) problems.push('caracteres_invalides');
  
  // Double protocole
  if (url.includes('http://http://') || url.includes('https://https://')) {
    problems.push('double_protocole');
  }
  
  // Format général
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  if (!urlRegex.test(url)) problems.push('format_incorrect');
  
  return {
    valid: problems.length === 0,
    problems: problems
  };
}

// ============================================
// 🚀 FONCTION PRINCIPALE
// ============================================
async function checkErrors() {
  console.log('='.repeat(80));
  console.log('🔍 VÉRIFICATION DES ERREURS EMAILS ET SITES WEB');
  console.log('='.repeat(80));
  
  // Récupérer toutes les entités
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('id, name, email, website');
  
  if (error) {
    console.error('❌ Erreur de récupération:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités analysées\n`);
  
  const emailErrors = [];
  const websiteErrors = [];
  
  for (const entity of entities) {
    // Vérifier les emails
    if (entity.email && entity.email.length > 0) {
      for (const email of entity.email) {
        const validation = validateEmail(email);
        if (!validation.valid) {
          emailErrors.push({
            id: entity.id,
            name: entity.name,
            value: email,
            problems: validation.problems
          });
        }
      }
    }
    
    // Vérifier les sites web
    if (entity.website && entity.website.length > 0) {
      for (const site of entity.website) {
        const validation = validateWebsite(site);
        if (!validation.valid) {
          websiteErrors.push({
            id: entity.id,
            name: entity.name,
            value: site,
            problems: validation.problems
          });
        }
      }
    }
  }
  
  // 📊 RAPPORT DES EMAILS ERRONÉS
  console.log('='.repeat(80));
  console.log(`📧 EMAILS ERRONÉS (${emailErrors.length})`);
  console.log('='.repeat(80));
  
  emailErrors.slice(0, 50).forEach((err, index) => {
    console.log(`\n${index + 1}. ${err.name.substring(0, 50)}`);
    console.log(`   Email: "${err.value}"`);
    console.log(`   Problèmes: ${err.problems.join(', ')}`);
  });
  
  if (emailErrors.length > 50) {
    console.log(`\n... et ${emailErrors.length - 50} autres erreurs email`);
  }
  
  // 📊 RAPPORT DES SITES WEB ERRONÉS
  console.log('\n' + '='.repeat(80));
  console.log(`🌐 SITES WEB ERRONÉS (${websiteErrors.length})`);
  console.log('='.repeat(80));
  
  websiteErrors.slice(0, 50).forEach((err, index) => {
    console.log(`\n${index + 1}. ${err.name.substring(0, 50)}`);
    console.log(`   Site: "${err.value}"`);
    console.log(`   Problèmes: ${err.problems.join(', ')}`);
  });
  
  if (websiteErrors.length > 50) {
    console.log(`\n... et ${websiteErrors.length - 50} autres erreurs site web`);
  }
  
  // 📋 RÉSUMÉ
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ');
  console.log('='.repeat(80));
  console.log(`✅ Total entités: ${entities.length}`);
  console.log(`📧 Emails avec erreurs: ${emailErrors.length}`);
  console.log(`🌐 Sites web avec erreurs: ${websiteErrors.length}`);
  
  // Propositions de correction
  console.log('\n' + '='.repeat(80));
  console.log('💡 EXEMPLES DE CORRECTIONS POSSIBLES');
  console.log('='.repeat(80));
  
  const corrections = [
    { pattern: /@gmailcom$/, replace: '@gmail.com', desc: 'Ajout du point' },
    { pattern: /@yahoofr$/, replace: '@yahoo.fr', desc: 'Ajout du point' },
    { pattern: /^www/, replace: 'http://www.', desc: 'Ajout du protocole' },
    { pattern: /\.$/, replace: '', desc: 'Suppression du point final' }
  ];
  
  emailErrors.slice(0, 5).forEach(err => {
    let corrected = err.value;
    corrections.forEach(c => {
      corrected = corrected.replace(c.pattern, c.replace);
    });
    if (corrected !== err.value) {
      console.log(`\n "${err.value}"`);
      console.log(` → "${corrected}"`);
    }
  });
  
  // Sauvegarder le rapport complet
  const fs = require('fs');
  const reportPath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\DOCUMENTS\\rapport_erreurs.json';
  
  const report = {
    total_entities: entities.length,
    email_errors: emailErrors,
    website_errors: websiteErrors,
    generated_at: new Date().toISOString()
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📁 Rapport complet sauvegardé: ${reportPath}`);
}

// ============================================
// ▶️ EXÉCUTION
// ============================================
checkErrors();