import Stripe from 'stripe';
import pool from '../config/database';
import { sendOrderConfirmation } from '../config/email';
import { generateInvoiceBuffer } from '../utils/invoice';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});
// Crear Payment Intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'eur', customerInfo, billingAddress, shippingAddress, items, couponCode, subtotal, discount, shipping, tax, total, } = req.body;
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
        const [result] = await pool.query(`INSERT INTO orders 
       (orderNumber, userId, customerEmail, customerName, customerPhone, 
        subtotal, shippingCost, tax, discount, couponCode, total, 
        shippingAddress, billingAddress, notes, status, paymentStatus, paymentIntentId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)`, [
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
        ]);
        const orderId = result.insertId;
        // Insertar items del pedido
        if (items && items.length > 0) {
            const itemValues = items.map((item) => [
                orderId,
                item.productId,
                item.title,
                '', // image placeholder
                item.quantity,
                item.price,
                parseFloat(item.price) * item.quantity,
            ]);
            await pool.query(`INSERT INTO order_items 
         (orderId, productId, productTitle, productImage, quantity, price, subtotal)
         VALUES ?`, [itemValues]);
        }
        res.json({
            clientSecret: paymentIntent.client_secret,
            orderId,
            orderNumber,
        });
    }
    catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Error al crear el intento de pago' });
    }
};
// Confirmar pago
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        // Obtener el Payment Intent de Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            // Actualizar el pedido como pagado
            await pool.query('UPDATE orders SET paymentStatus = ?, status = ? WHERE paymentIntentId = ?', ['paid', 'processing', paymentIntentId]);
            // Obtener detalles del pedido para enviar confirmación
            const [orders] = await pool.query('SELECT * FROM orders WHERE paymentIntentId = ?', [paymentIntentId]);
            if (orders.length > 0) {
                const order = orders[0];
                // Obtener items para adjuntar factura
                try {
                    const [items] = await pool.query('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
                    // Generate invoice locally and attach to confirmation email
                    try {
                        const buffer = await generateInvoiceBuffer(order, items);
                        try {
                            await sendOrderConfirmation(order.customerEmail, order.orderNumber, order.total, [
                                { filename: `invoice-${order.orderNumber}.pdf`, content: buffer },
                            ]);
                        }
                        catch (emailError) {
                            console.error('Error sending confirmation email with attachment:', emailError);
                            // fallback: send without attachment
                            try {
                                await sendOrderConfirmation(order.customerEmail, order.orderNumber, order.total);
                            }
                            catch (fallbackEmailErr) {
                                console.error('Error sending confirmation email (fallback):', fallbackEmailErr);
                            }
                        }
                    }
                    catch (genErr) {
                        console.error('Local invoice generation failed:', genErr);
                        // send without attachment
                        try {
                            await sendOrderConfirmation(order.customerEmail, order.orderNumber, order.total);
                        }
                        catch (emailError) {
                            console.error('Error sending confirmation email (fallback):', emailError);
                        }
                    }
                }
                catch (invErr) {
                    console.error('Error generating/attaching invoice:', invErr);
                    // Fallback: send without attachment
                    try {
                        await sendOrderConfirmation(order.customerEmail, order.orderNumber, order.total);
                    }
                    catch (emailError) {
                        console.error('Error sending confirmation email (fallback):', emailError);
                    }
                }
            }
            res.json({ success: true, status: 'paid' });
        }
        else {
            res.json({ success: false, status: paymentIntent.status });
        }
    }
    catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: 'Error al confirmar el pago' });
    }
};
// Obtener estado del pago
export const getPaymentStatus = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;
        const [orders] = await pool.query('SELECT status, paymentStatus, orderNumber FROM orders WHERE paymentIntentId = ?', [paymentIntentId]);
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(orders[0]);
    }
    catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({ error: 'Error al obtener estado del pago' });
    }
};
// Webhook de Stripe
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Manejar el evento
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Actualizar el pedido
            await pool.query('UPDATE orders SET paymentStatus = ?, status = ? WHERE paymentIntentId = ?', ['paid', 'processing', paymentIntent.id]);
            console.log('Payment succeeded:', paymentIntent.id);
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            await pool.query('UPDATE orders SET paymentStatus = ? WHERE paymentIntentId = ?', ['failed', failedPayment.id]);
            console.log('Payment failed:', failedPayment.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
};
//# sourceMappingURL=payments.controller.js.map