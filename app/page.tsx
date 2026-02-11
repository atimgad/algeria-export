import EntrepriseList from '@/components/EntrepriseList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🇩🇿 Plateforme B2B Algérienne
          </h1>
          <p className="text-xl opacity-90">
            Connectez votre entreprise aux marchés internationaux
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Inscrire mon entreprise
            </button>
            <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition">
              Explorer les entreprises
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Entreprises Algériennes
          </h2>
          <EntrepriseList />
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à exporter vos produits ?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Rejoignez la première plateforme B2B dédiée aux entreprises algériennes
          </p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
            Commencer gratuitement
          </button>
        </div>
      </section>
    </main>
  )
}