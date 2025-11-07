import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Obtener todos los cupones
export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const [coupons] = await pool.query<RowDataPacket[]>(
      `SELECT 
        c.*, u.email as createdByEmail
       FROM coupons c
       LEFT JOIN users u ON c.createdBy = u.id
       ORDER BY c.createdAt DESC`
    );

    res.json(coupons);
  } catch (error) {
    console.error('Error getting coupons:', error);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
};

// Obtener cupón por código
export const getCouponByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const [coupons] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM coupons WHERE code = ? AND isActive = true',
      [code.toUpperCase()]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    res.json(coupons[0]);
  } catch (error) {
    console.error('Error getting coupon:', error);
    res.status(500).json({ error: 'Error al obtener cupón' });
  }
};

// Validar cupón
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, total } = req.body;

    const [coupons] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM coupons WHERE code = ? AND isActive = true',
      [code.toUpperCase()]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ error: 'Cupón no válido' });
    }

    const coupon = coupons[0];

    // Validar fecha
    if (!coupon.isPermanent) {
      const now = new Date();
      const startDate = new Date(coupon.startDate);
      const endDate = coupon.endDate ? new Date(coupon.endDate) : null;

      if (now < startDate) {
        return res.status(400).json({ error: 'El cupón aún no está activo' });
      }

      if (endDate && now > endDate) {
        return res.status(400).json({ error: 'El cupón ha expirado' });
      }
    }

    // Validar compra mínima
    if (total < coupon.minPurchaseAmount) {
      return res.status(400).json({
        error: `Compra mínima requerida: €${coupon.minPurchaseAmount}`
      });
    }

    // Validar usos máximos
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({ error: 'El cupón ha alcanzado su límite de usos' });
    }

    // Calcular descuento
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (total * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      discount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Error al validar cupón' });
  }
};

// Crear cupón
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxUses,
      isPermanent,
      startDate,
      endDate
    } = req.body;

    const createdBy = req.userId;

    // Verificar que el código no exista
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM coupons WHERE code = ?',
      [code.toUpperCase()]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'El código de cupón ya existe' });
    }

    await pool.query(
      `INSERT INTO coupons 
       (code, discountType, discountValue, minPurchaseAmount, maxUses,
        isPermanent, startDate, endDate, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code.toUpperCase(), discountType, discountValue, minPurchaseAmount || 0,
        maxUses || null, isPermanent, startDate || null, endDate || null, createdBy
      ]
    );

    res.status(201).json({ message: 'Cupón creado exitosamente' });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Error al crear cupón' });
  }
};

// Actualizar cupón
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      discountType,
      discountValue,
      minPurchaseAmount,
      maxUses,
      isPermanent,
      startDate,
      endDate
    } = req.body;

    await pool.query(
      `UPDATE coupons 
       SET discountType = ?, discountValue = ?, minPurchaseAmount = ?,
           maxUses = ?, isPermanent = ?, startDate = ?, endDate = ?,
           updatedAt = NOW()
       WHERE id = ?`,
      [
        discountType, discountValue, minPurchaseAmount,
        maxUses || null, isPermanent, startDate || null, endDate || null, id
      ]
    );

    res.json({ message: 'Cupón actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Error al actualizar cupón' });
  }
};

// Eliminar cupón
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM coupons WHERE id = ?', [id]);

    res.json({ message: 'Cupón eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Error al eliminar cupón' });
  }
};

// Activar/Desactivar cupón
export const toggleCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    await pool.query(
      'UPDATE coupons SET isActive = ?, updatedAt = NOW() WHERE id = ?',
      [isActive, id]
    );

    res.json({
      message: `Cupón ${isActive ? 'activado' : 'desactivado'} exitosamente`
    });
  } catch (error) {
    console.error('Error toggling coupon:', error);
    res.status(500).json({ error: 'Error al cambiar estado del cupón' });
  }
};