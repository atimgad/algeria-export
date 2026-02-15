const fs = require('fs');
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importCompanies() {
  console.log('🚀 Début de l\'import simple...');
  
  const pdfPath = 'C:\\Users\\User\\Documents\\Projet AlgeriaExport\\PDF Files for Exporters\\algerie-exportateurs.pdf';
  
  try {
    // Lire le PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    
    console.log(`📄 PDF chargé: ${Math.round(text.length / 1000)}K caractères`);
    
    // Découper par lignes
    const lines = text.split('\n');
    console.log(`📝 ${lines.length} lignes`);
    
    // Chercher les entreprises (lignes avec sarl, spa, eurl, etc.)
    const companies = [];
    const patterns = /(sarl|spa|eurl|ets|snc|epic|epe\/spa)/i;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Si la ligne contient un type d'entreprise
      if (line.match(patterns) && line.length > 10 && line.length < 200) {
        // Extraire le nom (avant le type)
        const typeMatch = line.match(patterns);
        const type = typeMatch[0].toLowerCase();
        const name = line.substring(0, line.indexOf(typeMatch[0])).trim();
        
        if (name && name.length > 3) {
          companies.push({
            name: name.replace(/[^a-zA-Z0-9\s\-'.]/g, '').trim(),
            company_type: type,
            raw: line
          });
        }
      }
    }
    
    console.log(`✅ ${companies.length} entreprises trouvées`);
    
    // Afficher les 20 premières
    console.log('\n📝 Exemples:');
    companies.slice(0, 20).forEach((c, i) => {
      console.log(`${i+1}. ${c.name} (${c.company_type})`);
    });
    
    // Vider la table
    console.log('\n🧹 Nettoyage de la table...');
    await supabase.from('exporters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Import par lots
    console.log('\n📦 Import...');
    const BATCH_SIZE = 50;
    let imported = 0;
    
    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
      const batch = companies.slice(i, i + BATCH_SIZE);
      const batchData = batch.map(c => ({
        name: c.name.substring(0, 255),
        company_type: c.company_type,
        products: []
      }));
      
      const { error } = await supabase
        .from('exporters')
        .insert(batchData);
      
      if (error) {
        console.error(`❌ Erreur lot ${i/BATCH_SIZE + 1}:`, error.message);
      } else {
        imported += batch.length;
        console.log(`   ✅ Lot ${i/BATCH_SIZE + 1}: ${batch.length} (total: ${imported})`);
      }
    }
    
    console.log(`\n🎉 Import terminé: ${imported} entreprises`);
    
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

importCompanies();