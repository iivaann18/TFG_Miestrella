import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Star } from 'lucide-react';
import Button from '../Button';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // CAMBIADO: acepta null también
  onSave: (productData: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    handle: '',
    sku: '',
    inventory: '',
    status: 'draft' as 'active' | 'draft' | 'archived',
    featured: false,
    rating: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (product && product !== null) { // VERIFICAR que no sea null
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
        handle: product.handle,
        sku: product.sku || '',
        inventory: product.inventory.toString(),
        status: product.status,
        featured: product.featured,
        rating: product.rating ? product.rating.toString() : '4.8',
        images: product.images?.map(img => img.url) || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        compareAtPrice: '',
        handle: '',
        sku: '',
        inventory: '',
        status: 'draft',
        featured: false,
        rating: '4.8',
        images: [],
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
      inventory: parseInt(formData.inventory),
      rating: parseFloat(formData.rating),
      images: formData.images,
    };

    onSave(processedData);
    onClose();
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageAdd = () => {
    const url = prompt('Ingresa la URL de la imagen o nombre del archivo en /uploads/products/stock/:');
    if (url) {
      // Si solo es un nombre de archivo, añadir la ruta completa
      const fullUrl = url.startsWith('/') || url.startsWith('http') 
        ? url 
        : `/uploads/products/stock/${url}`;
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, fullUrl]
      }));
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar 2MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        
        // Usar el nombre del archivo como URL temporal
        const fileName = file.name;
        const url = `/uploads/products/stock/${fileName}`;
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url]
        }));
        
        // Limpiar preview después de 2 segundos
        setTimeout(() => setImagePreview(null), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateHandle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      handle: prev.handle || generateHandle(title)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-dark">
                {product ? 'Editar Producto' : 'Crear Producto'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Título del Producto *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                {/* Handle */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Handle (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                {/* Precio de comparación */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Precio de Comparación (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                {/* Inventario */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Inventario *
                  </label>
                  <input
                    type="number"
                    value={formData.inventory}
                    onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  >
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Valoración (1-5 estrellas)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(parseFloat(formData.rating) || 0)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown resize-none"
                />
              </div>

              {/* Destacado */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="mr-3 w-4 h-4 text-primary-brown focus:ring-primary-brown border-gray-300 rounded"
                />
                <label htmlFor="featured" className="text-primary-dark font-semibold">
                  Producto destacado
                </label>
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Imágenes
                </label>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleImageAdd}
                      variant="outline"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Añadir por URL
                    </Button>
                    
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="hidden"
                      />
                      <div className="inline-flex items-center px-4 py-2 bg-primary-brown text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Archivo
                      </div>
                    </label>
                  </div>

                  {/* Preview temporal */}
                  {imagePreview && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 mb-2">✅ Imagen añadida (guarda el producto para confirmar)</p>
                      <img src={imagePreview} alt="Preview" className="h-20 object-contain rounded" />
                    </div>
                  )}
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {product ? 'Actualizar' : 'Crear'} Producto
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;