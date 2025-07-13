import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const BestSellerSection = () => {
  // Get the first featured product as best seller
  const bestSeller = products.find(product => product.featured) || products[0];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 rounded-full px-6 py-2 text-lg font-medium mb-4">
            🔥 Producto Más Vendido del Día
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡No te lo pierdas!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El producto favorito de nuestros clientes. Calidad premium al mejor precio.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={bestSeller.image}
                  alt={bestSeller.name}
                  className="w-full h-80 lg:h-full object-cover"
                />
                <Badge className="absolute top-6 left-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 rounded-full px-4 py-2">
                  Más Vendido del Día
                </Badge>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-4 text-gray-500 border-gray-200">
                  {bestSeller.brand}
                </Badge>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {bestSeller.name}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {bestSeller.description}
                </p>
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-sm text-gray-500">Precio especial:</span>
                    <div className="text-4xl font-bold text-gray-900">
                      ${bestSeller.price.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Stock disponible:</span>
                    <div className="text-2xl font-bold text-green-600">
                      {bestSeller.stock} unidades
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to={`/product/${bestSeller.id}`} className="block">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full py-4 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Ver Producto Completo →
                    </Button>
                  </Link>
                  
                  <p className="text-center text-sm text-gray-500">
                    ⚡ Oferta limitada - Solo por hoy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};