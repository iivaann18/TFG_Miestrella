import React, { useEffect, useRef, useState } from 'react';

type HeroCarouselProps = {
  images?: string[];
  interval?: number;
};

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  images = [
    '/uploads/products/sample1.jpg',
    '/uploads/products/sample2.jpg',
    '/uploads/products/sample3.jpg',
  ],
  interval = 5000,
}) => {
  const [index, setIndex] = useState(0);
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
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50">
      <div className="relative h-full w-full">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="w-full flex-shrink-0 h-96 md:h-[520px] bg-white flex items-center justify-center">
              <img 
                src={src} 
                alt={`Figura de porcelana ${i + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => console.error('Error loading image:', src, e)}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          aria-label="Anterior"
          onClick={() => { prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md"
        >
          ‹
        </button>
        <button
          aria-label="Siguiente"
          onClick={() => { next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a imagen ${i + 1}`}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-primary-brown' : 'bg-white/70'} shadow-sm`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
