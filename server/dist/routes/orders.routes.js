import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, generateInvoice, } from '../controllers/orders.controller';
import { authenticateToken, requirePermission, optionalAuth } from '../middleware/auth';
const router = express.Router();
// Crear pedido (autenticación opcional)
router.post('/', optionalAuth, createOrder);
// Obtener pedidos del usuario autenticado
router.get('/user', authenticateToken, getUserOrders);
// Obtener todos los pedidos (solo admin/empleados con permiso)
router.get('/', authenticateToken, requirePermission('can_view_orders'), getAllOrders);
// Obtener factura PDF
router.get('/:id/invoice', authenticateToken, generateInvoice);
// Obtener pedido por ID
router.get('/:id', authenticateToken, getOrderById);
// Actualizar estado del pedido
router.patch('/:id/status', authenticateToken, requirePermission('can_edit_orders'), updateOrderStatus);
export default router;
//# sourceMappingURL=orders.routes.js.map