import { products } from '@/data/products';
import { ProductGrid } from './ProductGrid';


export const FeaturedProducts = () => {

  // 1. Leer del sessionStorage de forma segura
  const storedProducts = sessionStorage.getItem('products');
  let productsFromStorage = [];
  try {
    productsFromStorage = storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error parsing stored products:', error);
    productsFromStorage = [];
  }

  // 2. Combinar productos reales + almacenados
  const allProducts = [...products, ...productsFromStorage];
  // 3. Filtrar solo los destacados
  const featuredProducts = allProducts.filter((product) => product.featured || product.isHighlighted).sort((a, b) => b.id - a.id);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros productos más populares y recomendados por nuestros clientes.
          </p>
        </div>

        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};