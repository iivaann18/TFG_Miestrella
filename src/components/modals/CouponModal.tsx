import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import Button from '../Button';
import { Coupon } from '../../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: any) => void;
  coupon?: Coupon | null;
}

const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, onSave, coupon }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minPurchaseAmount: '',
    maxUses: '',
    isPermanent: false,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minPurchaseAmount: coupon.minPurchaseAmount.toString(),
        maxUses: coupon.maxUses?.toString() || '',
        isPermanent: coupon.isPermanent,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      });
    } else {
      resetForm();
    }
  }, [coupon, isOpen]);

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchaseAmount: '',
      maxUses: '',
      isPermanent: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-3">
              <Tag className="w-6 h-6 text-primary-brown" />
              <h2 className="text-2xl font-bold text-primary-dark">
                {coupon ? 'Editar Cupón' : 'Crear Cupón'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Código del Cupón */}
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">
                Código del Cupón *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                placeholder="VERANO2024"
                disabled={!!coupon}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown uppercase disabled:bg-gray-100"
              />
              {coupon && (
                <p className="text-xs text-gray-500 mt-1">
                  El código no se puede cambiar una vez creado
                </p>
              )}
            </div>

            {/* Tipo de Descuento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Cantidad Fija (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Valor del Descuento *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {formData.discountType === 'percentage' ? '%' : '€'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compra Mínima y Usos Máximos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Compra Mínima (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minPurchaseAmount}
                  onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Usos Máximos
                </label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Ilimitado"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                />
              </div>
            </div>

            {/* Permanente Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPermanent"
                checked={formData.isPermanent}
                onChange={(e) => setFormData({ ...formData, isPermanent: e.target.checked })}
                className="w-5 h-5 text-primary-brown focus:ring-primary-brown border-gray-300 rounded"
              />
              <label htmlFor="isPermanent" className="ml-3 text-sm font-semibold text-primary-dark">
                Cupón Permanente (sin fecha de expiración)
              </label>
            </div>

            {/* Fechas */}
            {!formData.isPermanent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Fecha de Expiración
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                  />
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-primary-light p-4 rounded-lg">
              <p className="text-sm font-semibold text-primary-dark mb-2">Vista Previa:</p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-primary-brown">
                <p className="text-lg font-bold text-primary-brown">{formData.code || 'CODIGO'}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.discountValue 
                    ? `${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '€'} de descuento`
                    : 'Ingrese el valor del descuento'
                  }
                </p>
                {formData.minPurchaseAmount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Compra mínima: €{formData.minPurchaseAmount}
                  </p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" onClick={onClose} variant="outline">
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {coupon ? 'Actualizar Cupón' : 'Crear Cupón'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CouponModal;