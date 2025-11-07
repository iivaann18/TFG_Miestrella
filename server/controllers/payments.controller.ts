import { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { sendOrderConfirmation } from '../config/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Crear Payment Intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      currency = 'eur',
      customerInfo,
      billingAddress,
      shippingAddress,
      items,
      couponCode,
      subtotal,
      discount,
      shipping,
      tax,
      total,
    } = req.body;

    const userId = req.userId || null;

    // Generar número de pedido
    const orderNumber = `ORD-${Date.now()}`;

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount ya viene en centavos
      currency,
      metadata: {
        orderNumber,
        userId: userId?.toString() || 'guest',
        customerEmail: customerInfo.email,
      },
    });

    // Crear pedido en la base de datos con estado pendiente
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO orders 
       (orderNumber, userId, customerEmail, customerName, customerPhone, 
        subtotal, shippingCost, tax, discount, couponCode, total, 
        shippingAddress, billingAddress, notes, status, paymentStatus, paymentIntentId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)`,
      [
        orderNumber,
        userId,
        customerInfo.email,
        `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerInfo.phone || null,
        subtotal,
        shipping,
        tax,
        discount,
        couponCode || null,
        total,
        JSON.stringify(shippingAddress),
        JSON.stringify(billingAddress),
        null,
        paymentIntent.id,
      ]
    );

    const orderId = result.insertId;

    // Insertar items del pedido
    if (items && items.length > 0) {
      const itemValues = items.map((item: any) => [
        orderId,
        item.productId,
        item.title,
        '', // image placeholder
        item.quantity,
        item.price,
        parseFloat(item.price) * item.quantity,
      ]);

      await pool.query(
        `INSERT INTO order_items 
         (orderId, productId, productTitle, productImage, quantity, price, subtotal)
         VALUES ?`,
        [itemValues]
      );
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      orderNumber,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Error al crear el intento de pago' });
  }
};

// Confirmar pago
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    // Obtener el Payment Intent de Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Actualizar el pedido como pagado
      await pool.query(
        'UPDATE orders SET paymentStatus = ?, status = ? WHERE paymentIntentId = ?',
        ['paid', 'processing', paymentIntentId]
      );

      // Obtener detalles del pedido para enviar confirmación
      const [orders] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM orders WHERE paymentIntentId = ?',
        [paymentIntentId]
      );

      if (orders.length > 0) {
        const order = orders[0];
        
        // Enviar email de confirmación
        try {
          await sendOrderConfirmation(
            order.customerEmail,
            order.orderNumber,
            order.total
          );
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      }

      res.json({ success: true, status: 'paid' });
    } else {
      res.json({ success: false, status: paymentIntent.status });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Error al confirmar el pago' });
  }
};

// Obtener estado del pago
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;

    const [orders] = await pool.query<RowDataPacket[]>(
      'SELECT status, paymentStatus, orderNumber FROM orders WHERE paymentIntentId = ?',
      [paymentIntentId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(orders[0]);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ error: 'Error al obtener estado del pago' });
  }
};

// Webhook de Stripe
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Actualizar el pedido
      await pool.query(
        'UPDATE orders SET paymentStatus = ?, status = ? WHERE paymentIntentId = ?',
        ['paid', 'processing', paymentIntent.id]
      );
      
      console.log('Payment succeeded:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      
      await pool.query(
        'UPDATE orders SET paymentStatus = ? WHERE paymentIntentId = ?',
        ['failed', failedPayment.id]
      );
      
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};