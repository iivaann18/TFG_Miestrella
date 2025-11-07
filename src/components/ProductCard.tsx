import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const price = parseFloat(product.price.toString());
    
    addToCart({
      variantId: product.id.toString(),
      productId: product.id,
      title: product.title,
      price: price.toString(),
      quantity: 1,
      image: product.images[0]?.url || 'https://via.placeholder.com/300x400?text=No+Image',
      handle: product.handle, // ✅ agregar esta línea
    });
  };

  const price = parseFloat(product.price.toString());
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : null;
  const hasDiscount = compareAtPrice !== null && compareAtPrice > price;
  const discountPercentage = hasDiscount && compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-custom overflow-hidden group"
    >
      <Link to={`/product/${product.handle}`}>
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/300x400?text=No+Image'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
          
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="bg-white text-primary-brown p-3 rounded-full hover:bg-primary-gold hover:text-white transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <Link
                to={`/product/${product.handle}`}
                className="bg-white text-primary-brown p-3 rounded-full hover:bg-primary-gold hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-primary-dark mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-brown">
                €{price.toFixed(2)}
              </span>
              {hasDiscount && compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  €{compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.inventory <= 5 && product.inventory > 0 && (
              <span className="text-xs text-red-500 font-semibold">
                ¡Solo {product.inventory} disponibles!
              </span>
            )}
            {product.inventory === 0 && (
              <span className="text-xs text-red-500 font-semibold">
                Agotado
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;