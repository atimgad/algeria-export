import Link from "next/link"; 
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"; 
 
const Footer = () => { 
  return ( 
    <footer className="bg-[#003153] text-white pt-16 pb-8"> 
      <div className="container mx-auto px-4"> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"> 
          <div> 
            <h3 className="text-2xl font-bold mb-4">AlgeriaExport</h3> 
            <p className="text-gray-300 mb-4">Algeria's trusted B2B trade infrastructure connecting verified suppliers with international buyers worldwide.</p> 
            <div className="flex space-x-4"> 
              <a href="#" className="hover:text-[#2E7D32] transition"><Linkedin className="h-5 w-5" /></a> 
              <a href="#" className="hover:text-[#2E7D32] transition"><Twitter className="h-5 w-5" /></a> 
              <a href="#" className="hover:text-[#2E7D32] transition"><Facebook className="h-5 w-5" /></a> 
            </div> 
          </div> 
          <div> 
            <h4 className="font-semibold mb-4 text-[#2E7D32]">For Buyers</h4> 
            <ul className="space-y-2 text-gray-300"> 
              <li><Link href="/marketplace" className="hover:text-white transition">Find Suppliers</Link></li> 
              <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li> 
              <li><Link href="/industries" className="hover:text-white transition">Industries</Link></li> 
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li> 
            </ul> 
          </div> 
          <div> 
            <h4 className="font-semibold mb-4 text-[#2E7D32]">For Suppliers</h4> 
            <ul className="space-y-2 text-gray-300"> 
              <li><Link href="/register/supplier" className="hover:text-white transition">Become a Supplier</Link></li> 
              <li><Link href="/dashboard" className="hover:text-white transition">Supplier Dashboard</Link></li> 
              <li><Link href="/resources" className="hover:text-white transition">Export Resources</Link></li> 
              <li><Link href="/certification" className="hover:text-white transition">Certification</Link></li> 
            </ul> 
          </div> 
          <div> 
            <ul className="space-y-2 text-gray-300"> 
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li> 
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li> 
              <li><Link href="/compliance" className="hover:text-white transition">Export Compliance</Link></li> 
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li> 
            </ul> 
          </div> 
        </div> 
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm"> 
          <p>(c) {new Date().getFullYear()} AlgeriaExport. All rights reserved. Algeria's Premier B2B Trade Infrastructure.</p> 
        </div> 
      </div> 
    </footer> 
  ); 
}; 
 
export default Footer; 
