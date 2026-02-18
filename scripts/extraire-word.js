const fs = require('fs');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

// Configuration - Chemin corrigé vers le fichier Word
const FICHIER_WORD = 'C:/Users/User/Documents/Projet AlgeriaExport/algeria-export/Exportateurs en texte.docx';
const SORTIE_TEXTE = 'exportateurs-word.txt';
const SORTIE_EXCEL = 'exportateurs-word.xlsx';
const SORTIE_JSON = 'exportateurs-word.json';

async function extraireWord() {
    console.log('📖 Lecture du fichier Word...');
    console.log(`📁 Chemin : ${FICHIER_WORD}`);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(FICHIER_WORD)) {
        console.log('❌ Fichier Word introuvable !');
        console.log('\nVérifie que le fichier est bien à cet emplacement :');
        console.log(FICHIER_WORD);
        return;
    }
    
    // Convertir le Word en texte
    console.log('🔄 Conversion en cours...');
    const resultat = await mammoth.extractRawText({ path: FICHIER_WORD });
    const texte = resultat.value;
    
    console.log(`✅ Texte extrait : ${texte.length} caractères`);
    
    // Sauvegarder le texte brut
    fs.writeFileSync(SORTIE_TEXTE, texte);
    console.log(`💾 Texte sauvegardé : ${SORTIE_TEXTE}`);
    
    // Découper le texte en lignes
    const lignes = texte.split('\n').filter(l => l.trim() !== '');
    
    console.log(`📊 Statistiques :`);
    console.log(`   - ${lignes.length} lignes non vides`);
    
    // Compter les différents types d'entités
    let ministeres = 0;
    let organismes = 0;
    let entreprises = 0;
    let associations = 0;
    let chambres = 0;
    
    lignes.forEach(ligne => {
        const l = ligne.toLowerCase();
        if (l.includes('ministère')) ministeres++;
        if (l.includes('agence') || l.includes('centre') || l.includes('office')) organismes++;
        if (l.includes('sarl') || l.includes('spa') || l.includes('eurl') || l.includes('snc')) entreprises++;
        if (l.includes('association')) associations++;
        if (l.includes('chambre')) chambres++;
    });
    
    console.log(`\n📊 Détail par catégorie :`);
    console.log(`   🏛️  Ministères : ${ministeres}`);
    console.log(`   🏢 Organismes : ${organismes}`);
    console.log(`   🏭 Entreprises : ${entreprises}`);
    console.log(`   🤝 Associations : ${associations}`);
    console.log(`   🏛️  Chambres : ${chambres}`);
    
    // Sauvegarder en JSON
    const stats = {
        total_lignes: lignes.length,
        ministeres: ministeres,
        organismes: organismes,
        entreprises: entreprises,
        associations: associations,
        chambres: chambres,
        texte_complet: texte.substring(0, 500) + '...'
    };
    
    fs.writeFileSync(SORTIE_JSON, JSON.stringify(stats, null, 2));
    console.log(`\n💾 JSON sauvegardé : ${SORTIE_JSON}`);
    
    // Créer un Excel avec toutes les lignes
    console.log('\n📊 Création du fichier Excel...');
    const wb = XLSX.utils.book_new();
    const ws_data = [['N°', 'Contenu']];
    
    lignes.forEach((ligne, index) => {
        ws_data.push([index + 1, ligne]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Exportateurs');
    XLSX.writeFile(wb, SORTIE_EXCEL);
    
    console.log(`✅ Excel créé : ${SORTIE_EXCEL}`);
    console.log(`\n📂 Fichiers générés :`);
    console.log(`   📁 ${SORTIE_TEXTE}`);
    console.log(`   📁 ${SORTIE_EXCEL}`);
    console.log(`   📁 ${SORTIE_JSON}`);
    console.log(`\n👉 Ouvre ${SORTIE_EXCEL} avec Excel pour voir le résultat`);
}

extraireWord().catch(console.error);