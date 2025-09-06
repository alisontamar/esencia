// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { ProductWithOffer } from '@/types/database.types';
import { supabase } from '@/lib/services/supabaseClient';

export function useProducts() {
  const [products, setProducts] = useState<ProductWithOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithOffer | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<ProductWithOffer[]>([]);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      setSelectedProduct(data ?? null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('categoria_id', selectedProduct.categoria_id);
      if (error) throw error;
      setProductsByCategory(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return { products, loading, error, selectedProduct, fetchProductById, productsByCategory, fetchProductsByCategory };
}
