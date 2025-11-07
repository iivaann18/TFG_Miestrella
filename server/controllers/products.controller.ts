import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [products] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.id, p.title, p.description, p.price, p.compareAtPrice, 
        p.handle, p.sku, p.inventory, p.status, p.featured,
        p.createdAt, p.updatedAt
       FROM products p
       WHERE p.status != 'archived'
       ORDER BY p.createdAt DESC`
    );

    // Obtener imágenes por separado
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const [images] = await pool.query<RowDataPacket[]>(
          'SELECT id, url, altText, position FROM product_images WHERE productId = ? ORDER BY position',
          [product.id]
        );
        
        return {
          ...product,
          images: images.map(img => ({
            id: img.id.toString(),
            url: img.url,
            altText: img.altText,
            position: img.position
          }))
        };
      })
    );

    res.json(productsWithImages);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [images] = await pool.query<RowDataPacket[]>(
      'SELECT id, url, altText, position FROM product_images WHERE productId = ? ORDER BY position',
      [id]
    );

    const product = {
      ...products[0],
      images: images.map(img => ({
        id: img.id.toString(),
        url: img.url,
        altText: img.altText,
        position: img.position
      }))
    };

    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Obtener producto por handle
export const getProductByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;

    const [products] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE handle = ?',
      [handle]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [images] = await pool.query<RowDataPacket[]>(
      'SELECT id, url, altText, position FROM product_images WHERE productId = ? ORDER BY position',
      [products[0].id]
    );

    const product = {
      ...products[0],
      images: images.map(img => ({
        id: img.id.toString(),
        url: img.url,
        altText: img.altText,
        position: img.position
      }))
    };

    res.json(product);
  } catch (error) {
    console.error('Error getting product by handle:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      compareAtPrice,
      handle,
      sku,
      inventory,
      status,
      featured,
      images = []
    } = req.body;

    // Verificar que el handle no exista
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM products WHERE handle = ?',
      [handle]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'El handle ya existe' });
    }

    // Insertar producto
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products 
       (title, description, price, compareAtPrice, handle, sku, inventory, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, compareAtPrice || null, handle, sku, inventory, status, featured]
    );

    const productId = result.insertId;

    // Insertar imágenes
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (productId, url, altText, position) VALUES (?, ?, ?, ?)',
          [productId, images[i], `${title} - Image ${i + 1}`, i + 1]
        );
      }
    }

    res.status(201).json({
      message: 'Producto creado exitosamente',
      productId
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      compareAtPrice,
      handle,
      sku,
      inventory,
      status,
      featured,
      images = []
    } = req.body;

    // Verificar que el producto existe
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar producto
    await pool.query(
      `UPDATE products 
       SET title = ?, description = ?, price = ?, compareAtPrice = ?,
           handle = ?, sku = ?, inventory = ?, status = ?, featured = ?,
           updatedAt = NOW()
       WHERE id = ?`,
      [title, description, price, compareAtPrice || null, handle, sku, inventory, status, featured, id]
    );

    // Actualizar imágenes
    if (images.length > 0) {
      // Eliminar imágenes anteriores
      await pool.query('DELETE FROM product_images WHERE productId = ?', [id]);

      // Insertar nuevas imágenes
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (productId, url, altText, position) VALUES (?, ?, ?, ?)',
          [id, images[i], `${title} - Image ${i + 1}`, i + 1]
        );
      }
    }

    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar imágenes
    await pool.query('DELETE FROM product_images WHERE productId = ?', [id]);

    // Marcar como archivado
    await pool.query('UPDATE products SET status = ? WHERE id = ?', ['archived', id]);

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};