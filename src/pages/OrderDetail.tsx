import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { Order } from '../types';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await ordersAPI.getById(Number(id));
        setOrder(res.data);
      } catch (err) {
        console.error('Error cargando orden:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !order) return <Loader />;

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Pedido {order.orderNumber}</h2>
            <p className="text-sm text-gray-600">Creado: {new Date(order.createdAt).toLocaleString('es-ES')}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">€{parseFloat(order.total.toString()).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Estado: {order.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm text-gray-600">Cliente</h3>
            <p className="font-medium">{order.customerName} — {order.customerEmail}{order.customerPhone ? ` • ${order.customerPhone}` : ''}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Pago</h3>
            <p className="font-medium">{order.paymentMethod || '—'}</p>
            {order.paymentIntentId && <p className="text-sm text-gray-600">ID pago: {order.paymentIntentId}</p>}
            {order.createdAt && (
              <p className="text-sm text-gray-600">Fecha estimada de entrega: {new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-gray-600 mb-2">Dirección de envío</h3>
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

        <div className="mb-6">
          <h3 className="text-sm text-gray-600 mb-2">Items</h3>
          <div className="space-y-2">
            {order.items && order.items.length > 0 ? (
              order.items.map(it => (
                <div key={it.id} className="flex justify-between items-center border rounded p-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Notas</h3>
            <p className="font-medium">{order.notes || '—'}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Resumen</h3>
            <div className="font-medium">
              <div>Subtotal: €{parseFloat(order.subtotal.toString()).toFixed(2)}</div>
              <div>Envío: €{parseFloat(order.shippingCost.toString()).toFixed(2)}</div>
              <div>IVA: €{parseFloat(order.tax.toString()).toFixed(2)}</div>
              {order.discount > 0 && <div>Descuento: -€{parseFloat(order.discount.toString()).toFixed(2)} {order.couponCode ? `(${order.couponCode})` : ''}</div>}
              <hr className="my-2" />
              <div className="text-lg font-bold">Total: €{parseFloat(order.total.toString()).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
          <div className="space-x-2">
            <Button variant="primary" onClick={() => window.print()}>Imprimir</Button>
            <Button variant="outline" onClick={async () => {
              try {
                const res = await fetch(`/api/orders/${order.id}/invoice`, { credentials: 'include' });
                if (!res.ok) throw new Error('Error descargando factura');
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${order.orderNumber}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (e) {
                console.error(e);
                alert('No se pudo descargar la factura');
              }
            }}>Descargar factura</Button>
            <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(String(order.orderNumber)); alert('Número de pedido copiado'); }}>Copiar nº pedido</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
