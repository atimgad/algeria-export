import Link from "next/link"; 
 
export default function Hero() { 
  return ( 
    <section className="relative bg-gradient-to-r from-[#003153] to-[#2E7D32] text-white py-20"> 
      <div className="container mx-auto px-4 text-center"> 
        <h1 className="text-4xl md:text-6xl font-bold mb-4"> 
          From Algeria to the World 
        </h1> 
        <p className="text-xl mb-8 max-w-3xl mx-auto"> 
          A trusted B2B trade infrastructure connecting verified Algerian suppliers with international buyers across multiple industries. 
        </p> 
        <div className="flex flex-col sm:flex-row gap-4 justify-center"> 
          <Link 
            href="/buyers" 
            className="bg-white text-[#001B3A] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition" 
          > 
            I am an International Buyer 
          </Link> 
          <Link 
            href="/suppliers" 
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#001B3A] transition" 
          > 
            I am an Algerian Supplier 
          </Link> 
        </div> 
      </div> 
    </section> 
  ); 
} 
