import { useState, useMemo } from 'react';

export const useFilters = (products) => {

    const [filters, setFilters] = useState([{
        marca: [],
        categoria: [],
        precio: { min: 0, max: 0 },
        busqueda: '',
    }]);

    const filterBrands = filters[0].marca;
    const filtersCategories = filters[0].categoria;
    const filtersSearch = filters[0].busqueda;

    console.log(products)
    const filteredProducts = useMemo(() => {
        return products?.filter((product) => {
            // Filter by brand
            if (
                !filterBrands.includes(product?.marcas?.nombre as string)
            ) {
                return false;
            }
            // Filter by category
            if (
                !filtersCategories.includes(product?.categoria_nombre as string) &&
                filtersCategories.length > 0
            )
                return false;

            // Filter by search
            if (filtersSearch) {
                const searchLower = filtersSearch.toLowerCase();
                const matchesName = product?.nombre
                    .toLowerCase()
                    .includes(searchLower);
                const matchesBrand = product?.marcas?.nombre
                    .toLowerCase()
                    .includes(searchLower);
                const matchesCategory = product?.categoria_nombre || ""
                    .toLowerCase()
                    .includes(searchLower);

                if (!matchesName && !matchesBrand && !matchesCategory) {
                    return false;
                }
            }

            return true;
        });
    }, [products, filters]);

    const updateFilters = (newFilters) => {
        setFilters((prev) => ([{
            marca: Array.isArray(newFilters.marca)
                ? newFilters.marca
                : prev[0].marca,
            categoria: Array.isArray(newFilters.categoria)
                ? newFilters.categoria
                : prev[0].categoria,
            precio: newFilters.precio ?? prev[0].precio,
            busqueda:
                typeof newFilters.busqueda === 'string'
                    ? newFilters.busqueda
                    : prev[0].busqueda,
        }]));
    };

    const clearFilters = () => {
        setFilters([{
            marca: [],
            categoria: [],
            precio: { min: 0, max: 0 },
            busqueda: '',
        }]);
    };

    return {
        filters,
        filteredProducts,
        updateFilters,
        clearFilters,
    };
};
