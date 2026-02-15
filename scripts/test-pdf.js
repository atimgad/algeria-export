const fs = require('fs');
const pdf = require('pdf-parse');

async function testPDF() {
  console.log('📄 Test de lecture PDF...');
  
  const pdfPath = 'C:\\Users\\User\\Documents\\Projet AlgeriaExport\\PDF Files for Exporters\\algerie-exportateurs.pdf';
  
  try {
    console.log('Chemin du fichier:', pdfPath);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfPath)) {
      console.error('❌ Le fichier n\'existe pas!');
      return;
    }
    
    const stats = fs.statSync(pdfPath);
    console.log('✅ Fichier trouvé, taille:', stats.size, 'bytes');
    
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log('✅ Fichier lu, buffer size:', dataBuffer.length, 'bytes');
    
    console.log('🔄 Tentative de parsing PDF...');
    const data = await pdf(dataBuffer);
    console.log('✅ PDF parsé avec succès!');
    console.log('📝 Nombre de caractères:', data.text.length);
    console.log('\n📝 Premier extrait (500 caractères):');
    console.log(data.text.substring(0, 500));
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    console.error(err);
  }
}

testPDF();