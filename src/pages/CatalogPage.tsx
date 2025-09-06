import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MobileFilterDrawer } from '@/components/MobileFilterDrawer';
import { useFilters } from '@/hooks/useFilters';
import { useMobile } from '@/hooks/useMobile';
import { useProducts } from '@/hooks/useProducts';
import { useBrand } from '@/hooks/useBrand';
import { useCategory } from '@/hooks/useCategory';
import { ProductWithOffer } from '@/types/database.types';
import { SEO } from '@/components/SEO';

export const CatalogPage = () => {
  const { category } = useParams();
  const { products, loading } = useProducts();
  const { categories } = useCategory();
  const { brands } = useBrand();

  const [sortBy, setSortBy] = useState<'nombre' | 'precio_base' | 'marca_nombre'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const isMobile = useMobile();

  const { filters, filteredProducts, updateFilters, clearFilters } = useFilters({ products });

  // Apply URL params to filters
  useEffect(() => {
    window.scrollTo(0, 0);
    const newFilters: Partial<typeof filters> = {};

    if (category) newFilters.categoria = [category.split('-').join(' ')];
    updateFilters(newFilters);
  }, [category]);

  // Ordenar productos filtrados
  const sortedProducts = filteredProducts.sort((a: ProductWithOffer, b: ProductWithOffer) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'precio_base':
        aValue = a.precio_base;
        bValue = b.precio_base;
        break;
      case 'nombre':
        aValue = a.nombre.toLowerCase();
        bValue = b.nombre.toLowerCase();
        break;
      case 'marca_nombre':
        aValue = a.marca_nombre?.toLowerCase() || '';
        bValue = b.marca_nombre?.toLowerCase() || '';
        break;
      default:
        aValue = a.nombre.toLowerCase();
        bValue = b.nombre.toLowerCase();
    }

    if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const productsNames = products.map(p => p.nombre).join(', ');
  const categoriesNames = categories.map(c => c.nombre).join(', ');
  const brandsNames = brands.map(b => b.nombre).join(', ');

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <SEO
        title="Esencia | Tendencias de belleza"
        description={`
Descubre los mejores productos de belleza para tu rutina diaria, combinando tendencias actuales, ingredientes naturales y ecológicos, ideales para todo tipo de piel, cabello y rostro. Encuentra productos de alta calidad a precios accesibles, incluyendo: ${productsNames}, en categorías como ${categoriesNames}, y de marcas reconocidas como ${brandsNames}. ¡Resalta tu belleza natural con Esencia, tu tienda de confianza!
`}
      />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-3 sm:mb-6 px-2 sm:px-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Mostrando {filteredProducts.length} productos
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {!isMobile && (
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6 bg-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm gap-2">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {isMobile && (
                  <MobileFilterDrawer
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearFilters}
                  />
                )}

                <span className="text-xs sm:text-sm text-gray-600">
                  {products.length} productos
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                 <Select
  value={sortBy}
  onValueChange={(value) => setSortBy(value as "nombre" | "precio_base" | "marca_nombre")}
>

                    <SelectTrigger className="w-24 sm:w-32 rounded-full text-xs sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nombre">Nombre</SelectItem>
                      <SelectItem value="precio_base">Precio</SelectItem>
                      <SelectItem value="marca_nombre">Marca</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <ProductGrid products={sortedProducts} isLoading={loading} />
          </div>
        </div>
      </div>
    </section>
  );
};
