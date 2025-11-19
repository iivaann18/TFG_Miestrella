import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

export const listProductImages = async (_req: Request, res: Response) => {
  try {
    const productsDir = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'products');
    if (!fs.existsSync(productsDir)) {
      return res.json({ images: [] });
    }

    const files = await fs.promises.readdir(productsDir);
    const images = files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).map((f) => `/uploads/products/${f}`);

    res.json({ images });
  } catch (err) {
    console.error('listProductImages error', err);
    res.status(500).json({ error: 'Failed to list product images' });
  }
};

export default {
  listProductImages,
};
