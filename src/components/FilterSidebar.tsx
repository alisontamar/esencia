import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useCategory } from '@/hooks/useCategory';
import { useBrand } from '@/hooks/useBrand';

export const FilterSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ""
}) => {

  const { categories } = useCategory();
  const { brands } = useBrand();

  const [openSections, setOpenSections] = useState({
    search: true,
    brand: true,
    category: true,
    price: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters[0].categoria, category]
      : filters[0].categoria.filter(c => c !== category);

    onFiltersChange({ categoria: newCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters[0].marca, brand]
      : filters[0].marca.filter(c => c !== brand);

    onFiltersChange({ marca: newBrands });
  };

  const activeFiltersCount =
    filters[0].marca.length +
    filters[0].categoria.length +
    (filters[0].precio.max > 0 || filters[0].precio.min > 0 ? 1 : 0) +
    (filters[0].busqueda ? 1 : 0);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 md:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Filtros</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-black"
          >
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Filter */}
        <Collapsible open={openSections.search} onOpenChange={() => toggleSection('search')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Búsqueda</span>
            {openSections.search ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Input
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="w-full"
            />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brand Filter */}
        <Collapsible open={openSections.brand} onOpenChange={() => toggleSection('brand')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Marcas</span>
            {openSections.brand ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3">
              {
                brands?.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand.nombre}`}
                        checked={filters[0].marca.includes(brand.nombre)}
                        onCheckedChange={(checked) =>
                          handleBrandChange(brand.nombre, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`brand-${brand.nombre}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {brand.nombre}
                      </Label>
                    </div>
                  </div>
                ))
              }
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Category Filter */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Categorías</span>
            {openSections.category ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters[0].categoria.includes(category.nombre)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.nombre, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.nombre}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />
      </div>
    </div>
  );
};