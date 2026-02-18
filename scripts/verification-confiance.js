const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Critères de confiance
const CRITERES = {
  // Noms suspects (coquilles, erreurs)
  NOMS_INVALIDES: [
    'Page', 'www', 'http', 'compte', 'total', 'sommaire',
    'introduction', 'chapitre', 'annexe', 'répertoire'
  ],
  
  // Indices de qualité
  INDICES_QUALITE: {
    OR: [
      'TROPHY', 'AWARD', 'PRIX', 'MÉDAILLE', 'DISTINCTION',
      'EXPORT TROPHY', 'EUROPEAN CEO', 'CERTIFICATION ISO',
      'ORGANISME AGRÉÉ', 'LABELLISÉ', 'PRIMÉ'
    ],
    ARGENT: [
      'EXPORTATEUR', 'EXPORT', 'INTERNATIONAL', 'ÉTRANGER',
      'CLIENTÈLE ÉTRANGÈRE', 'MARCHÉS INTERNATIONAUX'
    ],
    BRONZE: [
      'SARL', 'SPA', 'EURL', 'SAS', 'ENTREPRISE', 'ÉTABLISSEMENT',
      'INDUSTRIE', 'FABRICATION', 'PRODUCTION'
    ]
  },
  
  // Mots-clés de secteur
  SECTEURS: {
    'AGROALIMENTAIRE': ['AGRIC', 'ALIM', 'BOISSON', 'LAIT', 'VIANDE', 'FRUIT', 'LÉGUME', 'HUILE'],
    'PHARMACEUTIQUE': ['PHARMA', 'MÉDIC', 'LABORATOIRE', 'SANTÉ', 'MÉDICAL'],
    'INDUSTRIE': ['INDUST', 'FABRIC', 'PRODUCTION', 'USINE'],
    'SERVICES': ['SERVICE', 'CONSEIL', 'INGÉNIEUR', 'ÉTUDE'],
    'COMMERCE': ['COMMER', 'DISTRIB', 'IMPORT', 'EXPORT', 'NÉGOCE'],
    'BTP': ['BATIMENT', 'TRAVAUX', 'CONSTRUCTION', 'GÉNIE CIVIL'],
    'ÉNERGIE': ['ÉNERGIE', 'ÉLECTRIC', 'GAZ', 'PÉTROLE', 'RENOUVELABLE'],
    'ENVIRONNEMENT': ['DÉCHET', 'ENVIRONN', 'RECYCL', 'TRAITEMENT', 'ASSAINISS']
  }
};

async function verifierEntreprises() {
  console.log("\n🔍 DÉBUT DE LA VÉRIFICATION DES ENTREPRISES\n");
  
  // Récupérer toutes les entreprises
  const { data: entreprises, error } = await supabase
    .from('exportateurs')
    .select('*');
  
  if (error) {
    console.error("❌ Erreur de récupération:", error);
    return;
  }
  
  console.log(`📊 ${entreprises.length} entreprises à analyser\n`);
  
  let scores = {
    excellent: 0,
    bon: 0,
    moyen: 0,
    faible: 0,
    suspect: 0
  };
  
  let analyses = [];
  
  for (const e of entreprises) {
    const analyse = analyserEntreprise(e);
    analyses.push(analyse);
    
    // Compter par catégorie
    if (analyse.score >= 80) scores.excellent++;
    else if (analyse.score >= 60) scores.bon++;
    else if (analyse.score >= 40) scores.moyen++;
    else if (analyse.score >= 20) scores.faible++;
    else scores.suspect++;
  }
  
  // Afficher les résultats globaux
  console.log("=".repeat(70));
  console.log("📊 RÉPARTITION DES SCORES DE CONFIANCE");
  console.log("=".repeat(70));
  console.log(`🏆 Excellent (80-100) : ${scores.excellent} entreprises`);
  console.log(`👍 Bon (60-79)       : ${scores.bon} entreprises`);
  console.log(`🟡 Moyen (40-59)     : ${scores.moyen} entreprises`);
  console.log(`⚠️ Faible (20-39)     : ${scores.faible} entreprises`);
  console.log(`❌ Suspect (0-19)    : ${scores.suspect} entreprises`);
  console.log("=".repeat(70));
  
  // Afficher les entreprises suspectes
  if (scores.suspect > 0) {
    console.log("\n🔴 ENTREPRISES SUSPECTES À VÉRIFIER :");
    console.log("-".repeat(70));
    
    const suspectes = analyses.filter(a => a.score < 20);
    suspectes.slice(0, 20).forEach((a, i) => {
      console.log(`${i+1}. ${a.nom} (Score: ${a.score})`);
      console.log(`   Raisons: ${a.raisons.join(', ')}`);
    });
    
    if (suspectes.length > 20) {
      console.log(`... et ${suspectes.length - 20} autres`);
    }
  }
  
  // Top 10 des meilleures entreprises
  console.log("\n🏆 TOP 10 DES MEILLEURES ENTREPRISES :");
  console.log("-".repeat(70));
  
  const meilleures = analyses
    .filter(a => a.score >= 80)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  meilleures.forEach((a, i) => {
    console.log(`${i+1}. ${a.nom} (Score: ${a.score})`);
    console.log(`   Qualité: ${a.qualite}, Secteur: ${a.secteur}`);
  });
  
  // Vérification des doublons potentiels
  console.log("\n🔄 VÉRIFICATION DES DOUBLONS POTENTIELS :");
  console.log("-".repeat(70));
  
  const nomsMap = new Map();
  let doublonsPotentiels = 0;
  
  for (const e of entreprises) {
    const nomCourt = e.nom.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 15);
    if (nomsMap.has(nomCourt)) {
      doublonsPotentiels++;
      console.log(`⚠️ Doublon possible:`);
      console.log(`   ${nomsMap.get(nomCourt)}`);
      console.log(`   ${e.nom}`);
    } else {
      nomsMap.set(nomCourt, e.nom);
    }
  }
  
  console.log(`\n📊 ${doublonsPotentiels} doublons potentiels détectés`);
  
  // Statistiques par secteur
  console.log("\n📊 RÉPARTITION PAR SECTEUR :");
  console.log("-".repeat(70));
  
  const secteurs = {};
  analyses.forEach(a => {
    secteurs[a.secteur] = (secteurs[a.secteur] || 0) + 1;
  });
  
  Object.entries(secteurs)
    .sort((a, b) => b[1] - a[1])
    .forEach(([secteur, count]) => {
      console.log(`${secteur.padEnd(20)}: ${count} entreprises`);
    });
  
  console.log("\n✅ VÉRIFICATION TERMINÉE!");
}

function analyserEntreprise(e) {
  let score = 50; // Score de base
  let raisons = [];
  let qualite = 'Standard';
  let secteur = 'Général';
  
  const nom = e.nom || '';
  const nomUpper = nom.toUpperCase();
  
  // 1. Vérifier la longueur du nom
  if (nom.length < 5) {
    score -= 20;
    raisons.push('Nom trop court');
  } else if (nom.length > 10) {
    score += 5;
  }
  
  // 2. Vérifier les mots invalides
  for (const invalide of CRITERES.NOMS_INVALIDES) {
    if (nomUpper.includes(invalide.toUpperCase())) {
      score -= 30;
      raisons.push(`Contient "${invalide}"`);
      qualite = 'Suspect';
    }
  }
  
  // 3. Vérifier les indices de qualité OR
  for (const indice of CRITERES.INDICES_QUALITE.OR) {
    if (nomUpper.includes(indice)) {
      score += 30;
      qualite = 'Or';
      raisons.push(`Indice OR: ${indice}`);
      break;
    }
  }
  
  // 4. Vérifier les indices ARGENT
  if (qualite !== 'Or') {
    for (const indice of CRITERES.INDICES_QUALITE.ARGENT) {
      if (nomUpper.includes(indice)) {
        score += 20;
        qualite = 'Argent';
        raisons.push(`Indice ARGENT: ${indice}`);
        break;
      }
    }
  }
  
  // 5. Vérifier les indices BRONZE
  if (qualite === 'Standard') {
    for (const indice of CRITERES.INDICES_QUALITE.BRONZE) {
      if (nomUpper.includes(indice)) {
        score += 10;
        qualite = 'Bronze';
        raisons.push(`Indice BRONZE: ${indice}`);
        break;
      }
    }
  }
  
  // 6. Détection du secteur
  for (const [sect, mots] of Object.entries(CRITERES.SECTEURS)) {
    for (const mot of mots) {
      if (nomUpper.includes(mot)) {
        secteur = sect;
        score += 5;
        raisons.push(`Secteur détecté: ${sect}`);
        break;
      }
    }
    if (secteur !== 'Général') break;
  }
  
  // 7. Vérifier la source
  if (e.source === 'catalogue_2023') {
    score += 10;
  } else if (e.source === 'archive_2019') {
    score -= 5;
    raisons.push('Données 2019');
  }
  
  // 8. Vérifier la présence d'email/téléphone
  if (e.email && e.email.length > 5) {
    score += 15;
  }
  if (e.telephone && e.telephone.length > 5) {
    score += 10;
  }
  if (e.site_web && e.site_web.length > 5) {
    score += 10;
  }
  
  // Limiter le score entre 0 et 100
  score = Math.max(0, Math.min(100, score));
  
  return {
    nom: nom.substring(0, 50),
    score,
    qualite,
    secteur,
    raisons: raisons.slice(0, 3) // Garder les 3 principales raisons
  };
}

// Exécuter la vérification
verifierEntreprises().catch(console.error);