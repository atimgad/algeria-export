// scripts/verification-finale.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

async function verifierDoublons() {
  console.log('='.repeat(80));
  console.log('🔍 VÉRIFICATION FINALE DES DOUBLONS');
  console.log('='.repeat(80));
  
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités analysées\n`);
  
  const nameMap = new Map();
  const phoneMap = new Map();
  const emailMap = new Map();
  
  const doublons = {
    nom: [],
    telephone: [],
    email: []
  };
  
  // Vérification par nom
  for (const entity of entities) {
    const normalized = normalizeText(entity.name);
    if (normalized) {
      if (nameMap.has(normalized)) {
        doublons.nom.push({
          original: nameMap.get(normalized),
          duplicate: entity
        });
      } else {
        nameMap.set(normalized, entity);
      }
    }
  }
  
  // Vérification par téléphone
  for (const entity of entities) {
    if (entity.phone && entity.phone.length > 0) {
      for (const phone of entity.phone) {
        const clean = phone.replace(/\s+/g, '');
        if (clean && clean.length > 8) {
          if (phoneMap.has(clean)) {
            doublons.telephone.push({
              original: phoneMap.get(clean),
              duplicate: entity,
              phone: clean
            });
          } else {
            phoneMap.set(clean, entity);
          }
        }
      }
    }
  }
  
  // Vérification par email
  for (const entity of entities) {
    if (entity.email && entity.email.length > 0) {
      for (const email of entity.email) {
        const clean = email.toLowerCase().trim();
        if (clean) {
          if (emailMap.has(clean)) {
            doublons.email.push({
              original: emailMap.get(clean),
              duplicate: entity,
              email: clean
            });
          } else {
            emailMap.set(clean, entity);
          }
        }
      }
    }
  }
  
  console.log('📊 RAPPORT FINAL');
  console.log('='.repeat(80));
  console.log(`📌 Doublons par nom: ${doublons.nom.length}`);
  console.log(`📌 Doublons par téléphone: ${doublons.telephone.length}`);
  console.log(`📌 Doublons par email: ${doublons.email.length}`);
  
  const total = doublons.nom.length + doublons.telephone.length + doublons.email.length;
  
  console.log('\n' + '='.repeat(80));
  if (total === 0) {
    console.log('✅ AUCUN DOUBLON TROUVÉ !');
  } else {
    console.log(`⚠️  ${total} doublons potentiels détectés`);
    
    // Afficher les premiers doublons
    if (doublons.nom.length > 0) {
      console.log('\n📌 Exemples de doublons par nom:');
      doublons.nom.slice(0, 3).forEach((d, i) => {
        console.log(`   ${i+1}. "${d.original.name}"`);
        console.log(`      ↔ "${d.duplicate.name}"`);
      });
    }
  }
  console.log('='.repeat(80));
}

verifierDoublons();