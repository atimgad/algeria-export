const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PDF_FOLDER = "C:\\Users\\User\\Documents\\Projet AlgeriaExport\\PDF Files for Exporters";

// Configuration des fichiers avec parsers spécifiques
const files = [
  {
    path: path.join(PDF_FOLDER, "algerie-exportateurs.pdf"),
    table: "exportateurs",
    name: "Exportateurs généraux",
    parser: (text) => {
      const entreprises = [];
      const lines = text.split('\n');
      const nomsVus = new Set();
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 5 && 
            !trimmed.includes('Page') && 
            !trimmed.includes('www') &&
            !trimmed.includes('@') &&
            !trimmed.match(/^\d+$/)) {
          
          // Nettoyage
          let nom = trimmed.replace(/\s+/g, ' ').trim();
          
          // Éviter les doublons
          if (nomsVus.has(nom)) continue;
          if (nom.length < 3) continue;
          
          nomsVus.add(nom);
          
          // Déterminer la qualité basée sur des indices
          let qualite = 'Standard';
          if (trimmed.includes('SARL') || trimmed.includes('SPA')) qualite = 'Bronze';
          if (trimmed.includes('EXPORTATEUR')) qualite = 'Argent';
          if (trimmed.includes('TROPHY') || trimmed.includes('AWARD')) qualite = 'Or';
          
          entreprises.push({
            nom: nom.substring(0, 255),
            secteur: 'Général',
            wilaya: '',
            produits: '',
            source: 'catalogue_2023',
            qualite: qualite,
            certifications: [],
            annee_creation: null,
            capital: '',
            email: '',
            telephone: '',
            site_web: '',
            adresse: '',
            pays_export: [],
            distinctions: []
          });
        }
      }
      console.log(`   📊 ${entreprises.length} entreprises uniques extraites`);
      return entreprises;
    }
  },
  {
    path: path.join(PDF_FOLDER, "etablissements-de-fabrication pharmaceutiques.pdf"),
    table: "laboratoires_pharmaceutiques",
    name: "Laboratoires pharmaceutiques",
    parser: (text) => {
      const entreprises = [];
      const lines = text.split('\n');
      const nomsVus = new Set();
      
      for (const line of lines) {
        const trimmed = line.trim();
        // Format: N° Etablissement Wilaya Activité
        const match = trimmed.match(/^(\d+)\s+([^\d]+?)\s+([^\d]+?)\s+([^\d]+)$/);
        if (match) {
          let nom = (match[2] || '').trim();
          
          if (nomsVus.has(nom)) continue;
          nomsVus.add(nom);
          
          entreprises.push({
            nom: nom.substring(0, 255),
            wilaya: (match[3] || '').trim().substring(0, 100),
            activite: (match[4] || '').trim().substring(0, 255),
            numero_agrement: match[1],
            source: 'pharmaceutique_2023'
          });
        }
      }
      console.log(`   📊 ${entreprises.length} laboratoires uniques extraits`);
      return entreprises;
    }
  },
  {
    path: path.join(PDF_FOLDER, "fichier des exportateurs A 2019(1).pdf"),
    table: "exportateurs",
    name: "Exportateurs 2019",
    parser: (text) => {
      const entreprises = [];
      const lines = text.split('\n');
      const nomsVus = new Set();
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.match(/^[A-Z]/) && 
            trimmed.length > 10 && 
            !trimmed.includes('Page') &&
            !trimmed.includes('CHAMBRE')) {
          
          let nom = trimmed.replace(/\s+/g, ' ').trim();
          
          if (nomsVus.has(nom)) continue;
          nomsVus.add(nom);
          
          entreprises.push({
            nom: nom.substring(0, 255),
            secteur: 'Archive 2019',
            wilaya: '',
            produits: '',
            source: 'archive_2019',
            qualite: 'Standard',
            certifications: [],
            annee_creation: 2019,
            capital: '',
            email: '',
            telephone: '',
            site_web: '',
            adresse: '',
            pays_export: [],
            distinctions: []
          });
        }
      }
      console.log(`   📊 ${entreprises.length} exportateurs 2019 uniques extraits`);
      return entreprises;
    }
  },
  {
    path: path.join(PDF_FOLDER, "Liste des entreprises de traitement des déchets spéciaux.pdf"),
    table: "entreprises_dechets",
    name: "Traitement des déchets",
    parser: (text) => {
      const entreprises = [];
      const lines = text.split('\n');
      const nomsVus = new Set();
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 15 && 
            !trimmed.includes('Page') && 
            !trimmed.includes('Ministère') &&
            !trimmed.includes('République')) {
          
          let nom = trimmed.replace(/\s+/g, ' ').trim();
          
          if (nomsVus.has(nom)) continue;
          nomsVus.add(nom);
          
          // Détection du type de déchet
          let type_dechet = 'Spécial';
          if (trimmed.toLowerCase().includes('médical') || 
              trimmed.toLowerCase().includes('pharmaceutique')) {
            type_dechet = 'Médical';
          } else if (trimmed.toLowerCase().includes('industriel')) {
            type_dechet = 'Industriel';
          } else if (trimmed.toLowerCase().includes('dangereux')) {
            type_dechet = 'Dangereux';
          }
          
          entreprises.push({
            nom: nom.substring(0, 255),
            wilaya: '',
            type_dechet: type_dechet,
            agrement: '',
            source: 'dechets_2023'
          });
        }
      }
      console.log(`   📊 ${entreprises.length} entreprises de déchets uniques extraites`);
      return entreprises;
    }
  }
];

async function importFile(fileInfo) {
  console.log(`\n📄 ${'='.repeat(60)}`);
  console.log(`📄 Traitement: ${fileInfo.name}`);
  console.log(`📄 Table: ${fileInfo.table}`);
  console.log(`📄 ${'='.repeat(60)}`);
  
  if (!fs.existsSync(fileInfo.path)) {
    console.log(`❌ Fichier non trouvé: ${fileInfo.path}`);
    return { name: fileInfo.name, error: 'Fichier manquant' };
  }

  const dataBuffer = fs.readFileSync(fileInfo.path);
  console.log(`✅ Fichier chargé: ${(dataBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  try {
    const pdfData = await pdf(dataBuffer);
    console.log(`✅ PDF parsé: ${(pdfData.text.length / 1000).toFixed(0)}k caractères`);
    
    const entreprises = fileInfo.parser(pdfData.text);
    
    let totalInsere = 0;
    let totalDoublons = 0;
    let totalErreur = 0;
    
    if (entreprises.length > 0) {
      // Récupérer les noms existants dans la base
      const { data: existants } = await supabase
        .from(fileInfo.table)
        .select('nom');
      
      const nomsExistants = new Set(existants?.map(e => e.nom) || []);
      
      // Filtrer les doublons avec la base
      const nouveaux = entreprises.filter(e => !nomsExistants.has(e.nom));
      totalDoublons = entreprises.length - nouveaux.length;
      
      console.log(`   📊 Après vérification base: ${nouveaux.length} nouveaux, ${totalDoublons} doublons`);
      
      // Insertion par lots de 50
      for (let i = 0; i < nouveaux.length; i += 50) {
        const batch = nouveaux.slice(i, i + 50);
        
        const { error, data } = await supabase
          .from(fileInfo.table)
          .insert(batch)
          .select();
        
        if (error) {
          console.log(`   ❌ Erreur lot ${Math.floor(i/50) + 1}: ${error.message}`);
          totalErreur += batch.length;
        } else {
          console.log(`   ✅ Lot ${Math.floor(i/50) + 1}: ${data.length} insérés`);
          totalInsere += data.length;
        }
      }
      
      console.log(`\n   📊 RÉSULTAT: ${totalInsere} nouveaux, ${totalDoublons} doublons, ${totalErreur} erreurs`);
    }
    
    return { 
      name: fileInfo.name, 
      total: entreprises.length, 
      insere: totalInsere,
      doublons: totalDoublons,
      erreur: totalErreur
    };
    
  } catch (error) {
    console.log(`❌ Erreur critique: ${error.message}`);
    return { name: fileInfo.name, error: error.message };
  }
}

async function importAll() {
  console.log("\n🚀 DÉBUT DE L'IMPORTATION ULTRA-OPTIMISÉE\n");
  
  const startTime = Date.now();
  const results = [];
  
  for (const file of files) {
    const result = await importFile(file);
    results.push(result);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  console.log("\n" + "=".repeat(70));
  console.log("📊 RAPPORT FINAL D'IMPORTATION");
  console.log("=".repeat(70));
  
  let totalGlobal = 0;
  let insereGlobal = 0;
  let doublonsGlobal = 0;
  let erreurGlobal = 0;
  
  for (const r of results) {
    if (r.error) {
      console.log(`❌ ${r.name}: ERREUR - ${r.error}`);
    } else {
      console.log(`✅ ${r.name}: ${r.insere}/${r.total} insérés (${r.doublons} doublons, ${r.erreur} erreurs)`);
      totalGlobal += r.total || 0;
      insereGlobal += r.insere || 0;
      doublonsGlobal += r.doublons || 0;
      erreurGlobal += r.erreur || 0;
    }
  }
  
  console.log("=".repeat(70));
  console.log(`✅ TOTAL: ${insereGlobal}/${totalGlobal} entreprises importées`);
  console.log(`   Doublons évités: ${doublonsGlobal}`);
  console.log(`   Erreurs: ${erreurGlobal}`);
  console.log(`⏱️  Durée: ${duration} minutes`);
  console.log("=".repeat(70));
  console.log("\n✅ IMPORTATION TERMINÉE!");
}

// Exécution avec gestion d'erreur améliorée
importAll().catch(error => {
  console.error("❌ ERREUR FATALE:", error);
  process.exit(1);
});