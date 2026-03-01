// scripts/import-assurances.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

async function importFile(filePath) {
  console.log('🚀 Import ASSURANCES...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let imported = 0;
  let currentEntity = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Ignorer la première ligne (catégorie)
    if (i === 0) continue;
    
    // Ligne vide = fin d'entité
    if (line === '') {
      if (currentEntity) {
        const { error } = await supabase
          .from('official_directory')
          .insert([currentEntity]);
        
        if (!error) {
          imported++;
          console.log(`✅ ${imported}: ${currentEntity.name}`);
        }
        currentEntity = null;
      }
      continue;
    }
    
    // Début d'une nouvelle entité
    if (!currentEntity) {
      currentEntity = {
        name: cleanText(line),
        address: '',
        phone: [],
        fax: [],
        email: [],
        website: [],
        products: [],
        category: 'ASSURANCES',
        entity_type: 'insurance',
        source_file: 'assurances.txt'
      };
    } 
    else {
      if (line.startsWith('Tel:')) {
        currentEntity.phone.push(cleanText(line.replace('Tel:', '')));
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
      else {
        // Adresse
        if (currentEntity.address) {
          currentEntity.address += ' ' + cleanText(line);
        } else {
          currentEntity.address = cleanText(line);
        }
      }
    }
  }
  
  // Dernière entité
  if (currentEntity) {
    const { error } = await supabase
      .from('official_directory')
      .insert([currentEntity]);
    
    if (!error) {
      imported++;
      console.log(`✅ ${imported}: ${currentEntity.name}`);
    }
  }
  
  console.log(`\n✅ Total importés: ${imported}`);
}

const filePath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\SCRIPTS_UTILES\\assurances.txt';
importFile(filePath);