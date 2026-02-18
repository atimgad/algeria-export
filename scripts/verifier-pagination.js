const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'algerie-exportateurs.pdf');

async function verifierPagination() {
  console.log("\n🔍 VÉRIFICATION DE LA PAGINATION\n");
  
  if (!fs.existsSync(PDF_PATH)) {
    console.log(`❌ Fichier non trouvé: ${PDF_PATH}`);
    return;
  }
  
  const dataBuffer = fs.readFileSync(PDF_PATH);
  console.log(`✅ Fichier chargé: ${(dataBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  
  const pdfData = await pdf(dataBuffer);
  const texte = pdfData.text;
  
  // Chercher les numéros de page dans le texte
  // Format typique: "12" ou "12 " ou "12\n" en début/fin de page
  const regexPages = /\n\s*(\d{1,3})\s*\n/g;
  const numerosPages = [];
  let match;
  
  while ((match = regexPages.exec(texte)) !== null) {
    numerosPages.push(parseInt(match[1]));
  }
  
  console.log(`📄 ${numerosPages.length} numéros de page détectés`);
  console.log(`📄 Pages trouvées: ${numerosPages.slice(0, 20).join(', ')}...`);
  
  // Découper le texte par numéros de page
  const pages = [];
  let dernierIndex = 0;
  
  regexPages.lastIndex = 0;
  while ((match = regexPages.exec(texte)) !== null) {
    const debutPage = dernierIndex;
    const finPage = match.index;
    const contenuPage = texte.substring(debutPage, finPage).trim();
    
    if (contenuPage.length > 0) {
      pages.push({
        numero: parseInt(match[1]),
        contenu: contenuPage
      });
    }
    
    dernierIndex = match.index + match[0].length;
  }
  
  // Dernière page
  if (dernierIndex < texte.length) {
    pages.push({
      numero: (numerosPages[numerosPages.length - 1] || 0) + 1,
      contenu: texte.substring(dernierIndex).trim()
    });
  }
  
  console.log(`📄 ${pages.length} pages extraites\n`);
  
  // Analyser chaque page
  for (let i = 0; i < Math.min(pages.length, 10); i++) {
    const page = pages[i];
    const debutContenu = page.contenu.substring(0, 200).replace(/\n/g, ' ');
    
    console.log(`📄 Page ${page.numero}:`);
    console.log(`   ${debutContenu}...`);
    console.log('');
  }
  
  console.log(`\n📊 Statistiques:`);
  console.log(`   Nombre total de pages: ${pages.length}`);
  console.log(`   Première page: ${pages[0]?.numero || '?'}`);
  console.log(`   Dernière page: ${pages[pages.length-1]?.numero || '?'}`);
  
  // Chercher les sections par mots-clés
  const sections = {
    infosPratiques: [],
    index: [],
    secteurs: [],
    publicites: []
  };
  
  for (const page of pages) {
    const contenu = page.contenu.substring(0, 500);
    
    if (contenu.includes('Ministère') || contenu.includes('Banque') || contenu.includes('Ambassade')) {
      sections.infosPratiques.push(page.numero);
    }
    if (contenu.includes('INDEX ALPHABÉTIQUE') || contenu.includes('ALPHABETICAL INDEX')) {
      sections.index.push(page.numero);
    }
    if (contenu.includes('SECTEUR') || contenu.includes('SECTOR')) {
      sections.secteurs.push(page.numero);
    }
    if (contenu.includes('SARL') || contenu.includes('SPA') || contenu.includes('Tél:')) {
      sections.publicites.push(page.numero);
    }
  }
  
  console.log(`\n📊 Sections détectées:`);
  console.log(`   Infos pratiques: pages ${sections.infosPratiques.slice(0, 10).join(', ')}...`);
  console.log(`   Index: pages ${sections.index.join(', ')}`);
  console.log(`   Secteurs: pages ${sections.secteurs.slice(0, 10).join(', ')}...`);
  console.log(`   Publicités: pages ${sections.publicites.slice(0, 10).join(', ')}...`);
}

verifierPagination().catch(console.error);