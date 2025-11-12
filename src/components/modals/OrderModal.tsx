import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { useState } from 'react';
import Button from '../Button';
import { Order } from '../../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, order }) => {
  const [toast, setToast] = useState<string | null>(null);
  const estimatedDelivery = order?.createdAt
    ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000)
    : null;

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(String(order?.orderNumber || ''));
      setToast('Número de pedido copiado');
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      setToast('No se pudo copiar');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const downloadInvoice = async () => {
    try {
      const res = await ordersAPI.getInvoice(order!.id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order!.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setToast('Error al descargar factura');
      setTimeout(() => setToast(null), 3000);
    }
  };
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Pedido {order.orderNumber}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium">{order.customerName} — {order.customerEmail}{order.customerPhone ? ` • ${order.customerPhone}` : ''}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pedido Nº</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Dirección de envío</p>
                {order.shippingAddress ? (
                  <div className="font-medium">
                    <div>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                    <div>{order.shippingAddress.address1}{order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ''}</div>
                    <div>{order.shippingAddress.city} {order.shippingAddress.zip}</div>
                    <div>{order.shippingAddress.province}, {order.shippingAddress.country}</div>
                    {order.shippingAddress.phone && <div className="text-sm text-gray-600">Tel: {order.shippingAddress.phone}</div>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No hay dirección registrada.</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Items</p>
                <div className="mt-2 space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center border rounded p-2">
                        <div>
                          <p className="font-medium">{it.productTitle}</p>
                          <p className="text-sm text-gray-600">Cantidad: {it.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€{parseFloat(it.price.toString()).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Subtotal: €{parseFloat(it.subtotal.toString()).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No hay items registrados.</p>
                  )}
                </div>
              </div>

              {order.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notas</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Resumen de pago</p>
                  <div className="font-medium">
                    <div>Subtotal: €{parseFloat(order.subtotal.toString()).toFixed(2)}</div>
                    <div>Envío: €{parseFloat(order.shippingCost.toString()).toFixed(2)}</div>
                    <div>IVA: €{parseFloat(order.tax.toString()).toFixed(2)}</div>
                    {order.discount > 0 && <div>Descuento: -€{parseFloat(order.discount.toString()).toFixed(2)} {order.couponCode ? `(${order.couponCode})` : ''}</div>}
                    <hr className="my-2" />
                    <div className="text-lg font-bold">Total: €{parseFloat(order.total.toString()).toFixed(2)}</div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Detalles de pago</p>
                  <div className="font-medium">
                    <div>Estado: {order.paymentStatus}</div>
                    {order.paymentMethod && <div>Método: {order.paymentMethod}</div>}
                    {order.paymentIntentId && <div>ID Pago: {order.paymentIntentId}</div>}
                    {order.trackingNumber && <div>Tracking: {order.trackingNumber}</div>}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {estimatedDelivery && (
                  <div className="text-sm text-gray-600 mb-2">Fecha estimada de entrega: <span className="font-medium">{estimatedDelivery.toLocaleDateString('es-ES')}</span></div>
                )}
                <div className="flex justify-between items-center pt-4">
                  <div className="space-x-2">
                    <Button onClick={downloadInvoice} variant="outline">Descargar factura</Button>
                    <Button onClick={copyOrder} variant="outline"><Copy className="w-4 h-4 mr-2"/>Copiar nº pedido</Button>
                  </div>
                  <div>
                    <Button onClick={onClose} variant="outline">Cerrar</Button>
                  </div>
                </div>
                {toast && (
                  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded">{toast}</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderModal;
