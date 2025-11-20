import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageCircle, Mail, Gem, Gift, Truck, Sparkles, ShoppingBag, Palette, Package, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productsAPI } from '../services/api';
import { Product } from '../types';

type TabType = 'products' | 'custom';

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Imágenes de ejemplo para personalizadas (las mejores para mostrar)
  const customExamples = [
    { src: '/uploads/products/Figuraabogada.jpeg', name: 'Figura Abogada Personalizada' },
    { src: '/uploads/products/Figuraboda.jpeg', name: 'Figura Boda a Medida' },
    { src: '/uploads/products/Figuraharry.jpeg', name: 'Figura Temática Harry' },
    { src: '/uploads/products/Figuraskater.jpeg', name: 'Figura Skater Personalizada' },
  ];

  // Productos en stock (brujas y duendes disponibles)
  const stockItems = [
    { src: '/uploads/products/stock/Bruja.jpeg', name: 'Bruja Clásica', price: 45 },
    { src: '/uploads/products/stock/Bruja azul.jpeg', name: 'Bruja Azul', price: 45 },
    { src: '/uploads/products/stock/Bruja morada.jpeg', name: 'Bruja Morada', price: 45 },
    { src: '/uploads/products/stock/Bruja roja.jpeg', name: 'Bruja Roja', price: 45 },
    { src: '/uploads/products/stock/Bruja pequena.jpeg', name: 'Bruja Pequeña', price: 35 },
    { src: '/uploads/products/stock/Duende.jpeg', name: 'Duende Clásico', price: 40 },
    { src: '/uploads/products/stock/Duende 2.jpeg', name: 'Duende Sonriente', price: 40 },
    { src: '/uploads/products/stock/Duende con ropa.jpeg', name: 'Duende con Ropa', price: 45 },
    { src: '/uploads/products/stock/Duendes brazos movibles.jpeg', name: 'Duende Articulado', price: 50 },
    { src: '/uploads/products/stock/Otroduende.jpeg', name: 'Duende Especial', price: 40 },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, priceFilter, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const activeProducts = response.data.filter((p: Product) => p.status === 'active');
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter !== 'all') {
      filtered = filtered.filter((product) => {
        if (priceFilter === 'low') return product.price < 50;
        if (priceFilter === 'medium') return product.price >= 50 && product.price < 100;
        if (priceFilter === 'high') return product.price >= 100;
        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-primary-dark mb-4">
            Nuestra Colección
          </h1>
          <p className="text-xl text-gray-600">
            Figuras de porcelana artesanales únicas
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-primary-brown text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="inline w-5 h-5 mr-2 -mt-1" /> Productos en Stock
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'custom'
                  ? 'bg-primary-brown text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Palette className="inline w-5 h-5 mr-2 -mt-1" /> Figuras Personalizadas
            </button>
          </div>
        </motion.div>

        {/* Contenido según tab activo */}
        {activeTab === 'products' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header y descripción */}
            <div className="bg-gradient-to-r from-primary-brown/10 via-primary-gold/10 to-primary-rose/10 rounded-xl p-8 text-center">
              <div className="flex justify-center mb-2">
                <Gem className="w-8 h-8 text-primary-gold" />
              </div>
              <h2 className="text-3xl font-bold text-primary-dark mb-3">
                Colección Disponible
              </h2>
              <p className="text-gray-600 text-lg">
                Figuras de porcelana listas para enviar. Piezas únicas hechas a mano con todo el detalle y cariño.
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-brown focus:border-transparent transition-all"
                  />
                </div>

                {/* Price Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-brown focus:border-transparent transition-all appearance-none cursor-pointer bg-white"
                  >
                    <option value="all">Todos los precios</option>
                    <option value="low">Menos de €50</option>
                    <option value="medium">€50 - €100</option>
                    <option value="high">Más de €100</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count con estilo */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-medium flex items-center gap-2">
                <Package className="w-5 h-5 inline-block text-primary-brown" />
                Mostrando <span className="text-primary-brown font-bold">{filteredProducts.length + stockItems.length}</span> productos en total
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary-gold" />
                Envío gratuito en pedidos superiores a 50€
              </p>
            </div>

            {/* Productos de Stock (siempre visibles) */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-rose/20 to-primary-gold/20 rounded-xl p-6 text-center">
                <h3 className="text-2xl font-bold text-primary-dark mb-2 flex items-center justify-center gap-2">
                  <Package className="w-6 h-6 text-primary-brown" /> Colección en Stock
                </h3>
                <p className="text-gray-600">
                  Brujas y duendes de porcelana hechos a mano. Contacta para realizar tu pedido.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stockItems.map((item, index) => (
                  <motion.div
                    key={`stock-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Error loading image:', item.src);
                          e.currentTarget.src = 'https://via.placeholder.com/400?text=Imagen+no+disponible';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-primary-rose text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Stock
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg text-primary-dark mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-primary-brown mb-3">€{item.price}</p>
                      <button
                        onClick={() => {
                          const message = `Hola! Me interesa la ${item.name} de €${item.price}`;
                          window.open(`https://wa.me/34666714788?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full bg-primary-brown text-white py-2 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Consultar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Productos del Admin (si hay) */}
            {filteredProducts.length > 0 && (
              <div className="space-y-6 mt-12">
                <div className="bg-gradient-to-r from-primary-gold/20 to-primary-brown/20 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-primary-dark mb-2 flex items-center justify-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-primary-brown" /> Más Productos Disponibles
                  </h3>
                  <p className="text-gray-600">
                    Productos adicionales que puedes comprar directamente desde nuestra tienda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}



            {/* Info adicional */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8 mt-8"
              >
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Truck className="w-8 h-8 mx-auto mb-2 text-primary-brown" />
                    <h4 className="font-semibold text-gray-800 mb-1">Envío Rápido</h4>
                    <p className="text-sm text-gray-600">Entrega en 3-5 días laborables</p>
                  </div>
                  <div>
                    <Gift className="w-8 h-8 mx-auto mb-2 text-primary-gold" />
                    <h4 className="font-semibold text-gray-800 mb-1">Embalaje Premium</h4>
                    <p className="text-sm text-gray-600">Perfecto para regalo</p>
                  </div>
                  <div>
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary-rose" />
                    <h4 className="font-semibold text-gray-800 mb-1">100% Artesanal</h4>
                    <p className="text-sm text-gray-600">Hecho a mano en España</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Sección Figuras Personalizadas */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Info Section */}
            <div className="bg-white rounded-xl shadow-custom p-8">
              <h2 className="text-3xl font-bold text-primary-dark mb-4">
                ✨ Crea tu Figura Única
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                ¿Tienes una idea especial? Diseñamos figuras de porcelana completamente personalizadas 
                según tus necesidades. Perfectas para bodas, comuniones, regalos únicos o cualquier ocasión especial.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-primary-light p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-primary-dark mb-3">📋 Proceso</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Contacta con nosotros por WhatsApp o email</li>
                    <li>✓ Cuéntanos tu idea y envía fotos de referencia</li>
                    <li>✓ Te enviamos boceto y presupuesto</li>
                    <li>✓ Fabricamos tu figura única a mano</li>
                    <li>✓ Entrega en 3-4 semanas</li>
                  </ul>
                </div>
                
                <div className="bg-primary-light p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-primary-dark mb-3">💡 Ideas populares</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Novios de boda personalizados</li>
                    <li>• Figuras de profesiones (médicos, abogados...)</li>
                    <li>• Personajes temáticos (superhéroes, anime...)</li>
                    <li>• Mascotas y animales</li>
                    <li>• Hobbies y deportes</li>
                  </ul>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/34666714788?text=Hola,%20me%20gustaría%20solicitar%20un%20presupuesto%20para%20una%20figura%20personalizada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  📱 +34 666 71 47 88
                </a>
                
                <a
                  href="mailto:info@miestrella.com?subject=Solicitud%20de%20Figura%20Personalizada"
                  className="flex items-center justify-center gap-3 bg-primary-brown hover:opacity-90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  <Mail className="w-6 h-6" />
                  ✉️ Contactar por Email
                </a>
              </div>
            </div>

            {/* Examples Gallery */}
            <div>
              <h3 className="text-2xl font-bold text-primary-dark mb-6">
                Ejemplos de Trabajos Personalizados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {customExamples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="h-64 bg-gray-50 flex items-center justify-center p-2">
                      <img
                        src={example.src}
                        alt={example.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium text-gray-700 text-center">
                        {example.name}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-primary-brown/0 group-hover:bg-primary-brown/10 transition-all" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-primary-brown via-primary-gold to-primary-rose text-white rounded-xl p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">¿Listo para crear algo único?</h3>
              <p className="text-lg mb-6 opacity-90">
                Contáctanos y hagamos realidad tu idea
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/34666714788?text=Hola,%20me%20gustaría%20solicitar%20un%20presupuesto%20para%20una%20figura%20personalizada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary-brown font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  📱 WhatsApp
                </a>
                <a
                  href="mailto:info@miestrella.com?subject=Solicitud%20de%20Figura%20Personalizada"
                  className="bg-white text-primary-brown font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  ✉️ Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Store;