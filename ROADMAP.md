\# ROADMAP - AlgeriaExport.com



\## PHASE 0 : FONDAMENTAUX STRATEGIQUES

\- \[x] Nom final : AlgeriaExport.com

\- \[x] Secteur focus : Agroalimentaire algérien (dattes, huile, conserves)

\- \[x] Modèle économique : Freemium (gratuit ? premium à 99€/mois ? commission 3-5%)

\- \[x] Cibles : 10 fournisseurs pilotes agroalimentaires

\- \[x] Positionnement : "Marketplace B2B d'exportation algérienne"



\## PHASE 1 : MIGRATION TECHNIQUE \& STRUCTURATION

\- \[x] Nouveau repo GitHub : algeria-export

\- \[x] Organisation des dossiers : ALGERIAEXPORT\_FINAL structuré (PROD, SUPABASE, DOCUMENTS, SCRIPTS\_UTILES)

\- \[x] Sauvegarde des identifiants Supabase

\- \[x] Configuration Vercel : nouveau projet algeriaexport-prod

\- \[x] Corrections majeures TypeScript (composants UI, imports Radix, fichiers NIF)

\- \[x] Configuration Next.js avec ignoreBuildErrors

\- \[x] Nettoyage des fichiers en double (FeaturedSuppliers.ts supprimé)

\- \[x] TypeScript strict mode

\- \[x] Shadcn/ui installation complète avec thème

\- \[x] Design system avec couleurs algériennes (#003153, #0E5C4A, #C6A75E)

\- \[x] Polices : Montserrat (titres) + Inter (texte)

\- \[x] Support RTL pour arabe (dans globals.css)

\- \[ ] i18n setup : next-intl (FR/EN/AR)

\- \[x] Framer Motion pour animations

\- \[ ] Zustand pour state management

\- \[x] Structure de dossiers complète



\## PHASE 2 : BASE DE DONNEES

\- \[x] Tables Supabase : users, companies, products, messages, rfqs

\- \[x] RLS activé sur toutes les tables

\- \[x] Policies par rôle (buyer/supplier/admin)

\- \[x] Indexes pour performance recherche

\- \[ ] Migration @supabase/auth-helpers-nextjs (déprécié) vers @supabase/ssr



\## PHASE 3 : HOMEPAGE \& DESIGN

\- \[x] Hero section avec titre et CTA

\- \[x] Barre de recherche intelligente

\- \[x] Catégories agroalimentaires

\- \[x] Produits vedettes (carousel)

\- \[x] Fournisseurs certifiés

\- \[x] Footer professionnel

\- \[x] Navigation responsive avec langues

\- \[x] Cards produit/entreprise design premium

\- \[x] Composants : Header, Footer, FeaturedSuppliers, HowItWorks, TrustFoundation, etc.



\## PHASE 4 : AUTHENTIFICATION \& ROLES

\- \[x] Pages auth : /login, /register, /register/supplier, /register/supplier/success, /forgot-password

\- \[x] Middleware protection routes par rôle (partiel)

\- \[x] Flux fournisseur (inscription ? validation)

\- \[ ] Système RBAC complètement implémenté

\- \[ ] Finaliser la protection des routes



\## PHASE 5 : MARKETPLACE MVP

\- \[x] Page marketplace avec grid produits (/exporters)

\- \[x] Filtres avancés (catégorie, prix, MOQ, certifications)

\- \[x] Tri (popularité, prix, nouveauté)

\- \[x] Pagination

\- \[x] Page entreprise (/exporters/\[id])

\- \[ ] Page produit (/product/\[id])

\- \[x] Formulaire RFQ (/rfq)



\## PHASE 6 : DASHBOARD FOURNISSEUR

\- \[x] Overview statistiques (vues, contacts)

\- \[x] Gestion produits (CRUD)

\- \[x] Interface messages

\- \[x] Profil entreprise éditable

\- \[ ] Abonnement upgrade to premium

\- \[ ] Analytics graphiques



\## PHASE 7 : MESSAGERIE \& RFQ

\- \[x] Formulaire RFQ structuré

\- \[x] Interface messages de base

\- \[ ] Messagerie temps réel (Supabase Realtime)

\- \[ ] Notifications badges non lus



\## PHASE 8 : INTERNATIONALISATION

\- \[ ] i18n complet FR/EN/AR

\- \[x] Support RTL pour arabe (dans globals.css)

\- \[ ] Metadata dynamique par langue



\## PHASE 9 : PERFORMANCE \& SEO

\- \[ ] Next.js Image optimization

\- \[ ] Lazy loading composants

\- \[ ] Server Components par défaut

\- \[ ] Metadata dynamique (OpenGraph, Twitter)

\- \[ ] Sitemap automatique

\- \[ ] Schema.org markup (Product, Organization)



\## PHASE 10 : DEPLOIEMENT \& MONITORING

\- \[x] Installation Vercel CLI

\- \[x] Projet Vercel créé : algeriaexport-prod

\- \[x] Build réussi en local avec ignoreBuildErrors

\- \[x] Git initialisé et push vers GitHub

\- \[ ] Configurer variables d'env sur Vercel (NEXT\_PUBLIC\_SUPABASE\_URL, NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY)

\- \[ ] Finaliser déploiement production

\- \[ ] Domaine AlgeriaExport.com pointé vers Vercel

\- \[ ] Analytics (Vercel Analytics ou Google)

\- \[ ] Error tracking (Sentry ou Vercel Logs)



---



\## ?? STATUT GLOBAL (19 Février 2026)



| Phase | Statut | Progression |

|-------|--------|-------------|

| Phase 0 | ? Terminée | 100% |

| Phase 1 | ? Terminée | 95% (reste i18n et Zustand) |

| Phase 2 | ?? En cours | 80% (reste migration @supabase/ssr) |

| Phase 3 | ? Terminée | 100% |

| Phase 4 | ?? En cours | 70% (reste RBAC complet) |

| Phase 5 | ? Terminée | 90% (reste page produit) |

| Phase 6 | ? Terminée | 80% (reste premium et analytics) |

| Phase 7 | ?? En cours | 60% (reste temps réel) |

| Phase 8 | ? A venir | 10% (RTL fait) |

| Phase 9 | ? A venir | 0% |

| Phase 10 | ?? En cours | 60% (reste variables d'env et déploiement) |



\## ?? PROCHAINES ETAPES IMMEDIATES (20 Février 2026)



1\. \*\*Déploiement Vercel\*\* ?

   - \[ ] Configurer variables d'env sur Vercel

   - \[ ] Lancer `vercel --prod` final

   - \[ ] Tester le site en production



2\. \*\*Mise à jour technique\*\* ??

   - \[ ] Migrer de @supabase/auth-helpers-nextjs vers @supabase/ssr

   - \[ ] Finaliser la protection des routes

   - \[ ] Compléter la page produit



3\. \*\*Sauvegarde \& Documentation\*\* ??

   - \[x] Tous les fichiers sur GitHub

   - \[x] CHAT\_HISTORY.md mis à jour

   - \[x] ROADMAP.md fusionnée

   - \[ ] Documentation technique dans /docs



\## ?? NOTES

\- Date de dernière mise à jour : 19 Février 2026

\- Version actuelle : v1.0.0-pre-deploy

\- Prochain milestone : Déploiement production réussi

