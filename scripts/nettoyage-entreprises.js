const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Mots à supprimer (fausses entrées)
const A_SUPPRIMER = [
  'ENGLISH',
  'ANGLAIS',
  'FRANÇAIS',
  'ARABE',
  'Product:',
  'See advertisement',
  'To find a company',
  'Liste Entreprises',
  'COMPANIES LIST',
  'Consult the alphabetical',
  'AGRICULTURE',
  'Fax:',
  'Tel:',
  'Page',
  'www.',
  '@:'
];

// Regroupement des doublons (entreprise + email)
const REGROUPEMENTS = [
  {
    pattern: /(.+?),\s*(sarl|eurl|spa)/i,
    emailPattern: /@: (.+@.+)/
  }
];

async function nettoyer() {
  console.log("\n🧹 DÉBUT DU NETTOYAGE\n");
  
  // Récupérer toutes les entreprises
  const { data: entreprises, error } = await supabase
    .from('exportateurs')
    .select('*');
  
  if (error) {
    console.error("❌ Erreur:", error);
    return;
  }
  
  console.log(`📊 ${entreprises.length} entreprises avant nettoyage\n`);
  
  let supprime = 0;
  let fusionne = 0;
  let garde = 0;
  
  // 1. Supprimer les fausses entrées
  for (const e of entreprises) {
    let aSupprimer = false;
    
    for (const mot of A_SUPPRIMER) {
      if (e.nom.toUpperCase().includes(mot.toUpperCase())) {
        aSupprimer = true;
        break;
      }
    }
    
    if (aSupprimer || e.nom.length < 5) {
      const { error } = await supabase
        .from('exportateurs')
        .delete()
        .eq('id', e.id);
      
      if (!error) {
        supprime++;
        console.log(`🗑️ Supprimé: ${e.nom.substring(0, 50)}`);
      }
    } else {
      garde++;
    }
  }
  
  // 2. Traiter les emails séparés
  const entreprisesRestantes = entreprises.filter(e => garde > 0);
  const mapEmail = new Map();
  
  for (const e of entreprisesRestantes) {
    const emailMatch = e.nom.match(/@: (.+@.+)/);
    if (emailMatch) {
      mapEmail.set(emailMatch[1], e.id);
    }
  }
  
  // 3. Fusionner entreprises avec leurs emails
  for (const e of entreprisesRestantes) {
    for (const [email, idEmail] of mapEmail) {
      if (e.nom.includes(email) && e.id !== idEmail) {
        // Mettre à jour l'entreprise principale avec l'email
        await supabase
          .from('exportateurs')
          .update({ email: email })
          .eq('id', e.id);
        
        // Supprimer l'entrée email
        await supabase
          .from('exportateurs')
          .delete()
          .eq('id', idEmail);
        
        fusionne++;
        console.log(`🔗 Fusion: ${e.nom.substring(0, 30)} + ${email}`);
      }
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("📊 RÉSULTAT DU NETTOYAGE");
  console.log("=".repeat(50));
  console.log(`🗑️ Supprimés: ${supprime}`);
  console.log(`🔗 Fusionnés: ${fusionne}`);
  console.log(`✅ Gardés: ${garde - fusionne}`);
  console.log("=".repeat(50));
  
  // Afficher les 10 premières entreprises nettoyées
  const { data: propres } = await supabase
    .from('exportateurs')
    .select('nom, email, telephone')
    .limit(10);
  
  console.log("\n📋 APERÇU APRÈS NETTOYAGE :");
  propres?.forEach((e, i) => {
    console.log(`${i+1}. ${e.nom.substring(0, 50)}`);
    if (e.email) console.log(`   📧 ${e.email}`);
  });
  
  console.log("\n✅ NETTOYAGE TERMINÉ!");
}

nettoyer().catch(console.error);