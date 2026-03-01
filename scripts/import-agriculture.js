// scripts/import-agriculture.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration de ce fichier
const BATCH_NAME = 'batch_20260301_agriculture';
const CATEGORY = 'AGRICULTURE';
const ENTITY_TYPE = 'agriculture';

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function extractProducts(line) {
  if (!line.startsWith('Produit:')) return [];
  const productsText = line.replace('Produit:', '').trim();
  return productsText
    .split(/[.,]/)
    .map(p => cleanText(p))
    .filter(p => p && p.length > 2);
}

async function importFile() {
  console.log('='.repeat(70));
  console.log(`🚀 IMPORT ${CATEGORY}`);
  console.log('='.repeat(70));
  
  // CHEMIN DU FICHIER
  const filePath = 'C:\\Users\\User\\Documents\\ALGERIAEXPORT_FINAL\\DOCUMENTS\\20260301_agriculture.txt';
  
  // CRÉER LE FICHIER (car tu as collé le contenu dans le chat)
  console.log('📝 Création du fichier...');
  const content = `AGRICULTURE

AMADHAGH IMPORT EXPORT, sarl
Centre Bendjellil, Biskra
Tel: +213 554 819636 / 661 745734
Fax: +213 33 587126
@: abguidoum@gmail.com / contact@amadhagh.dz / amadimex@yahoo.fr http: www.amadhagh.dz
Produit: Fruits et Legumes. Dattes.

AMARIUS, sarl
Z.I Khemisti, Lot 20, Ain El Hadjar, Tlemcen
Tel: +213 40 917344
Fax: +213 43 434744
Produit: Graines de caroube.

AMRANI FOUDHIL
Cite Farfar, Commune Tolga, Biskra
Tel: +213 556 396334
@: amrani79931@gmail.com 
Produit: Dattes fraîches.

AMSAMTEX IMPORT EXPORT, sarl
Local 701 Cite 360 Logt, BT D36 Ben Aknoun, Alger
Tel: +213 550 096690
@: alsamtex@gmail.com / amsamtex2017@goldendattes.fr 
http: www.goldendattes.fr
Produit: Dattes fraîches «Deglet Nour», Margarine (non liquide), sauces harissa, pâtes alimentaires (cuites ou farcies), semoules de ble dur, cafe, preparations et conserves de poissons, eaux minerales.

AQUASUB, eurl
23, Rue Idir Toumi Ben Aknoun, Alger
Tel: +213 550 602870
@: toufikabi@gmail.com
Produit: Truffes, a l’etat frais ou refrigere.

ARKHEL ORCHARD, sarl
Saâdouna ouest Gouraya, Tipaza
Tel: +213 661 602720
@: sarl_msf@yahoo.fr 
Produit: Dattes.

ARSO BOUCHERIT, eurl
Lotissement 237 parti n°02 Sidi Okba, Biskra
Tel: +213 555 843510
Fax: +213 33 623016
@: arsoboucherit@gmail.com 
Produit: Dattes.

AT EXPORT, sarl
Hay Krim Bbelkacem, Groupe n°03, Lot n°01 local n°02, Dar El Beida, Alger
Tel: +213 676 964250
Produit: Dattes.

ATIA ASAAD ISLAM
Route Nationalee n°05, Farfar, Tolga, Biskra
Tel: +213 33 597222 / 774 549358
Fax: +213 33 597222
@: atiaassadislam@gmail.com
Produit: Dattes fraîches «Deglet Nour».

AZIZA INTERNATIONAL TRADING, sarl
Biskra, Biskra
Tel: +213 661 550 210 / 07
Produit: Dattes fraîches «Deglet Nour».

BAB EL DJAZIRA EXPORT, eurl
Lotissement Benyahia Chaiba, Tipaza
Tel: +213 665 481780
@: eurl_bab_el_djazira_export@gmail.com 
Produit: Carottes et navets frais

BACHA MOHAMED AMINE
Pavillon 311, Sellier, Hydra, Alger
Tel: +213 551 250250
 @: bachaamine@live.fr 
Produit: Dattes.

BAHIA CENTRE, eurl
Route Sidi M’hamed, Oran
Tel: +213 41 452925
Produit: Dattes fraîches «Deglet Nour».

BANQUISE MEDOC, sarl
Cite Houari Boumediene n°29, Chelghoum Laïd, Mila
Tel: +213 31 481797 / 555 995156
Fax: +213 31 481797
@: msatechnologies.dz@gmail.com 
Produit: Dattes.

BARDJAMANA IMPORT EXPORT, sarl
Lot Kheireddine, Rue Saker Lazhar n°03, Biskra
Tel: +213 661 376494 / 33 558234
Fax: +213 33 558234
@: bardjamana07@gmail.com
Produit: Dattes fraiches «Deglet Nour». Fruits et Legumes. Biscuits de dattes. Dattes fourrees aux amandes. Dattes fourrees au Chocolat. Poudre de dattes. Miel de dattes. Confiture de dattes. Huile d’olive. Produits agroalimentaires.

BATIFIX, sarl
890, Cite les Oliviers, El Kiffan, Tlemcen
Tel: +213 43 272350 / 770 507160
Fax: +213 43 272350
@: batifix.dz@gmail.dz 
http: www.batifix.dz 
Produit: Dattes.

BAWABAT LIWA IMPORT EXPORT, eurl
2eme etage n°39 Ferme Ferroudja, Ben Omar, Kouba, Alger
Tel: +213 550 967197 / 553 929873
@: bawliwa2016@hotmail.com 
Produit: Dattes.

BELKIS ET SAFIA, sarl
Route d’Annaba, Tebessa
Tel: +213 696 703540
Produit: Oignons sauvages.

BEN ABBES TRANSFORMATION ET CONDITIONNEMENT DE FRUITS ET LEGUME, eurl
Z.A n°06-07 Oumache, Biskra
Tel: +213 33 628241 / 661 577067
@: eurlbenabbes@yahoo.fr 
http: www.eurlbenabbes.com 
Produit: Dattes.

BEN DJEDDOU FOUZI FOUZI
Cite d’Oasis, Tolga, Biskra
Tel: +213 561 326297
@: medatte07@gmail.com 
Produit: Dattes.

BENAMOR ABDERAZZAK, sarl
Cite Sedra Khemisti, Tissemsilt
Tel: +213 560 284710
Produit: Pommes de terre.

BENBDELHALIM MOKADDEM FOUZI-BFM
Route de Bousaada Tolga, Biskra
Tel: +213 47 2099999 / 550 598099
Fax: +213 47 209999
@: ahmedamine1999@yahoo.fr 
http: www.bmfouzi.com 
Produit: Dattes.

BENGHENAM IMPORT EXPORT, eurl
Cite 686 Logts, Salah Bey, Setif
Tel: +213 772 552676
Produit: Dattes fraîches, Caroube, graines.

BENZAZA, sarl
Ferme Benza, Z.A, Ain Noussy, Mostaganem
Tel: +213 45 274878 / 770 946666 / 669 758422
Fax: +213 45 274514
@: awbenzaz@yahoo.fr / sarl.benzaza@yahoo.fr 
Produit: Pommes de terre.

BIO EXPORT ALGERIE, sarl
Cite des Annasser Bt 37, Kouba, Alger
Tel: +213 560 962397
@: coobioexport@gmail.com 
Produit: Œufs.

BIODATTES ALGERIE, eurl
152, Cite Khemisti 407, Residence Salem Bir El Djir, Oran
Tel: +213 33 581334 / 799 301721
Fax: +213 21 773586
@: contact@biodattes.com 
http: www.biodattes.com 
Produit: Dattes.

BIONOOR, sarl
46, Rue Khelifa Boukhalfa, Alger
Tel: +213 774 284400
@: hadj.khelil@bionoor.com 
http: www.bionoor.com 
Produit: Dattes.

BOUARFA BUSINESS TRADE, eurl
02, Rue de Brazza, El Mouradia, Alger
Tel: +213 21 602653 / 693732 / 555 813042
Fax: +213 21 602653 / 693732
@: contact@bouarfabtrade.com 
Produit: Dattes.

BOUKELLAL MOHAMMED TAHAR PRESTIGE DATTES
Tillef 13,70 commune de Bazer Sakra, BP 42, El Eulma, Setif
Tel: +213 550 553379 / 541 346135
Fax: +213 36 769257
@: boukellal@yandex.ru / prestige.dattes@yandex.ru 
http: www.prestigedattes.com 
Produit: Dattes.

BOURAYOU ABDELKRIM
Rue, Belfassi Messaoud et Anter Achir El Malah, Aïn Temouchent
Tel: +213 43 644870 / 556 835084
Fax: +213 43 644870
@: etsvidatil@gmail.com
Produit: Dattes fraîches «Deglet Nour».

BOUREBA IMPORT EXPORT, eurl
Rue du Mars 1962, Bouira / Cite 1100 Logements, Cooperative Ouadah, Bouira 
Tel: +213 555 461226
@: eurlboureba@yahoo.com 
Produit: Oignons et echalotes.

BOUTI BOUDRAA EXPORT AGROALIMENTAIRES-SBEPA, sarl
24 Avril, Touggourt, Ouargla
Tel: +213 29 673343
Fax: +213 29 674527
@: boutidjamel@yahoo.fr 
Produit: Fruits et Legumes, Dattes.

CASA, sarl
Zone Depôt 6, n°05 El Nedjma, Oran
Tel: +213 41 336878 / 555 616264
Fax: +213 41 337474
@: contact@errahikhoney.com / zm@casa.dz 
http: www.errahikhoney.com
Produit: Miel, Pollen.

CEDPA, sarl
Z.I Beni Hamidine 115C, Les Eucalyptus, Alger
Tel: +213 23 939451 / 52 / 560 952577
Fax: +213 23 939453
@: dg_sarl.cedpa@yahoo.fr
Produit: Fruits et Legumes. Dattes fraîches «Deglet Nour». Dattes fraîches. Fraise.

CHALOUCHE DJAMEL, ets
Fraction El Kerroucha Beni Slimane, Medea
Tel: +213 555 474340
@: dj.chelouche@yahoo.fr 
Produit: Fruits et legumes.

CHEIKH BOUAMAMA IMPORT EXPORT, sarl
127, Avenue Colonel Amirouche BP 641 El Menia, Ghardaïa
Tel: +213 29 211394 / 1225 / 661 645933
Fax: +213 29 211226
@: steouledsidcheikh@yahoo.fr 
Produit: Dattes.

CHENNAF FAOUZI EXPORT, eurl
Cite Sâada El Meghair, El Oued
Tel: +213 699 004160
Produit: Dattes.

CHERFAOUI COM, eurl
Ain Oulmen, Setif
Tel: +213 661 356930
@: amar.cherfaoui@gmail.com 
Produit: Racine de pyrethre.

CHERGUI MOHAMED
Rue Ghedab Derradji, Bouchagroun, Biskra
Tel: +213 552 319570
Produit: Dattes.

CO DATTES BENSALEM, sarl
Boulevard Si Houes, Tolga, Biskra
Tel: +213 33 787469
Fax: +213 33 787469
Produit: Dattes.

COMFORT TRADE, sarl
Lot n°08, 372 Lotissements, 19 Mai 1956, Bloc«A», Annaba
Tel: +213 550 524260
@: mohamedbiad374@gmail.com / comforttrad9@gmail.com
Produit: Dattes.

COMPAGNIE ALGERIENNE TRADING MITIDJA-CATM, sarl
Centre Sidi Abed, Tessala El Merdja, BP 25 Birtouta, Alger
Tel: +213 23 584156 / 550 286323 / 584 161062
Fax: +213 23 584155 / 57
@: sarlcatm@hotmail.com / tahar.tahir@catmdz.om 
Produit: Fruits.
 
COMPLEXE AGROALIMENTAIRE D’EL KSEUR, sarl
Z.A El Kseur, Bejaïa Tel: +213 34 822528
Fax: +213 34 822522
@: dcomcaa@gmail.com 
Produit: Aliments de betails

D.F.I.E, sarl
61, Rue de la Palestine, Blida
Tel: +213 556 232465 / 557 050255
Fax: +213 25 393013 / 21 321378
Produit: Dattes.

DANOR, sarl
Zone d’equipement, Route de Batna, Biskra
Tel: +213 33 657562 / 64
Fax: +213 33 657564
@: dg@danordz.com 
http: www.danordz.com 
Produit: Dattes.

DATE LAND, sarl
Rue du 1er Novembre Foughala, Biskra
Tel: +213 33 580046
Fax: +213 33 580046 / 670 377577
@: sarl.dateland@gmail.com 
Produit: Dattes.

DATOL EXPORT, eurl
122, Avenue Si El Haoues,Tolga, Biskra
Tel: +213 33 581395 / 551 878370
Fax: +213 33 581396
@: datol@hotmail.fr 
Produit: Dattes.

DATTES CHETTI, eurl
Cite Al Alia El Meghaier, El Oued
Tel: +213 32 194554 / 001 / 661 385289
Fax: +213 32 194554 / 001
@: contact@dattechetti.com / info@ dattechetti.com / dates.chetti@yahoo.com 
http: www.dattechetti.com
Produit: Dattes.

DATTES COFFEE, sarl
16, Rue Mohamed Sassi, El Biar, Alger
Tel: +213 21 920325
Fax: +213 21 920325
@: coffee_foods@yahoo.fr 
Produit: Dattes.

DATTES LICIOUS, eurl
Rue 1er Novembre, Foughala, Biskra
Tel: +213 33 580475
Fax: +213 33 580475
@: ak.dattelicious@gmail.com 
Produit: Dattes.

DEKACHIM, sarl
Cite 100 logt, Zeralda, Alger
Tel: +213 23 325608 / 561 259964
@: dekachim@hotmail.fr / sarl_dekachim@hotmail.fr
Produit: Produit bio insecticide fongicide.
 
DELHOUM DATTES, sarl
49, Rue Hassiba Ben Bouali, Alger
Tel: +213 542 527640
@: delhoumdatte@gmail.com
Produit: Dattes fraîches «Deglet Nour».

DJAOUHARAT TITRI LITANMIA EL MOSTADAMA, sarl
Cite 01 Novembre Beni Slimane, Medea
Tel: +213 550 282810
Fax: +213 25 714604
Produit: Legumes.

DJEFFAL NABIL IMPORT EXPORT, eurl
Cite Souissi Brahim Bouzitouna de Nord, Commune de Sidi Okba, Biskra
Tel: +213 663 087580
Produit: Dattes fraîches.

DJENANE CHREA EXP, sarl
Cite El Medjadji n°31,04, Blida
Tel: +213 554 578115 / 790 093904
@: agrolinedz@gmail.com 
Produit: Dattes, grenade.

DMPRO EXPORT, sarl
Lotissement 19 Mai 1956, Baba Hassen, Alger
Tel: +213 561 691683 / 549 578783
Fax: +213 21 350340
@: contact@dmproexport.com 
http: www.dmproexport.com 
Produit: Fruits et legumes.

EL ABRADJ IMPORT EXPORT, sarl
Hai Khemisti Hlm 525 Logts ILot A 2-5, Bt 04, Etage 01 Route 06, Oran
Tel: +213 559 176980
Produit: Dattes fraîches «Deglet Nour».

EL AHLIA EXPORT, sarl
Cite Dou, Z.I 4, Lot 233 local n°1, Bab Ezzouar,Alger
Tel: +213 21 245876 / 661 526358 / 770 940354
Fax: +213 21 245876
Produit: Truffes.

EL BISKRIA COMMERCIALISATION DE PRODUITS AGRICOLES-ECPA, sarl
Z.I de Biskra, BP 457 RP 07000, Biskra
Tel: +213 61 314566
@: bicpag@yahoo.fr 
Produit: Dattes.


EL FALAK, sarl
n°65 Cite la Tafna Local n°01 Maghnia, Tlemcen
Tel: +213 550 091800
@: sarl.elfalak@gmail.com 
Produit: Dattes.

EL MACHROHA, eurl
Rue Serdouk Boudjemaa Mechroha, Souk Ahras
Tel: +213 554 026080
Produit: Œufs fertilises destines a l’incubation De volailles de l’espece Gallus domesticus.

EL MANAKIBE COMPUTER, sarl
Cite Belle Vue G3 Garidi n°21 Kouba, Alger
Tel: +213 35 744040 / 474411
Fax: +213 23 708515 / 744111
Produit: Dattes fraîches «Deglet Nour».

EL MOSTAKBAL SERVICES AGRICOLES, eurl
Zone El Djadaida, Guemar, El Oued
Tel: +213 20 943964 / 661 786155 / 770 384892
Fax: +213 32 202530
@: mousagrico@gmail.com / info@ datteselmostakbal.com
http: www.datteselmostakbal.com 
Produit: Dattes.

EL MOUKHTAR. CO (ETS BISKRI MOHAMED MOKHTAR)
Lot Benghana n°03 Biskra, usine Zaatcha Ben Boulaïd EL Hadjeb, Biskra
Tel: +213 33 754367 / 661 620840 / 554 257811
Fax: +213 33 754367
@: elmoukhtarco@hotmail.fr 
http: www.dattesmoukhtar.com
Produit: Dattes Deglet Nour Fraîches (Branchee et Regime), Dattes Deglet Nour Conditionnees. Dattes Deglet Nour Conditionnees Denoyautees, Dattes, Fruits et Legumes, Derivees de la Dattes.

EL NADJAH AGRO, eurl
Rue Si Djeloul Belmiloud, Cherchel, Tipaza
Tel: +213 24 330351 / 550 591006 / 929992
Fax: +213 24 330351
@: mokdadi@yahoo.fr / elnadjahagro@gmail.com 
Produit: Dattes fraîches «Deglet Nour», Fruits et Legumes.




EL NAKHLA EL DJAMILA IMPORT EXPORT, eurl
Cite wouroud, M’Sila
Tel: +213 550 947423 / 561 691683
Fax: +213 21 350340
@: mounir13070@gmail.com
Produit: Dattes fraîches «Deglet Nour».

EL SABAH, sarl
Route de Hamam Melouane, Bougara, Blida 
Tel: +213 25 251365
Fax: +213 25 303035
@: elsabah.group@gmail.com / elsabah.blida@gmail.com
http: www.elsabahgroup.com
Produit: Olives, fruits et legumes, dattes

ELITE IMPORT EXPORT, sarl
Hai Daya Bd Chopuhada n°03, Oran
Tel: +213 554 267000
Produit: Dattes fraîches «Deglet Nour».

EPICES AGRO, eurl
Bab Ezzouar, Alger
Tel: +213 541 780000
@: secexport@gmail.com 
Produit: Dattes, epices.

EXPLATEAU, sarl
9A Cooperative El Yasmine, Khraicia, Alger
Tel: +213 559 414746 / 550 102435
@: mohamedali121271@yahoo.fr
Produit: Dattes fraîches «Deglet Nour», Fruits et Legumes.
 
FARES ABDELHAKIM DES DATTES, eurl
Cite Ben Dekiche, Rue Kouaoussi Deraddji Barika, Batna
Tel: +213 559 64103
Produit: Dattes fraîches «Deglet Nour».

FATIMA BAY EXPORT, eurl
Rue Boukabous Hocine Cite Ayouf Ouest Local A, Jijel
Tel: +213 34 478867
Produit: Oignons et echalotes.

FEET COM EXPORT, sarl
38, Lot des Jeunes Aveugles, Draria, Alger
Tel: +213 23 595016
Fax: +213 23 595016
@: info@foodalgeria.com 
Produit: Figues.

FERDJALLAH AZZOUZI
Cite 80 Logement Tolga, Biskra
Tel: +213 770 640850
@: luxiatolga07@gmail.com 
Produit: Dattes.

FIDEL NEOCE, sarl
Cite Younci Amer n°118 Bordj El Kiffan, Alger
Tel: +213 23 873204 / 662 045735 / 550 960203
Fax: +213 23 873204
@: sarlfidelnegoce@outlook.fr 
Produit: Miel de dattes.

FIRST FEET, sarl
Kouassemia 203 Lot 04, Chlef
Tel: +213 541 141045
@: firstfeet88@gmail.com 
Produit: Poulets congeles.

FORA DATTES, sarl
06, Rue Ramdane Ouramdane Bt Major Abderahmane Mira 09, Alger
Tel: +213 550 861180
@: allamsofiane@hotmail.com 
Produit: Dattes fraîches «Deglet Nour».

FRERES HELLAL DATTES, eurl
Rue Emir Abdelkader, Tolga, Biskra
Tel: +213 33 759655 / 581140 / 550 012199
Fax: +213 33 581140
@: dattes07@live.fr 
Produit: Dattes.

FRIGOMEDIT, epe/spa
Rue des Freres Ferradj & Zabana, cite des Cators, Carrefour Rouiba, Alger
Tel: +213 23 861411 / 558 588954
Fax: +213 23 861455
Produit: Dattes fraîches «Deglet Nour», harissa, Œufs d’oiseaux, Abricots, cerises, peches, Pommes de terre, Legumes conserves provisoirement, Jus de fruits, Autres fruits frais.

FRSK IMP EXP, eurl
Cooperative Kerdoua 37, Birkhadem, Alger
Tel: +213 550 587935
Fax: +213 23 271370
Produit: Dattes fraîches.



FRUITS EL BARAKA, eurl
Cite El Makhbat Avenue S n°03, Blida
Tel: +213 25 468151
Fax: +213 25 468153
Produit: Truffes.
 
FRUITS STORE EXPORT, eurl
67, Rue Cherif Debbih, Alger
Tel: +213 21 712066 / 771 806476 / 556 368886
Fax: +213 21 711735
@: fruitsstoreexport@yahoo.com
Produit: Truffes, Fraise, Abricot, Raisin, Pomme de terre.

FRUITS TASSILI, eurl
Cite 206 Logts Bt 21 S° 04 Ouled Yaich Blida
Tel: +213 661 771717 / 668 771527 / 556 641553
Fax: +213 25 401744
@: fruitassili@hotmail.fr
Produit: Autres legumes frais, fraises.

FRULLEG, sarl
Lieu Dit Tazmalt Centre, Commune Tazmalt, Bejaïa
Tel: +213 542 142230
@: frulleg.ol@gmail.com 
Produit: Pommes de terre.

GBK FOOD, sarl
Cite Saidani Djilali Local n°08 a, Ouled Hedadj, Boumerdes
Tel: +213 552 012211 / 550 529083
@: benboureklotfi@gmail.com 
Produit: Dattes.

GLOBAL TRADE SAHARA, eurl
Aïn Beida, Lot 04, Local 01, Ouargla
Tel: +213 29 792045 / 660 432391 / 550 325521
Fax: +213 29 793075 / 732094
@: globaltradesahara@gmail.com
Produit: Truffes, Dattes, Pignons de pin, Fruits et Legumes.

GOLDEN SEED, sarl
Cite Saliba n°24, Z.I Oued Smar, Alger
Tel: +213 21 207149 / 23 924554
Fax: +213 21 207129 / 23 924559
@: goldenseed.dz@gmail.com 
Produit: Dattes.

GRAND SUD SERVICES, sarl
Cite Gouifla Zelfana,, Ghardaïa
Tel: +213 770 543866 / 660 391312
@: sud_gss@hotmail.fr / sarlgss@hotmail.fr 
Produit: Dattes fraîches «Deglet Nour».

GREEN OIL NUTRITION, sarl
Lot 12, Cite Mohamed Chaabani, BP 166, Hassi Messaoud, Ouargla
Tel: +213 29 799008 / 661 249351
Fax: +213 29 744451
http: www.greenoilnutrition.com 
Produit: Extrait naturel de dattes.

GREEN PALM, eurl
Cite des Dunes GP de propriete n°22, Lot: 05,Cheraga, Alger
Tel: +213 23 226334 / 553 887967
Fax: +213 23 226334
@: sevendates@outlook.com / selectdatte@outlook.com
http: www.sevendates.net 
Produit: Dattes.

GRINE MOHAMED
Rue, Mehamed Chirif Commune Bordj Ben Azzouz, Tolga, Biskra
Tel: +213 558 400920
Fax: +213 33 577931
@: grine_export@yahoo.fr 
Produit: Dattes.

HABBAS EXPORT, eurl
Local n°01 bis, Lieu dit Alma, Bouzeguene Centre, Tizi Ouzou
Tel: +213 555 752058
@: habbasmerzouk@gmail.com 
Produit: Fruits et Legumes. Dattes.

HADDOUD MONCEF, ets
Boulevard Des Freres Saib, Tolga, Biskra
Tel: +213 33 581392 / 770 493730
Fax: +213 33 581392
@: contact@haddoudexport.com 
http: www.haddoudexport.com 
Produit: Dattes.

HADDOUD SALIM,
Z.A, Tolga, Biskra
Tel: +213 33 581259 / 60 / 774 278727
Fax: +213 33 581257
@: haddou_s@yahoo.fr 
http: www.etshaddou.com 
Produit: Dattes.

HAL NEGOCE, sarl
Cite 24 lgts, BT 34, n°33, Bouchaoui Cheraga, Alger
Tel: +213 23 276311 / 699 667709 / 552 181094
Fax: +213 23 276311
@: Nabil.maksene@hotmail.fr 
Produit: Dattes.

HAMEL RACHID, sarl
EAI, Hassi Bounif, Oran
Tel: +213 770 303290
Fax: +213 41 292550
@: har31@hotmail.com 
Produit: Fruits et legumes.

HAMPTON ALGERIA, eurl
Centre des affaires Bab Ezzouar, Alger
Tel: +213 656 034400
@: contact@hampton.com 
http: www.hamptondates.com 
Produit: Dattes.

HASSANI DATTES, eurl
Rue Badi Lakhdar, Hai Kabluti, Biskra
Tel: +213 33 731131 / 557 683179
@: hassani.a.ghani@gmail.com
Produit: Fruits et Legumes, Dattes fraîches «Deglet Nour».

HAYATI IMPORT EXPORT, eurl
Hai Tamaris 25 Local S, Mohammadia, Alger
Tel: +213 665 637720
Produit: Dattes fraîches «Deglet Nour».

HELIMET BRAHIM EL KHALIL
Route Nationalee n°03 Bouchagroune, Biskra
Tel: +213 552 166950
@: bahihlimet@gmail.com 
Produit: Fruits et Legumes. Dattes.

HELIMET LAKHDAR
03, Route de la Wilaya Tolga, Tolga, Biskra
Tel: +213 33 574056 / 550 226058 / 770 615715
Fax: +213 33 574056
@: samahabiskra1@gmail.com
Produit: Fruits et Legumes, Dattes fraîches «Deglet Nour».
 
HELIMET MOHAMED CHAABANI
Bouchagroune, Tolga, Biskra
Tel: +213 557 210130
@: samahabiskra1@gmail.com 
Produit: Fruits et Legumes, Dattes.

HUBBARD ALGERIE, eurl
99, Les Vergers, Birkhadem, Alger
Tel: +213 550 969303
@: contact@hubbardalgerie.com 
http: www.hubbardalgerie.com
Produit: OAC et poussins reproducteurs chair.

HYDROTOBATO, sarl
19 Rue des Freres Smail Challal Sidi M’hamed, Alger
Tel: +213 21 690725
Fax: +213 21 690716
Produit: Dattes fraîches.

IBN FAHR IMPORT EXPORT, sarl
15 Hai El Moudjahidine, Ben Aknoun, Alger
Tel: +213 671 161780
Fax: +213 21 926172
@: sarlibnfah@yahoo.fr
Produit: Asperges, Fenouil, Pruneaux Dattes .

ILYA TRINGLE IMPORT, eurl
Cite Hachemi n°58/G4 1er Tranche B, Setif
Tel: +213 36 638163
Fax: +213 36 638162
Produit: Oignons et echalotes.

IMPEX UNIVERSAL BUSINESS, SARL
Belle Residence 16027 Bab Ezzouar, Alger
Tel: +213 23 884913
Produit: Grenades, figues de Barbarie, kakis, jujubes, Fraises, Pasteques, Choux fleurs et choux fleurs brocoli, Betteraves, fenouil, Carottes, Artichauts, Dattes fraîches «Deglet Nour».

INTERNATIONAL BIOGOODS EXPORT, sarl
Cite 08 Mai 45 Bt 2c Appt n°10, Bab Ezzouar, Alger
Tel: +213 661 446719
Fax: +213 21 731345
@: biogoods.export@gmail.com 
http: www.idcbona.com
Produit: Dattes fraîches.

IVDIDEN EXPORT, sarl
Route d’Alger, Lots n°03, 12 Lgts LSP Draâ El Mizan, Tizi Ouzou
Tel: +213 26 135007 / 770 555212 / 780 503886
Fax: +213 26 135007
@: sarlivdiden@gmail.com 
Produit: Dattes.

JNANI, eurl
Z.I Souf El Tel Chamel Section 03, Groupe de Propriete n°26, Aïn Temouchent
Tel: +213 667 709990
Produit: Dattes fraîches.

KABIR AGRO INDUSTRIE, sarl
Ville de Setif
Tel: +213 550 473450
Fax: +213 36 693232
@: sarlkabir.setif@gmail.com 
Produit: Gingembre.

KECHROUD KHALED
Rue Si El Haouas, Tolga, Biskra
Tel: +213 33 597395 / 559 192233
Fax: +213 33 597395
@: khaled.kechroud@gmail.com
Produit: Dattes fraîches «Deglet Nour», Figue, Figue de barbarie, Persil, Coriandre, Menthe, Fruits et Legumes.

KERBAA ABDELKARIM, ets
Hai Saâda, Biskra
Tel: +213 33 759641 / 555 408748
Fax: +213 33 759641 / 655121
@: kerbaaa@yahoo.fr 
Produit: Dattes.

KHALAF BEN SAYAH IMPORT EXPORT, eurl
Rue de La Republique n°05, Bouchagroun, Biskra
Tel: +213 33 573731 / 550 062895
@: bidi071975@gmail.com
Produit: Dattes fraîches «Deglet Nour».

KHIR BLADI EXPORT, sarl
Cite El Hamiz 04, Groupe 01 Lot n°13, Dar El Beida, Alger
Tel: +213 23 867304 / 550 713313
Fax: +213 23 867304
@: moh.307@hotmail.fr
Produit: Dattes.

KISRANE MAKLOUF
Cite Baarir Ferfar, Tolga, Biskra
Tel: +213 33 787188 / 561 297859
Fax: +213 33 787888
@: ks.eexporrt@yahoo.fr
Produit: Dattes fraîches «Deglet Nour».

KOUTOUF BILADI, eurl
Cite Beaulieu, Rue 06 n°43 Local A, Oued Smar, Alger
Tel: +213 540 054610
@: blabahdidi@gmail.com / rosiersrouges2018@gmail.com 
Produit: Dattes.

KRIMO AGRO EXPORT
12 Avenue Colonel Lotfi Bab El Oued, Alger
Tel: +213 21 979225 / 550 954305
Produit: Amidon.

LABED ABDELKADER
Bouchegroune, Biskra
Tel: +213 775 588220
Produit: Dattes.

LABED AISSA
Rue Nabchi Mohamed, Biskra
Tel: +213 779 201520
@: tamerlabed@hotmail.com 
Produit: Dattes fraîches.

LABED ZINEDDINE
Rue Bendjaballah Messaoud, Biskra
Tel: +213 33 773716 / 561 310361
@: lzkbouchag@yahoo.fr
Produit: Dattes fraîches «Deglet Nour».

LALIOUI POUR COMMERCIALISATION, eurl
Ain El Kebira, Setif
Tel: +213 36 598061 / 550 751963
Fax: +213 36 598061
@: irabah@hotmail.com
Produit: Eaux gazeifiees additionnees de sucre ou d’autres edulcorant, Gingembre, Dattes fraîches «Deglet Nour».

LAMARA FETHALLAH
Rue Elamir Abdelkader, Sidi Khaled, Tolga, Biskra
Tel: +213 553 417820
@: lamara.fathallah@gmail.com 
Produit: Dattes fraîches «Deglet Nour».

LAND BRAWEN INTERNATIONAL
Mih Ouanssa, El Oued
Tel: +213 550 130450
@: landbrawen@gmail.com
Produit: Dattes fraîches «Deglet Nour».

LC BUSINESS IMPORT EXPORT, sarl
n°20 Lot, Sofra Nord Grp G Hamiz, Dar El Beida , Alger
Tel: +213 770 990730
Produit: Dattes fraîches «Deglet Nour», fraise, Noix de coco, noix du Bresil et noix de cajou, Tomates, a l’etat frais ou refrigere, Huile d’olive et ses fractions.

LEBDI ABDELHAMID
Cite Triangle Universitaire n°03, Bechar
Tel: +213 49 812638 / 798 281743 / 560 544218
Fax: +213 49 238251 / 812638
@: hamilil@hotmail.fr
Produit: Fruits et Legumes, Raisin, Fraise, Grenade, Figue, Figue de barbarie, Pomme de terre, Tomate, Poivron, Piment, Petit pois, Carotte, Artichaut, Ail, Truffes

LEBSSISSE TOUFIK
n°07 Bloc 214, Sidi Ameur Temacine, Ouargla
Tel: +213 29 633005
Produit: Dattes.

LES FRERES BOUCHEKAL EXPORT, sarl
Z.A n°71 Cite El Nakhil Tolga, Biskra
Tel: +213 550 574460
Produit: Dattes.

LES FRUITS DU DESERT, sarl
Etage 5 Tranche 34 Rsl 388 ilot 122 Hai Ibn Roched Angle Rue F Et Rue A, Act Point du Jour, Oran
Tel: +213 549 298480
Produit: Dattes fraîches «Deglet Nour».

LES HUILERIES EL DJURDJURA
Ville de Bouira
Tel: +213 26 909470 / 770 165316
@: elhorra.etb@gmail.com 
http: www.eldjurdjura.com 
Produit: Huile d’olives.

LIOUA DATTES EXPORT, eurl
n°57, cooperative immobiliere «en bande», Bordj El Bahri, Alger
Tel: +213 554 917518 / 673 248109
@: eurllioua@outlook.com
Produit: Dattes fraîches «Deglet Nour».

MABROUKI ABDELAZIZ
Ain Soufi Nahdj Republique 15, Bouchagroune, Biskra
Tel: +213 772 601640
@: mabrouki.abdi@hotmail.fr 
Produit: Dattes fraîches.

MAFATIH EL KHEIR EXPORT, sarl
Cite Bouzegza, B08 n°10, Alger
Tel: +213 797 514680
@: mafatihelkheirexportmail.com 
Produit: Dattes.

MAKA FAOUZI EXPORT, eurl
Rue de la paix, Sedrata, Tlemcen
Tel: +213 659 711160
Fax: +213 37 777101
@: canalge2016@hotmail.com
Produit: Dattes.

MAMINE EXPORT,
Rue de Liberte, Commune El Menia, Ghardaïa
Tel: +213 29 211455 / 555 755544
Fax: +213 29 211455
@: mamine.export@gmail.com 
Produit: Produits agricoles, Dattes.

MANA HICHEM
Cite Lousif Elhamel, Commune de Tolga, Biskra
Tel: +213 33 599100
Fax: +213 33 599100
@: manadates@yahoo.fr
Produit: Dattes fraîches «Deglet Nour».

MATOX, sarl
Cite 1er Novembre Ksar El Boukhari, Medea
Tel: +213 667 493910
@: matoxexport@gmail.com P
Produit: Fruits et legumes.

MAZOUZI YOUCEF
64, Housing Estate Messelmoun, Tipaza
Tel: +213 24 336133 / 541 916684
Fax: +213 541 916684
@: algeriafood@gmail.com 
Produit: Dattes.

MEITAH RABAH, ets
Quartier El Ouahat, Tolga, Biskra
Tel: +213 33 581176 / 561 686660 / 00 33 625
903194 / 551 518292 / 555 456891
Fax: +213 33 581176
@: rabahmeitah@yahoo.com 
Produit: Dattes Deglet Nour.

MELIANI TARIK
Cite El Feth Rue 260 n°22 Maghnia, Tlemcen
Tel: +213 771 535350
Fax: +213 43 305070
Produit: Dattes.

MERZOUGUI NABIL
Cite Yahyaoui Abdelhafid n°21, Sidi Okba, Biskra
Tel: +213 557 425155
@: nabilmr25.com@gmail.com 
Produit: Dattes fraîches «Deglet Nour».

MIXTRADE, eurl
Rabah Garidi Lot 6 Ouled Hadjadj, Boumerdes
Tel: +213 560 084252 / 550 244954 / 499157
Fax: +213 24 709339
@: info@mixtradedz.com
http: www.mixtrade.dz
Produit: Autres produits fourragers (betteraves).

MNH SAVEURS AMAZIGH
25, Mustafa Ben Boulaid, Alger
Tel: +213 699 761327
Produit: Tomates seches.

MOKABLI DESIGN, sarl
Route de Berbissa ilot 50 Section 11, Kolea, Tipaza
Tel: +213 23 322161
@: info@mokablidesign.com
http: www.mokablidesign.com 
Produit: Dattes fraîches.

MRHN IMPORT EXPORT, eurl
Ue Kious Mohamed Bt (J) Local 50 L, Tranche 02, Alger
Tel: +213 77 254000@: mrhn.export@yahoo.com 
Produit: Dattes fraîches, Mayonnaise.

NAKHIL EL MEDINA, eurl
Hai Cheikh Bouamama n°121 ilot Or Planned Landsuving n°02, Oran
Tel: +213 556 609993 / 771 100210
@: nakhilmedina@gmail.com 
Produit: Dattes.

NANI FOOD, sarl
Hai Ouled Belhadj, Saoula, Alger
Tel: +213 23 596504 / 661 318585
Fax: +213 23 596505
@: nanifoods@yahoo.fr
Produit: Fruits et Legumes, Dattes.

NASSRE EL DIN ISLAME EXPORT, eurl
Cite Slimani Mohamed, Rue 05 n°154 Eucalyptus, Alger
Tel: +213 560 045030
@: dzahmed326@gmail.com
Produit: Choux fleurs et choux fleurs brocolis frais.

NATURAMA ALGERIE, sarl
Angle de la Rue Patrice Lumumba et Maurice Audin, Souk Ahras
Tel: +213 561 894167 / 70
@: tarek3394@hotmail.fr
Produit: Feuilles de romarin sechees, graines et fruits des especes utilisees principalement en parfumerie, huile de romarin.

NOVEXA, sarl
Avenue des Freres Saouli, Biskra, Biskra
Tel: +213 770 700990
@: novexacontact@gmail.com 
Produit: Dattes.

ONID REALISATION ET INGIERIE, spa
Lot n°52, Z.I de Rouiba, Alger
Tel: +213 23 850264
Fax: +213 23 850273
@: onidri@hotmail.fr 
Produit: Fruits et Legumes.

OUADAH TOUMOUR, sarl
Centre Benkhelil, Blida
Tel: +213 550 303310
@: ouadahdattes@gmail.com
Produit: Dattes fraîches «Deglet Nour».

OUASDI INTERNATIONAL-CS, eurl
BP 42B, Rue Tekamera, Z.A Edimco, Bejaïa
Tel: +213 34 113333 / 664 342655
Fax: +213 34 113131
@: ouasdi@hotmail.com
http: www.carobalgeria.com
Produit: Caroubes, graine de caroube, farine de caroube, concassee de caroube, câpre, huile d’olive, huile d’olive, noyaux d’olive.

OULEKSER, sarl
Lot 110, logts cite 54 rass Bouira, Bouira
Tel: +213 560 986991 / 661 349097
Fax: +213 26 722365
@: lounislimam@gmail.com 
Produit: Huile d’olive.

OURAK IMPORT EXPORT, eurl
Cite Labdouat Tebesbest, Touggourt, Ouargla
Tel: +213 770 384920
Fax: +213 32 217221
Produit: Oignons

OVO ZACCAR sarl
105, rue Belkacem El Ouzri, Blida 
Tel: +213 25 233775
Fax: +213 25 233775
@: ovozaccar.dz@gmail.com 
Produit: Œufs de consommation

PALMARS, eurl
Centre Commercial Mehanaoui Ahmed El Eulma, Setif
Tel: +213 661 797900
@: hadilands@gmail.com 
Produit: Dattes.

PETRO MEBK INDUSTRIELLE, eurl
Fernand ville, Oran
Tel: +213 41 623951 / 770 501491 / 1280
Fax: +213 41 623960
@: contact@petroindustrie.com
http: www.petroindustrie.com
Produit: Dattes fraîches «Deglet Nour».

PHENIX DATTE, sarl
DROH Commune de Chetma, Biskra
Tel: +213 33 620913 / 751860 / 661 598404
Fax: +213 33 744128 / 620915
@: sarlphenixdatte@yahoo.fr / contact@ sarlphenixdatte.com
http: www.sarlphenixdatte.com 
Produit: Dattes.

PLAST ECO BISKRA, sarl
Rue Mohamed Nadjar n°10, 1er etage quartier de Lioua, Daira d’Oural, Biskra
Tel: +213 561 744860
@: ounis_27@yahoo.com
Produit: Dattes fraîches «Deglet Nour».

PRECIEUSE BOVINS ALGERIEN, sarl
Ferme n°7 Ouled Ahmed, Route de Mosquee 17, Bejaïa
Tel: +213 664 185700
Fax: +213 21 248280
@: nacib.nacib@yahoo.fr 
Produit: Dattes fraîches.

PRESTIGE OFFICE, eurl
Cite Sonelgaz, Lot 29 Local B, Gue de Constantine, Alger
Tel: +213 21 837876 / 27 / 550 088507
Fax: +213 21 837827
Produit: Dattes fraîches.

PRODIAK DATTES, sarl
Zone indsutrielle, Kouinine, El Oued
Tel: +213 32 238952 / 550 471583 / 502194
Fax: +213 32 238979
@: prodiak@yahoo.fr
http: www.dates-prodiak.com
Produit: Dattes

RACHEDI RACHID
Section 02 GP 256, Bordj El Bahri, Alger
Tel: +213 557 064940
@: rachidespagne1@hotmail.fr 
Produit: Dattes.

RAHMOUNE YAZID
Rue, du 01 Novembre Lichana, Tolga, Biskra
Tel: +213 664 889540
Produit: Dattes.

REBAHI IMPORT EXPORT, eurl
50, Rue Kritli Mokhtar, Beni Tamou, Blida
Tel: +213 775 873750
@: nadji1977@hotmail.com 
Produit: Dattes fraîches.

RIHAM EL CHARK, eurl
Tel: +213 542 198230
@: hamzawahid1991@gmail.com 
Produit: Pommes de terre.

RKBM TRADING, sarl
10, Rue Moussa Hamadache, Hussein Dey, Alger
Tel: +213 550 945120
@: sarlrkbmtrading@gmail.com 
Produit: Dattes fraîches «Deglet Nour», Gingembres.

ROUISSI SELAMI IMPORT EXPORT, eurl
Cite Djebel Djemâa, El Oued
Tel: +213 660 089873 / 791 026352
@: aminadattes@gmail.com 
Produit: Dattes.

SAADA YOUCEF FAROUK
Zone Urbaine Ouest Routede Tolga, Biskra
Tel: +213 549 425590
@: oasisdattesnour@gmail.com 
Produit: Dattes fraîches «Deglet Nour».

SADA DAT, eurl
Rue, El Abed El Hadi 9, Bouchagroune, Biskra
Tel: +213 555 124040
Produit: Dattes fraîches «Deglet Nour».

SAGRI FOOD, sarl
Cooperative Universitaire 88, Kouba, Alger
Tel: +213 21 282802 / 26
Fax: +213 21 282650
@: douguiz@hotmail.com / sagrifood@yahoo.fr 
Produit: Dattes.

SAHREX, eurl
Cite Nouvelle n°15 B Beni Mered, Blida
Tel: +213 560 009902
@: eurlsahrex@gmail.com 
Produit: Laine.

SALAM M’ZAB EXPORT, eurl
02, Cooperative Soummam, Reghaïa, Alger
Tel: +213 23 968641 / 7674 / 770 896060
Fax: +213 23 968641
@: salam.maz@gmail.com
Produit: Dattes fraîches «Deglet Nour», Truffes, Olives, Pasteque, Melon, Fruits, Legumes.
 
SALIM COBRA EXPORTATION, eurl
Tolga, Biskra
Tel: +213 771 440459
@: cobraexport@gmail.com 
Produit: Dattes fraîches.

SAVEUR DE GRAND SUD IMPORT EXPORT, eurl
Hai Ghouifla, BP54, Zelfane, Ghardaïa
Tel: +213 660 391310
@: sarlgss@hotmail.fr 
Produit: Dattes fraîches.

SAVEUR DU SAHARA, eurl
Cite 80 Logements Sidi Okba, Biskra
Tel: +213 557 425160
@: nabilmr25@gmail.com 
Produit: Dattes.

SAWALYLOU IMPORT EXPORT, sarl
R.N n°05 Villa 16, Bab Ezzouar, Alger
Tel: +213 23 832154 / 0550 461599
Fax: +213 23 832154
@: 213sawalylouimpexp@gmail.com 
Produit: Legumes.

SCTPAA-MEGA DATTE ELWAFA, eurl
40, Rue Mohamed Boudiaf, Cheraga, Alger
Tel: +213 21 373007 / 555 000500 / 560 024523
Fax: +213 21 373007
@: sctpaa@hotmail.com 
http: www.degletnour.net 
Produit: Dattes.

SED OASIS, sarl
Route nationale n°03, Bouchagrane, Biskra
Tel: +213 34 034279 / 561 686660
Fax: +213 33 756853
@: sed.oasis@hotmail.com 
http: www.sedoasis.com
Produit: Dattes fraiches et conditionnees.

SERENA IMPORT EXPORT, sarl
07, Rue El Ahram, Local n°01, Annaba
Tel: +213 667 328430
Produit: Escargots, Oignons sauvages, Echalotes, Châtaignes.

SERVINAL ALIMENTAIRE, sarl
Cite des 400 Logts Local n°02-03, Tixeraine, Birkhadem, Alger
Tel: +213 21 402395 / 771 447312
@: servinalag@yahoo.fr 
Produit: Dattes fraîches.

SETA GLOBAL, sarl
Rue 05 Juillet, n°26, El Harrach, Alger
Tel: +213 551 902109 / 656 953513
@: setaalgeria@gmail.com
Produit: Dattes fraîches «Deglet Nour».

SIMAC PLUS, sarl
Coop El Karama BT 111 Local 01, Hai 11
Decembre 1960, Boumerdes
Tel: +213 560 788100
@: assahoc80@outlook.fr
Produit: Dattes fraîches «Deglet Nour».

SOCIETE BOULAL, eurl
Sidi Amrane, El Oued
Tel: +213 550 467370
@: eurlboulal@gmail.com
Produit: Dattes fraîches «Deglet Nour».

SOCIETE GHEZZAL DATTES, sarl
Benthious Mekhadma, Biskra
Tel: +213 661 374718 / 33 571889
Fax: +213 33 571851
@: contact@ghezzaldates.com
http: www.ghezzaldates.com
Produit: Deglet Nour, Branchette, Ravier 500g/250g et Pâte de datte.

SOCIETE SOUF SEMOULE, sarl
Sidi Abdellah Chott, El Oued
Tel: +213 32 219700
Fax: +213 32 219300
@: soufsemoule@yahoo.fr
Produit: Dattes fraîches «Deglet Nour».

SOCOFEL, sarl
26, Zam Ali Mendjeli, Nouvelle Ville, El Khroub, Constantine
Tel: +213 31 675369 / 661 360173
Fax: +213 31 741231
@: sarl_socofel@yahoo.fr, contact@datiadz.com 
http: www.datiadz.com
Produit: Dattes.

SOLTANI MOHAMED FOUZI IMPORT EXPORT, eurl
Route de Bouchegouf, Guelma
Tel: +213 37 227810 / 7601 / 770 443476
Fax: +213 37 126426 / 227810 / 7601
@: eurlsoltani@hotmail.fr 
Produit: Dattes.

STAR MANIA, sarl
19 Rue Hocine Beladjel Local 01, Alger
Tel: +213 560 981022
@: bendjaberislam@gmail.com
Produit: Citrouilles, courges et calebasses.

STB TOLGA EL BARAKA, sarl
Z.A Tolga, Biskra
Tel: +213 550 158658 / 770 867268
Fax: +213 33 851252
Produit: Dattes fraîches «Deglet Nour».

STE BEDJAOUI ABDELATIF
Hai Houfaf Abdelkrim, Commune Bordj Ben Azzouz, Biskra
Tel: +213 541 399723 / 20
@: bedjaouia7@gmail.com 
Produit: Pommes de terre.

SUD DATTE, eurl
Rue, Ahmed Laama Mohamed Tahar, Tolga, Biskra
Tel: +213 33 599060 / 786070 / 554 571285
Fax: +213 33 599057 / 786089
@: suddatte@yahoo.fr / sudatte@hotmail.fr 
Produit: Fruits et Legumes. Dattes.

T.L.H IMPORT EXPORT, sarl
Cite El Moudjahidine, El Oued
Tel: +213 550 783082 / 661 388440 / 23 757631
@: limaneahmedtedjani@gmail.com / harof@live.fr
Produit: Dattes fraîches.

TAHRAOUI, sarl
08, Avenue Hakim Saâdane, Biskra
Tel: +213 33 536039
Fax: +213 33 532928
@: info@groupetahraoui.com 
http: www.groupetahraoui.com 
Produit: Fruits et legumes.

TAYBA DATTES, sarl
Z.A Ouargla, Ouargla
Tel: +213 29 716145
Fax: +213 29 716145
Produit: Confitures, gelees, marmelades, purees et pâtes de fruits, dattes fraîches «Deglet Nour».

TCPA EXPORT, sarl
Hai Ali Sadek 01, 23 Bordj El Kiffan, Alger
Tel: +213 551 025450 / 656 506661
@: manager@sarltcpaexport.com / bakhoukh.36@gmail.com
Produit: Piments du genre capsicum ou du genre pimenta, Celeris autres que les
celeris raves, haricots non ecosses, pommes, aubergines, carottes, Choux fleurs et choux fleurs brocolis, Betteraves a salades, Dattes fraîches «Deglet Nour».

TELLA TRANSFORMATION DE VIANDES, sarl
Ouled Ferha Eucalyptus, 63, Alger
Tel: +213 555 810740
Fax: +213 23 970310
@: zineahras@yahoo.fr
Produit: Viandes et abats.

THE DEGLET NOOR COMPANY, sarl
Quartier Zouhou 101 Al Maktofa, Tolga, Biskra
Tel: +213 673 626895
@: contact@degletnoorfactory.com 
Produit: Dattes fraîches.

TIZI CHIKE CHIKEN, sarl
Rue, AZ.Ib Cheraioua, TiZ.I Rached, Tizi Ouzou
Tel: +213 26 217510 / 552 547170
@: transpacific1998@gmail.com
Produit: Viandes et abats frais, refrigeres ou congeles.

TOLGA AGRO FOOD, sarl
17, Route de Tougourt Tolga, Biskra
Tel: +213 33 597777 / 560 030200
Fax: +213 33 597218
@: ks.export@yahoo.fr 
Produit: Dattes.

TOLGA GARDENS, eurl
Koudia Hamra Bba, Tolga, Biskra
Tel: +213 550 150711
Fax: +213 33 599136
@: info@tolgagardens.com 
http: www.tolgagardens.com 
Produit: Dattes fraîches.

VEGFRUT GLOBAL, sarl
Cite 94 Lot 11 bp 01 1er etage, Bouira
Tel: +213 662 441570@: vegfrut.g@gmail.com 
Produit: Dattes.

VERRE PACK, sarl
Cite Mahsas Keddour, Local n°2, Corso, Boumerdes
Tel: +213 24 951377 / 661 651754 / 561 666770
Fax: +213 24 951377
@: verre.pack@gmail.com
Produit: Dattes, Olives, Huile d’olive, Confiture, Hmis, Derssa.

WLI ALGERIA, sarl
Cooperative El Amel n°166 VSA Zeralda, Alger
Tel: +213 21 330299 / 770 980153
Fax: +213 21 330301
@: wlialgeria@yahoo.fr 
Produit: Dattes.

WORLDWIDE BIO FOOD, sarl
Residence Tahani, Surcouf, Ain Taya, Alger
Tel: +213 561 412654 / 541 000084
@: worldwidebiofood@gmail.com 
http: www.worldwidebiofood.com 
Produit: Fruits et Legumes et autre agroalimentaires.

YOUCEF RAFIK INDUSTRIE, eurl
Cite Guellal Nour, Setif
Tel: +213 36 581386 / 661 730043 / 560 904016
Fax: +213 36 581386
@: rafikyoucef@hotmail.fr 
http: www.rafikyoucef.wixsite.com
Produit: Dattes, Fruits et Legumes, Huile d’olives.

ZEMOULI SAAD, eurl
Lot Communal 02 Lot 56 01 h Krouma, Skikda
Tel: +213 557 887370
@: zemoulidatte@gmail.com
Produit: Dattes.

ZERIG NEW WORLD EXPORT IMPORT, eurl
Rue, 01 Nouvembre, Foughala, Biskra
Tel: +213 699 170970
Produit: Dattes.

ZIBAN DATTES, sarl
Rue Ben Ameur Aissa, Tolga, Biskra
Tel: +213 33 788986 / 581256 / 791 709678
Fax: +213 33 581256 / 788986
@: ziban.dattes@yahoo.fr 
Produit: Dattes.

ZIBAN GARDEN, sarl
Zone d’equipement n°25, BP 770 RP, Biskra
Tel: +213 33 759667 / 639667 / 560 940203
Fax: +213 33 758851 / 659655
@: bma@zibangarden.com 
http: www.zibangarden.com 
Produit: Dattes.

ZIBANE BOUALEM, eurl
Sidi Soufi Ouled Mimoun, Tlemcen
Tel: +213 551 419270 / 697 966950
Produit: Dattes.

ZIDOUN MANSOUR
Centre Amroussa, Bouinan, Blida
Tel: +213 556 565320
@: amine1870@hotmail.fr
Produit: Dattes, Dattes seches, Sirop de dattes, Farine de dattes, Pâtes de dattes, Dechets de l’industrie de dattes.`;

  fs.writeFileSync(filePath, content);
  console.log('✅ Fichier créé');
  
  // LIRE LE FICHIER
  console.log('\n📖 Lecture du fichier...');
  const lines = content.split('\n');
  
  let imported = 0;
  let errors = 0;
  let currentEntity = null;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '') {
      if (currentEntity) {
        try {
          const { error } = await supabase
            .from('official_directory')
            .insert([{
              ...currentEntity,
              import_batch: BATCH_NAME
            }]);
          
          if (error) {
            console.error(`❌ Erreur ${currentEntity.name.substring(0, 30)}:`, error.message);
            errors++;
          } else {
            imported++;
            if (imported % 10 === 0) {
              console.log(`  ✅ ${imported} entités...`);
            }
          }
        } catch (error) {
          console.error(`💥 Exception:`, error.message);
          errors++;
        }
        currentEntity = null;
      }
      continue;
    }
    
    if (!currentEntity) {
      currentEntity = {
        name: cleanText(line),
        address: '',
        phone: [],
        fax: [],
        email: [],
        website: [],
        products: [],
        category: CATEGORY,
        entity_type: ENTITY_TYPE,
        source_file: '20260301_agriculture.txt'
      };
    } 
    else {
      if (line.startsWith('Tel:') || line.startsWith('Tél:')) {
        currentEntity.phone.push(cleanText(line.replace(/^Té?l:/i, '')));
      }
      else if (line.startsWith('Fax:')) {
        currentEntity.fax.push(cleanText(line.replace('Fax:', '')));
      }
      else if (line.startsWith('@:')) {
        currentEntity.email.push(cleanText(line.replace('@:', '')));
      }
      else if (line.startsWith('http')) {
        currentEntity.website.push(cleanText(line.replace('http:', '')));
      }
      else if (line.startsWith('Produit:')) {
        const products = extractProducts(line);
        currentEntity.products.push(...products);
      }
      else {
        if (currentEntity.address) {
          currentEntity.address += ' ' + cleanText(line);
        } else {
          currentEntity.address = cleanText(line);
        }
      }
    }
  }
  
  if (currentEntity) {
    try {
      const { error } = await supabase
        .from('official_directory')
        .insert([{
          ...currentEntity,
          import_batch: BATCH_NAME
        }]);
      
      if (!error) {
        imported++;
      } else {
        errors++;
      }
    } catch (error) {
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`📊 RÉSULTATS ${CATEGORY}`);
  console.log('='.repeat(70));
  console.log(`✅ Importés: ${imported}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`🏷️  Batch: ${BATCH_NAME}`);
}

importFile();