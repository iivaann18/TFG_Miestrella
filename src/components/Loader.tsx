import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="w-16 h-16 border-4 border-primary-light border-t-primary-brown rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default Loader;