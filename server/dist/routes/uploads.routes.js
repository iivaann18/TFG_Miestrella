import { Router } from 'express';
import uploadsController from '../controllers/uploads.controller';
const router = Router();
// GET /api/uploads/products
router.get('/products', uploadsController.listProductImages);
export default router;
//# sourceMappingURL=uploads.routes.js.map