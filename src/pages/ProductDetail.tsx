import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (handle) {
      loadProduct(handle);
    }
  }, [handle]);

  const loadProduct = async (productHandle: string) => {
    try {
      setLoading(true);
      const response = await productsAPI.getByHandle(productHandle);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

   addToCart({
    variantId: product.id.toString(),
    productId: product.id,
    title: product.title,
    price: parseFloat(product.price.toString()).toString(),
    quantity,
    image: product.images[0]?.url || 'https://via.placeholder.com/300x400?text=No+Image',
    handle: product.handle, // AÑADIDO
  });

    navigate('/cart');
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Producto no encontrado
          </h2>
          <Button onClick={() => navigate('/store')} variant="primary">
            <ArrowLeft className="w-5 h-5 mr-2 inline-block" />
            Volver a la tienda
          </Button>
        </div>
      </div>
    );
  }

  // Convertir precios a números
  const price = parseFloat(product.price.toString());
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : null;
  const hasDiscount = compareAtPrice !== null && compareAtPrice > price;
  const discountPercentage = hasDiscount && compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const currentImage = product.images[selectedImage]?.url || 'https://via.placeholder.com/600x800?text=No+Image';
  
  // Valoraciones
  const rating = product.rating || 4.8;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/store')}
          className="flex items-center text-primary-brown hover:text-primary-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la tienda
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-custom p-4 mb-4">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-[600px] object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=No+Image';
                }}
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white rounded-lg p-2 transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-primary-brown'
                        : 'hover:ring-2 hover:ring-primary-gold'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col max-w-full"
          >
            <h1 className="text-4xl font-bold text-primary-dark mb-4 break-words">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < fullStars
                        ? 'text-yellow-500 fill-current'
                        : i === fullStars && hasHalfStar
                        ? 'text-yellow-500 fill-current opacity-50'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">({rating} de 5 estrellas)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 flex-wrap">
                <span className="text-4xl font-bold text-primary-brown">
                  €{price.toFixed(2)}
                </span>
                {hasDiscount && compareAtPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      €{compareAtPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description - CORREGIDO para texto largo */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-primary-dark mb-3">
                Descripción
              </h3>
              <div className="text-gray-700 leading-relaxed break-words max-w-full overflow-hidden">
                <p className="whitespace-pre-wrap word-break">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-primary-dark mb-3">
                Cantidad
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-primary-light text-primary-dark px-4 py-2 rounded-lg hover:bg-primary-brown hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="bg-primary-light text-primary-dark px-4 py-2 rounded-lg hover:bg-primary-brown hover:text-white transition-colors"
                >
                  +
                </button>
                <span className="text-gray-600">
                  ({product.inventory} disponibles)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={product.inventory === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2 inline-block" />
                {product.inventory === 0 ? 'Agotado' : 'Añadir al Carrito'}
              </Button>
              <Button variant="outline" size="lg" className="sm:w-auto">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-primary-light rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Envío gratis</span>
                <span className="font-semibold text-primary-brown">
                  En pedidos superiores a €50
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Garantía</span>
                <span className="font-semibold text-primary-brown">
                  30 días de devolución
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Artesanía</span>
                <span className="font-semibold text-primary-brown">
                  Hecho a mano
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;