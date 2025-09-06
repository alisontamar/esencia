import { useState, useMemo } from "react";
import { ProductWithOffer } from "@/types/database.types";

export interface ProductFilters {
  marca: string[];
  categoria: string[];
  precio: { min: number; max: number };
  busqueda: string;
}

interface UseFiltersProps {
  products: ProductWithOffer[];
}

export const useFilters = ({ products }: UseFiltersProps) => {
  const [filters, setFilters] = useState<ProductFilters>({
    marca: [],
    categoria: [],
    precio: { min: 0, max: 0 },
    busqueda: "",
  });

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      // --- Filtro por marca ---
      if (
        filters.marca.length > 0 &&
        !filters.marca.includes(product?.marcas?.nombre ?? "")
      ) {
        return false;
      }

      // --- Filtro por categoría ---
      if (
        filters.categoria.length > 0 &&
        !filters.categoria.includes(product?.categoria_nombre ?? "")
      ) {
        return false;
      }

      // --- Filtro por precio ---
      if (
        (filters.precio.min > 0 && product?.precio_actual < filters.precio.min) ||
        (filters.precio.max > 0 && product?.precio_actual > filters.precio.max)
      ) {
        return false;
      }

      // --- Filtro por búsqueda ---
      if (filters.busqueda) {
        const searchLower = filters.busqueda.toLowerCase();
        const matchesName = product?.nombre?.toLowerCase().includes(searchLower);
        const matchesBrand = product?.marcas?.nombre?.toLowerCase().includes(searchLower);
        const matchesCategory = product?.categoria_nombre?.toLowerCase().includes(searchLower);

        if (!matchesName && !matchesBrand && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  // --- Actualiza filtros con toggle automático ---
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      marca: newFilters.marca
        ? Array.isArray(newFilters.marca)
          ? newFilters.marca
          : [...prev.marca, newFilters.marca]
        : prev.marca,

      categoria: newFilters.categoria
        ? Array.isArray(newFilters.categoria)
          ? newFilters.categoria
          : [...prev.categoria, newFilters.categoria]
        : prev.categoria,

      precio: newFilters.precio ?? prev.precio,

      busqueda:
        typeof newFilters.busqueda === "string"
          ? newFilters.busqueda
          : prev.busqueda,
    }));
  };

  const clearFilters = () => {
    setFilters({
      marca: [],
      categoria: [],
      precio: { min: 0, max: 0 },
      busqueda: "",
    });
  };

  return {
    filters,
    filteredProducts,
    updateFilters,
    clearFilters,
  };
};
