import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <header className="mb-12">
          <h1 className="text-4xl font-heading font-bold text-primary">
            AlgeriaExport.com
          </h1>
          <p className="text-lg text-secondary mt-2">
            Marketplace B2B d'exportation algérienne
          </p>
        </header>

        {/* Section démo couleurs */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold text-primary-dark mb-6">
            Design System - Couleurs Algériennes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Carte Primaire (Bleu) */}
            <div className="bg-primary p-6 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">Primaire</h3>
              <p className="mb-4">#0A2E52 - Bleu Algérie</p>
              <Button variant="outline" className="bg-primary-light border-white text-white hover:bg-primary-dark">
                Bouton Primaire
              </Button>
            </div>

            {/* Carte Secondaire (Vert) */}
            <div className="bg-secondary p-6 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">Secondaire</h3>
              <p className="mb-4">#0E5C4A - Vert Nature</p>
              <Button variant="outline" className="bg-secondary-light border-white text-white hover:bg-secondary-dark">
                Bouton Secondaire
              </Button>
            </div>

            {/* Carte Accent (Or) */}
            <div className="bg-accent p-6 rounded-xl text-gray-900">
              <h3 className="text-xl font-bold mb-2">Accent</h3>
              <p className="mb-4">#C6A75E - Or Soleil</p>
              <Button variant="outline" className="bg-accent-light border-gray-900 text-gray-900 hover:bg-accent-dark">
                Bouton Accent
              </Button>
            </div>
          </div>

          {/* Boutons de démo */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-primary mb-4">
              Variantes de Boutons
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
        </section>

        {/* Section typographie */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold text-primary-dark mb-6">
            Typographie
          </h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-heading font-bold">Titre H1 - Montserrat</h1>
            <h2 className="text-3xl font-heading font-semibold">Titre H2 - Montserrat</h2>
            <p className="text-lg font-body">Paragraphe - Inter: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="text-lg font-arabic" dir="rtl">نص عربي تجريبي - Noto Sans Arabic</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 font-body">
            AlgeriaExport.com © 2024 - Connecter les fournisseurs algériens aux marchés mondiaux
          </p>
        </footer>
      </div>
    </div>
  )
}