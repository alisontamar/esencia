import { products } from '@/data/products';
import { ProductGrid } from './ProductGrid';

export const FeaturedProducts = () => {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Productos Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros productos más populares y recomendados por nuestros clientes.
          </p>
        </div>

        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};