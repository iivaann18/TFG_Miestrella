import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HeroCarouselProps = {
  images?: string[];
  interval?: number;
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

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  images = [],
  interval = 5000,
}) => {
  const [index, setIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const start = () => {
    stop();
    timeoutRef.current = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
  };

  const stop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const goTo = (i: number) => {
    setIndex(i);
  };

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-white shadow-lg">
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-96 md:h-[520px] bg-white flex items-center justify-center"
          >
            <motion.img
              src={images[index]}
              alt={getImageName(images[index])}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => console.error('Error loading image:', images[index], e)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows con animación hover */}
        <motion.button
          aria-label="Anterior"
          onClick={() => { prev(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
        >
          <span className="text-2xl font-bold">‹</span>
        </motion.button>
        <motion.button
          aria-label="Siguiente"
          onClick={() => { next(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
        >
          <span className="text-2xl font-bold">›</span>
        </motion.button>

        {/* Dots con animación */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <motion.button
              key={i}
              aria-label={`Ir a imagen ${i + 1}`}
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === index ? 'bg-primary-brown w-8' : 'bg-white/70'
              } shadow-md`}
            />
          ))}
        </div>

        {/* Nombre de la imagen actual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm"
        >
          {getImageName(images[index])}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroCarousel;
