export default function ContactPage() { 
  return ( 
    <div className="min-h-screen bg-gray-50 py-24"> 
      <div className="container mx-auto px-4"> 
        <h1 className="text-4xl font-bold text-center mb-4 text-[#003153]">Contact Our Team</h1> 
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Get in touch with our trade specialists for any inquiry</p> 
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100"> 
          <div className="space-y-4"> 
            <p className="text-gray-600 text-center">Email: contact@algeriaexport.com</p> 
            <p className="text-gray-600 text-center">Phone: +213 (0) 123 456 789</p> 
            <p className="text-gray-600 text-center">Address: Algiers, Algeria</p> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
} 
