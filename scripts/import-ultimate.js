// scripts/import-ultimate.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 📋 CONFIGURATION DES CATÉGORIES
// ============================================
const CATEGORIES = {
  // Institutions
  'MINISTERES': { type: 'institution', keywords: ['ministère', 'ministre'] },
  'AMBASSADES': { type: 'embassy', keywords: ['ambassade', 'consulat'] },
  'AMBASSADES ALGERIENNES': { type: 'embassy', keywords: ['ambassade d\'algérie'] },
  
  // Chambres
  'CHAMBRES DE COMMERCE': { type: 'chamber', keywords: ['chambre de commerce', 'cci'] },
  'CHAMBRES D\'AGRICULTURE': { type: 'chamber', keywords: ['chambre d\'agriculture'] },
  'CHAMBRES D\'ARTISANAT': { type: 'chamber', keywords: ['chambre d\'artisanat'] },
  'CHAMBRES DE PÊCHE': { type: 'chamber', keywords: ['chambre de la pêche'] },
  
  // Services
  'HÔTELS': { type: 'hotel', keywords: ['hôtel', 'hotel'] },
  'AGENCES DE VOYAGES': { type: 'travel', keywords: ['agence de voyages', 'tour', 'travel'] },
  'TRANSPORTS': { type: 'transport', keywords: ['transport', 'air algérie', 'air france', 'port'] },
  
  // Finance
  'BANQUES': { type: 'bank', keywords: ['banque', 'banque d', 'crédit', 'caisse'] },
  'ASSURANCES': { type: 'insurance', keywords: ['assurance', 'assurances', 'cagex', 'caar'] },
  
  // Industrie
  'AGROALIMENTAIRE': { type: 'food', keywords: ['alimentaire', 'boisson', 'conserves', 'huile', 'sucre', 'café', 'lait', 'fromage', 'yaourt', 'pâte', 'couscous'] },
  'CHIMIE & PHARMACIE': { type: 'chemical', keywords: ['chimique', 'pharma', 'médicament', 'cosmétique', 'savon', 'peinture'] },
  'ÉLECTRONIQUE': { type: 'electronics', keywords: ['électronique', 'electro', 'tv', 'télévision', 'ordinateur'] },
  'MÉTALLURGIE': { type: 'metal', keywords: ['métallurgie', 'acier', 'fer', 'aluminium', 'sidérurgie'] },
  'TEXTILE': { type: 'textile', keywords: ['textile', 'vêtement', 'tissu', 'couture', 'mode'] },
  'EMBALLAGES': { type: 'packaging', keywords: ['emballage', 'carton', 'papier', 'plastique'] },
  'BTP & MATÉRIAUX': { type: 'construction', keywords: ['ciment', 'béton', 'carreau', 'céramique', 'marbre', 'plâtre'] },
  'ÉNERGIE & MINES': { type: 'energy', keywords: ['énergie', 'mine', 'pétrole', 'gaz', 'électricité'] },
  
  // Commerce
  'AGRICULTURE': { type: 'agriculture', keywords: ['agriculture', 'datte', 'fruit', 'légume', 'olive', 'ferme'] },
  'PÊCHE & AQUACULTURE': { type: 'fishing', keywords: ['pêche', 'aquaculture', 'poisson', 'crustacé', 'crevette'] },
  'ARTISANAT': { type: 'handicraft', keywords: ['artisanat', 'tapis', 'poterie', 'céramique', 'corail'] },
  
  // Autres
  'SERVICES': { type: 'services', keywords: ['service', 'conseil', 'maintenance', 'location'] },
  'ÉDITION': { type: 'publishing', keywords: ['édition', 'livre', 'presse', 'imprimerie'] },
  'AUTRES': { type: 'other', keywords: [] }
};

// ============================================
// 🔧 FONCTIONS DE NETTOYAGE
// ============================================

function cleanText(text) {
  if (!text) return '';
  
  const replacements = {
    'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë',
    'Ã¢': 'â', 'Ã¤': 'ä', 'Ã®': 'î', 'Ã¯': 'ï',
    'Ã´': 'ô', 'Ã¶': 'ö', 'Ã»': 'û', 'Ã¼': 'ü',
    'Ã§': 'ç', 'Ã ': 'à', 'â€™': "'", 'Â': '',
    'Ã ': 'à', 'Ã¡': 'á', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã¿': 'ÿ', 'Ã ': 'à'
  };
  
  let cleaned = text;
  for (const [bad, good] of Object.entries(replacements)) {
    cleaned = cleaned.replace(new RegExp(bad, 'g'), good);
  }
  
  // Supprimer les espaces multiples
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

function cleanPhone(phone) {
  if (!phone) return '';
  
  // Supprimer les espaces inutiles
  let cleaned = phone.replace(/\s+/g, ' ').trim();
  
  // Supprimer les points, tirets, etc.
  cleaned = cleaned.replace(/[.\-]/g, ' ');
  
  // Supprimer les espaces autour des slashs
  cleaned = cleaned.replace(/\s*\/\s*/g, ' / ');
  
  return cleaned;
}

function cleanEmail(email) {
  if (!email) return '';
  
  // Supprimer les espaces
  let cleaned = email.replace(/\s+/g, '').trim();
  
  // Mettre en minuscules
  cleaned = cleaned.toLowerCase();
  
  return cleaned;
}

function cleanWebsite(url) {
  if (!url) return '';
  
  // Supprimer les espaces
  let cleaned = url.replace(/\s+/g, '').trim();
  
  // Ajouter http:// si nécessaire
  if (!cleaned.startsWith('http')) {
    cleaned = 'http://' + cleaned;
  }
  
  return cleaned;
}

// ============================================
// 🏷️ CLASSIFICATION
// ============================================

function determineCategory(name, products = []) {
  const nameLower = name.toLowerCase();
  const productsLower = products.join(' ').toLowerCase();
  const text = nameLower + ' ' + productsLower;
  
  let bestCategory = 'AUTRES';
  let bestScore = 0;
  
  for (const [category, config] of Object.entries(CATEGORIES)) {
    let score = 0;
    
    // Vérifier les mots-clés
    for (const keyword of config.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
      }
    }
    
    // Bonus pour les correspondances exactes dans le nom
    for (const keyword of config.keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        score += 5;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

// ============================================
// 🔍 DÉTECTION DES DOUBLONS
// ============================================

function findDuplicates(entities) {
  const duplicates = [];
  const seen = new Map();
  
  for (const entity of entities) {
    // Clé basée sur le nom normalisé
    const nameKey = entity.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (seen.has(nameKey)) {
      duplicates.push({
        original: seen.get(nameKey),
        duplicate: entity,
        reason: 'Nom similaire'
      });
    } else {
      seen.set(nameKey, entity);
    }
  }
  
  return duplicates;
}

// ============================================
// 📥 PARSING DU FICHIER
// ============================================

async function parseFile(filePath) {
  console.log('📖 Lecture du fichier...');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const entities = [];
  let currentEntity = null;
  let currentCategory = '';
  
  console.log(`📊 ${lines.length} lignes trouvées`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecter les catégories principales (en majuscules)
    if (line && line.match(/^[A-Z\s]{5,}$/) && !line.includes('Tél') && !line.includes('Fax')) {
      // Sauvegarder l'entité précédente
      if (currentEntity) {
        entities.push(currentEntity);
        currentEntity = null;
      }
      
      currentCategory = line;
      console.log(`\n📌 Catégorie: ${currentCategory}`);
      continue;
    }
    
    // Ignorer les lignes vides
    if (line === '') {
      if (currentEntity) {
        entities.push(currentEntity);
        currentEntity = null;
      }
      continue;
    }
    
    // Si on a une ligne non vide
    if (line) {
      // Si c'est le début d'une nouvelle entité
      if (!currentEntity) {
        currentEntity = {
          name: cleanText(line),
          address: '',
          phone: [],
          fax: [],
          email: [],
          website: [],
          products: [],
          category: currentCategory,
          source_file: 'exportateurs.txt',
          raw_data: line
        };
      } else {
        // Ajouter à l'entité existante
        currentEntity.raw_data += '\n' + line;
        
        if (line.startsWith('Tél:')) {
          const phone = cleanPhone(line.replace('Tél:', '').trim());
          if (phone) currentEntity.phone.push(phone);
        }
        else if (line.startsWith('Fax:')) {
          const fax = cleanPhone(line.replace('Fax:', '').trim());
          if (fax) currentEntity.fax.push(fax);
        }
        else if (line.startsWith('@:')) {
          const email = cleanEmail(line.replace('@:', '').trim());
          if (email) currentEntity.email.push(email);
        }
        else if (line.startsWith('http')) {
          const website = cleanWebsite(line.replace('http:', '').trim());
          if (website) currentEntity.website.push(website);
        }
        else if (line.startsWith('Produit:')) {
          const products = line.replace('Produit:', '')
            .split('.')
            .map(p => cleanText(p))
            .filter(p => p);
          currentEntity.products.push(...products);
        }
        else {
          // C'est l'adresse
          if (currentEntity.address) {
            currentEntity.address += ' ' + cleanText(line);
          } else {
            currentEntity.address = cleanText(line);
          }
        }
      }
    }
  }
  
  // Ajouter la dernière entité
  if (currentEntity) {
    entities.push(currentEntity);
  }
  
  console.log(`\n📦 ${entities.length} entités trouvées`);
  return entities;
}

// ============================================
// 💾 SAUVEGARDE DANS SUPABASE
// ============================================

async function saveEntity(entity) {
  // Déterminer la catégorie finale
  const finalCategory = determineCategory(entity.name, entity.products);
  
  const data = {
    name: entity.name,
    address: entity.address,
    phone: entity.phone,
    fax: entity.fax,
    email: entity.email,
    website: entity.website,
    products: entity.products,
    category: finalCategory,
    source_file: entity.source_file,
    raw_data: entity.raw_data
  };
  
  const { error } = await supabase
    .from('official_directory')
    .insert([data]);
  
  if (error) {
    throw error;
  }
  
  return true;
}

// ============================================
// 🚀 FONCTION PRINCIPALE
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 IMPORT ULTIME - ALGERIAEXPORT');
  console.log('='.repeat(60));
  
  const filePath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\DOCUMENTS\\backup_docs\\exportateurs.txt';
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier non trouvé: ${filePath}`);
    return;
  }
  
  try {
    // ÉTAPE 1: Parser le fichier
    const entities = await parseFile(filePath);
    
    // ÉTAPE 2: Détecter les doublons
    console.log('\n🔍 Recherche des doublons...');
    const duplicates = findDuplicates(entities);
    if (duplicates.length > 0) {
      console.log(`⚠️ ${duplicates.length} doublons potentiels trouvés`);
    } else {
      console.log('✅ Aucun doublon détecté');
    }
    
    // ÉTAPE 3: Sauvegarder dans Supabase
    console.log('\n💾 Sauvegarde dans Supabase...');
    
    let success = 0;
    let errors = 0;
    const categoryStats = {};
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      
      try {
        await saveEntity(entity);
        success++;
        
        // Statistiques par catégorie
        const finalCategory = determineCategory(entity.name, entity.products);
        categoryStats[finalCategory] = (categoryStats[finalCategory] || 0) + 1;
        
        if (success % 50 === 0) {
          console.log(`✅ ${success} entités sauvegardées...`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Erreur sur "${entity.name.substring(0, 30)}...":`, error.message);
      }
    }
    
    // RÉSULTATS FINAUX
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSULTATS FINAUX');
    console.log('='.repeat(60));
    console.log(`✅ Importés avec succès: ${success}`);
    console.log(`❌ Erreurs: ${errors}`);
    
    if (duplicates.length > 0) {
      console.log(`⚠️ Doublons détectés: ${duplicates.length}`);
    }
    
    console.log('\n📊 STATISTIQUES PAR CATÉGORIE:');
    
    const sortedCategories = Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1]);
    
    for (const [category, count] of sortedCategories) {
      const percent = Math.round((count / success) * 100);
      console.log(`   ${category}: ${count} entités (${percent}%)`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 IMPORT TERMINÉ !');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('💥 ERREUR FATALE:', error);
  }
}

// ============================================
// ▶️ EXÉCUTION
// ============================================
main();