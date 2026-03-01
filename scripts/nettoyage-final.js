// scripts/nettoyage-final.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function nettoyageFinal() {
  console.log('='.repeat(80));
  console.log('🧹 NETTOYAGE FINAL');
  console.log('='.repeat(80));

  // 1️⃣ Vérifier TROIS FRERES / ATLAS GREEN
  console.log('\n🔍 Vérification TROIS FRERES / ATLAS GREEN...');
  
  const { data: troisFreres } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'TROIS FRERES EL HOUARI, sarl');
  
  const { data: atlas } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'ATLAS GREEN, sarl');
  
  if (troisFreres && atlas && troisFreres.length > 0 && atlas.length > 0) {
    console.log(`   📧 Email commun: elhouari366@gmail.com`);
    console.log(`   🏢 Trois Frères: ${troisFreres[0].category}`);
    console.log(`   🏢 Atlas Green: ${atlas[0].category}`);
    console.log(`   🤔 Décision: À GARDER (probablement même contact)`);
  }

  // 2️⃣ Fusionner ASEA / ABB
  console.log('\n🔄 Fusion ASEA BROWN BOVERI ↔ ABB...');
  
  const { data: asea } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'ASEA BROWN BOVERI ALGERIE, spa');
  
  const { data: abb } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'ABB, spa');
  
  if (asea && abb && asea.length > 0 && abb.length > 0) {
    const main = abb[0];
    const second = asea[0];
    
    // Fusionner les données
    const allProducts = new Set([
      ...(main.products || []),
      ...(second.products || [])
    ]);
    
    const allPhones = new Set([
      ...(main.phone || []),
      ...(second.phone || [])
    ]);
    
    const allWebsites = new Set([
      ...(main.website || []),
      ...(second.website || [])
    ]);
    
    await supabase
      .from('official_directory')
      .update({
        products: Array.from(allProducts),
        phone: Array.from(allPhones),
        website: Array.from(allWebsites),
        name: 'ABB / ASEA BROWN BOVERI, spa' // Nom fusionné
      })
      .eq('id', main.id);
    
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', second.id);
    
    console.log('   ✅ Fusion effectuée');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ NETTOYAGE TERMINÉ');
  console.log('='.repeat(80));
}

nettoyageFinal();