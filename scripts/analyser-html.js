const fs = require('fs');
const path = require('path');
const readline = require('readline');

const HTML_FILE = path.join(__dirname, '..', 'algerie-exportateurs conv.html');

async function analyserHTML() {
  console.log("\n🔍 ANALYSE DU FICHIER HTML (sans tout charger en mémoire)\n");
  
  const fileStream = fs.createReadStream(HTML_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNum = 0;
  let sections = {
    h1: [],
    h2: [],
    tables: [],
    infosPratiques: false,
    index: false,
    secteurs: false
  };
  
  console.log("Lecture ligne par ligne...\n");
  
  for await (const line of rl) {
    lineNum++;
    
    // Chercher les titres principaux
    if (line.includes('<h1')) {
      const match = line.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const titre = match ? match[1].substring(0, 50) : '...';
      sections.h1.push({ ligne: lineNum, titre });
      console.log(`📌 H1 à ligne ${lineNum}: ${titre}`);
    }
    
    // Chercher les sous-titres
    if (line.includes('<h2')) {
      const match = line.match(/<h2[^>]*>(.*?)<\/h2>/i);
      const titre = match ? match[1].substring(0, 50) : '...';
      sections.h2.push({ ligne: lineNum, titre });
      console.log(`   H2 à ligne ${lineNum}: ${titre}`);
    }
    
    // Chercher les tableaux
    if (line.includes('<table')) {
      sections.tables.push(lineNum);
    }
    
    // Détection des sections importantes
    if (line.includes('Infos Pratiques') || line.includes('Adresses Utiles')) {
      sections.infosPratiques = lineNum;
    }
    if (line.includes('INDEX ALPHABÉTIQUE')) {
      sections.index = lineNum;
    }
    if (line.includes('LISTE DES ENTREPRISES')) {
      sections.secteurs = lineNum;
    }
    
    // Afficher progression tous les 10000 lignes
    if (lineNum % 10000 === 0) {
      console.log(`📊 ${lineNum} lignes analysées...`);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 RAPPORT D'ANALYSE");
  console.log("=".repeat(60));
  console.log(`📄 Total lignes: ${lineNum}`);
  console.log(`📌 Titres H1 trouvés: ${sections.h1.length}`);
  console.log(`📌 Sous-titres H2 trouvés: ${sections.h2.length}`);
  console.log(`📊 Tableaux trouvés: ${sections.tables.length}`);
  console.log("-".repeat(60));
  
  if (sections.infosPratiques) {
    console.log(`✅ Infos Pratiques détectées à la ligne ${sections.infosPratiques}`);
  }
  if (sections.index) {
    console.log(`✅ Index détecté à la ligne ${sections.index}`);
  }
  if (sections.secteurs) {
    console.log(`✅ Secteurs détectés à la ligne ${sections.secteurs}`);
  }
  
  console.log("\n📌 Premiers titres H1 trouvés:");
  sections.h1.slice(0, 10).forEach(h => {
    console.log(`   Ligne ${h.ligne}: ${h.titre}`);
  });
  
  console.log("\n📌 Premiers sous-titres H2 trouvés:");
  sections.h2.slice(0, 20).forEach(h => {
    console.log(`   Ligne ${h.ligne}: ${h.titre}`);
  });
}

analyserHTML().catch(console.error);