import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageSrc, imageAlt, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Cerrar modal"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Imagen */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-7xl max-h-[90vh] w-full"
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-contain"
            />
            <p className="text-white text-center mt-4 text-lg">{imageAlt}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
