// scripts/import-transports.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration de ce fichier
const BATCH_NAME = 'batch_20260301_transports';
const CATEGORY = 'TRANSPORTS';
const ENTITY_TYPE = 'transport';

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function extractProducts(line) {
  if (!line.startsWith('Produit:')) return [];
  const productsText = line.replace('Produit:', '').trim();
  return productsText
    .split(/[.,]/)
    .map(p => cleanText(p))
    .filter(p => p && p.length > 2);
}

async function importFile() {
  console.log('='.repeat(70));
  console.log(`🚀 IMPORT ${CATEGORY}`);
  console.log('='.repeat(70));
  
  // CHEMIN DU FICHIER
  const filePath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\DOCUMENTS\\k-TRANSPORTS.txt';
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier non trouvé: ${filePath}`);
    return;
  }
  
  console.log(`📖 Lecture du fichier...`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let imported = 0;
  let errors = 0;
  let currentEntity = null;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '') {
      if (currentEntity) {
        try {
          const { error } = await supabase
            .from('official_directory')
            .insert([{
              ...currentEntity,
              import_batch: BATCH_NAME
            }]);
          
          if (error) {
            console.error(`❌ Erreur ${currentEntity.name.substring(0, 30)}:`, error.message);
            errors++;
          } else {
            imported++;
            if (imported % 5 === 0) {
              console.log(`  ✅ ${imported} entités...`);
            }
          }
        } catch (error) {
          console.error(`💥 Exception:`, error.message);
          errors++;
        }
        currentEntity = null;
      }
      continue;
    }
    
    if (!currentEntity) {
      currentEntity = {
        name: cleanText(line),
        address: '',
        phone: [],
        fax: [],
        email: [],
        website: [],
        products: [],
        category: CATEGORY,
        entity_type: ENTITY_TYPE,
        source_file: 'k-TRANSPORTS.txt'
      };
    } 
    else {
      if (line.startsWith('Tel:') || line.startsWith('Tél:')) {
        currentEntity.phone.push(cleanText(line.replace(/^Té?l:/i, '')));
      }
      else if (line.startsWith('Fax:')) {
        currentEntity.fax.push(cleanText(line.replace('Fax:', '')));
      }
      else if (line.startsWith('@:')) {
        currentEntity.email.push(cleanText(line.replace('@:', '')));
      }
      else if (line.startsWith('http')) {
        currentEntity.website.push(cleanText(line.replace('http:', '')));
      }
      else if (line.startsWith('Produit:')) {
        const products = extractProducts(line);
        currentEntity.products.push(...products);
      }
      else {
        if (currentEntity.address) {
          currentEntity.address += ' ' + cleanText(line);
        } else {
          currentEntity.address = cleanText(line);
        }
      }
    }
  }
  
  if (currentEntity) {
    try {
      const { error } = await supabase
        .from('official_directory')
        .insert([{
          ...currentEntity,
          import_batch: BATCH_NAME
        }]);
      
      if (!error) {
        imported++;
      } else {
        errors++;
      }
    } catch (error) {
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`📊 RÉSULTATS ${CATEGORY}`);
  console.log('='.repeat(70));
  console.log(`✅ Importés: ${imported}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`🏷️  Batch: ${BATCH_NAME}`);
}

importFile();