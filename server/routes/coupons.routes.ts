import express from 'express';
import {
  getAllCoupons,
  getCouponByCode,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from '../controllers/coupons.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = express.Router();

// Validar cupón (público o autenticado)
router.post('/validate', validateCoupon);

// Obtener cupón por código (público para verificación)
router.get('/:code', getCouponByCode);

// Rutas protegidas
router.get('/', authenticateToken, requirePermission('can_view_analytics'), getAllCoupons);
router.post('/', authenticateToken, requirePermission('can_create_coupons'), createCoupon);
router.put('/:id', authenticateToken, requirePermission('can_edit_coupons'), updateCoupon);
router.patch('/:id/toggle', authenticateToken, requirePermission('can_edit_coupons'), toggleCoupon);
router.delete('/:id', authenticateToken, requirePermission('can_delete_coupons'), deleteCoupon);

export default router;