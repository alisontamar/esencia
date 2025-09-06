import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductImageZoom } from "@/components/ProductImageZoom";
import { ProductGrid } from '@/components/ProductGrid';
import { handleWhatsAppClick } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCategory } from '@/hooks/useCategory';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SEO } from '@/components/SEO';
import { ProductWithOffer } from '@/types/database.types';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const {
    loading,
    fetchProductById,
    selectedProduct: product,
    fetchProductsByCategory,
    productsByCategory,
  } = useProducts();

  const { categories } = useCategory();
  const { registerWhatsAppConsultation } = useAnalytics();

  // Valores seguros para TypeScript
  const ofertaActiva = product?.ofertas?.[0]?.activa ?? false;
  const precioUnitario = ofertaActiva
    ? product?.ofertas?.[0]?.precio_final ?? 0
    : product?.precio_base ?? 0;
  const productName = product?.nombre ?? "Producto belleza";
  const brandName = product?.marcas?.nombre ?? "Marca desconocida";
  const categoryName = categories?.find(c => c.id === product?.categoria_id)?.nombre ?? "Categoría desconocida";
  const productImage = product?.imagen_url ?? "";
  const currency = product?.moneda ?? "Bs.";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchProductById(id);
      fetchProductsByCategory();
    }
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <aside className="container mx-auto px-4 py-8">
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
        </aside>
      </section>
    );
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <SEO
        title={`${productName} | Esencia`}
        description={`✨ Descubre el producto cosmético de belleza ${productName}, creado por la marca ${brandName}, diseñado especialmente para realzar tu cuidado personal. 🌸 Perteneciente a la categoría ${categoryName}, este producto combina calidad, innovación y resultados visibles, convirtiéndose en tu aliado ideal para resaltar tu belleza natural.`}
        image_url={productImage}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center justify-center">
            {/* Main Image with Zoom */}
            <div className="relative">
              <ProductImageZoom
                src={productImage}
                alt={productName}
                className="aspect-square rounded-2xl bg-gray-100"
              />
              {product?.esta_en_oferta && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium z-10">
                  Producto en oferta
                </span>
              )}
              {product?.es_destacado && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium z-10">
                  Producto destacado
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{brandName}</p>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{productName}</h1>
                <p className="text-lg text-gray-600">Categoría: {categoryName}</p>
              </div>

              {/* Price Section */}
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-600">Precio unitario:</span>
                {ofertaActiva ? (
                  <div className="text-right">
                    <div className="text-sm line-through text-gray-500">
                      {currency} {product?.precio_base ?? 0}
                    </div>
                    <div className="text-2xl font-bold text-pink-600">
                      {currency} {precioUnitario}
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    {currency} {precioUnitario}
                  </span>
                )}
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

              {quantity > 1 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600">Total ({quantity} unidades):</span>
                    <span className="text-3xl font-bold text-pink-600">
                      {currency} {precioUnitario * quantity}
                    </span>
                  </div>
                </div>
              )}

              {/* WhatsApp Button */}
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    if (product) {
                      handleWhatsAppClick(product, quantity);
                      if (product.id) registerWhatsAppConsultation(product.id);
                    }
                  }}
                  size="lg"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {quantity === 1
                    ? `Consultar por WhatsApp - ${currency}${precioUnitario}`
                    : `Consultar por WhatsApp - ${quantity} unidades (${currency})`}
                </Button>

                {quantity > 1 && (
                  <div className="text-center text-sm text-gray-600">
                    {quantity} × {currency}{precioUnitario} = {currency}{precioUnitario * quantity}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {productsByCategory?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
            <ProductGrid products={productsByCategory as ProductWithOffer[]} />
          </div>
        )}
      </div>
    </section>
  );
};
