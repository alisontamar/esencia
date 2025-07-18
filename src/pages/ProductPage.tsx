import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductImageZoom } from "@/components/ProductImageZoom";
import { handleWhatsAppClick } from '@/lib/utils';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  
  const getCategoryName = (category: string) => {
    const categories = {
      bedroom: "Dormitorio",
      living: "Sala de Estar",
      kitchen: "Cocina",
      bathroom: "Baño",
      lighting: "Iluminación",
      decoration: "Decoración",
    }
    return categories[category as keyof typeof categories] || category
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
            <div className="bg-white rounded-3xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded-3xl"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <Link to="/catalog">
              <Button>Volver al catálogo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const totalPrice = product.price * quantity
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto justify-center">
            {['Inicio', 'Dormitorio', 'Sala de Estar', 'Cocina', 'Baño', 'Iluminación', 'Decoración', 'Ver Todo'].map((tab) => (
              <button
                key={tab}
                className="py-4 px-2 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap border-b-2 border-transparent hover:border-pink-300 transition-colors"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="relative">
              <ProductImageZoom
                src={product.image}
                alt={product.name}
                className="aspect-square rounded-2xl bg-gray-100"
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium z-10">
                  Más Vendido del Día
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600">Categoría: {getCategoryName(product.category)}</p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 space-y-4">
              {/* Unit Price */}
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-600">Precio unitario:</span>
                <span className="text-2xl font-bold text-gray-800">${product.price}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-600">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <Button variant="ghost" size="sm" onClick={decrementQuantity} className="px-3 hover:bg-gray-100">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-6 py-2 font-bold text-lg min-w-[4rem] text-center">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={incrementQuantity} className="px-3 hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              {quantity > 1 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600">Total ({quantity} unidades):</span>
                    <span className="text-3xl font-bold text-pink-600">${totalPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp Button */}
            <div className="space-y-4">
              <Button onClick={handleWhatsAppClick} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-5 h-5 mr-2" />
                {quantity === 1
                  ? `Consultar por WhatsApp - $${product.price}`
                  : `Consultar por WhatsApp - ${quantity} unidades ($${totalPrice})`}
              </Button>

              {/* Price breakdown for multiple items */}
              {quantity > 1 && (
                <div className="text-center text-sm text-gray-600">
                  {quantity} × ${product.price} = ${totalPrice}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
};