import { Globe, Shield, Clock, TrendingUp, Users, FileCheck } from "lucide-react"; 
 
const ValueProposition = () => { 
  return ( 
    <section className="py-24 bg-gray-50"> 
      <div className="container mx-auto px-4"> 
        <div className="text-center mb-16"> 
          <span className="text-[#2E7D32] font-semibold text-sm tracking-wider uppercase">Value Proposition</span> 
          <h2 className="text-4xl font-bold mt-2 text-[#003153]">Built for Both Sides of the Trade</h2> 
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">A infrastructure designed to reduce risk and create opportunities for everyone</p> 
        </div> 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12"> 
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"> 
            <div className="flex items-center gap-3 mb-6"> 
              <Globe className="h-8 w-8 text-[#2E7D32]" /> 
              <h3 className="text-2xl font-bold text-[#003153]">For International Buyers</h3> 
            </div> 
            <ul className="space-y-4"> 
              <li className="flex gap-3"> 
                <Shield className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" /> 
                <span><span className="font-semibold">Reduce sourcing risk</span> with pre-validated suppliers and structured due diligence</span> 
              </li> 
              <li className="flex gap-3"> 
                <Clock className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" /> 
                <span><span className="font-semibold">Save time and resources</span> with direct access to verified exporters</span> 
              </li> 
              <li className="flex gap-3"> 
                <FileCheck className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" /> 
                <span><span className="font-semibold">Trade with confidence</span> using export-ready documentation and compliance frameworks</span> 
              </li> 
            </ul> 
          </div> 
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"> 
            <div className="flex items-center gap-3 mb-6"> 
              <Users className="h-8 w-8 text-[#2E7D32]" /> 
              <h3 className="text-2xl font-bold text-[#003153]">For Algerian Suppliers</h3> 
            </div> 
            <ul className="space-y-4"> 
              <li className="flex gap-3"> 
                <TrendingUp className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" /> 
                <span><span className="font-semibold">Access global markets</span> and connect with verified international buyers</span> 
              </li> 
              <li className="flex gap-3"> 
                <Shield className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" /> 
                <span><span className="font-semibold">Export readiness support</span> with compliance and documentation assistance</span> 
              </li> 
              <li className="flex gap-3"> 
                <Globe className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" /> 
                <span><span className="font-semibold">Grow your export volume</span> through structured trade opportunities</span> 
              </li> 
            </ul> 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
}; 
 
export default ValueProposition; 
