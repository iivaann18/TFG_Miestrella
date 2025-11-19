import React from 'react';
import { Link } from 'react-router-dom';

type CreationsGalleryProps = {
  images?: string[];
};

const CreationsGallery: React.FC<CreationsGalleryProps> = ({
  images = [
    '/uploads/products/sample1.jpg',
    '/uploads/products/sample2.jpg',
    '/uploads/products/sample3.jpg',
    '/uploads/products/sample4.jpg',
    '/uploads/products/sample5.jpg',
    '/uploads/products/sample6.jpg',
  ],
}) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-semibold text-primary-dark mb-6">Nuestras creaciones</h3>
        <p className="text-gray-600 mb-6 max-w-2xl">Galería de piezas únicas hechas a mano. Cada imagen muestra detalles y acabados.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <div key={i} className="group overflow-hidden rounded-lg bg-gray-50 shadow-sm">
              <div className="h-56 bg-gray-50 flex items-center justify-center p-1">
                <img 
                  src={src} 
                  alt={`Figura de porcelana ${i + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => console.error('Error loading image:', src, e)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/store">
            <button className="px-6 py-2 bg-primary-brown text-white rounded-md shadow-sm hover:opacity-95">Ver más trabajos</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreationsGallery;
