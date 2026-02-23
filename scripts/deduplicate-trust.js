// scripts/deduplicate-trust.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 📊 SCORE DE CONFIANCE
// ============================================
function calculateTrustScore(entity) {
  let score = 0;
  const details = [];
  
  // 1. Informations de base (max 30 points)
  if (entity.name && entity.name.length > 3) {
    score += 10;
    details.push('nom:10');
  }
  
  if (entity.address && entity.address.length > 10) {
    score += 10;
    details.push('adresse:10');
  }
  
  // 2. Contacts (max 40 points)
  if (entity.phone && entity.phone.length > 0) {
    const validPhones = entity.phone.filter(p => 
      p.match(/^\+213\d{9}$/) || p.match(/^0\d{9}$/)
    );
    score += Math.min(20, validPhones.length * 5);
    details.push(`tel:${validPhones.length * 5}`);
  }
  
  if (entity.email && entity.email.length > 0) {
    const validEmails = entity.email.filter(e => 
      e.includes('@') && e.includes('.')
    );
    score += Math.min(20, validEmails.length * 5);
    details.push(`email:${validEmails.length * 5}`);
  }
  
  // 3. Site web (max 10 points)
  if (entity.website && entity.website.length > 0) {
    score += 10;
    details.push('web:10');
  }
  
  // 4. Produits (max 20 points)
  if (entity.products && entity.products.length > 0) {
    score += Math.min(20, entity.products.length * 2);
    details.push(`produits:${entity.products.length * 2}`);
  }
  
  // Niveau de confiance
  let level = 'LOW';
  if (score >= 70) level = 'HIGH';
  else if (score >= 40) level = 'MEDIUM';
  
  return {
    score,
    level,
    details: details.join(', ')
  };
}

// ============================================
// 🔍 DÉTECTION DES DOUBLONS
// ============================================
async function findDuplicates() {
  console.log('🔍 Recherche des doublons...');
  
  // Récupérer toutes les entités
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur de récupération:', error);
    return [];
  }
  
  console.log(`📦 ${entities.length} entités récupérées`);
  
  const duplicates = [];
  const seen = new Map();
  const exactMatches = new Map();
  
  for (const entity of entities) {
    // 1. Doublons par nom exact (normalisé)
    const normalizedName = entity.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');
    
    if (exactMatches.has(normalizedName)) {
      duplicates.push({
        type: 'exact_name',
        original: exactMatches.get(normalizedName),
        duplicate: entity,
        reason: 'Nom identique après normalisation'
      });
    } else {
      exactMatches.set(normalizedName, entity);
    }
    
    // 2. Doublons par téléphone
    if (entity.phone && entity.phone.length > 0) {
      for (const phone of entity.phone) {
        const cleanPhone = phone.replace(/\s+/g, '');
        if (cleanPhone.length > 8) {
          if (seen.has(cleanPhone)) {
            duplicates.push({
              type: 'same_phone',
              original: seen.get(cleanPhone),
              duplicate: entity,
              reason: `Même téléphone: ${cleanPhone}`
            });
          } else {
            seen.set(cleanPhone, entity);
          }
        }
      }
    }
  }
  
  // Regrouper les doublons uniques
  const uniqueDuplicates = [];
  const duplicateIds = new Set();
  
  for (const dup of duplicates) {
    const dupId = dup.duplicate.id;
    if (!duplicateIds.has(dupId)) {
      duplicateIds.add(dupId);
      uniqueDuplicates.push(dup);
    }
  }
  
  console.log(`⚠️ ${uniqueDuplicates.length} doublons trouvés`);
  return uniqueDuplicates;
}

// ============================================
// 🧹 NETTOYAGE DES DOUBLONS
// ============================================
async function cleanDuplicates(duplicates) {
  console.log('\n🧹 Nettoyage des doublons...');
  
  let kept = 0;
  let deleted = 0;
  let merged = 0;
  
  for (const dup of duplicates) {
    const original = dup.original;
    const duplicate = dup.duplicate;
    
    console.log(`\n📌 Doublon: ${duplicate.name.substring(0, 30)}...`);
    console.log(`   Raison: ${dup.reason}`);
    console.log(`   Original: ${original.name.substring(0, 30)}...`);
    
    // Comparer les scores de confiance
    const originalScore = calculateTrustScore(original);
    const duplicateScore = calculateTrustScore(duplicate);
    
    console.log(`   Score original: ${originalScore.score} (${originalScore.level})`);
    console.log(`   Score doublon: ${duplicateScore.score} (${duplicateScore.level})`);
    
    // Décider quoi garder
    let keep = original;
    let remove = duplicate;
    
    if (duplicateScore.score > originalScore.score) {
      // Le doublon a plus d'infos, on fusionne
      console.log(`   🔄 Fusion: le doublon a plus d'informations`);
      
      // Fusionner les données
      const mergedEntity = {
        ...original,
        phone: [...new Set([...original.phone, ...duplicate.phone])],
        fax: [...new Set([...original.fax, ...duplicate.fax])],
        email: [...new Set([...original.email, ...duplicate.email])],
        website: [...new Set([...original.website, ...duplicate.website])],
        products: [...new Set([...original.products, ...duplicate.products])],
        trust_score: Math.max(originalScore.score, duplicateScore.score)
      };
      
      // Mettre à jour l'original
      const { error: updateError } = await supabase
        .from('official_directory')
        .update(mergedEntity)
        .eq('id', original.id);
      
      if (!updateError) {
        // Supprimer le doublon
        const { error: deleteError } = await supabase
          .from('official_directory')
          .delete()
          .eq('id', duplicate.id);
        
        if (!deleteError) {
          merged++;
          console.log(`   ✅ Fusion réussie`);
        }
      }
    } else {
      // L'original est meilleur, on garde l'original et on supprime le doublon
      console.log(`   🗑️ Suppression du doublon (moins d'infos)`);
      
      const { error } = await supabase
        .from('official_directory')
        .delete()
        .eq('id', duplicate.id);
      
      if (!error) {
        deleted++;
        console.log(`   ✅ Doublon supprimé`);
      }
    }
  }
  
  console.log('\n📊 RÉSULTAT DU NETTOYAGE:');
  console.log(`   ✅ Gardés: ${kept}`);
  console.log(`   🗑️ Supprimés: ${deleted}`);
  console.log(`   🔄 Fusionnés: ${merged}`);
  
  return { kept, deleted, merged };
}

// ============================================
// 📊 MISE À JOUR DES SCORES DE CONFIANCE
// ============================================
async function updateTrustScores() {
  console.log('\n📊 Mise à jour des scores de confiance...');
  
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('*');
  
  if (error) {
    console.error('❌ Erreur de récupération:', error);
    return;
  }
  
  console.log(`📦 ${entities.length} entités à mettre à jour`);
  
  let updated = 0;
  let errors = 0;
  
  for (const entity of entities) {
    const trust = calculateTrustScore(entity);
    
    const { error: updateError } = await supabase
      .from('official_directory')
      .update({
        trust_score: trust.score,
        trust_level: trust.level,
        trust_details: trust.details
      })
      .eq('id', entity.id);
    
    if (updateError) {
      errors++;
      console.error(`❌ Erreur pour ${entity.name.substring(0, 30)}:`, updateError.message);
    } else {
      updated++;
      if (updated % 200 === 0) {
        console.log(`✅ ${updated} entités mises à jour...`);
      }
    }
  }
  
  return { updated, errors };
}

// ============================================
// 📊 STATISTIQUES FINALES
// ============================================
async function showStats() {
  console.log('\n📊 STATISTIQUES FINALES');
  
  const { data: entities, error } = await supabase
    .from('official_directory')
    .select('trust_level, category');
  
  if (error) {
    console.error('❌ Erreur de stats:', error);
    return;
  }
  
  const trustStats = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };
  
  const categoryStats = {};
  
  for (const entity of entities) {
    trustStats[entity.trust_level || 'LOW']++;
    categoryStats[entity.category] = (categoryStats[entity.category] || 0) + 1;
  }
  
  console.log('\n📊 NIVEAUX DE CONFIANCE:');
  console.log(`   🟢 HAUTE: ${trustStats.HIGH}`);
  console.log(`   🟡 MOYENNE: ${trustStats.MEDIUM}`);
  console.log(`   🔴 BASSE: ${trustStats.LOW}`);
  
  console.log('\n📊 TOP 10 CATÉGORIES:');
  Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
}

// ============================================
// 🚀 FONCTION PRINCIPALE
// ============================================
async function main() {
  console.log('='.repeat(70));
  console.log('🚀 DÉDOUBLONNAGE & CONFIANCE - ALGERIAEXPORT');
  console.log('='.repeat(70));
  
  try {
    // 1. D'abord mettre à jour les scores de confiance
    console.log('\n📊 ÉTAPE 1: Mise à jour des scores de confiance');
    const trustResults = await updateTrustScores();
    console.log(`\n✅ Scores mis à jour: ${trustResults.updated}`);
    console.log(`❌ Erreurs: ${trustResults.errors}`);
    
    // 2. Ensuite trouver les doublons
    console.log('\n🔍 ÉTAPE 2: Recherche des doublons');
    const duplicates = await findDuplicates();
    
    if (duplicates.length === 0) {
      console.log('✅ Aucun doublon trouvé !');
    } else {
      // 3. Nettoyer les doublons
      console.log('\n🧹 ÉTAPE 3: Nettoyage des doublons');
      await cleanDuplicates(duplicates);
    }
    
    // 4. Afficher les stats finales
    await showStats();
    
    console.log('\n' + '='.repeat(70));
    console.log('🎉 OPÉRATION TERMINÉE !');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('💥 ERREUR FATALE:', error);
  }
}

// ============================================
// ▶️ EXÉCUTION
// ============================================
main();