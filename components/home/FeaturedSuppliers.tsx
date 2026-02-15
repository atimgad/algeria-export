import { Building2, MapPin, Plane, Factory } from "lucide-react";

const FeaturedSuppliers = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#2E7D32] font-semibold text-sm tracking-wider uppercase">Trusted Partners</span>
          <h2 className="text-4xl font-bold mt-2 text-[#003153]">Featured Verified Suppliers</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Algeria's industrial champions across all sectors</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ÉNERGIE */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Sonatrach</h3>
                <p className="text-sm text-gray-500">Energy & Petrochemicals</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Algeria's largest company, top African energy group.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Naftal</h3>
                <p className="text-sm text-gray-500">Petroleum Products</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Sonatrach subsidiary, leader in fuel distribution.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Sonelgaz</h3>
                <p className="text-sm text-gray-500">Electricity & Gas</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">National utility giant, expanding into renewables.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          {/* AGROALIMENTAIRE */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Cevital</h3>
                <p className="text-sm text-gray-500">Agro-Food & Electronics</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Largest private group, exports to 36 countries.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Bejaia, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Groupe Soummam</h3>
                <p className="text-sm text-gray-500">Dairy & Fresh Products</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Leader in dairy industry, trusted nationwide.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Bejaia, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Amor Benamor</h3>
                <p className="text-sm text-gray-500">Semoule & Couscous</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Historic brand, leader in semoule and preserves.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          {/* BTP & MATÉRIAUX */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Cosider</h3>
                <p className="text-sm text-gray-500">Construction & Infrastructure</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">National leader in major infrastructure projects.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Sider</h3>
                <p className="text-sm text-gray-500">Steel Industry</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Public steel champion, El Hadjar complex.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Annaba, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">GICA</h3>
                <p className="text-sm text-gray-500">Cement & Construction</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Top cement producer, key to self-sufficiency.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          {/* SIDÉRURGIE */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Factory className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Tosyalı Algérie</h3>
                <p className="text-sm text-gray-500">Steel & Manufacturing</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">World record in DRI production (2.43M tons), 15,000 employees globally.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Oran, Algeria</span>
            </div>
          </div>

          {/* ÉLECTRONIQUE */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">ENIE</h3>
                <p className="text-sm text-gray-500">Electronics</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Public pioneer in electronics (Sidi Bel Abbès).</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Sidi Bel Abbès, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Condor</h3>
                <p className="text-sm text-gray-500">Electronics & Appliances</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Private leader in electronics, major exporter.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Bordj Bou Arreridj, Algeria</span>
            </div>
          </div>

          {/* TRANSPORT & LOGISTIQUE */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Air Algérie</h3>
                <p className="text-sm text-gray-500">National Airline</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Flag carrier, connecting Algeria to over 40 destinations worldwide.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          {/* TÉLÉCOMS */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Algérie Télécom</h3>
                <p className="text-sm text-gray-500">Telecom Operator</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Historic telecom operator, backbone of connectivity.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Mobilis</h3>
                <p className="text-sm text-gray-500">Mobile Telecom</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Leader in mobile telephony, market pioneer.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Djezzy</h3>
                <p className="text-sm text-gray-500">Mobile Telecom</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Major mobile operator, strong market presence.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Ooredoo</h3>
                <p className="text-sm text-gray-500">Mobile Telecom</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">International operator, key player in mobile market.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          {/* GROUPE REZAYAT */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Groupe Rezayat</h3>
                <p className="text-sm text-gray-500">Conglomerate</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Major Saudi-Algerian group active in steel, trading and logistics.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          {/* PHARMA & TEXTILE */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Saidal</h3>
                <p className="text-sm text-gray-500">Pharmaceuticals</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Public leader in generic drugs production.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl rotate-12 transform group-hover:rotate-0 transition duration-300 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003153]">Alcost</h3>
                <p className="text-sm text-gray-500">Textile Industry</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Fleuron of textile industry, professional wear.</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-gray-500">Algiers, Algeria</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;