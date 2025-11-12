import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../Button';
import { CheckCircle, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../services/api';

interface Props {
  orderId: number | string;
  paymentIntent?: any;
  onClose: () => void;
  order?: any;
}

const PaymentSuccessModal: React.FC<Props> = ({ orderId, paymentIntent, onClose, order }) => {
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const estimatedDelivery = order?.createdAt
    ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000)
    : new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(String(orderId));
      setToast('Número de pedido copiado');
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      setToast('No se pudo copiar');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const downloadInvoice = async () => {
    try {
      const res = await ordersAPI.getInvoice(Number(orderId));
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading invoice:', err);
      setToast(err.response?.data?.error || 'Error al descargar factura');
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl p-8 z-10 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Pago realizado con éxito</h3>
        <p className="text-sm text-gray-600 mb-4">Tu pedido <span className="font-medium">#{orderId}</span> se ha creado correctamente.</p>

        {paymentIntent && (
          <div className="text-left mb-4 bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Importe: <span className="font-medium">€{(paymentIntent.amount_total || paymentIntent.amount || 0) / 100}</span></p>
            <p className="text-sm text-gray-600">Estado pago: <span className="font-medium">{paymentIntent.status || paymentIntent.payment_status}</span></p>
            {paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 && (
              <p className="text-sm text-gray-600">Tarjeta: **** **** **** {paymentIntent.charges.data[0].payment_method_details.card.last4}</p>
            )}
          </div>
        )}

          <div className="mb-4">
            <p className="text-sm text-gray-600">Fecha estimada de entrega:</p>
            <p className="font-medium">{estimatedDelivery.toLocaleDateString('es-ES')}</p>
          </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button onClick={onClose} variant="primary">Volver a la tienda</Button>
          <Button onClick={() => navigate('/profile')} variant="outline">Mi cuenta</Button>
          <Button onClick={() => navigate(`/order/${orderId}`)} variant="outline">Ver mi pedido</Button>
          <Button onClick={downloadInvoice} variant="outline">Descargar factura</Button>
          <Button onClick={copyOrderId} variant="outline"><Copy className="w-4 h-4 mr-2"/>Copiar nº pedido</Button>
        </div>
        {toast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded">{toast}</div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccessModal;
