// scripts/verification-ultime.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificationUltime() {
  console.log('='.repeat(80));
  console.log('🔍 VÉRIFICATION ULTIME');
  console.log('='.repeat(80));
  
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités\n`);
  
  // 1. Compter par catégorie
  const categories = {};
  entities.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + 1;
  });
  
  console.log('📊 RÉPARTITION PAR CATÉGORIE :');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
  
  // 2. Vérifier les doublons restants
  const names = new Map();
  const phones = new Map();
  const emails = new Map();
  
  let doublons = 0;
  
  for (const e of entities) {
    // Par nom
    const nameKey = e.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (names.has(nameKey)) {
      doublons++;
      console.log(`\n⚠️ Doublon potentiel: ${e.name}`);
      console.log(`   ↔ ${names.get(nameKey).name}`);
    } else {
      names.set(nameKey, e);
    }
    
    // Par téléphone
    if (e.phone) {
      for (const p of e.phone) {
        const phoneKey = p.replace(/\s+/g, '');
        if (phoneKey.length > 8) {
          if (phones.has(phoneKey)) {
            doublons++;
            console.log(`\n⚠️ Même téléphone: ${p}`);
            console.log(`   ${e.name} ↔ ${phones.get(phoneKey).name}`);
          } else {
            phones.set(phoneKey, e);
          }
        }
      }
    }
    
    // Par email
    if (e.email) {
      for (const em of e.email) {
        const emailKey = em.toLowerCase().trim();
        if (emailKey) {
          if (emails.has(emailKey)) {
            doublons++;
            console.log(`\n⚠️ Même email: ${em}`);
            console.log(`   ${e.name} ↔ ${emails.get(emailKey).name}`);
          } else {
            emails.set(emailKey, e);
          }
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  if (doublons === 0) {
    console.log('✅ AUCUN DOUBLON TROUVÉ !');
  } else {
    console.log(`⚠️ ${doublons} doublons détectés`);
  }
  console.log('='.repeat(80));
}

verificationUltime();