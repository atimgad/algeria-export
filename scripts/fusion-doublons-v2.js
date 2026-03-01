// scripts/fusion-doublons-v2.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function normalizeName(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

async function fusionnerDoublonsV2() {
  console.log('='.repeat(80));
  console.log('🔄 FUSION DES DOUBLONS - VERSION 2');
  console.log('='.repeat(80));
  
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités analysées\n`);
  
  // Grouper par nom normalisé
  const groups = new Map();
  
  for (const entity of entities) {
    const normalized = normalizeName(entity.name);
    if (!normalized) continue;
    
    if (!groups.has(normalized)) {
      groups.set(normalized, []);
    }
    groups.get(normalized).push(entity);
  }
  
  let fusions = 0;
  let suppressions = 0;
  
  for (const [normalizedName, group] of groups.entries()) {
    if (group.length <= 1) continue;
    
    console.log(`\n📌 ${group[0].name} (${group.length} entités)`);
    
    // Garder la première, fusionner les autres
    const main = group[0];
    const others = group.slice(1);
    
    const allProducts = new Set(main.products || []);
    const allPhones = new Set(main.phone || []);
    const allEmails = new Set(main.email || []);
    const allWebsites = new Set(main.website || []);
    
    for (const other of others) {
      console.log(`   🔄 Fusion avec ${other.category} (${other.products?.length || 0} produits)`);
      
      // Ajouter les produits
      if (other.products) {
        other.products.forEach(p => allProducts.add(p));
      }
      
      // Ajouter les téléphones
      if (other.phone) {
        other.phone.forEach(p => allPhones.add(p));
      }
      
      // Ajouter les emails
      if (other.email) {
        other.email.forEach(e => allEmails.add(e));
      }
      
      // Ajouter les sites web
      if (other.website) {
        other.website.forEach(w => allWebsites.add(w));
      }
      
      // Supprimer le doublon
      const { error: deleteError } = await supabase
        .from('official_directory')
        .delete()
        .eq('id', other.id);
      
      if (!deleteError) {
        suppressions++;
      }
      
      fusions++;
    }
    
    // Mettre à jour l'entité principale
    const updates = {
      products: Array.from(allProducts),
      phone: Array.from(allPhones),
      email: Array.from(allEmails),
      website: Array.from(allWebsites)
    };
    
    const { error: updateError } = await supabase
      .from('official_directory')
      .update(updates)
      .eq('id', main.id);
    
    if (!updateError) {
      console.log(`   ✅ Maintenant ${allProducts.size} produits`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RÉSULTATS');
  console.log('='.repeat(80));
  console.log(`✅ Fusions: ${fusions}`);
  console.log(`🗑️ Suppressions: ${suppressions}`);
  console.log('='.repeat(80));
}

fusionnerDoublonsV2();