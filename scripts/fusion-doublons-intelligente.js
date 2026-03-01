// scripts/fusion-doublons-intelligente.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 🔧 FONCTIONS DE NETTOYAGE
// ============================================
function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculer le score de complétude d'une entité
function calculateCompleteness(entity) {
  let score = 0;
  
  // Nom (obligatoire)
  if (entity.name && entity.name.length > 3) score += 10;
  
  // Adresse
  if (entity.address && entity.address.length > 10) score += 15;
  
  // Téléphones
  if (entity.phone && entity.phone.length > 0) {
    score += Math.min(20, entity.phone.length * 5);
  }
  
  // Emails
  if (entity.email && entity.email.length > 0) {
    score += Math.min(20, entity.email.length * 5);
  }
  
  // Sites web
  if (entity.website && entity.website.length > 0) {
    score += 10;
  }
  
  // Produits (le plus important)
  if (entity.products && entity.products.length > 0) {
    score += Math.min(30, entity.products.length * 3);
  }
  
  return score;
}

// ============================================
// 🚀 FONCTION PRINCIPALE
// ============================================
async function fusionnerDoublons() {
  console.log('='.repeat(80));
  console.log('🔄 FUSION INTELLIGENTE DES DOUBLONS');
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
  
  let totalFusions = 0;
  let totalSuppressions = 0;
  
  // Analyser chaque groupe
  for (const [normalizedName, group] of groups.entries()) {
    if (group.length <= 1) continue; // Pas de doublon
    
    console.log(`\n📌 Groupe: ${group[0].name.substring(0, 50)} (${group.length} entités)`);
    
    // Calculer les scores de complétude
    const scored = group.map(e => ({
      ...e,
      score: calculateCompleteness(e)
    }));
    
    // Trier par score (du plus élevé au plus bas)
    scored.sort((a, b) => b.score - a.score);
    
    // La meilleure entité est celle qu'on garde
    const best = scored[0];
    const duplicates = scored.slice(1);
    
    console.log(`   🏆 Meilleure: ${best.name.substring(0, 40)} (score: ${best.score})`);
    console.log(`   Produits: ${best.products?.length || 0}`);
    
    // Fusionner les produits de tous les doublons
    const allProducts = new Set(best.products || []);
    
    for (const dup of duplicates) {
      console.log(`   🔄 Fusion avec: ${dup.name.substring(0, 40)} (score: ${dup.score})`);
      console.log(`      Catégorie: ${dup.category}`);
      console.log(`      Produits: ${dup.products?.length || 0}`);
      
      // Ajouter les produits du doublon
      if (dup.products && dup.products.length > 0) {
        dup.products.forEach(p => allProducts.add(p));
      }
      
      // Ajouter les autres informations manquantes
      const updates = {};
      
      // Fusionner les téléphones
      if (dup.phone && dup.phone.length > 0) {
        const allPhones = new Set([...(best.phone || []), ...dup.phone]);
        updates.phone = Array.from(allPhones);
      }
      
      // Fusionner les fax
      if (dup.fax && dup.fax.length > 0) {
        const allFax = new Set([...(best.fax || []), ...dup.fax]);
        updates.fax = Array.from(allFax);
      }
      
      // Fusionner les emails
      if (dup.email && dup.email.length > 0) {
        const allEmails = new Set([...(best.email || []), ...dup.email]);
        updates.email = Array.from(allEmails);
      }
      
      // Fusionner les sites web
      if (dup.website && dup.website.length > 0) {
        const allWebsites = new Set([...(best.website || []), ...dup.website]);
        updates.website = Array.from(allWebsites);
      }
      
      // Mettre à jour la meilleure entité
      if (Object.keys(updates).length > 0 || allProducts.size > (best.products?.length || 0)) {
        updates.products = Array.from(allProducts);
        
        const { error: updateError } = await supabase
          .from('official_directory')
          .update(updates)
          .eq('id', best.id);
        
        if (!updateError) {
          console.log(`      ✅ Fusion des données réussie`);
        }
      }
      
      // Supprimer le doublon
      const { error: deleteError } = await supabase
        .from('official_directory')
        .delete()
        .eq('id', dup.id);
      
      if (!deleteError) {
        totalSuppressions++;
        console.log(`      🗑️ Doublon supprimé`);
      }
      
      totalFusions++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RÉSULTATS DE LA FUSION');
  console.log('='.repeat(80));
  console.log(`✅ Fusions effectuées: ${totalFusions}`);
  console.log(`🗑️ Doublons supprimés: ${totalSuppressions}`);
  console.log('='.repeat(80));
}

// ============================================
// ▶️ EXÉCUTION
// ============================================
fusionnerDoublons();