const fs = require('fs');
const pdfParse = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialiser Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

function extractCompanies(text) {
  const lines = text.split('\n');
  const companies = [];
  let currentCompany = null;
  
  console.log('📝 Analyse du texte...');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Ignorer les lignes trop courtes ou vides
    if (line.length < 3) continue;
    
    // Chercher les motifs d'entreprises (nom en majuscules)
    if (line.match(/^[A-Z][A-Z\s\-'.,]{5,}/) && line.length < 100) {
      // Sauvegarder l'entreprise précédente
      if (currentCompany && currentCompany.name) {
        companies.push({...currentCompany});
      }
      
      // Nouvelle entreprise
      currentCompany = {
        name: line,
        company_type: '',
        address: '',
        phone: '',
        fax: '',
        email: '',
        website: '',
        products: [],
        activity_sector: 'À déterminer',
        raw_lines: []
      };
    }
    
    // Si on a une entreprise en cours, on collecte les infos
    if (currentCompany) {
      currentCompany.raw_lines.push(line);
      
      // Type d'entreprise (sarl, spa, eurl, etc.)
      if (!currentCompany.company_type) {
        const typeMatch = line.match(/\b(sarl|spa|eurl|ets|snc|epic|epe\/spa)\b/i);
        if (typeMatch) {
          currentCompany.company_type = typeMatch[1].toLowerCase();
        }
      }
      
      // Téléphone
      if (!currentCompany.phone) {
        const phoneMatch = line.match(/(?:Tél|Tel|Ph|Pho|Mobile)[:\s]*[+]?(\d[\d\s\-\(\)]{5,})/i);
        if (phoneMatch) {
          currentCompany.phone = phoneMatch[0].replace(/^(Tél|Tel|Ph|Pho|Mobile)[:\s]*/i, '').trim();
        }
      }
      
      // Fax
      if (!currentCompany.fax) {
        const faxMatch = line.match(/Fax[:\s]*([^,\n]+)/i);
        if (faxMatch) {
          currentCompany.fax = faxMatch[1].trim();
        }
      }
      
      // Email
      if (!currentCompany.email) {
        const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          currentCompany.email = emailMatch[0];
        }
      }
      
      // Website
      if (!currentCompany.website) {
        const webMatch = line.match(/(?:www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (webMatch) {
          currentCompany.website = webMatch[0];
        }
      }
      
      // Adresse
      if (line.match(/rue|boulevard|avenue|cité|zone|route|bp|lot|h[âa]i|ville|commune|b\.p|sidi|tolga|biskra|alger|oran|constantine/i) && 
          !line.match(/@|www|http|Tél|Fax|Mobile/)) {
        if (!currentCompany.address) {
          currentCompany.address = line;
        } else if (currentCompany.address.length < 100) {
          currentCompany.address += ' ' + line;
        }
      }
      
      // Produits
      if (line.match(/Produit:|Product:|Produits:|Products:/i)) {
        const productLine = line.replace(/Produit:|Product:|Produits:|Products:/i, '').trim();
        if (productLine) {
          const products = productLine.split(/[•,;]/).map(p => p.trim()).filter(p => p && p.length > 0);
          currentCompany.products = [...currentCompany.products, ...products];
        }
      }
    }
  }
  
  // Ajouter la dernière entreprise
  if (currentCompany && currentCompany.name) {
    companies.push({...currentCompany});
  }
  
  console.log(`   ${companies.length} entreprises potentielles trouvées`);
  return companies;
}

async function importCompanies() {
  console.log('📄 Lecture du PDF...');
  const pdfPath = 'C:\\Users\\User\\Documents\\Projet AlgeriaExport\\PDF Files for Exporters\\algerie-exportateurs.pdf';
  
  try {
    const text = await parsePDF(pdfPath);
    console.log(`📄 PDF lu, ${text.length} caractères`);
    
    console.log('🔍 Extraction des entreprises...');
    const companies = extractCompanies(text);
    
    console.log('📦 Import dans Supabase...');
    let imported = 0;
    let errors = 0;
    
    for (const company of companies) {
      // Nettoyer les données
      const cleanCompany = {
        name: company.name.substring(0, 255),
        company_type: company.company_type || null,
        address: company.address ? company.address.substring(0, 500) : null,
        phone: company.phone ? company.phone.substring(0, 100) : null,
        fax: company.fax ? company.fax.substring(0, 100) : null,
        email: company.email ? company.email.substring(0, 255) : null,
        website: company.website ? company.website.substring(0, 255) : null,
        products: company.products.slice(0, 20), // Limiter à 20 produits
        activity_sector: 'À déterminer'
      };
      
      // Ne garder que les entreprises avec un nom valide
      if (cleanCompany.name && cleanCompany.name.length > 3) {
        try {
          const { error } = await supabase
            .from('exporters')
            .insert([cleanCompany]);
          
          if (error) {
            if (!error.message.includes('duplicate')) {
              console.error(`❌ Erreur: ${error.message.substring(0, 100)}`);
              errors++;
            }
          } else {
            imported++;
            if (imported % 5 === 0) {
              console.log(`   ${imported} entreprises importées...`);
            }
          }
        } catch (err) {
          errors++;
        }
      }
    }
    
    console.log('\n📊 Résumé de l\'import :');
    console.log(`   ✅ Importées : ${imported}`);
    console.log(`   ❌ En erreur : ${errors}`);
    console.log(`   📝 Total trouvées : ${companies.length}`);
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

// Exécuter l'import
importCompanies();