import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { couponsAPI } from '../services/api';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const subtotalAfterDiscount = subtotal - discount;
  const shipping = subtotalAfterDiscount > 50 ? 0 : 5.99; // Envío gratis > €50
  const tax = subtotalAfterDiscount * 0.21; // 21% IVA España
  const total = subtotalAfterDiscount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await couponsAPI.validate(couponCode.toUpperCase(), subtotal);
      
      if (response.data.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: response.data.discount,
          ...response.data.coupon
        });
        setCouponCode('');
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.error || 'Cupón inválido');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-dark mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-8">
            Añade algunos productos para comenzar tu compra
          </p>
          <Link to="/store">
            <Button variant="primary" size="lg">
              Ir a la Tienda
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-primary-dark mb-8"
        >
          Carrito de Compras
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.variantId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-xl shadow-custom p-6 flex flex-col md:flex-row gap-6"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-primary-brown font-bold text-lg">
                    €{parseFloat(item.price).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="bg-primary-light p-2 rounded-lg hover:bg-primary-brown hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="bg-primary-light p-2 rounded-lg hover:bg-primary-brown hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  className="text-red-500 hover:text-red-700 transition-colors self-start"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </motion.div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 transition-colors text-sm"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-custom p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-primary-dark mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                </div>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-semibold">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-700 font-semibold">
                        -€{discount.toFixed(2)}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'GRATIS' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-semibold">€{tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-primary-dark">Total</span>
                  <span className="font-bold text-primary-brown">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Code */}
              {!appliedCoupon && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Código de Cupón
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="Ingresa tu cupón"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown uppercase"
                      disabled={couponLoading}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      variant="outline"
                      size="sm"
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      {couponLoading ? '...' : 'Aplicar'}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-2">{couponError}</p>
                  )}
                </div>
              )}

              <Button
                onClick={handleCheckout}
                variant="primary"
                size="lg"
                fullWidth
              >
                Proceder al Pago
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </Button>

              <Link to="/store" className="block text-center mt-4 text-primary-brown hover:text-primary-gold transition-colors">
                Continuar comprando
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;