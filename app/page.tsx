import Hero from "@/components/home/Hero"; 
import TrustFoundation from "@/components/home/TrustFoundation"; 
import Industries from "@/components/home/Industries"; 
import ExportGrowth2026 from "@/components/home/ExportGrowth2026"; 
import HowItWorks from "@/components/home/HowItWorks"; 
import ValueProposition from "@/components/home/ValueProposition"; 
import FeaturedSuppliers from "@/components/home/FeaturedSuppliers"; 
import FinalCTA from "@/components/home/FinalCTA"; 
import Footer from "@/components/layout/Footer"; 
 
export default function Home() { 
  return ( 
    <main> 
      <Hero /> 
      <TrustFoundation /> 
      <Industries /> 
      <ExportGrowth2026 /> 
      <HowItWorks /> 
      <ValueProposition /> 
      <FeaturedSuppliers /> 
      <FinalCTA /> 
      <Footer /> 
    </main> 
  ); 
} 
