import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Building 
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, couponsAPI } from '../services/api';
import { Address } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Customer Info
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Billing Address
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'ES',
    zip: '',
    phone: user?.phone || '',
  });

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'ES',
    zip: '',
    phone: user?.phone || '',
  });

  const subtotal = getTotalPrice();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const subtotalAfterDiscount = subtotal - discount;
  const shipping = subtotalAfterDiscount > 50 ? 0 : 5.99;
  const tax = subtotalAfterDiscount * 0.21;
  const total = subtotalAfterDiscount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

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
      setError(error.response?.data?.error || 'Cupón inválido');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      // Crear Payment Intent en el backend
      const paymentData = {
        amount: Math.round(total * 100), // Stripe usa centavos
        currency: 'eur',
        customerInfo,
        billingAddress,
        shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
        items: items.map(item => ({
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
        couponCode: appliedCoupon?.code,
        subtotal,
        discount,
        shipping,
        tax,
        total,
      };

      const { data } = await ordersAPI.createPaymentIntent(paymentData);

      // Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${billingAddress.firstName} ${billingAddress.lastName}`,
              email: customerInfo.email,
              phone: billingAddress.phone,
              address: {
                line1: billingAddress.address1,
                line2: billingAddress.address2,
                city: billingAddress.city,
                state: billingAddress.province,
                postal_code: billingAddress.zip,
                country: billingAddress.country.toLowerCase(),
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Error al procesar el pago');
      } else if (paymentIntent.status === 'succeeded') {
        // Pago exitoso
        clearCart();
        navigate(`/order-confirmation/${data.orderId}`, {
          state: { paymentIntent }
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-primary-brown hover:text-primary-gold transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al carrito
          </button>
          <h1 className="text-4xl font-bold text-primary-dark">Finalizar Compra</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información de contacto y direcciones */}
            <div className="space-y-6">
              {/* Customer Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-custom p-6"
              >
                <h2 className="text-2xl font-semibold text-primary-dark mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Información de Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-custom p-6"
              >
                <h2 className="text-2xl font-semibold text-primary-dark mb-4 flex items-center">
                  <Building className="w-6 h-6 mr-2" />
                  Dirección de Facturación
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.firstName}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.lastName}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Empresa (opcional)
                    </label>
                    <input
                      type="text"
                      value={billingAddress.company}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.address1}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, address1: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Apartamento, suite, etc. (opcional)
                    </label>
                    <input
                      type="text"
                      value={billingAddress.address2}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, address2: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Provincia *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.province}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, province: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.zip}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, zip: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      País *
                    </label>
                    <select
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    >
                      <option value="ES">España</option>
                      <option value="FR">Francia</option>
                      <option value="IT">Italia</option>
                      <option value="PT">Portugal</option>
                      <option value="DE">Alemania</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address Toggle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-custom p-6"
              >
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="mr-3 w-4 h-4 text-primary-brown focus:ring-primary-brown border-gray-300 rounded"
                  />
                  <label htmlFor="sameAsBilling" className="text-primary-dark font-semibold">
                    La dirección de envío es la misma que la de facturación
                  </label>
                </div>

                {!sameAsBilling && (
                  <div>
                    <h2 className="text-2xl font-semibold text-primary-dark mb-4 flex items-center">
                      <MapPin className="w-6 h-6 mr-2" />
                      Dirección de Envío
                    </h2>
                    {/* Similar form fields as billing address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Repeat similar fields for shipping address */}
                      <div>
                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                        />
                      </div>
                      {/* Add more shipping address fields as needed */}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-custom p-6"
              >
                <h2 className="text-2xl font-semibold text-primary-dark mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Método de Pago
                </h2>
                <div className="border border-gray-300 rounded-lg p-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#2d2638',
                          '::placeholder': {
                            color: '#9ca3af',
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-600">
                  <Lock className="w-4 h-4 mr-2" />
                  Tu información está protegida con encriptación SSL
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-custom p-6 sticky top-24"
              >
                <h2 className="text-2xl font-semibold text-primary-dark mb-6">
                  Resumen del Pedido
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary-dark">{item.title}</h4>
                        <p className="text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-primary-brown">
                        €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                {!appliedCoupon && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Código de Cupón
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Ingresa tu cupón"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        variant="outline"
                        size="sm"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({appliedCoupon.code})</span>
                      <span>-€{discount.toFixed(2)}</span>
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
                  <hr />
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-primary-dark">Total</span>
                    <span className="font-bold text-primary-brown">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!stripe || loading}
                >
                  <Lock className="w-5 h-5 mr-2 inline-block" />
                  {loading ? 'Procesando...' : `Pagar €${total.toFixed(2)}`}
                </Button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;