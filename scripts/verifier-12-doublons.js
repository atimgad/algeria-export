// scripts/verifier-12-doublons.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifier12Doublons() {
  console.log('='.repeat(80));
  console.log('🔍 VÉRIFICATION DES 12 DOUBLONS');
  console.log('='.repeat(80));
  
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  // Trouver les doublons par téléphone
  const phoneMap = new Map();
  const phoneDoublons = [];
  
  for (const entity of entities) {
    if (entity.phone) {
      for (const phone of entity.phone) {
        const clean = phone.replace(/\s+/g, '');
        if (phoneMap.has(clean)) {
          phoneDoublons.push({
            phone: clean,
            e1: phoneMap.get(clean),
            e2: entity
          });
        } else {
          phoneMap.set(clean, entity);
        }
      }
    }
  }
  
  // Trouver les doublons par email
  const emailMap = new Map();
  const emailDoublons = [];
  
  for (const entity of entities) {
    if (entity.email) {
      for (const email of entity.email) {
        const clean = email.toLowerCase().trim();
        if (emailMap.has(clean)) {
          emailDoublons.push({
            email: clean,
            e1: emailMap.get(clean),
            e2: entity
          });
        } else {
          emailMap.set(clean, entity);
        }
      }
    }
  }
  
  console.log('\n📞 DOUBLONS PAR TÉLÉPHONE (4) :\n');
  phoneDoublons.forEach((d, i) => {
    console.log(`${i+1}. Tél: ${d.phone}`);
    console.log(`   A: ${d.e1.name} (${d.e1.category})`);
    console.log(`   B: ${d.e2.name} (${d.e2.category})`);
    console.log('---');
  });
  
  console.log('\n📧 DOUBLONS PAR EMAIL (8) :\n');
  emailDoublons.forEach((d, i) => {
    console.log(`${i+1}. Email: ${d.email}`);
    console.log(`   A: ${d.e1.name} (${d.e1.category})`);
    console.log(`   B: ${d.e2.name} (${d.e2.category})`);
    console.log('---');
  });
  
  console.log('='.repeat(80));
  console.log('🔍 ACTION MANUELLE NÉCESSAIRE');
  console.log('='.repeat(80));
  console.log('Vérifie chaque paire :');
  console.log('1️⃣ Si même entreprise → ne rien faire (c\'est normal)');
  console.log('2️⃣ Si entreprises différentes → c\'est un vrai doublon à supprimer');
}

verifier12Doublons();