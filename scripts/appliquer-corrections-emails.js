// scripts/appliquer-corrections-emails.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 📋 CORRECTIONS MANUELLES (basées sur ta Partie 2)
// ============================================
const corrections = [
  // Format: { ancien: "email complet avec slash", nouveaux: ["email1", "email2", ...] }
  {
    ancien: "abguidoum@gmail.com / contact@amadhagh.dz / amadimex@yahoo.fr http: www.amadhagh.dz",
    nouveaux: ["abguidoum@gmail.com", "contact@amadhagh.dz", "amadimex@yahoo.fr"]
  },
  {
    ancien: "alsamtex@gmail.com / amsamtex2017@goldendattes.fr",
    nouveaux: ["alsamtex@gmail.com", "amsamtex2017@goldendattes.fr"]
  },
  {
    ancien: "awbenzaz@yahoo.fr / sarl.benzaza@yahoo.fr",
    nouveaux: ["awbenzaz@yahoo.fr", "sarl.benzaza@yahoo.fr"]
  },
  {
    ancien: "contact@errahikhoney.com / zm@casa.dz",
    nouveaux: ["contact@errahikhoney.com", "zm@casa.dz"]
  },
  {
    ancien: "mohamedbiad374@gmail.com / comforttrad9@gmail.com",
    nouveaux: ["mohamedbiad374@gmail.com", "comforttrad9@gmail.com"]
  },
  {
    ancien: "sarlcatm@hotmail.com / tahar.tahir@catmdz.om",
    nouveaux: ["sarlcatm@hotmail.com", "tahar.tahir@catmdz.com"]
  },
  {
    ancien: "contact@dattechetti.com / info@ dattechetti.com / dates.chetti@yahoo.com",
    nouveaux: ["contact@dattechetti.com", "info@dattechetti.com", "dates.chetti@yahoo.com"]
  },
  {
    ancien: "dekachim@hotmail.fr / sarl_dekachim@hotmail.fr",
    nouveaux: ["dekachim@hotmail.fr", "sarl_dekachim@hotmail.fr"]
  },
  {
    ancien: "mousagrico@gmail.com / info@ datteselmostakbal.com",
    nouveaux: ["mousagrico@gmail.com", "info@datteselmostakbal.com"]
  },
  {
    ancien: "mokdadi@yahoo.fr / elnadjahagro@gmail.com",
    nouveaux: ["mokdadi@yahoo.fr", "elnadjahagro@gmail.com"]
  },
  {
    ancien: "elsabah.group@gmail.com / elsabah.blida@gmail.com",
    nouveaux: ["elsabah.group@gmail.com", "elsabah.blida@gmail.com"]
  },
  {
    ancien: "sud_gss@hotmail.fr / sarlgss@hotmail.fr",
    nouveaux: ["sud_gss@hotmail.fr", "sarlgss@hotmail.fr"]
  },
  {
    ancien: "sevendates@outlook.com / selectdatte@outlook.com",
    nouveaux: ["sevendates@outlook.com", "selectdatte@outlook.com"]
  },
  {
    ancien: "blabahdidi@gmail.com / rosiersrouges2018@gmail.com",
    nouveaux: ["blabahdidi@gmail.com", "rosiersrouges2018@gmail.com"]
  },
  {
    ancien: "mafatihelkheirexportmail.com",
    nouveaux: ["mafatihelkheirexport@mail.com"]
  },
  {
    ancien: "dir_generale@cagex.dz / dir_com@cagex.dz",
    nouveaux: ["dir_generale@cagex.dz", "dir_com@cagex.dz"]
  },
  {
    ancien: "sarlphenixdatte@yahoo.fr / contact@ sarlphenixdatte.com",
    nouveaux: ["sarlphenixdatte@yahoo.fr", "contact@sarlphenixdatte.com"]
  },
  {
    ancien: "douguiz@hotmail.com / sagrifood@yahoo.fr",
    nouveaux: ["douguiz@hotmail.com", "sagrifood@yahoo.fr"]
  },
  {
    ancien: "sarl_socofel@yahoo.fr, contact@datiadz.com",
    nouveaux: ["sarl_socofel@yahoo.fr", "contact@datiadz.com"]
  },
  {
    ancien: "suddatte@yahoo.fr / sudatte@hotmail.fr",
    nouveaux: ["suddatte@yahoo.fr", "sudatte@hotmail.fr"]
  },
  {
    ancien: "limaneahmedtedjani@gmail.com / harof@live.fr",
    nouveaux: ["limaneahmedtedjani@gmail.com", "harof@live.fr"]
  },
  {
    ancien: "manager@sarltcpaexport.com / bakhoukh.36@gmail.com",
    nouveaux: ["manager@sarltcpaexport.com", "bakhoukh.36@gmail.com"]
  },
  {
    ancien: "hamoudboualem@djazairconnect.com / aminey64@gmail.com / rostom.chermatte@hamoudboualem.com",
    nouveaux: ["hamoudboualem@djazairconnect.com", "aminey64@gmail.com", "rostom.chermatte@hamoudboualem.com"]
  },
  {
    ancien: "errassassi@hotmail.com / errassassifood@hotmail.com",
    nouveaux: ["errassassi@hotmail.com", "errassassifood@hotmail.com"]
  },
  {
    ancien: "maisonlahlou@yahoo.fr / infomaisonlahlou@yahoo.fr",
    nouveaux: ["maisonlahlou@yahoo.fr", "infomaisonlahlou@yahoo.fr"]
  },
  {
    ancien: "fouad@altoch.com / sarah@altoch.com / contact@altoch.com",
    nouveaux: ["fouad@altoch.com", "sarah@altoch.com", "contact@altoch.com"]
  },
  {
    ancien: "abdelhakim.mehenna@spaelfath.com / ahmed.mekhalfia@spaelfath.com",
    nouveaux: ["abdelhakim.mehenna@spaelfath.com", "ahmed.mekhalfia@spaelfath.com"]
  },
  {
    ancien: "filmoplast01@gmail.com / tntex.filmo@gmail.com",
    nouveaux: ["filmoplast01@gmail.com", "tntex.filmo@gmail.com"]
  },
  {
    ancien: "hamilal@gmail.com / skaihworld@gmail.com",
    nouveaux: ["hamilal@gmail.com", "skaihworld@gmail.com"]
  },
  {
    ancien: "contact@tapidor.net / h.a@tapidor.net",
    nouveaux: ["contact@tapidor.net", "h.a@tapidor.net"]
  },
  {
    ancien: "tiscoba@yahoo.fr / info@tiscoba.com",
    nouveaux: ["tiscoba@yahoo.fr", "info@tiscoba.com"]
  },
  {
    ancien: "info@groupeazzouz.com / groupazzouz.spa@gmail.com",
    nouveaux: ["info@groupeazzouz.com", "groupazzouz.spa@gmail.com"]
  },
  {
    ancien: "loudinisarl@gmail.com / loudini@gmail.ru",
    nouveaux: ["loudinisarl@gmail.com", "loudini@gmail.ru"]
  },
  {
    ancien: "communication@epebatimetal.dz / dg@ epebatimetal.dz",
    nouveaux: ["communication@epebatimetal.dz", "dg@epebatimetal.dz"]
  },
  {
    ancien: "lylia.aitabdallah@doka",
    nouveaux: ["lylia.aitabdallah@doka.com"]
  },
  {
    ancien: "medigoutte@yahoo.fr / rezkihatem@ yahoo.fr",
    nouveaux: ["medigoutte@yahoo.fr", "rezkihatem@yahoo.fr"]
  },
  {
    ancien: "siderelhadjar.communication@alsolbdz. com / annaba.communication@alsolbdz.com",
    nouveaux: ["siderelhadjar.communication@alsolbdz.com", "annaba.communication@alsolbdz.com"]
  },
  {
    ancien: "info@spsdz.com / mkg@spsdz.com",
    nouveaux: ["info@spsdz.com", "mkg@spsdz.com"]
  },
  {
    ancien: "info@technociddz.com / technocid@ yahoo.fr",
    nouveaux: ["info@technociddz.com", "technocid@yahoo.fr"]
  },
  {
    ancien: "co.anas@hotmail.com / sarl.lux@gmail.com",
    nouveaux: ["co.anas@hotmail.com", "sarl.lux@gmail.com"]
  },
  {
    ancien: "contact@meradja.com / merdjafodil@ outlook.fr",
    nouveaux: ["contact@meradja.com", "merdjafodil@outlook.fr"]
  },
  {
    ancien: "contact@mexicali_dz.com / contact_mexicali@yahoo.fr",
    nouveaux: ["contact@mexicali_dz.com", "contact_mexicali@yahoo.fr"]
  },
  {
    ancien: "sarlnegomax@gmail.com / sarlzimafood@gmail.com",
    nouveaux: ["sarlnegomax@gmail.com", "sarlzimafood@gmail.com"]
  },
  {
    ancien: "contact@intersurvey.dz / intersurveyalgerie@gmail.com",
    nouveaux: ["contact@intersurvey.dz", "intersurveyalgerie@gmail.com"]
  },
  {
    ancien: "gemadec@gema-group.com / dcm-dir@ gema-group.com /gemadga@gema-group.com",
    nouveaux: ["gemadec@gema-group.com", "dcm-dir@gema-group.com", "gemadga@gema-group.com"]
  },
  {
    ancien: "ncarouiba@hotmail.com / nca@rouiba.com.dz",
    nouveaux: ["ncarouiba@hotmail.com", "nca@rouiba.com.dz"]
  },
  {
    ancien: "commercial@perfectsnacks.dz / contact@ perfectssnacks.dz",
    nouveaux: ["commercial@perfectsnacks.dz", "contact@perfectsnacks.dz"]
  },
  {
    ancien: "office@promasidordz.com / info@ promasidordz.com",
    nouveaux: ["office@promasidordz.com", "info@promasidordz.com"]
  },
  {
    ancien: "h.aitbenamara@ciomat.dz / m.aitbenamara@ciomat.dz",
    nouveaux: ["h.aitbenamara@ciomat.dz", "m.aitbenamara@ciomat.dz"]
  },
  {
    ancien: "info@flr.dz / flrcontact@yahoo.fr",
    nouveaux: ["info@flr.dz", "flrcontact@yahoo.fr"]
  },
  {
    ancien: "larbi.kherifi@hydroindustrie.dz / contact@ hydroindustrie.dz",
    nouveaux: ["larbi.kherifi@hydroindustrie.dz", "contact@hydroindustrie.dz"]
  },
  {
    ancien: "info@knaufalgerie.com / mourad.taleb@knaufalgerie.com",
    nouveaux: ["info@knaufalgerie.com", "mourad.taleb@knaufalgerie.com"]
  },
  {
    ancien: "info@proliposdz.com / contact@ proliposdz.com",
    nouveaux: ["info@proliposdz.com", "contact@proliposdz.com"]
  },
  {
    ancien: "couscouspastamama@yahoo.fr / contact@sopimama.com",
    nouveaux: ["couscouspastamama@yahoo.fr", "contact@sopimama.com"]
  },
  {
    ancien: "sosemie@globalofficedz.com / contact@ sosemie.com",
    nouveaux: ["sosemie@globalofficedz.com", "contact@sosemie.com"]
  },
  {
    ancien: "contact@tchinlait.com / infos@tchinlait.com",
    nouveaux: ["contact@tchinlait.com", "infos@tchinlait.com"]
  },
  {
    ancien: "travepssarl@yaho.fr / contact@travepsdz.com",
    nouveaux: ["travepssarl@yahoo.fr", "contact@travepsdz.com"]
  },
  {
    ancien: "metaplast@yahoo.fr / info@metaplastdz.com",
    nouveaux: ["metaplast@yahoo.fr", "info@metaplastdz.com"]
  },
  {
    ancien: "contact@monoelectric.com / commercial@monoelectric.com",
    nouveaux: ["contact@monoelectric.com", "commercial@monoelectric.com"]
  },
  {
    ancien: "samettex10@gmail.com / contact@ samettex.dz",
    nouveaux: ["samettex10@gmail.com", "contact@samettex.dz"]
  },
  {
    ancien: "contact@galionalgerie.com / taher.ydri@galionalgerie.com",
    nouveaux: ["contact@galionalgerie.com", "taher.ydri@galionalgerie.com"]
  },
  {
    ancien: "contact@ecopack-sarl.com / nabil.yadi@ecopack-sarl.com",
    nouveaux: ["contact@ecopack-sarl.com", "nabil.yadi@ecopack-sarl.com"]
  },
  {
    ancien: "contact@mega-papiers.com / i.habri@mega-papiers.com",
    nouveaux: ["contact@mega-papiers.com", "i.habri@mega-papiers.com"]
  },
  {
    ancien: "info@tonicindustrie.com / export@tonic-industrie.com",
    nouveaux: ["info@tonicindustrie.com", "export@tonic-industrie.com"]
  },
  {
    ancien: "contact@enap.dz / commercial@enap.dz / export@enap.dz",
    nouveaux: ["contact@enap.dz", "commercial@enap.dz", "export@enap.dz"]
  },
  {
    ancien: "info@hightechsecurity.com / support@ hightechsecurity.com",
    nouveaux: ["info@hightechsecurity.com", "support@hightechsecurity.com"]
  }
];

async function applyCorrections() {
  console.log('='.repeat(80));
  console.log('🔧 APPLICATION DES CORRECTIONS EMAILS');
  console.log('='.repeat(80));
  
  let totalCorrections = 0;
  
  for (const correction of corrections) {
    // Chercher les entités qui ont cet email
    const { data: entities, error } = await supabase
      .from('official_directory')
      .select('id, name, email')
      .contains('email', [correction.ancien]);
    
    if (error) {
      console.error('❌ Erreur recherche:', error);
      continue;
    }
    
    for (const entity of entities) {
      // Remplacer l'ancien email par les nouveaux
      const newEmails = entity.email.filter(e => e !== correction.ancien);
      newEmails.push(...correction.nouveaux);
      
      const { error: updateError } = await supabase
        .from('official_directory')
        .update({ email: newEmails })
        .eq('id', entity.id);
      
      if (!updateError) {
        totalCorrections++;
        console.log(`✅ ${entity.name.substring(0, 50)}`);
        console.log(`   → ${correction.nouveaux.join(', ')}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`✅ Total corrections appliquées: ${totalCorrections}`);
  console.log('='.repeat(80));
}

applyCorrections();