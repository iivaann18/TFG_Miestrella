import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  handleWebhook,
} from '../controllers/payments.controller';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

// Crear Payment Intent
router.post('/create-payment-intent', optionalAuth, createPaymentIntent);

// Confirmar pago
router.post('/confirm-payment', optionalAuth, confirmPayment);

// Obtener estado del pago
router.get('/status/:paymentIntentId', getPaymentStatus);

// Webhook de Stripe (sin autenticación, raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;