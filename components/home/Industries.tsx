import { Wheat, Factory, Package, Fuel } from "lucide-react"; 
 
export default function Industries() { 
  return ( 
    <section className="py-16 bg-white"> 
      <div className="container mx-auto px-4"> 
        <h2 className="text-3xl font-bold text-center mb-12 text-[#003153]">Key Export Industries</h2> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> 
          <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"> 
            <Wheat className="h-12 w-12 mx-auto mb-4 text-[#2E7D32]" /> 
            <p className="text-gray-600">Dates, olive oil, preserved foods, spices</p> 
          </div> 
          <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"> 
            <Factory className="h-12 w-12 mx-auto mb-4 text-[#2E7D32]" /> 
            <h3 className="text-xl font-semibold mb-2">Manufacturing</h3> 
            <p className="text-gray-600">Industrial equipment, textiles, chemicals</p> 
          </div> 
          <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"> 
            <Package className="h-12 w-12 mx-auto mb-4 text-[#2E7D32]" /> 
            <h3 className="text-xl font-semibold mb-2">Raw Materials</h3> 
            <p className="text-gray-600">Minerals, phosphates, construction materials</p> 
          </div> 
          <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"> 
            <Fuel className="h-12 w-12 mx-auto mb-4 text-[#2E7D32]" /> 
            <p className="text-gray-600">Oil, gas, renewables, petrochemicals</p> 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
} 
