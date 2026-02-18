const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Configuration
const INPUT_TEXTE = 'texte-exportateurs.txt';
const OUTPUT_EXCEL = 'exportateurs-complet.xlsx';
const OUTPUT_JSON = 'exportateurs-brut.json';
const OUTPUT_ANOMALIES = 'anomalies-detectees.txt';

// Types de sociétés à détecter
const TYPES_SOCIETE = [
    'sarl', 'spa', 'eurl', 'snc', 'epic', 'ets', 'sarl/',
    'sarl,', 'sarl ', 'spa,', 'spa ', 'eurl,', 'eurl ',
    'snc,', 'snc ', 'sprl', 'scoop', 'sarl au capital'
];

// Structure
let entreprises = [];
let anomalies = [];
let currentSecteur = '';

// Fonction pour nettoyer les lignes
function cleanLine(line) {
    return line.replace(/\s+/g, ' ').trim();
}

// Vérifier si une ligne contient un type de société
function contientTypeSociete(line) {
    let lowerLine = line.toLowerCase();
    return TYPES_SOCIETE.some(type => lowerLine.includes(type));
}

// Analyser un numéro de téléphone
function analyserTelephone(ligne) {
    let contenu = ligne.replace(/^Tél:|^Pho:|^Fax:/i, '').trim();
    let estComplexe = false;
    let motifs = [];
    
    if (contenu.includes('/')) {
        let parties = contenu.split('/');
        if (parties.length > 2) {
            motifs.push('multiples_numéros');
            estComplexe = true;
        }
    }
    if (contenu.match(/\d+\s*(à|-)\s*\d+/)) {
        motifs.push('plage_numéros');
        estComplexe = true;
    }
    if (contenu.match(/\d{2,3}\s+\d{2,3}\s+\d{2,3}\s+\d{2,3}\s+\d{2,3}/)) {
        motifs.push('numéros_espacés');
        estComplexe = true;
    }
    if (contenu.includes('et') || contenu.includes('ou')) {
        motifs.push('texte_descriptif');
        estComplexe = true;
    }
    if (contenu.match(/\+213\s*\d{2,3}\s*\d{2,3}\s*\d{2,3}\s*\/\s*\d{3,}/)) {
        motifs.push('fixe_et_portable');
        estComplexe = true;
    }
    
    return {
        brut: contenu,
        estComplexe: estComplexe,
        motifs: motifs
    };
}

// Extraire le nom de l'entreprise (gère les noms sur plusieurs lignes)
function extraireNom(lines, startIndex) {
    let nomComplet = '';
    let i = startIndex;
    let ligneCourante = cleanLine(lines[i]);
    
    // Si la ligne contient déjà un type de société, c'est le nom complet
    if (contientTypeSociete(ligneCourante)) {
        return { nom: ligneCourante, nextIndex: i };
    }
    
    // Sinon, on accumule jusqu'à trouver un type de société
    nomComplet = ligneCourante;
    i++;
    
    while (i < lines.length) {
        let prochaineLigne = cleanLine(lines[i]);
        if (contientTypeSociete(prochaineLigne)) {
            nomComplet += ' ' + prochaineLigne;
            return { nom: nomComplet, nextIndex: i };
        }
        if (prochaineLigne.match(/^\d/) || prochaineLigne === '') {
            break;
        }
        nomComplet += ' ' + prochaineLigne;
        i++;
    }
    
    return { nom: nomComplet, nextIndex: startIndex };
}

// Fonction principale d'extraction
function parseEntreprise(lines, startIndex, secteur) {
    let entreprise = {
        secteur: secteur,
        nom: '',
        nom_brut: '',
        adresse: '',
        telephone: '',
        telephone_brut: '',
        fax: '',
        email: '',
        site: '',
        produits: []
    };

    let i = startIndex;
    
    // Extraction du nom (gestion multi-lignes)
    let resultNom = extraireNom(lines, i);
    entreprise.nom = resultNom.nom;
    entreprise.nom_brut = resultNom.nom;
    i = resultNom.nextIndex + 1;
    
    // Sauter les lignes vides
    while (i < lines.length && cleanLine(lines[i]) === '') i++;
    
    // Adresse
    if (i < lines.length) {
        let ligneAdresse = cleanLine(lines[i]);
        if (!ligneAdresse.match(/^Tél:|^Fax:|^@:|^http:|^Produit:/i)) {
            entreprise.adresse = ligneAdresse;
            i++;
        }
    }
    
    // Collecter les autres infos
    while (i < lines.length) {
        let ligneCourante = cleanLine(lines[i]);
        
        // Détection nouvelle entreprise
        if (contientTypeSociete(ligneCourante) && ligneCourante !== entreprise.nom) {
            break;
        }
        
        if (ligneCourante.startsWith('Tél:') || ligneCourante.startsWith('Pho:')) {
            entreprise.telephone_brut = ligneCourante.replace(/Tél:|Pho:/i, '').trim();
            let analyse = analyserTelephone(ligneCourante);
            entreprise.telephone = analyse.brut;
            
            if (analyse.estComplexe) {
                anomalies.push({
                    entreprise: entreprise.nom,
                    type: 'telephone',
                    contenu: analyse.brut,
                    motifs: analyse.motifs,
                    ligne: i + 1
                });
            }
        }
        else if (ligneCourante.startsWith('Fax:')) {
            entreprise.fax = ligneCourante.replace('Fax:', '').trim();
        }
        else if (ligneCourante.startsWith('@:')) {
            entreprise.email = ligneCourante.replace('@:', '').trim();
        }
        else if (ligneCourante.startsWith('http:')) {
            entreprise.site = ligneCourante.trim();
        }
        else if (ligneCourante.startsWith('Produit:')) {
            let produit = ligneCourante.replace('Produit:', '').trim();
            if (produit) entreprise.produits.push(produit);
        }
        else if (ligneCourante !== '' && !ligneCourante.includes('Voir publicité')) {
            // Produit sur plusieurs lignes
            if (entreprise.produits.length > 0 && !ligneCourante.match(/Tél:|Fax:|@:|http:/i)) {
                entreprise.produits[entreprise.produits.length - 1] += ' ' + ligneCourante;
            }
        }
        
        i++;
    }
    
    return { entreprise, nextIndex: i };
}

// Fonction principale
function extractFromText() {
    console.log('📖 Lecture du fichier texte...');
    
    if (!fs.existsSync(INPUT_TEXTE)) {
        console.log(`❌ Fichier ${INPUT_TEXTE} introuvable`);
        console.log('\n📝 Crée d\'abord le fichier texte :');
        console.log(`1. Copie le texte complet du PDF`);
        console.log(`2. Colle-le dans un fichier nommé: ${INPUT_TEXTE}`);
        console.log(`3. Exécute ce script à nouveau`);
        return;
    }
    
    const text = fs.readFileSync(INPUT_TEXTE, 'utf8');
    const lines = text.split('\n');
    
    console.log('🔍 Analyse des entreprises...');
    console.log('📊 Recherche des types: SARL, EURL, SPA, etc.\n');
    
    let compteur = 0;
    
    for (let i = 0; i < lines.length; i++) {
        let line = cleanLine(lines[i]);
        
        // Détection des secteurs
        if (line.match(/^[A-Z\s]{10,}$/) && line.length > 15 && !line.includes('INDEX')) {
            currentSecteur = line;
            console.log(`📁 Secteur trouvé: ${currentSecteur.substring(0, 40)}...`);
            continue;
        }
        
        // Détection des entreprises
        if (contientTypeSociete(line)) {
            compteur++;
            if (compteur % 50 === 0) {
                console.log(`   ➡️ ${compteur} entreprises traitées...`);
            }
            
            const result = parseEntreprise(lines, i, currentSecteur);
            entreprises.push(result.entreprise);
            i = result.nextIndex - 1;
        }
    }
    
    console.log(`\n✅ TOTAL: ${entreprises.length} entreprises trouvées`);
    
    // Statistiques
    let stats = {
        avecTelephone: 0,
        avecEmail: 0,
        avecSite: 0,
        avecFax: 0
    };
    
    entreprises.forEach(e => {
        if (e.telephone) stats.avecTelephone++;
        if (e.email) stats.avecEmail++;
        if (e.site) stats.avecSite++;
        if (e.fax) stats.avecFax++;
    });
    
    console.log('\n📊 Statistiques:');
    console.log(`   📞 Téléphone: ${stats.avecTelephone} entreprises`);
    console.log(`   📧 Email: ${stats.avecEmail} entreprises`);
    console.log(`   🌐 Site web: ${stats.avecSite} entreprises`);
    console.log(`   📠 Fax: ${stats.avecFax} entreprises`);
    
    // Sauvegarde JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(entreprises, null, 2));
    console.log(`\n💾 JSON sauvegardé: ${OUTPUT_JSON}`);
    
    // Rapport d'anomalies
    if (anomalies.length > 0) {
        let rapport = "🔍 ANOMALIES DÉTECTÉES\n";
        rapport += "=".repeat(60) + "\n\n";
        
        // Grouper par type
        let parType = {};
        anomalies.forEach(a => {
            if (!parType[a.type]) parType[a.type] = [];
            parType[a.type].push(a);
        });
        
        for (let type in parType) {
            rapport += `\n📌 ${type.toUpperCase()} (${parType[type].length} cas)\n`;
            rapport += "-".repeat(40) + "\n";
            
            parType[type].forEach((a, idx) => {
                rapport += `  ${idx+1}. ${a.entreprise}\n`;
                rapport += `     Contenu: ${a.contenu}\n`;
                if (a.motifs) rapport += `     Motifs: ${a.motifs.join(', ')}\n`;
            });
            rapport += '\n';
        }
        
        fs.writeFileSync(OUTPUT_ANOMALIES, rapport);
        console.log(`⚠️  ${anomalies.length} anomalies détectées - voir ${OUTPUT_ANOMALIES}`);
    }
    
    // Création Excel
    console.log('\n📊 Création du fichier Excel...');
    const wb = XLSX.utils.book_new();
    const ws_data = [
        ['Secteur', 'Nom complet', 'Adresse', 'Téléphone (brut)', 'Fax', 'Email', 'Site Web', 'Produits']
    ];
    
    entreprises.forEach(e => {
        ws_data.push([
            e.secteur || '',
            e.nom || '',
            e.adresse || '',
            e.telephone_brut || e.telephone || '',
            e.fax || '',
            e.email || '',
            e.site || '',
            e.produits.join(' | ')
        ]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Exportateurs');
    XLSX.writeFile(wb, OUTPUT_EXCEL);
    
    console.log(`✅ Excel créé: ${OUTPUT_EXCEL}`);
    console.log('\n📂 Fichiers générés :');
    console.log(`   📁 ${OUTPUT_EXCEL}`);
    console.log(`   📁 ${OUTPUT_JSON}`);
    if (anomalies.length > 0) {
        console.log(`   📁 ${OUTPUT_ANOMALIES} (À vérifier)`);
    }
    console.log(`\n👉 Ouvre ${OUTPUT_EXCEL} avec Excel`);
    if (anomalies.length > 0) {
        console.log(`👉 Vérifie les anomalies dans ${OUTPUT_ANOMALIES}`);
    }
}

// Exécution
extractFromText();