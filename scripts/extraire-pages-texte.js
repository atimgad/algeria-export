const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'algerie-exportateurs.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'exportateurs_pages.txt');

async function extrairePages() {
  console.log("\n📄 EXTRACTION PAGE PAR PAGE VERS FICHIER TEXTE\n");
  
  if (!fs.existsSync(PDF_PATH)) {
    console.log(`❌ Fichier non trouvé: ${PDF_PATH}`);
    return;
  }
  
  const dataBuffer = fs.readFileSync(PDF_PATH);
  console.log(`✅ Fichier chargé: ${(dataBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  
  const pdfData = await pdf(dataBuffer);
  const texte = pdfData.text;
  
  // Détecter les numéros de page
  const regexPages = /\n\s*(\d{1,3})\s*\n/g;
  const positions = [];
  let match;
  
  while ((match = regexPages.exec(texte)) !== null) {
    positions.push({
      numero: parseInt(match[1]),
      index: match.index
    });
  }
  
  console.log(`📄 ${positions.length} numéros de page détectés\n`);
  
  // Trier par index
  positions.sort((a, b) => a.index - b.index);
  
  // Ouvrir le fichier de sortie
  let output = "";
  let pagesExtraites = 0;
  
  // Extraire chaque page
  for (let i = 0; i < positions.length; i++) {
    const debut = positions[i].index;
    const fin = (i < positions.length - 1) ? positions[i + 1].index : texte.length;
    const contenuPage = texte.substring(debut, fin).trim();
    
    // Nettoyer le contenu
    const contenuPropre = contenuPage
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    output += `\n${'='.repeat(80)}\n`;
    output += `PAGE ${positions[i].numero}\n`;
    output += `${'='.repeat(80)}\n\n`;
    output += contenuPropre;
    output += `\n\n${'-'.repeat(80)}\n`;
    
    pagesExtraites++;
    
    if (i % 50 === 0) {
      console.log(`   Page ${positions[i].numero} extraite...`);
    }
  }
  
  // Écrire le fichier
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  
  console.log(`\n✅ ${pagesExtraites} pages extraites avec succès!`);
  console.log(`📁 Fichier créé: ${OUTPUT_PATH}`);
  console.log(`📊 Taille du fichier: ${(output.length / 1024 / 1024).toFixed(2)} MB`);
}

extrairePages().catch(console.error);