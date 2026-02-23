// scripts/import-master.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 📞 MODULE TÉLÉPHONE INTELLIGENT
// ============================================
class PhoneParser {
  parsePhoneLine(line) {
    const numbers = [];
    const content = line.replace(/^(Tél|Fax):\s*/i, '').trim();
    
    // Gérer les slashs
    const parts = content.split('/').map(p => p.trim());
    
    for (let part of parts) {
      // Gérer les plages "XX à YY"
      if (part.includes('à') || part.includes('-')) {
        const rangeMatch = part.match(/(\d+)\s*(?:à|a|−|-)\s*(\d+)/i);
        if (rangeMatch) {
          const start = parseInt(rangeMatch[1]);
          const end = parseInt(rangeMatch[2]);
          for (let i = start; i <= end; i++) {
            numbers.push(i.toString());
          }
        }
      } else {
        // Nettoyer le numéro
        const cleaned = part.replace(/\s+/g, '').replace(/[^\d+]/g, '');
        if (cleaned) numbers.push(cleaned);
      }
    }
    
    return numbers;
  }

  validatePhone(phone) {
    if (!phone) return { valid: false, score: 0 };
    
    const cleaned = phone.replace(/\s+/g, '');
    let score = 0;
    
    if (cleaned.length >= 8) score += 10;
    if (cleaned.length >= 12) score += 10;
    if (cleaned.startsWith('+213')) score += 15;
    if (cleaned.startsWith('0')) score += 10;
    if (cleaned.match(/^(0[5-7]|\+213[5-7])/)) score += 10;
    
    return {
      valid: true,
      score: score,
      cleaned: cleaned
    };
  }
}

// ============================================
// 🤖 MODULE IA - Détection intelligente des catégories
// ============================================
class IAEngine {
  constructor() {
    this.keywords = {
      'MINISTERES': ['ministère', 'ministre', 'gouvernement'],
      'AMBASSADES': ['ambassade', 'consulat'],
      'CHAMBRES': ['chambre', 'cci'],
      'ASSOCIATIONS': ['association', 'fédération'],
      'BANQUES': ['banque', 'bank', 'crédit'],
      'ASSURANCES': ['assurance'],
      'TRANSPORT': ['transport', 'air', 'port', 'maritime'],
      'HOTELS': ['hôtel', 'hotel'],
      'AGRICULTURE': ['agriculture', 'datte', 'fruit', 'olive'],
      'AGROALIMENTAIRE': ['alimentaire', 'boisson', 'conserves', 'huile'],
      'CHIMIE': ['chimique', 'pharma', 'médicament', 'cosmétique'],
      'ELECTRONIQUE': ['électronique', 'tv', 'ordinateur'],
      'METALLURGIE': ['métallurgie', 'acier', 'fer', 'aluminium'],
      'TEXTILE': ['textile', 'vêtement', 'tissu']
    };
  }

  predictCategory(name) {
    const text = name.toLowerCase();
    
    for (const [category, keywords] of Object.entries(this.keywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return category;
        }
      }
    }
    return null;
  }
}

// ============================================
// ✅ MODULE CONFIANCE
// ============================================
class TrustValidator {
  constructor() {
    this.phoneParser = new PhoneParser();
  }

  validateEmail(email) {
    if (!email) return { valid: false, score: 0 };
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    
    let score = 0;
    if (isValid) {
      score += 30;
      if (email.includes('.gov.dz')) score += 20;
      if (email.includes('.dz')) score += 10;
    }
    
    return { valid: isValid, score };
  }

  validateWebsite(url) {
    if (!url) return { valid: false, score: 0 };
    
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})/i;
    const isValid = regex.test(url);
    
    let score = 0;
    if (isValid) {
      score += 20;
      if (url.includes('.gov.dz')) score += 20;
      if (url.includes('.dz')) score += 5;
    }
    
    return { valid: isValid, score };
  }

  validateAddress(address) {
    if (!address) return { valid: false, score: 0 };
    
    let score = 0;
    if (/\d/.test(address)) score += 10;
    if (/rue|boulevard|avenue|cité|lot/i.test(address)) score += 15;
    if (/(Alger|Oran|Constantine)/i.test(address)) score += 25;
    if (address.length > 20) score += 10;
    
    return { valid: score > 20, score };
  }

  calculateTrustScore(entity) {
    let totalScore = 0;
    
    // Email
    if (entity.email?.length) {
      totalScore += entity.email.reduce((sum, e) => sum + this.validateEmail(e).score, 0);
    }
    
    // Téléphone
    if (entity.phone?.length) {
      totalScore += entity.phone.reduce((sum, p) => sum + this.phoneParser.validatePhone(p).score, 0);
    }
    
    // Website
    if (entity.website?.length) {
      totalScore += entity.website.reduce((sum, w) => sum + this.validateWebsite(w).score, 0);
    }
    
    // Adresse
    if (entity.address) {
      totalScore += this.validateAddress(entity.address).score;
    }
    
    // Bonus informations
    const infoCount = [
      entity.name, entity.address,
      entity.phone?.length, entity.email?.length,
      entity.website?.length, entity.products?.length
    ].filter(Boolean).length;
    
    totalScore += infoCount * 10;
    
    const finalScore = Math.min(100, Math.round(totalScore / 2.5));
    
    let trustLevel = 'LOW';
    if (finalScore >= 70) trustLevel = 'HIGH';
    else if (finalScore >= 40) trustLevel = 'MEDIUM';
    
    return {
      score: finalScore,
      level: trustLevel,
      infoCount
    };
  }
}

// ============================================
// 📋 MAPPING DES CATÉGORIES
// ============================================
const CATEGORY_MAPPING = {
  'MINISTERES': { type: 'institution', icon: '🏛️' },
  'ORGANISMES DU COMMERCE EXTERIEUR': { type: 'institution', icon: '🏢' },
  'ASSOCIATIONS': { type: 'association', icon: '🤝' },
  'DIRECTIONS RÉGIONALES DU COMMERCE': { type: 'institution', icon: '🗺️' },
  'DIRECTIONS DE COMMERCE ET DE LA PROMOTION DES EXPORTATIONS DES WILAYAS': { type: 'institution', icon: '🏛️' },
  'CHAMBRES DE COMMERCE ET D\'INDUSTRIE': { type: 'chamber', icon: '🏭' },
  'CHAMBRES D\'AGRICULTURE': { type: 'chamber', icon: '🌾' },
  'CHAMBRES D\'ARTISANAT ET DES METIERS': { type: 'chamber', icon: '🎨' },
  'CHAMBRES DE LA PÊCHE ET DE L\'AQUACULTURE': { type: 'chamber', icon: '🎣' },
  'AMBASSADES ACCREDITEES EN ALGERIE': { type: 'embassy', icon: '🏛️' },
  'LES AMBASSADES D\'ALGERIE A L\'ETRANGER': { type: 'embassy', icon: '🌍' },
  'HÔTELS': { type: 'hotel', icon: '🏨' },
  'AGENCES DE VOYAGES': { type: 'travel', icon: '✈️' },
  'AGRICULTURE': { type: 'agribusiness', icon: '🌱' },
  'AGROALIMENTAIRE': { type: 'food', icon: '🍽️' },
  'AQUACULTURE, ELEVAGE & PECHE': { type: 'fishing', icon: '🐟' },
  'ARTISANAT': { type: 'handicraft', icon: '🪡' },
  'INDUSTRIE CHIMIQUE': { type: 'chemical', icon: '🧪' },
  'MACHINES & APPAREILS ELECTRIQUES': { type: 'electronics', icon: '📱' },
  'MACHINES & EQUIPEMENTS': { type: 'machinery', icon: '⚙️' },
  'PAPIER & CARTONS': { type: 'paper', icon: '📄' },
  'PLASTIQUES & CAOUTCHOUC': { type: 'plastic', icon: '🥤' },
  'TEXTILES, BONNETERIE & CONFECTION': { type: 'textile', icon: '👕' },
  'TRAVAIL DU BOIS & ARTICLES EN BOIS': { type: 'wood', icon: '🪵' },
  'MAROQUINERIE, CUIR & CHAUSSUES': { type: 'leather', icon: '👞' },
  'MATERIELS DE TRANSPORT': { type: 'transport', icon: '🚛' },
  'GROUPES INDUSTRIELS': { type: 'industrial', icon: '🏭' },
  'BANQUES': { type: 'bank', icon: '🏦' },
  'ASSURANCES': { type: 'insurance', icon: '🛡️' },
  'TRANSPORT AERIEN': { type: 'transport', icon: '✈️' },
  'TRANSPORT ROUTIER': { type: 'transport', icon: '🚚' },
  'TRANSPORT MARITIME': { type: 'transport', icon: '🚢' },
  'PORTS': { type: 'port', icon: '⚓' },
  'ENERGIE & MINES': { type: 'energy', icon: '⚡' },
  'SIDERURGIE & METALLURGIE': { type: 'steel', icon: '🏗️' },
  'PRODUITS MANUFACTURES DIVERS': { type: 'manufacturing', icon: '🏭' },
  'PRODUITS MINERAUX NON METALLIQUES': { type: 'minerals', icon: '🪨' },
  'SERVICES': { type: 'services', icon: '🔧' },
  'EDITION': { type: 'publishing', icon: '📚' },
  'COMMERCE MULTIPLE': { type: 'trading', icon: '🛒' }
};

// ============================================
// 🔧 FONCTIONS PRINCIPALES
// ============================================

function cleanText(text) {
  if (!text) return '';
  
  const replacements = {
    'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë',
    'Ã¢': 'â', 'Ã¤': 'ä', 'Ã®': 'î', 'Ã¯': 'ï',
    'Ã´': 'ô', 'Ã¶': 'ö', 'Ã»': 'û', 'Ã¼': 'ü',
    'Ã§': 'ç', 'Ã ': 'à', 'â€™': "'", 'Â': ''
  };
  
  let cleaned = text;
  for (const [bad, good] of Object.entries(replacements)) {
    cleaned = cleaned.replace(new RegExp(bad, 'g'), good);
  }
  
  return cleaned.trim();
}

function extractWilaya(address) {
  if (!address) return null;
  
  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Tizi Ouzou',
    'Béjaïa', 'Biskra', 'Tlemcen', 'Mostaganem', 'Skikda', 'Batna', 'Djelfa',
    'Médéa', 'Chlef', 'Souk Ahras', 'Mila', 'Bouira', 'Boumerdès', 'Tipaza',
    'Aïn Defla', 'Naama', 'Mascara', 'Relizane', 'Saïda', 'Sidi Bel Abbès',
    'Tiaret', 'Tissemsilt', 'El Oued', 'Ghardaïa', 'Laghouat', 'Ouargla',
    'Illizi', 'Tamanrasset', 'Adrar', 'Béchar', 'Tindouf', 'El Tarf', 'Guelma',
    'Jijel', 'Khenchela', 'M\'Sila', 'Bordj Bou Arreridj', 'Oum El Bouaghi', 'Tébessa'
  ];
  
  for (const wilaya of wilayas) {
    if (address.includes(wilaya)) {
      return wilaya;
    }
  }
  return null;
}

// ============================================
// 🚀 FONCTION D'IMPORT PRINCIPALE
// ============================================
async function importFile(filePath) {
  console.log('🚀 Démarrage de l\'import...');
  console.log(`📁 Fichier: ${filePath}`);
  
  const phoneParser = new PhoneParser();
  const iaEngine = new IAEngine();
  const trustValidator = new TrustValidator();
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let currentCategory = '';
  let imported = 0;
  let errors = 0;
  let iaPredictions = 0;
  let categories = new Set();
  let trustStats = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  
  console.log(`📊 Total lignes: ${lines.length}\n`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecter les catégories (lignes en majuscules)
    if (line && line.match(/^[A-Z\s]{5,}$/) && !line.match(/^(Tél|Fax|@|http)/i)) {
      // Chercher la catégorie dans le mapping
      let foundCategory = null;
      for (const key of Object.keys(CATEGORY_MAPPING)) {
        if (line.includes(key)) {
          foundCategory = key;
          break;
        }
      }
      
      if (foundCategory) {
        currentCategory = foundCategory;
        categories.add(currentCategory);
        console.log(`📌 Catégorie: ${currentCategory} ${CATEGORY_MAPPING[currentCategory]?.icon || ''}`);
      } else {
        console.log(`⚠️ Catégorie non mappée: ${line}`);
      }
      continue;
    }
    
    // Si on a une catégorie et une ligne non vide qui n'est pas un champ, c'est le début d'une entité
    if (currentCategory && line && !line.match(/^(Tél|Fax|@|http|Produit)/i)) {
      
      // Collecter toutes les lignes de l'entité
      let entityLines = [line];
      let j = i + 1;
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        
        // Si on trouve une ligne vide ou une nouvelle catégorie, on arrête
        if (!nextLine || nextLine.match(/^[A-Z\s]{5,}$/)) {
          break;
        }
        
        entityLines.push(nextLine);
        j++;
      }
      
      // Initialiser l'entité
      const entity = {
        category: currentCategory,
        name: '',
        address: '',
        phone: [],
        fax: [],
        email: [],
        website: [],
        products: []
      };
      
      // Parser chaque ligne
      for (const line of entityLines) {
        const trimmed = line.trim();
        
        if (trimmed.match(/^Tél:/i)) {
          const numbers = phoneParser.parsePhoneLine(trimmed);
          entity.phone.push(...numbers);
        }
        else if (trimmed.match(/^Fax:/i)) {
          const numbers = phoneParser.parsePhoneLine(trimmed);
          entity.fax.push(...numbers);
        }
        else if (trimmed.match(/^@:/i)) {
          const emails = trimmed.replace(/^@:\s*/i, '').split('/').map(e => e.trim());
          entity.email.push(...emails);
        }
        else if (trimmed.match(/^http:/i) || trimmed.match(/^https:/i)) {
          const sites = trimmed.replace(/^https?:\s*/i, '').split(' ').map(s => s.trim());
          entity.website.push(...sites);
        }
        else if (trimmed.match(/^Produit:/i)) {
          const products = trimmed.replace(/^Produit:\s*/i, '').split('.').map(p => p.trim()).filter(p => p);
          entity.products.push(...products);
        }
        else if (!entity.name) {
          entity.name = trimmed;
        }
        else if (!entity.address) {
          entity.address = trimmed;
        }
        else {
          entity.address += ' ' + trimmed;
        }
      }
      
      // Nettoyer les données
      const cleanEntity = {
        category: entity.category,
        name: cleanText(entity.name),
        address: cleanText(entity.address),
        phone: entity.phone.map(p => cleanText(p)),
        fax: entity.fax.map(f => cleanText(f)),
        email: entity.email.map(e => cleanText(e)),
        website: entity.website.map(w => cleanText(w)),
        products: entity.products.map(p => cleanText(p)),
        entity_type: CATEGORY_MAPPING[entity.category]?.type || 'company',
        source_file: 'exportateurs.txt',
        wilaya: extractWilaya(cleanText(entity.address))
      };
      
      // IA prédiction si catégorie non trouvée
      if (!CATEGORY_MAPPING[entity.category]) {
        const predictedCategory = iaEngine.predictCategory(cleanEntity.name);
        if (predictedCategory) {
          cleanEntity.category = predictedCategory;
          cleanEntity.entity_type = CATEGORY_MAPPING[predictedCategory]?.type || 'company';
          iaPredictions++;
        }
      }
      
      // Score de confiance
      const trustScore = trustValidator.calculateTrustScore(cleanEntity);
      cleanEntity.trust_score = trustScore.score;
      cleanEntity.trust_level = trustScore.level;
      cleanEntity.trust_details = `infos:${trustScore.infoCount}`;
      
      trustStats[trustScore.level]++;
      
      // Insérer dans Supabase
      try {
        const { error } = await supabase
          .from('official_directory')
          .insert([cleanEntity]);
        
        if (error) {
          console.error(`❌ Erreur ${cleanEntity.name.substring(0, 30)}:`, error.message);
          errors++;
        } else {
          imported++;
          
          const trustEmoji = trustScore.level === 'HIGH' ? '🟢' : trustScore.level === 'MEDIUM' ? '🟡' : '🔴';
          
          if (imported % 10 === 0) {
            console.log(`✅ ${imported} importés... ${trustEmoji} Confiance: ${trustScore.score} [${trustScore.level}]`);
          }
        }
      } catch (error) {
        console.error(`💥 Exception:`, error.message);
        errors++;
      }
      
      i = j - 1; // Avancer jusqu'à la fin de l'entité
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 RÉSULTATS FINAUX');
  console.log('='.repeat(70));
  console.log(`✅ Importés: ${imported}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`🤖 Prédictions IA: ${iaPredictions}`);
  console.log('\n📊 NIVEAUX DE CONFIANCE:');
  console.log(`   🟢 HAUTE: ${trustStats.HIGH}`);
  console.log(`   🟡 MOYENNE: ${trustStats.MEDIUM}`);
  console.log(`   🔴 BASSE: ${trustStats.LOW}`);
  console.log(`\n📌 Catégories (${categories.size}):`);
  
  Array.from(categories).sort().forEach(cat => {
    console.log(`   - ${cat} ${CATEGORY_MAPPING[cat]?.icon || '📋'}`);
  });
}

// ============================================
// 🎬 EXÉCUTION
// ============================================
const filePath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\DOCUMENTS\\backup_docs\\exportateurs.txt';

if (!fs.existsSync(filePath)) {
  console.error(`❌ Fichier non trouvé: ${filePath}`);
  process.exit(1);
}

importFile(filePath).catch(console.error);