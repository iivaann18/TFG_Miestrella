import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const listProductImages = async (_req: Request, res: Response) => {
  try {
    const productsDir = path.resolve(__dirname, '..', '..', 'public', 'uploads', 'products');
    console.log('📂 Reading directory:', productsDir);
    console.log('📂 Directory exists:', fs.existsSync(productsDir));
    
    if (!fs.existsSync(productsDir)) {
      console.log('⚠️  Directory does not exist, returning empty array');
      return res.json({ images: [] });
    }

    const files = await fs.promises.readdir(productsDir);
    console.log('📁 Files found:', files.length);
    
    const images = files
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .map((f) => `/uploads/products/${f}`);
    
    console.log('🖼️  Image files:', images.length);
    res.json({ images });
  } catch (err) {
    console.error('❌ listProductImages error', err);
    res.status(500).json({ error: 'Failed to list product images' });
  }
};

export default {
  listProductImages,
};
