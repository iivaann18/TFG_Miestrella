import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PaymentSuccessModal from '../components/modals/PaymentSuccessModal';
import { ordersAPI } from '../services/api';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentIntent, setPaymentIntent] = useState<any>(location.state?.paymentIntent || null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (id) {
        try {
          const res = await ordersAPI.getById(Number(id));
          setOrder(res.data);
          // if backend returns paymentIntent detail inside order, use it
          if (!paymentIntent && res.data?.paymentIntent) {
            setPaymentIntent(res.data.paymentIntent);
          }
        } catch (err) {
          console.error('Error cargando orden:', err);
        }
      }
    };
    load();
  }, [id]);

  const handleClose = () => {
    // redirect to store
    navigate('/store');
  };

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center">
      <PaymentSuccessModal orderId={id || ''} paymentIntent={paymentIntent} onClose={handleClose} order={order} />
    </div>
  );
};

export default OrderConfirmation;
