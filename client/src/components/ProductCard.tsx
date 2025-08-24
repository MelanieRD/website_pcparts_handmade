import { Star, ShoppingCart, Heart, Package, Eye } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const categoryColor = product.category === 'computer' 
    ? 'bg-secondary-100 text-secondary-800' 
    : 'bg-primary-100 text-primary-800';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white/90 rounded-full hover:bg-white hover:text-red-500 transition-colors">
            <Heart className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onViewDetails(product)}
            className="p-2 bg-white/90 rounded-full hover:bg-white hover:text-primary-500 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            {product.subcategory}
          </span>
        </div>
        {product.brand && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-black/70 text-white rounded text-xs font-medium">
              {product.brand}
            </span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2rem]">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Package className="h-3 w-3 mr-1" />
            {product.inStock ? 'Stock' : 'Agotado'}
          </div>
        </div>

        <p className="text-gray-600 text-xs mb-3 line-clamp-1 leading-tight">
          {product.description}
        </p>

        <div className="mb-3">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 py-2 px-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 border-2 border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Eye className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs font-medium truncate">Ver</span>
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`flex-1 py-2 px-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
              product.inStock
                ? product.category === 'computer'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs font-medium truncate">
              {product.inStock ? 'Comprar' : 'Agotado'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}