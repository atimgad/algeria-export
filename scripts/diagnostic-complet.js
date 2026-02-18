const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function diagnosticComplet() {
  console.log("\n🔍 DIAGNOSTIC COMPLET DES BASES DE DONNÉES\n");
  
  const tables = [
    { name: 'exportateurs', label: '📦 Exportateurs généraux' },
    { name: 'laboratoires_pharmaceutiques', label: '💊 Laboratoires pharmaceutiques' },
    { name: 'entreprises_dechets', label: '♻️ Traitement des déchets' }
  ];
  
  let rapportGlobal = {
    date: new Date().toISOString(),
    totalGeneral: 0,
    tables: {}
  };
  
  for (const table of tables) {
    console.log(`\n${table.label}`);
    console.log("═".repeat(60));
    
    // Compter le nombre total
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ Erreur: ${error.message}`);
      continue;
    }
    
    console.log(`📊 TOTAL: ${count} enregistrements`);
    rapportGlobal.totalGeneral += count || 0;
    
    // Récupérer les 1000 premiers pour analyse
    const { data: echantillon, error: fetchError } = await supabase
      .from(table.name)
      .select('*')
      .limit(1000);
    
    if (fetchError) {
      console.log(`❌ Erreur chargement: ${fetchError.message}`);
      continue;
    }
    
    if (!echantillon || echantillon.length === 0) {
      console.log(`⚠️ Aucune donnée dans cette table`);
      rapportGlobal.tables[table.name] = {
        total: count || 0,
        echantillon: []
      };
      continue;
    }
    
    // Analyser les colonnes disponibles
    const colonnes = Object.keys(echantillon[0] || {});
    console.log(`📋 Colonnes: ${colonnes.join(', ')}`);
    
    // Analyser les sources
    const sources = {};
    echantillon.forEach(e => {
      if (e.source) {
        sources[e.source] = (sources[e.source] || 0) + 1;
      }
    });
    
    console.log(`📌 Sources:`);
    Object.entries(sources).forEach(([src, nb]) => {
      console.log(`   - ${src}: ${nb} entrées`);
    });
    
    // Afficher les 5 premiers enregistrements
    console.log(`\n🔎 Aperçu des 5 premiers:`);
    echantillon.slice(0, 5).forEach((e, i) => {
      console.log(`\n   ${i+1}. ${e.nom || 'Sans nom'}`);
      if (e.wilaya) console.log(`      Wilaya: ${e.wilaya}`);
      if (e.secteur) console.log(`      Secteur: ${e.secteur}`);
      if (e.activite) console.log(`      Activité: ${e.activite}`);
      if (e.email) console.log(`      Email: ${e.email}`);
      if (e.telephone) console.log(`      Tél: ${e.telephone}`);
    });
    
    // Détection des doublons potentiels dans l'échantillon
    const nomsVus = new Map();
    const doublons = [];
    
    echantillon.forEach(e => {
      if (!e.nom) return;
      const nomNormalise = e.nom.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (nomsVus.has(nomNormalise)) {
        doublons.push({
          original: nomsVus.get(nomNormalise),
          doublon: e.nom
        });
      } else {
        nomsVus.set(nomNormalise, e.nom);
      }
    });
    
    if (doublons.length > 0) {
      console.log(`\n⚠️ Doublons potentiels dans l'échantillon:`);
      doublons.slice(0, 10).forEach((d, i) => {
        console.log(`   ${i+1}. "${d.original}" ≈ "${d.doublon}"`);
      });
      if (doublons.length > 10) {
        console.log(`   ... et ${doublons.length - 10} autres`);
      }
    } else {
      console.log(`\n✅ Aucun doublon évident dans l'échantillon`);
    }
    
    // Sauvegarder les stats
    rapportGlobal.tables[table.name] = {
      total: count || 0,
      colonnes,
      sources,
      doublonsPotentiels: doublons.length,
      echantillon: echantillon.slice(0, 10).map(e => ({
        id: e.id,
        nom: e.nom,
        source: e.source,
        wilaya: e.wilaya,
        secteur: e.secteur,
        activite: e.activite
      }))
    };
    
    console.log("\n" + "═".repeat(60));
  }
  
  // RAPPORT FINAL
  console.log("\n" + "=".repeat(70));
  console.log("📊 RAPPORT DE DIAGNOSTIC FINAL");
  console.log("=".repeat(70));
  console.log(`📅 Date: ${new Date().toLocaleString()}`);
  console.log(`📦 TOTAL GÉNÉRAL: ${rapportGlobal.totalGeneral} enregistrements`);
  console.log("-".repeat(70));
  
  for (const [nom, stats] of Object.entries(rapportGlobal.tables)) {
    console.log(`\n${nom}:`);
    console.log(`   📊 Total: ${stats.total} enregistrements`);
    if (stats.sources) {
      console.log(`   📌 Sources: ${Object.keys(stats.sources).join(', ') || 'aucune'}`);
    }
    console.log(`   ⚠️ Doublons potentiels: ${stats.doublonsPotentiels || 0}`);
    
    if (stats.echantillon && stats.echantillon.length > 0) {
      console.log(`   🔎 Exemples:`);
      stats.echantillon.slice(0, 3).forEach(e => {
        console.log(`      - ${e.nom || 'Sans nom'}`);
      });
    }
  }
  
  console.log("\n" + "=".repeat(70));
  
  // Sauvegarder le rapport complet
  fs.writeFileSync(
    'diagnostic_complet.json',
    JSON.stringify(rapportGlobal, null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Rapport sauvegardé dans: diagnostic_complet.json`);
  console.log("\n✅ DIAGNOSTIC TERMINÉ!");
}

// Exécution
diagnosticComplet().catch(error => {
  console.error("❌ ERREUR FATALE:", error);
});