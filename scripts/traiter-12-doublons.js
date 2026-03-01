// scripts/traiter-12-doublons.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function traiterDoublons() {
  console.log('='.repeat(80));
  console.log('🔧 TRAITEMENT DES 12 DOUBLONS');
  console.log('='.repeat(80));

  // 1️⃣ BESSMA MOUSSE (même entreprise) - RIEN À FAIRE
  console.log('\n1. ✅ BESSMA MOUSSE - OK (même entreprise)');

  // 2️⃣ ALGERIAN CEMENT / GROUPE LAFARGE (fusion)
  console.log('\n2. 🔄 FUSION: ALGERIAN CEMENT ↔ GROUPE LAFARGE');
  
  const { data: lafarge } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'GROUPE LAFARGE, spa');
  
  const { data: cement } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'ALGERIAN CEMENT COMPANY [GROUPE LAFARGE]-ACC, spa');
  
  if (lafarge && cement && lafarge.length > 0 && cement.length > 0) {
    const main = lafarge[0];
    const second = cement[0];
    
    // Fusionner les produits
    const allProducts = new Set([...(main.products || []), ...(second.products || [])]);
    
    await supabase
      .from('official_directory')
      .update({ products: Array.from(allProducts) })
      .eq('id', main.id);
    
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', second.id);
    
    console.log('   ✅ Fusion effectuée');
  }

  // 3️⃣ EL FALAK / EL FALAH (supprimer EL FALAH)
  console.log('\n3. ❌ SUPPRESSION: EL FALAH (doublon de EL FALAK)');
  
  const { data: elFalah } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'EL FALAH IMPORT EXPORT, sarl');
  
  if (elFalah && elFalah.length > 0) {
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', elFalah[0].id);
    console.log('   ✅ EL FALAH supprimé');
  }

  // 4️⃣ ABB / ASEA (même groupe) - RIEN À FAIRE
  console.log('\n4. ✅ ABB / ASEA - OK (même groupe)');

  // 5️⃣ HELIMET (fusion si même famille)
  console.log('\n5. 🔄 FUSION: HELIMET LAKHDAR ↔ HELIMET MOHAMED CHAABANI');
  
  const { data: helimet1 } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'HELIMET LAKHDAR');
  
  const { data: helimet2 } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'HELIMET MOHAMED CHAABANI');
  
  if (helimet1 && helimet2 && helimet1.length > 0 && helimet2.length > 0) {
    const allProducts = new Set([
      ...(helimet1[0].products || []),
      ...(helimet2[0].products || [])
    ]);
    
    await supabase
      .from('official_directory')
      .update({ products: Array.from(allProducts) })
      .eq('id', helimet1[0].id);
    
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', helimet2[0].id);
    
    console.log('   ✅ Fusion effectuée');
  }

  // 6️⃣ RKBM / RAIL TECH (supprimer RAIL TECH)
  console.log('\n6. ❌ SUPPRESSION: RAIL TECH ALGERIE (doublon de RKBM)');
  
  const { data: railTech } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'RAIL TECH ALGERIE, sarl');
  
  if (railTech && railTech.length > 0) {
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', railTech[0].id);
    console.log('   ✅ RAIL TECH supprimé');
  }

  // 7️⃣ SAVEUR GRAND SUD / GRAND SUD (fusion)
  console.log('\n7. 🔄 FUSION: SAVEUR GRAND SUD ↔ GRAND SUD SERVICES');
  
  const { data: saveur } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'SAVEUR DE GRAND SUD IMPORT EXPORT, eurl');
  
  const { data: grandSud } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'GRAND SUD SERVICES, sarl');
  
  if (saveur && grandSud && saveur.length > 0 && grandSud.length > 0) {
    const allProducts = new Set([
      ...(saveur[0].products || []),
      ...(grandSud[0].products || [])
    ]);
    
    await supabase
      .from('official_directory')
      .update({ products: Array.from(allProducts) })
      .eq('id', saveur[0].id);
    
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', grandSud[0].id);
    
    console.log('   ✅ Fusion effectuée');
  }

  // 8️⃣ ATLAS GREEN / TROIS FRERES (même email) - À GARDER
  console.log('\n8. ✅ ATLAS GREEN / TROIS FRERES - OK (entreprises différentes avec même contact)');

  // 9️⃣ et 🔟 CASA / CASA TEX (même email) - À GARDER
  console.log('\n9-10. ✅ CASA / CASA TEX - OK (entreprises différentes avec même contact)');

  // 1️⃣1️⃣ EL FALAK / EL FALAH (déjà traité en #3)

  // 1️⃣2️⃣ ALARBI / AFC RECYCLAGE (supprimer AFC)
  console.log('\n11. ❌ SUPPRESSION: AFC RECYCLAGE (doublon de ALARBI)');
  
  const { data: afc } = await supabase
    .from('official_directory')
    .select('*')
    .eq('name', 'AFC RECYCLAGE, sarl');
  
  if (afc && afc.length > 0) {
    await supabase
      .from('official_directory')
      .delete()
      .eq('id', afc[0].id);
    console.log('   ✅ AFC RECYCLAGE supprimé');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ TRAITEMENT TERMINÉ');
  console.log('='.repeat(80));
}

traiterDoublons();