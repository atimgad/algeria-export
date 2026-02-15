import { Search, Handshake, FileCheck } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#2E7D32] font-semibold text-sm tracking-wider uppercase">The Process</span>
          <h2 className="text-4xl font-bold mt-2 text-[#003153]">How the Infrastructure Works</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">A structured framework designed for institutional-grade cross-border trade</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="relative mb-8 inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-3xl rotate-45 transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
                <div className="flex items-center justify-center h-full -rotate-45">
                  <Search className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg border-4 border-white">1</div>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#003153]">Identify Verified Partners</h3>
            <p className="text-sm text-[#2E7D32] font-medium mb-3">Find trusted suppliers</p>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">Access pre-validated Algerian suppliers through a structured due diligence framework.</p>
          </div>
          <div className="text-center group">
            <div className="relative mb-8 inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-3xl rotate-45 transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
                <div className="flex items-center justify-center h-full -rotate-45">
                  <Handshake className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg border-4 border-white">2</div>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#003153]">Connect & Negotiate with Confidence</h3>
            <p className="text-sm text-[#2E7D32] font-medium mb-3">Secure communication</p>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">Engage directly with trusted counterparts in a controlled B2B environment.</p>
          </div>
          <div className="text-center group">
            <div className="relative mb-8 inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-3xl rotate-45 transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
                <div className="flex items-center justify-center h-full -rotate-45">
                  <FileCheck className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg border-4 border-white">3</div>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#003153]">Execute Compliant Trade</h3>
            <p className="text-sm text-[#2E7D32] font-medium mb-3">Risk-free execution</p>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">Move forward with export-ready documentation and traceable transactions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;