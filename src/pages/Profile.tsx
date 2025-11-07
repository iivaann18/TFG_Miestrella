import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Package, Edit2, Save, X } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { authAPI, ordersAPI } from '../services/api';
import { Order } from '../types';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'security'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states - CORREGIDO EL TIPO
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';
  }>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      // Preparar data sin el campo vacío
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };
      
      // Solo incluir gender si no está vacío
      if (formData.gender) {
        updateData.gender = formData.gender;
      }
      
      await authAPI.updateProfile(updateData);
      updateUser(updateData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error al actualizar' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      setLoading(true);
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: any = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-primary-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-primary-dark mb-8"
        >
          Mi Cuenta
        </motion.h1>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-custom mb-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === 'info'
                    ? 'border-primary-brown text-primary-brown'
                    : 'border-transparent text-gray-500 hover:text-primary-brown'
                }`}
              >
                <User className="w-5 h-5 inline-block mr-2" />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary-brown text-primary-brown'
                    : 'border-transparent text-gray-500 hover:text-primary-brown'
                }`}
              >
                <Package className="w-5 h-5 inline-block mr-2" />
                Mis Pedidos
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === 'security'
                    ? 'border-primary-brown text-primary-brown'
                    : 'border-transparent text-gray-500 hover:text-primary-brown'
                }`}
              >
                <Lock className="w-5 h-5 inline-block mr-2" />
                Seguridad
              </button>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mx-6 mt-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {/* Información Personal */}
            {activeTab === 'info' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-primary-dark">
                    Información Personal
                  </h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleUpdateProfile} disabled={loading} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            firstName: user?.firstName || '',
                            lastName: user?.lastName || '',
                            phone: user?.phone || '',
                            gender: user?.gender || '',
                          });
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Género
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                      <option value="prefer_not_to_say">Prefiero no decir</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Mis Pedidos */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark mb-6">
                  Historial de Pedidos
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="loader mx-auto"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-primary-dark">
                              Pedido {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              {order.itemsCount || 0} {order.itemsCount === 1 ? 'producto' : 'productos'}
                            </p>
                            <p className="text-xl font-bold text-primary-brown">
                              €{parseFloat(order.total.toString()).toFixed(2)}
                            </p>
                          </div>
                          <Link to={`/order/${order.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aún no has realizado ningún pedido</p>
                    <Link to="/store">
                      <Button variant="primary">Ir a la Tienda</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Seguridad */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark mb-6">
                  Cambiar Contraseña
                </h2>

                <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-brown"
                    />
                  </div>

                  <Button type="submit" disabled={loading} variant="primary" fullWidth>
                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;