import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Crear pedido
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      items,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      couponCode,
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      notes
    } = req.body;

    const userId = req.userId || null;

    // Generar número de pedido
    const orderNumber = `ORD-${Date.now()}`;

    // Insertar pedido
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO orders 
       (orderNumber, userId, customerEmail, customerName, customerPhone, 
        subtotal, shippingCost, tax, discount, couponCode, total, 
        shippingAddress, notes, status, paymentStatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [
        orderNumber, userId, customerEmail, customerName, customerPhone,
        subtotal, shippingCost, tax, discount, couponCode || null, total,
        JSON.stringify(shippingAddress), notes || null
      ]
    );

    const orderId = result.insertId;

    // Insertar items del pedido
    if (items && items.length > 0) {
      const itemValues = items.map((item: any) => [
        orderId,
        item.productId,
        item.title,
        item.image,
        item.quantity,
        item.price,
        parseFloat(item.price) * item.quantity
      ]);

      await pool.query(
        `INSERT INTO order_items 
         (orderId, productId, productTitle, productImage, quantity, price, subtotal)
         VALUES ?`,
        [itemValues]
      );
    }

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      orderId,
      orderNumber
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

// Obtener pedidos del usuario
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id, o.orderNumber, o.customerEmail, o.customerName,
        o.subtotal, o.shippingCost, o.tax, o.discount, o.total,
        o.status, o.paymentStatus, o.trackingNumber,
        o.createdAt, o.updatedAt,
        COUNT(oi.id) as itemsCount
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       WHERE o.userId = ?
       GROUP BY o.id
       ORDER BY o.createdAt DESC`,
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener pedido por ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM orders WHERE id = ? AND (userId = ? OR ? IS NULL)`,
      [id, userId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener items del pedido
    const [items] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM order_items WHERE orderId = ?',
      [id]
    );

    const order = {
      ...orders[0],
      items
    };

    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// Obtener todos los pedidos (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id, o.orderNumber, o.customerEmail, o.customerName,
        o.subtotal, o.shippingCost, o.tax, o.discount, o.total,
        o.status, o.paymentStatus, o.trackingNumber,
        o.createdAt, o.updatedAt,
        COUNT(oi.id) as itemsCount
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       GROUP BY o.id
       ORDER BY o.createdAt DESC`
    );

    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Actualizar estado del pedido
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    await pool.query(
      `UPDATE orders 
       SET status = ?, trackingNumber = ?, updatedAt = NOW()
       WHERE id = ?`,
      [status, trackingNumber || null, id]
    );

    res.json({ message: 'Estado del pedido actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};