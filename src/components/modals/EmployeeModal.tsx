import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield } from 'lucide-react';
import Button from '../Button';
import { User, EmployeePermissions } from '../../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: any) => void;
  employee?: User | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });

  const [permissions, setPermissions] = useState<Partial<EmployeePermissions>>({
    can_edit_products: false,
    can_delete_products: false,
    can_view_orders: true,
    can_edit_orders: false,
    can_manage_users: false,
    can_create_coupons: false,
    can_edit_coupons: false,
    can_delete_coupons: false,
    can_view_analytics: true,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
      });
      if (employee.permissions) {
        setPermissions(employee.permissions);
      }
    } else {
      resetForm();
    }
  }, [employee, isOpen]);

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
    });
    setPermissions({
      can_edit_products: false,
      can_delete_products: false,
      can_view_orders: true,
      can_edit_orders: false,
      can_manage_users: false,
      can_create_coupons: false,
      can_edit_coupons: false,
      can_delete_coupons: false,
      can_view_analytics: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      permissions,
    });
    onClose();
  };

  const permissionGroups = [
    {
      title: 'Productos',
      permissions: [
        { key: 'can_edit_products', label: 'Editar Productos' },
        { key: 'can_delete_products', label: 'Eliminar Productos' },
      ],
    },
    {
      title: 'Pedidos',
      permissions: [
        { key: 'can_view_orders', label: 'Ver Pedidos' },
        { key: 'can_edit_orders', label: 'Editar Pedidos' },
      ],
    },
    {
      title: 'Cupones',
      permissions: [
        { key: 'can_create_coupons', label: 'Crear Cupones' },
        { key: 'can_edit_coupons', label: 'Editar Cupones' },
        { key: 'can_delete_coupons', label: 'Eliminar Cupones' },
      ],
    },
    {
      title: 'Administración',
      permissions: [
        { key: 'can_manage_users', label: 'Gestionar Usuarios' },
        { key: 'can_view_analytics', label: 'Ver Analíticas' },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 text-primary-brown" />
              <h2 className="text-2xl font-bold text-primary-dark">
                {employee ? 'Editar Empleado' : 'Crear Empleado'}
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
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold text-primary-dark mb-4">
                Información del Empleado
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={!!employee}
                    placeholder="empleado@miestrella.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown disabled:bg-gray-100"
                  />
                  {!employee && (
                    <p className="text-xs text-gray-500 mt-1">
                      Se generará una contraseña segura y se enviará por email
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-primary-brown" />
                <h3 className="text-lg font-semibold text-primary-dark">
                  Permisos de Acceso
                </h3>
              </div>

              <div className="space-y-6">
                {permissionGroups.map((group, index) => (
                  <div key={index} className="bg-primary-light p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-dark mb-3">{group.title}</h4>
                    <div className="space-y-2">
                      {group.permissions.map((perm) => (
                        <label key={perm.key} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[perm.key as keyof EmployeePermissions] || false}
                            onChange={(e) =>
                              setPermissions({
                                ...permissions,
                                [perm.key]: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-primary-brown focus:ring-primary-brown border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" onClick={onClose} variant="outline">
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {employee ? 'Actualizar Empleado' : 'Crear Empleado'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmployeeModal;