// scripts/corriger-emails-websites.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 🔧 FONCTIONS DE CORRECTION
// ============================================

function cleanEmail(email) {
  if (!email) return null;
  
  let cleaned = email.trim();
  
  // 1. Supprimer les espaces autour de @
  cleaned = cleaned.replace(/\s*@\s*/g, '@');
  
  // 2. Supprimer les slashs et séparateurs
  cleaned = cleaned.replace(/[\/|]/g, '');
  
  // 3. Supprimer les caractères parasites à la fin (P, http, etc.)
  cleaned = cleaned.replace(/\s+(P|http).*$/i, '');
  
  // 4. Si pas de @, essayer de deviner
  if (!cleaned.includes('@')) {
    if (cleaned.includes('.')) {
      // Peut-être un format comme "nom.domaine" → "nom@domaine"
      const parts = cleaned.split('.');
      if (parts.length >= 2) {
        cleaned = parts[0] + '@' + parts.slice(1).join('.');
      }
    }
  }
  
  // 5. Ajouter @ si manque toujours
  if (!cleaned.includes('@') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./, '@');
  }
  
  // 6. Nettoyer les espaces restants
  cleaned = cleaned.replace(/\s+/g, '');
  
  // 7. Valider le format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    console.log(`   ⚠️  Email probablement invalide après correction: "${cleaned}"`);
  }
  
  return cleaned;
}

function cleanWebsite(url) {
  if (!url) return null;
  
  let cleaned = url.trim();
  
  // 1. Enlever le texte "Produit:" et tout ce qui suit
  cleaned = cleaned.replace(/\s+Produit:.*$/i, '');
  
  // 2. Enlever les espaces
  cleaned = cleaned.replace(/\s+/g, '');
  
  // 3. Ajouter http:// si nécessaire
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'http://' + cleaned;
  }
  
  // 4. Nettoyer les doubles protocoles
  cleaned = cleaned.replace(/http:\/\/http:\/\//, 'http://');
  cleaned = cleaned.replace(/https:\/\/https:\/\//, 'https://');
  
  // 5. Valider le format
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  if (!urlRegex.test(cleaned)) {
    console.log(`   ⚠️  URL probablement invalide après correction: "${cleaned}"`);
  }
  
  return cleaned;
}

// ============================================
// 🚀 FONCTION PRINCIPALE
// ============================================
async function correctData() {
  console.log('='.repeat(80));
  console.log('🔧 CORRECTION AUTOMATIQUE DES EMAILS ET SITES WEB');
  console.log('='.repeat(80));
  
  // Récupérer toutes les entités
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur de récupération:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités à analyser\n`);
  
  let emailCorrections = 0;
  let websiteCorrections = 0;
  let totalEmails = 0;
  let totalWebsites = 0;
  
  for (const entity of entities) {
    let modified = false;
    const updates = {};
    
    // Traiter les emails
    if (entity.email && entity.email.length > 0) {
      totalEmails += entity.email.length;
      const correctedEmails = [];
      
      for (const email of entity.email) {
        const corrected = cleanEmail(email);
        if (corrected && corrected !== email) {
          correctedEmails.push(corrected);
          emailCorrections++;
          modified = true;
          console.log(`\n📧 ${entity.name.substring(0, 50)}`);
          console.log(`   Avant: "${email}"`);
          console.log(`   Après: "${corrected}"`);
        } else if (corrected) {
          correctedEmails.push(corrected);
        }
      }
      
      if (correctedEmails.length > 0) {
        updates.email = correctedEmails;
      }
    }
    
    // Traiter les sites web
    if (entity.website && entity.website.length > 0) {
      totalWebsites += entity.website.length;
      const correctedWebsites = [];
      
      for (const site of entity.website) {
        const corrected = cleanWebsite(site);
        if (corrected && corrected !== site) {
          correctedWebsites.push(corrected);
          websiteCorrections++;
          modified = true;
          console.log(`\n🌐 ${entity.name.substring(0, 50)}`);
          console.log(`   Avant: "${site}"`);
          console.log(`   Après: "${corrected}"`);
        } else if (corrected) {
          correctedWebsites.push(corrected);
        }
      }
      
      if (correctedWebsites.length > 0) {
        updates.website = correctedWebsites;
      }
    }
    
    // Mettre à jour dans Supabase
    if (modified) {
      const { error: updateError } = await supabase
        .from('official_directory')
        .update(updates)
        .eq('id', entity.id);
      
      if (updateError) {
        console.error(`❌ Erreur mise à jour ${entity.id}:`, updateError);
      }
    }
  }
  
  // 📊 RAPPORT FINAL
  console.log('\n' + '='.repeat(80));
  console.log('📊 RAPPORT DE CORRECTION');
  console.log('='.repeat(80));
  console.log(`📧 Emails analysés: ${totalEmails}`);
  console.log(`✅ Emails corrigés: ${emailCorrections}`);
  console.log(`🌐 Sites web analysés: ${totalWebsites}`);
  console.log(`✅ Sites web corrigés: ${websiteCorrections}`);
  console.log('='.repeat(80));
}

// ============================================
// ▶️ EXÉCUTION
// ============================================
correctData();