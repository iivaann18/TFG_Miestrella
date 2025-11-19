import express from 'express';
import { subscribe, unsubscribe, getAllSubscribers, } from '../controllers/newsletter.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
const router = express.Router();
// Rutas públicas
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
// Rutas protegidas
router.get('/', authenticateToken, requireAdmin, getAllSubscribers);
export default router;
//# sourceMappingURL=newsletter.routes.js.map