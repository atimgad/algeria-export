const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function exportComplet() {
  console.log("\n🚀 EXPORT COMPLET DES ENTREPRISES\n");
  
  const startTime = Date.now();
  
  // Récupérer toutes les entreprises de toutes les tables
  const tables = [
    { name: 'exportateurs', label: 'Exportateurs généraux' },
    { name: 'laboratoires_pharmaceutiques', label: 'Laboratoires pharmaceutiques' },
    { name: 'entreprises_dechets', label: 'Traitement des déchets' }
  ];
  
  let toutesEntreprises = [];
  let stats = {};
  
  for (const table of tables) {
    console.log(`📄 Chargement: ${table.label}...`);
    
    let page = 0;
    let hasMore = true;
    
    while (hasMore) {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .range(page * 1000, (page + 1) * 1000 - 1);
      
      if (error) {
        console.error(`❌ Erreur ${table.name}:`, error.message);
        break;
      }
      
      if (data && data.length > 0) {
        // Ajouter la source
        const avecSource = data.map(e => ({
          ...e,
          _table_source: table.name,
          _categorie: table.label
        }));
        
        toutesEntreprises = toutesEntreprises.concat(avecSource);
        page++;
        console.log(`   ✅ Page ${page}: ${data.length} entreprises`);
        
        if (data.length < 1000) hasMore = false;
      } else {
        hasMore = false;
      }
    }
    
    stats[table.name] = {
      label: table.label,
      count: toutesEntreprises.filter(e => e._table_source === table.name).length
    };
  }
  
  const endTime = Date.now();
  const duree = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log("\n" + "=".repeat(80));
  console.log("📊 STATISTIQUES GLOBALES");
  console.log("=".repeat(80));
  
  let total = 0;
  for (const [key, stat] of Object.entries(stats)) {
    console.log(`${stat.label.padEnd(30)}: ${stat.count} entreprises`);
    total += stat.count;
  }
  console.log("-".repeat(80));
  console.log(`TOTAL ENTREPRISES`.padEnd(30) + `: ${total}`);
  console.log(`Temps de chargement`.padEnd(30) + `: ${duree} secondes`);
  console.log("=".repeat(80));
  
  // 1. EXPORT JSON COMPLET
  console.log("\n💾 Génération des fichiers...");
  
  const jsonComplet = {
    meta: {
      date_export: new Date().toISOString(),
      total_entreprises: total,
      tables: stats
    },
    entreprises: toutesEntreprises
  };
  
  fs.writeFileSync(
    'export_complet.json',
    JSON.stringify(jsonComplet, null, 2),
    'utf8'
  );
  console.log(`✅ JSON complet: export_complet.json (${(JSON.stringify(jsonComplet).length / 1024 / 1024).toFixed(2)} MB)`);
  
  // 2. EXPORT CSV UNIVERSEL
  const headers = [
    'id', 'nom', 'categorie', 'wilaya', 'secteur', 'activite',
    'produits', 'email', 'telephone', 'site_web', 'adresse',
    'qualite', 'source', 'date_import'
  ];
  
  let csvLignes = [headers.join(';')];
  
  for (const e of toutesEntreprises) {
    const ligne = headers.map(h => {
      let valeur = e[h] || '';
      // Nettoyer pour CSV
      if (typeof valeur === 'string') {
        valeur = valeur.replace(/;/g, ',').replace(/\n/g, ' ').trim();
      }
      if (Array.isArray(valeur)) {
        valeur = valeur.join(', ');
      }
      return `"${valeur}"`;
    }).join(';');
    
    csvLignes.push(ligne);
  }
  
  fs.writeFileSync('export_complet.csv', csvLignes.join('\n'), 'utf8');
  console.log(`✅ CSV complet: export_complet.csv (${(csvLignes.join('\n').length / 1024 / 1024).toFixed(2)} MB)`);
  
  // 3. EXPORT PAR CATÉGORIE (fichiers séparés)
  for (const table of tables) {
    const entreprisesTable = toutesEntreprises.filter(e => e._table_source === table.name);
    
    // JSON par catégorie
    fs.writeFileSync(
      `export_${table.name}.json`,
      JSON.stringify(entreprisesTable, null, 2),
      'utf8'
    );
    
    // CSV par catégorie
    const csvLignesTable = [headers.join(';')];
    for (const e of entreprisesTable) {
      const ligne = headers.map(h => {
        let valeur = e[h] || '';
        if (typeof valeur === 'string') {
          valeur = valeur.replace(/;/g, ',').replace(/\n/g, ' ').trim();
        }
        if (Array.isArray(valeur)) {
          valeur = valeur.join(', ');
        }
        return `"${valeur}"`;
      }).join(';');
      csvLignesTable.push(ligne);
    }
    
    fs.writeFileSync(
      `export_${table.name}.csv`,
      csvLignesTable.join('\n'),
      'utf8'
    );
    
    console.log(`   ✅ ${table.label}: ${entreprisesTable.length} entreprises`);
  }
  
  // 4. RAPPORT HTML DE VISUALISATION
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Export des entreprises</title>
  <style>
    body { font-family: Arial; margin: 20px; }
    .stats { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th { background: #003153; color: white; padding: 10px; }
    td { border: 1px solid #ddd; padding: 8px; }
    .or { background: #FFD700; }
    .argent { background: #C0C0C0; }
    .bronze { background: #CD7F32; }
  </style>
</head>
<body>
  <h1>📊 Export des entreprises - ${new Date().toLocaleDateString()}</h1>
  
  <div class="stats">
    <h2>Statistiques</h2>
    <ul>
      ${Object.entries(stats).map(([key, s]) => 
        `<li><strong>${s.label}:</strong> ${s.count} entreprises</li>`
      ).join('')}
      <li><strong>TOTAL:</strong> ${total} entreprises</li>
    </ul>
  </div>
  
  <h2>Échantillon (50 premières entreprises)</h2>
  <table>
    <tr>
      <th>ID</th>
      <th>Nom</th>
      <th>Catégorie</th>
      <th>Qualité</th>
      <th>Wilaya</th>
      <th>Secteur</th>
      <th>Email</th>
    </tr>
    ${toutesEntreprises.slice(0, 50).map(e => `
      <tr>
        <td>${e.id || ''}</td>
        <td>${(e.nom || '').substring(0, 50)}</td>
        <td>${e._categorie || ''}</td>
        <td class="${(e.qualite || '').toLowerCase()}">${e.qualite || ''}</td>
        <td>${e.wilaya || ''}</td>
        <td>${e.secteur || ''}</td>
        <td>${e.email || ''}</td>
      </tr>
    `).join('')}
  </table>
  
  <p style="margin-top: 20px; color: #666;">
    Généré le ${new Date().toLocaleString()}<br>
    Fichiers disponibles: 
    <a href="export_complet.json">JSON complet</a> | 
    <a href="export_complet.csv">CSV complet</a>
  </p>
</body>
</html>
  `;
  
  fs.writeFileSync('export_rapport.html', html, 'utf8');
  console.log(`   ✅ Rapport HTML: export_rapport.html`);
  
  console.log("\n" + "=".repeat(80));
  console.log("✅ EXPORT TERMINÉ !");
  console.log("=".repeat(80));
  console.log("\n📁 Fichiers générés :");
  console.log("   📄 export_complet.json    (Données brutes)");
  console.log("   📄 export_complet.csv     (Tableau)");
  console.log("   📄 export_rapport.html    (Visualisation)");
  console.log("   📄 export_exportateurs.*  (Catégorie générale)");
  console.log("   📄 export_laboratoires_pharmaceutiques.*");
  console.log("   📄 export_entreprises_dechets.*");
  console.log("=".repeat(80));
}

// Exécution
exportComplet().catch(error => {
  console.error("❌ ERREUR:", error);
});