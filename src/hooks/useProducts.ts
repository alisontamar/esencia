// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { ProductWithOffer } from '@/types/database.types';
import { supabase } from '@/lib/services/supabaseClient';

export function useProducts() {
  const [products, setProducts] = useState<ProductWithOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithOffer | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<ProductWithOffer[]>([]);

  const fetchAllProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*'); // ajusta a tu tabla
    setProducts(data ?? []);
    setLoading(false);
  };

  const fetchProductById = async (id: string) => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    setSelectedProduct(data ?? null);
    setLoading(false);
  };

  const fetchProductsByCategory = async () => {
    if (!selectedProduct) return;
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('categoria_id', selectedProduct.categoria_id);
    setProductsByCategory(data ?? []);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return { products, loading, selectedProduct, fetchProductById, productsByCategory, fetchProductsByCategory };
}
