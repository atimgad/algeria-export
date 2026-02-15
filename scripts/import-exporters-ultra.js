const fs = require('fs');
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[^\x20-\x7EÀ-ÿ\s]/g, ' ') // Garder caractères imprimables
    .replace(/\s+/g, ' ')                // Espaces uniques
    .replace(/[®™©]/g, '')               // Enlever symboles
    .trim();
}

async function parsePDF(filePath) {
  console.log('📄 Lecture du PDF...');
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

function extractAllCompanies(text) {
  console.log('🔍 Extraction ULTRA des entreprises...');
  
  const lines = text.split('\n');
  const companies = [];
  let currentCompany = null;
  
  // Patterns de détection
  const patterns = {
    // Nom d'entreprise (majuscules, suivi de sarl/spa/etc.)
    companyStart: /^([A-Z][A-Z\s\-'.,]{3,})\s*[,;]\s*(sarl|spa|eurl|ets|snc|epic|epe\/spa|eurl|sarl|snc)/i,
    
    // Téléphone
    phone: /(?:Tél|Tel|Ph|Pho|Mobile)[:\s]*[+]?(\d[\d\s\-\(\)]{5,})/i,
    
    // Fax
    fax: /Fax[:\s]*([^,\n]+)/i,
    
    // Email
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    
    // Site web
    website: /(?:www\.|https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    
    // Adresse
    address: /(?:rue|boulevard|avenue|cité|zone|route|bp|lot|h[âa]i|ville|commune|b\.p|sidi|tolga|biskra|alger|oran|constantine|annaba|setif|blida|tizi|ouargla|ghardaia)/i,
    
    // Produit
    product: /(?:Produit|Product|Produits|Products)[:\s]*[:]?\s*(.+)/i
  };

  let lineCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = cleanText(rawLine);
    lineCount++;
    
    if (lineCount % 1000 === 0) {
      console.log(`   Analyse ligne ${lineCount}/${lines.length}...`);
    }
    
    // Détecter début d'entreprise
    const startMatch = line.match(patterns.companyStart);
    if (startMatch && !currentCompany) {
      if (currentCompany) companies.push(currentCompany);
      
      currentCompany = {
        name: cleanText(startMatch[1]),
        company_type: startMatch[2].toLowerCase(),
        address: '',
        phone: '',
        fax: '',
        email: '',
        website: '',
        products: [],
        raw_lines: [line]
      };
      continue;
    }
    
    // Si on a une entreprise en cours
    if (currentCompany) {
      currentCompany.raw_lines.push(line);
      
      // Téléphone
      if (!currentCompany.phone) {
        const phoneMatch = line.match(patterns.phone);
        if (phoneMatch) {
          currentCompany.phone = cleanText(phoneMatch[0].replace(/^(Tél|Tel|Ph|Pho|Mobile)[:\s]*/i, ''));
        }
      }
      
      // Fax
      if (!currentCompany.fax) {
        const faxMatch = line.match(patterns.fax);
        if (faxMatch) {
          currentCompany.fax = cleanText(faxMatch[1]);
        }
      }
      
      // Email
      if (!currentCompany.email) {
        const emailMatch = line.match(patterns.email);
        if (emailMatch) {
          currentCompany.email = emailMatch[0];
        }
      }
      
      // Website
      if (!currentCompany.website) {
        const webMatch = line.match(patterns.website);
        if (webMatch) {
          currentCompany.website = webMatch[0];
        }
      }
      
      // Adresse (accumuler)
      if (line.match(patterns.address) && !line.match(/@|www|http|Tél|Fax|Mobile|Produit|Product/)) {
        if (!currentCompany.address) {
          currentCompany.address = line;
        } else if (currentCompany.address.length < 300) {
          currentCompany.address += ' ' + line;
        }
      }
      
      // Produits
      const productMatch = line.match(patterns.product);
      if (productMatch) {
        const products = productMatch[1].split(/[•,;]/)
          .map(p => cleanText(p))
          .filter(p => p && p.length > 2 && !p.match(/^(www|http|@)/));
        
        currentCompany.products.push(...products);
      }
      
      // Fin d'entreprise (ligne vide suivie d'une nouvelle majuscule)
      if (line === '' && i < lines.length - 1) {
        const nextLine = cleanText(lines[i + 1]);
        if (nextLine.match(patterns.companyStart)) {
          companies.push({...currentCompany});
          currentCompany = null;
        }
      }
    }
  }
  
  // Ajouter la dernière
  if (currentCompany) {
    companies.push(currentCompany);
  }
  
  console.log(`✅ ${companies.length} entreprises potentielles trouvées`);
  return companies;
}

async function importAll() {
  console.log('='.repeat(50));
  console.log('🚀 IMPORT ULTRA DES EXPORTATEURS');
  console.log('='.repeat(50));
  
  try {
    // Lire PDF
    const pdfPath = 'C:\\Users\\User\\Documents\\Projet AlgeriaExport\\PDF Files for Exporters\\algerie-exportateurs.pdf';
    const text = await parsePDF(pdfPath);
    
    // Extraire entreprises
    const companies = extractAllCompanies(text);
    
    // Filtrer pour garder seulement les vraies entreprises
    const validCompanies = companies.filter(c => 
      c.name && 
      c.name.length > 5 && 
      !c.name.match(/^(Page|INDEX|TABLE|CONTENTS|FOREWORD|PREFACE|USEFUL|CHAMBER|MINISTRY)/i) &&
      c.name.length < 100
    );
    
    console.log(`\n📊 Statistiques:`);
    console.log(`   - Total brut: ${companies.length}`);
    console.log(`   - Valides: ${validCompanies.length}`);
    
    // Afficher les 10 premières
    console.log('\n📝 Exemples (10 premières):');
    validCompanies.slice(0, 10).forEach((c, i) => {
      console.log(`   ${i+1}. ${c.name} (${c.company_type || '?'})`);
      if (c.products.length > 0) {
        console.log(`      Produits: ${c.products.slice(0, 2).join(', ')}${c.products.length > 2 ? '...' : ''}`);
      }
    });
    
    // Vider la table
    console.log('\n🧹 Nettoyage de la table...');
    await supabase.from('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Import par lots
    console.log('\n📦 Import dans Supabase...');
    const BATCH_SIZE = 50;
    let imported = 0;
    let errors = 0;
    
    for (let i = 0; i < validCompanies.length; i += BATCH_SIZE) {
      const batch = validCompanies.slice(i, i + BATCH_SIZE);
      const batchData = batch.map(c => ({
        name: c.name.substring(0, 255),
        company_type: c.company_type ? c.company_type.substring(0, 50) : null,
        address: c.address ? c.address.substring(0, 500) : null,
        phone: c.phone ? c.phone.substring(0, 100) : null,
        fax: c.fax ? c.fax.substring(0, 100) : null,
        email: c.email ? c.email.substring(0, 255) : null,
        website: c.website ? c.website.substring(0, 255) : null,
        products: c.products.slice(0, 10).map(p => p.substring(0, 200)),
        activity_sector: 'À déterminer'
      }));
      
      const { error } = await supabase
        .from('exporters')
        .insert(batchData);
      
      if (error) {
        console.error(`❌ Lot ${i/BATCH_SIZE + 1} erreur:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
        console.log(`   ✅ Lot ${i/BATCH_SIZE + 1}/${Math.ceil(validCompanies.length/BATCH_SIZE)}: ${batch.length} entreprises importées (total: ${imported})`);
      }
      
      // Pause pour éviter de surcharger
      await new Promise(r => setTimeout(r, 100));
    }
    
    console.log('\n='.repeat(50));
    console.log('📊 RÉSUMÉ FINAL');
    console.log('='.repeat(50));
    console.log(`   ✅ Importées : ${imported}`);
    console.log(`   ❌ En erreur : ${errors}`);
    console.log(`   📝 Total entreprises : ${validCompanies.length}`);
    
    // Réactiver RLS
    console.log('\n🔒 Réactivation de la sécurité RLS...');
    await supabase.rpc('enable_rls_on_exporters');
    
    console.log('\n🎉 IMPORT TERMINÉ AVEC SUCCÈS !');
    
  } catch (err) {
    console.error('❌ Erreur fatale:', err);
  }
}

importAll();