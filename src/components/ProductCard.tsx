import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  return (
    <Card
      className={`flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-lg border-0 rounded-2xl bg-white ${className}`}
    >
      <div className="aspect-square flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
          <div className="mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</span>
          </div>

          {/* Product name with flex-grow to take available space */}
          <h3 className="font-medium text-gray-800 mb-4 text-sm group-hover:text-pink-600 transition-colors flex-grow">
            {product.name}
          </h3>

          {/* Footer section - always at bottom */}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-gray-800 text-lg">${product.price}</span>

            <Link
              to={`/product/${product.id}`}
              className="text-sm text-white px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-md transition-all duration-200 transform hover:scale-105"
            >
              Ver detalles →
            </Link>
          </div>
      </CardContent>
    </Card>
  );
};