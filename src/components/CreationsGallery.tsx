import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageModal from './ImageModal';

type CreationsGalleryProps = {
  images?: string[];
};

// Mapeo de nombres de archivo a nombres descriptivos
const imageNames: Record<string, string> = {
  'Figuraabogada.jpeg': 'Figura Abogada',
  'Figuraboda.jpeg': 'Figura Boda',
  'Figuraboda2.jpeg': 'Figura Boda Especial',
  'Figuraboda3.jpeg': 'Figura Boda Romántica',
  'Figuraboda4.jpeg': 'Figura Boda Elegante',
  'Figuraboda5.jpeg': 'Figura Boda Clásica',
  'Figurabola.jpeg': 'Figura Bola',
  'Figuracaravan.jpeg': 'Figura Caravana',
  'Figuracomunion.jpeg': 'Figura Comunión',
  'Figuradiego.jpeg': 'Figura Diego',
  'Figuraharry.jpeg': 'Figura Harry',
  'Figuralucas.jpeg': 'Figura Lucas',
  'Figuranaina.jpeg': 'Figura Naina',
  'Figuranena.jpeg': 'Figura Nena',
  'Figuranina.jpeg': 'Figura Niña',
  'Figuranona.jpeg': 'Figura Nona',
  'Figuraratica.jpeg': 'Figura Ratica',
  'Figurarobotica.jpeg': 'Figura Robótica',
  'Figuraskater.jpeg': 'Figura Skater',
};

const getImageName = (src: string): string => {
  const filename = src.split('/').pop() || '';
  return imageNames[filename] || 'Figura de porcelana';
};

const isNew = (index: number, total: number): boolean => {
  // Marcar las últimas 3 imágenes como nuevas
  return index >= total - 3;
};

const CreationsGallery: React.FC<CreationsGalleryProps> = ({
  images = [],
}) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, images.length));
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold text-primary-dark mb-6"
        >
          Nuestras creaciones
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-6 max-w-2xl"
        >
          Galería de piezas únicas hechas a mano. Cada imagen muestra detalles y acabados.
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {visibleImages.map((src, i) => {
            const imageName = getImageName(src);
            const showNewBadge = isNew(i + (images.length - visibleImages.length), images.length);
            
            return (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-lg bg-gray-50 shadow-sm cursor-pointer relative"
                onClick={() => setSelectedImage({ src, alt: imageName })}
              >
                {/* Badge NUEVO */}
                {showNewBadge && (
                  <div className="absolute top-2 right-2 bg-primary-rose text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                    NUEVO
                  </div>
                )}
                
                <div className="h-56 bg-gray-50 flex items-center justify-center p-1">
                  <img 
                    src={src} 
                    alt={imageName}
                    className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => console.error('Error loading image:', src, e)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón Cargar más */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-primary-brown text-white rounded-md shadow-sm hover:opacity-95 transition-opacity"
            >
              Cargar más ({images.length - visibleCount} restantes)
            </button>
          </motion.div>
        )}

        {/* Botón Ver tienda */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <Link to="/store">
            <button className="px-6 py-2 bg-primary-gold text-primary-dark rounded-md shadow-sm hover:opacity-95 transition-opacity">
              Ver más trabajos
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Modal Lightbox */}
      <ImageModal
        isOpen={selectedImage !== null}
        imageSrc={selectedImage?.src || ''}
        imageAlt={selectedImage?.alt || ''}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
};

export default CreationsGallery;
