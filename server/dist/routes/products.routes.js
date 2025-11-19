import express from 'express';
import { getAllProducts, getProductById, getProductByHandle, createProduct, updateProduct, deleteProduct, } from '../controllers/products.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';
const router = express.Router();
// Rutas públicas
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/handle/:handle', getProductByHandle);
// Rutas protegidas
router.post('/', authenticateToken, requirePermission('can_edit_products'), createProduct);
router.put('/:id', authenticateToken, requirePermission('can_edit_products'), updateProduct);
router.delete('/:id', authenticateToken, requirePermission('can_delete_products'), deleteProduct);
export default router;
//# sourceMappingURL=products.routes.js.map