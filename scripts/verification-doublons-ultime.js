// scripts/verification-doublons-ultime.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 🔧 FONCTIONS DE NETTOYAGE
// ============================================
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
}

// Similarité entre deux chaînes (Levenshtein simplifié)
function stringSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// ============================================
// 🚀 FONCTION PRINCIPALE
// ============================================
async function checkDuplicates() {
  console.log('='.repeat(80));
  console.log('🔍 VÉRIFICATION ULTIME DES DOUBLONS');
  console.log('='.repeat(80));
  
  // Récupérer toutes les entités
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur de récupération:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités analysées\n`);
  
  const duplicates = {
    exact_name: [],
    exact_phone: [],
    exact_email: [],
    exact_website: [],
    fuzzy_name: []
  };
  
  // Index pour recherche rapide
  const nameMap = new Map();
  const phoneMap = new Map();
  const emailMap = new Map();
  const websiteMap = new Map();
  
  // 1️⃣ DOUBLONS PAR NOM EXACT
  console.log('🔍 Recherche des doublons par nom exact...');
  for (const entity of entities) {
    const normalized = normalizeText(entity.name);
    if (normalized) {
      if (nameMap.has(normalized)) {
        duplicates.exact_name.push({
          original: nameMap.get(normalized),
          duplicate: entity,
          key: normalized
        });
      } else {
        nameMap.set(normalized, entity);
      }
    }
  }
  
  // 2️⃣ DOUBLONS PAR TÉLÉPHONE
  console.log('🔍 Recherche des doublons par téléphone...');
  for (const entity of entities) {
    if (entity.phone && entity.phone.length > 0) {
      for (const phone of entity.phone) {
        const normalized = normalizePhone(phone);
        if (normalized && normalized.length > 8) {
          if (phoneMap.has(normalized)) {
            duplicates.exact_phone.push({
              original: phoneMap.get(normalized),
              duplicate: entity,
              key: normalized
            });
          } else {
            phoneMap.set(normalized, entity);
          }
        }
      }
    }
  }
  
  // 3️⃣ DOUBLONS PAR EMAIL
  console.log('🔍 Recherche des doublons par email...');
  for (const entity of entities) {
    if (entity.email && entity.email.length > 0) {
      for (const email of entity.email) {
        const normalized = normalizeText(email);
        if (normalized) {
          if (emailMap.has(normalized)) {
            duplicates.exact_email.push({
              original: emailMap.get(normalized),
              duplicate: entity,
              key: normalized
            });
          } else {
            emailMap.set(normalized, entity);
          }
        }
      }
    }
  }
  
  // 4️⃣ DOUBLONS PAR SITE WEB
  console.log('🔍 Recherche des doublons par site web...');
  for (const entity of entities) {
    if (entity.website && entity.website.length > 0) {
      for (const site of entity.website) {
        const normalized = normalizeText(site.replace(/^https?:\/\//, ''));
        if (normalized) {
          if (websiteMap.has(normalized)) {
            duplicates.exact_website.push({
              original: websiteMap.get(normalized),
              duplicate: entity,
              key: normalized
            });
          } else {
            websiteMap.set(normalized, entity);
          }
        }
      }
    }
  }
  
  // 5️⃣ DOUBLONS PAR SIMILARITÉ DE NOM (Fuzzy)
  console.log('🔍 Recherche des doublons par similarité (90%)...');
  const names = entities.map(e => ({
    id: e.id,
    name: e.name,
    normalized: normalizeText(e.name)
  })).filter(n => n.normalized);
  
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      if (i === j) continue;
      
      const similarity = stringSimilarity(names[i].normalized, names[j].normalized);
      if (similarity > 0.9) { // 90% de similarité
        const entity1 = entities.find(e => e.id === names[i].id);
        const entity2 = entities.find(e => e.id === names[j].id);
        
        duplicates.fuzzy_name.push({
          original: entity1,
          duplicate: entity2,
          similarity: Math.round(similarity * 100) + '%',
          key: names[i].normalized + ' ↔ ' + names[j].normalized
        });
      }
    }
  }
  
  // 📊 RAPPORT
  console.log('\n' + '='.repeat(80));
  console.log('📊 RAPPORT DE VÉRIFICATION');
  console.log('='.repeat(80));
  
  console.log(`\n📌 DOUBLONS PAR NOM EXACT: ${duplicates.exact_name.length}`);
  duplicates.exact_name.slice(0, 10).forEach((d, i) => {
    console.log(`   ${i+1}. "${d.original.name.substring(0, 30)}..." ↔ "${d.duplicate.name.substring(0, 30)}..."`);
  });
  
  console.log(`\n📌 DOUBLONS PAR TÉLÉPHONE: ${duplicates.exact_phone.length}`);
  duplicates.exact_phone.slice(0, 10).forEach((d, i) => {
    console.log(`   ${i+1}. ${d.key} : "${d.original.name.substring(0, 30)}..." ↔ "${d.duplicate.name.substring(0, 30)}..."`);
  });
  
  console.log(`\n📌 DOUBLONS PAR EMAIL: ${duplicates.exact_email.length}`);
  duplicates.exact_email.slice(0, 10).forEach((d, i) => {
    console.log(`   ${i+1}. ${d.key} : "${d.original.name.substring(0, 30)}..." ↔ "${d.duplicate.name.substring(0, 30)}..."`);
  });
  
  console.log(`\n📌 DOUBLONS PAR SITE WEB: ${duplicates.exact_website.length}`);
  duplicates.exact_website.slice(0, 10).forEach((d, i) => {
    console.log(`   ${i+1}. ${d.key} : "${d.original.name.substring(0, 30)}..." ↔ "${d.duplicate.name.substring(0, 30)}..."`);
  });
  
  console.log(`\n📌 DOUBLONS PAR SIMILARITÉ (>90%): ${duplicates.fuzzy_name.length}`);
  duplicates.fuzzy_name.slice(0, 10).forEach((d, i) => {
    console.log(`   ${i+1}. [${d.similarity}] "${d.original.name.substring(0, 30)}..." ↔ "${d.duplicate.name.substring(0, 30)}..."`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ');
  console.log('='.repeat(80));
  console.log(`✅ Total entités: ${entities.length}`);
  console.log(`🔴 Doublons nom exact: ${duplicates.exact_name.length}`);
  console.log(`🔴 Doublons téléphone: ${duplicates.exact_phone.length}`);
  console.log(`🔴 Doublons email: ${duplicates.exact_email.length}`);
  console.log(`🔴 Doublons site web: ${duplicates.exact_website.length}`);
  console.log(`🟡 Doublons similaires: ${duplicates.fuzzy_name.length}`);
  
  const totalDoublons = duplicates.exact_name.length + 
                        duplicates.exact_phone.length + 
                        duplicates.exact_email.length + 
                        duplicates.exact_website.length;
  
  console.log(`\n⚠️  TOTAL DOUBLONS DÉTECTÉS: ${totalDoublons}`);
  console.log('='.repeat(80));
  
  return duplicates;
}

// ============================================
// ▶️ EXÉCUTION
// ============================================
checkDuplicates();