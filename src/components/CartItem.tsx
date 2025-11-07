import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const price = parseFloat(item.price);
  const subtotal = price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.variantId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.variantId, item.quantity + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md"
    >
      {/* Imagen del producto */}
      <img
        src={item.image}
        alt={item.title}
        className="w-24 h-24 object-cover rounded-lg"
      />

      {/* Información del producto */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-primary-dark mb-1">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-2">€{price.toFixed(2)}</p>

        {/* Controles de cantidad */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrease}
            className="bg-primary-light p-2 rounded-full hover:bg-primary-beige transition-colors"
          >
            <Minus className="w-4 h-4 text-primary-brown" />
          </motion.button>
          
          <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrease}
            className="bg-primary-light p-2 rounded-full hover:bg-primary-beige transition-colors"
          >
            <Plus className="w-4 h-4 text-primary-brown" />
          </motion.button>
        </div>
      </div>

      {/* Subtotal y eliminar */}
      <div className="flex flex-col items-end space-y-4">
        <p className="text-xl font-bold text-primary-brown">
          €{subtotal.toFixed(2)}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(item.variantId)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CartItem;