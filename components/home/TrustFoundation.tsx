import { ShieldCheck, FileCheck, Lock, Layers } from "lucide-react"; 
 
export default function TrustFoundation() { 
  return ( 
    <section className="bg-gray-50 py-12 border-y border-gray-200"> 
      <div className="container mx-auto px-4"> 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"> 
          <div> 
            <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-[#003153]" /> 
            <div className="text-lg font-bold text-[#003153]">Verified Suppliers</div> 
            <div className="text-sm text-gray-600">Structured due diligence and validation framework</div> 
          </div> 
          <div> 
            <FileCheck className="h-8 w-8 mx-auto mb-2 text-[#003153]" /> 
            <div className="text-lg font-bold text-[#003153]">Export Compliance</div> 
            <div className="text-sm text-gray-600">Aligned with international trade regulations</div> 
          </div> 
          <div> 
            <Lock className="h-8 w-8 mx-auto mb-2 text-[#003153]" /> 
            <div className="text-lg font-bold text-[#003153]">Secure Trade</div> 
            <div className="text-sm text-gray-600">Controlled, traceable, and protected transactions</div> 
          </div> 
          <div> 
            <Layers className="h-8 w-8 mx-auto mb-2 text-[#003153]" /> 
            <div className="text-lg font-bold text-[#003153]">Multi-Industry Coverage</div> 
            <div className="text-sm text-gray-600">Across Algeria's key export sectors</div> 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
} 
