import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Extender Request para incluir userId y user
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
    }
  }
}

// Verificar token JWT - CORREGIDO
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as any;
    
    // Obtener información completa del usuario
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT id, email, firstName, lastName, phone, gender, role, permissions 
       FROM users WHERE id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.userId = decoded.userId;
    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// Verificar que el usuario es admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }

  next();
};

// Verificar permisos específicos
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Los admins tienen todos los permisos
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar permisos del empleado
    if (!req.user.permissions) {
      return res.status(403).json({ error: 'Sin permisos asignados' });
    }

    let permissions;
    try {
      permissions = typeof req.user.permissions === 'string' 
        ? JSON.parse(req.user.permissions) 
        : req.user.permissions;
    } catch (error) {
      return res.status(500).json({ error: 'Error al leer permisos' });
    }

    if (!permissions[permission]) {
      return res.status(403).json({ 
        error: 'No tienes permiso para realizar esta acción',
        requiredPermission: permission 
      });
    }

    next();
  };
};

// Middleware opcional: autenticación sin requerir token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const secret = process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, secret) as any;
      
      const [users] = await pool.query<RowDataPacket[]>(
        `SELECT id, email, firstName, lastName, phone, gender, role, permissions 
         FROM users WHERE id = ?`,
        [decoded.userId]
      );

      if (users.length > 0) {
        req.userId = decoded.userId;
        req.user = users[0];
      }
    }
  } catch (error) {
    // No hacer nada, continuar sin autenticación
  }
  
  next();
};