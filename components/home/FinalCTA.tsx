import { ArrowRight } from "lucide-react"; 
 
import Link from "next/link"; 
 
const FinalCTA = () => { 
  return ( 
    <section className="py-24 bg-gradient-to-r from-[#003153] to-[#2E7D32] text-white"> 
      <div className="container mx-auto px-4 text-center"> 
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Trading with Algeria Today</h2> 
        <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">Join Algeria's premier trade infrastructure and connect with verified suppliers and international buyers.</p> 
        <div className="flex flex-col sm:flex-row gap-4 justify-center"> 
          <Link href="/dashboard" className="bg-white text-[#003153] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2 text-lg"> 
            Access the Infrastructure <ArrowRight className="h-5 w-5" /> 
          </Link> 
          <Link href="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#003153] transition inline-flex items-center justify-center gap-2 text-lg"> 
            Contact Our Team 
          </Link> 
        </div> 
      </div> 
    </section> 
  ); 
}; 
 
export default FinalCTA; 
