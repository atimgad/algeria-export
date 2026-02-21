import { Wheat, Factory, Package, Fuel } from "lucide-react";

export default function Industries() {
  const industries = [
    {
      icon: Fuel,
      title: "Hydrocarbons (Oil & Gas)",
      description: "The backbone of the economy, driven by state-owned Sonatrach, featuring high-quality Sahara Blend crude and significant natural gas exports to Europe.",
      color: "text-[#D21034]"
    },
    {
      icon: Factory,
      title: "Fertilizers & Chemicals",
      description: "Nitrogenous fertilizers and ammonia are major non-hydrocarbon exports, with significant production in complexes like Arzew and a new $7 billion phosphate project in Tébessa.",
      color: "text-[#003153]"
    },
    {
      icon: Package,
      title: "Mining & Metals",
      description: "Iron ore, zinc, lead, and phosphate rock are significant, with major operations at Ouenza and Djebel Onk.",
      color: "text-[#2E7D32]"
    },
    {
      icon: Factory,
      title: "Manufacturing & Construction Materials",
      description: "Increasing exports of cement, steel (via firms like Tosyali Algérie), and iron products.",
      color: "text-[#C6A75E]"
    },
    {
      icon: Package,
      title: "Pharmaceuticals",
      description: "A rapidly growing sector, with over 200 local plants supplying roughly 75% of domestic demand and aiming for increased exports.",
      color: "text-[#D21034]"
    },
    {
      icon: Wheat,
      title: "Agriculture & Food Processing",
      description: "Key exports include dates, figs, olive oil, and processed foods like pasta and biscuits.",
      color: "text-[#2E7D32]"
    },
    {
      icon: Factory,
      title: "Textiles",
      description: "Emerging manufacturing sector, notably with the TAYAL joint venture in Sidi Khettab.",
      color: "text-[#003153]"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#2E7D32] font-semibold text-sm tracking-wider uppercase">
            🇩🇿 Algeria's Strengths
          </span>
          <h2 className="text-4xl font-bold mt-2 text-[#003153]">
            Key Export Industries
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From hydrocarbons to agriculture, Algeria offers diverse export opportunities backed by strategic infrastructure and institutional support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-gray-50 rounded-xl hover:shadow-lg transition border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 bg-white rounded-lg ${industry.color} group-hover:scale-110 transition`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003153] group-hover:text-[#2E7D32] transition">
                    {industry.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {industry.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Note de source */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Sources: Observatoire de la Complexité Économique (OEC), Données officielles 2025-2026</p>
        </div>
      </div>
    </section>
  );
}