// scripts/import-from-pdf.js
const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractPdf() {
  console.log('📖 Lecture du PDF...');
  
  const pdfPath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\DOCUMENTS\\backup_docs\\algerie-exportateurs.pdf';
  
  // Vérifier que le fichier existe
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ Fichier PDF non trouvé!');
    return;
  }
  
  const dataBuffer = fs.readFileSync(pdfPath);
  console.log(`📊 Taille du PDF: ${dataBuffer.length} bytes`);
  
  const data = await pdfParse(dataBuffer);
  const text = data.text;
  
  // Sauvegarder le texte extrait
  const outputPath = 'scripts/pdf-extract.txt';
  fs.writeFileSync(outputPath, text);
  
  console.log(`✅ PDF extrait dans ${outputPath}`);
  console.log(`📊 ${text.length} caractères`);
  console.log(`📊 ${text.split('\n').length} lignes`);
  
  // Afficher les 20 premières lignes
  const lines = text.split('\n').slice(0, 20);
  console.log('\n📋 Premières lignes:');
  lines.forEach((line, i) => {
    console.log(`${i + 1}: ${line.substring(0, 80)}`);
  });
}

extractPdf().catch(console.error);