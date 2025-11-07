import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserPermissions,
  toggleUserStatus,
  deleteUser,
} from '../controllers/users.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios (solo admin o con permiso)
router.get('/', requirePermission('can_manage_users'), getAllUsers);

// Obtener usuario por ID
router.get('/:id', requirePermission('can_manage_users'), getUserById);

// Actualizar permisos de usuario
router.put('/:id/permissions', requirePermission('can_manage_users'), updateUserPermissions);

// Activar/Desactivar usuario
router.patch('/:id/toggle', requirePermission('can_manage_users'), toggleUserStatus);

// Eliminar usuario
router.delete('/:id', requirePermission('can_manage_users'), deleteUser);

export default router;