const fs = require('fs');
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialiser Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Nettoyer une chaîne de caractères
function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/[^\x20-\x7EÀ-ÿ]/g, ' ') // Garder les caractères imprimables
    .replace(/\s+/g, ' ') // Remplacer les espaces multiples
    .trim();
}

// Extraire les entreprises du texte
function extractCompanies(text) {
  const lines = text.split('\n');
  const companies = [];
  let currentCompany = null;
  
  console.log('🔍 Analyse du texte...');
  
  // Patterns pour détecter les entreprises
  const patterns = {
    name: /^([A-Z][A-Z\s\-'.,]{3,})(?:\s*[,]\s*|\s+)(sarl|spa|eurl|ets|snc|epic|epe\/spa)/i,
    phone: /(?:Tél|Tel|Ph|Pho|Mobile)[:\s]*[+]?(\d[\d\s\-\(\)]{5,})/i,
    fax: /Fax[:\s]*([^,\n]+)/i,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    website: /(?:www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    address: /(?:rue|boulevard|avenue|cité|zone|route|bp|lot|h[âa]i|ville|commune|b\.p|sidi)/i
  };

  for (let i = 0; i < lines.length; i++) {
    const line = cleanString(lines[i]);
    if (line.length < 2) continue;
    
    // Chercher les noms d'entreprises (souvent en majuscules)
    if (line.match(/^[A-Z][A-Z\s\-'.,]{5,}/) && line.length < 100) {
      // Sauvegarder l'entreprise précédente
      if (currentCompany && currentCompany.name) {
        companies.push({...currentCompany});
      }
      
      // Nouvelle entreprise
      const nameMatch = line.match(patterns.name);
      currentCompany = {
        name: line,
        company_type: nameMatch ? nameMatch[2].toLowerCase() : null,
        address: '',
        phone: '',
        fax: '',
        email: '',
        website: '',
        products: [],
        activity_sector: 'À déterminer',
        raw: []
      };
    }
    
    // Si on a une entreprise en cours, on collecte les infos
    if (currentCompany) {
      // Type d'entreprise si pas trouvé
      if (!currentCompany.company_type) {
        const typeMatch = line.match(/\b(sarl|spa|eurl|ets|snc|epic|epe\/spa)\b/i);
        if (typeMatch) {
          currentCompany.company_type = typeMatch[1].toLowerCase();
        }
      }
      
      // Téléphone
      if (!currentCompany.phone) {
        const phoneMatch = line.match(patterns.phone);
        if (phoneMatch) {
          currentCompany.phone = phoneMatch[0].replace(/^(Tél|Tel|Ph|Pho|Mobile)[:\s]*/i, '').trim();
        }
      }
      
      // Fax
      if (!currentCompany.fax) {
        const faxMatch = line.match(patterns.fax);
        if (faxMatch) {
          currentCompany.fax = faxMatch[1].trim();
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
      
      // Adresse (si la ligne contient des mots d'adresse)
      if (line.match(patterns.address) && !line.match(/@|www|http|Tél|Fax|Mobile/)) {
        if (!currentCompany.address) {
          currentCompany.address = line;
        } else if (currentCompany.address.length < 200) {
          currentCompany.address += ' ' + line;
        }
      }
      
      // Produits
      if (line.match(/Produit:|Product:|Produits:|Products:/i)) {
        const productLine = line.replace(/Produit:|Product:|Produits:|Products:/i, '').trim();
        if (productLine) {
          const products = productLine.split(/[•,;]/)
            .map(p => cleanString(p))
            .filter(p => p && p.length > 2);
          currentCompany.products = [...currentCompany.products, ...products];
        }
      }
    }
  }
  
  // Ajouter la dernière entreprise
  if (currentCompany && currentCompany.name) {
    companies.push({...currentCompany});
  }
  
  // Filtrer les entreprises valides
  return companies.filter(c => 
    c.name && 
    c.name.length > 5 && 
    !c.name.includes('Page') &&
    !c.name.includes('INDEX')
  );
}

async function importCompanies() {
  console.log('🚀 Début de l\'import...');
  
  const pdfPath = 'C:\\Users\\User\\Documents\\Projet AlgeriaExport\\PDF Files for Exporters\\algerie-exportateurs.pdf';
  
  try {
    // Lire le PDF
    console.log('📄 Lecture du PDF...');
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log(`✅ Fichier lu: ${Math.round(dataBuffer.length / 1024 / 1024 * 10) / 10} MB`);
    
    const data = await pdf(dataBuffer);
    console.log(`✅ PDF parsé: ${Math.round(data.text.length / 1000)}K caractères`);
    
    // Extraire les entreprises
    console.log('🔍 Extraction des entreprises...');
    const companies = extractCompanies(data.text);
    console.log(`✅ ${companies.length} entreprises extraites`);
    
    // Afficher les 5 premières
    console.log('\n📝 Exemples d\'entreprises trouvées:');
    companies.slice(0, 5).forEach((c, i) => {
      console.log(`   ${i+1}. ${c.name.substring(0, 50)}...`);
    });
    
    // Vider la table existante
    console.log('\n🧹 Nettoyage de la table...');
    const { error: deleteError } = await supabase
      .from('exporters')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.log('⚠️  Impossible de vider la table (peut-être vide)');
    } else {
      console.log('✅ Table vidée');
    }
    
    // Importer les entreprises
    console.log('\n📦 Import dans Supabase...');
    let imported = 0;
    let errors = 0;
    
    for (let i = 0; i < Math.min(companies.length, 500); i++) {
      const company = companies[i];
      
      // Préparer les données
      const cleanData = {
        name: cleanString(company.name).substring(0, 255),
        company_type: company.company_type ? cleanString(company.company_type) : null,
        address: company.address ? cleanString(company.address).substring(0, 500) : null,
        phone: company.phone ? cleanString(company.phone).substring(0, 100) : null,
        fax: company.fax ? cleanString(company.fax).substring(0, 100) : null,
        email: company.email ? cleanString(company.email).substring(0, 255) : null,
        website: company.website ? cleanString(company.website).substring(0, 255) : null,
        products: company.products.slice(0, 10).map(p => cleanString(p).substring(0, 100)),
        activity_sector: 'À déterminer'
      };
      
      // Ne garder que les entreprises avec un nom valide
      if (cleanData.name && cleanData.name.length > 3) {
        try {
          const { error } = await supabase
            .from('exporters')
            .insert([cleanData]);
          
          if (error) {
            console.error(`❌ Erreur: ${error.message.substring(0, 100)}`);
            errors++;
          } else {
            imported++;
            if (imported % 10 === 0) {
              console.log(`   ${imported}/${Math.min(companies.length, 500)} entreprises importées...`);
            }
          }
        } catch (err) {
          errors++;
        }
      }
    }
    
    console.log('\n📊 Résumé final :');
    console.log(`   ✅ Importées : ${imported}`);
    console.log(`   ❌ En erreur : ${errors}`);
    console.log(`   📝 Total extraites : ${companies.length}`);
    
    // Vérifier les données importées
    const { data: checkData, error: checkError } = await supabase
      .from('exporters')
      .select('count', { count: 'exact', head: true });
    
    console.log(`   📊 Dans la base : ${checkData || '?'} entreprises`);
    
  } catch (err) {
    console.error('❌ Erreur fatale:', err.message);
    console.error(err);
  }
}

// Exécuter
importCompanies();