import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Tag,
  UserPlus,
  Power,
  PowerOff,
} from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ProductModal from '../components/modals/ProductModal';
import CouponModal from '../components/modals/CouponModal';
import EmployeeModal from '../components/modals/EmployeeModal';
import OrderModal from '../components/modals/OrderModal';
import { productsAPI, ordersAPI, couponsAPI, usersAPI, authAPI } from '../services/api';
import { Product, Order, Coupon, User } from '../types';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'employees'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview' || activeTab === 'products') {
        const productsResponse = await productsAPI.getAll();
        setProducts(productsResponse.data);
      }
      
      if (activeTab === 'overview' || activeTab === 'orders') {
        if (canViewOrders()) {
          const ordersResponse = await ordersAPI.getAllOrders();
          setOrders(ordersResponse.data);
        }
      }
      
      if (activeTab === 'coupons') {
        const couponsResponse = await couponsAPI.getAll();
        setCoupons(couponsResponse.data);
      }
      
      if (activeTab === 'employees') {
        if (canManageUsers()) {
          const usersResponse = await usersAPI.getAll();
          setEmployees(usersResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showMessage('error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Permisos
  const canEditProducts = () => user?.role === 'admin' || user?.permissions?.can_edit_products;
  const canDeleteProducts = () => user?.role === 'admin' || user?.permissions?.can_delete_products;
  const canViewOrders = () => user?.role === 'admin' || user?.permissions?.can_view_orders;
  const canEditOrders = () => user?.role === 'admin' || user?.permissions?.can_edit_orders;
  const canManageUsers = () => user?.role === 'admin' || user?.permissions?.can_manage_users;
  const canCreateCoupons = () => user?.role === 'admin' || user?.permissions?.can_create_coupons;
  const canEditCoupons = () => user?.role === 'admin' || user?.permissions?.can_edit_coupons;
  const canDeleteCoupons = () => user?.role === 'admin' || user?.permissions?.can_delete_coupons;

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Productos
  const handleSaveProduct = async (productData: any) => {
    try {
      if (selectedProduct) {
        await productsAPI.update(selectedProduct.id, productData);
        showMessage('success', 'Producto actualizado exitosamente');
      } else {
        await productsAPI.create(productData);
        showMessage('success', 'Producto creado exitosamente');
      }
      loadDashboardData();
      setSelectedProduct(null);
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al guardar producto');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await productsAPI.delete(id);
      showMessage('success', 'Producto eliminado exitosamente');
      loadDashboardData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al eliminar producto');
    }
  };

  // Cupones
  const handleSaveCoupon = async (couponData: any) => {
    try {
      if (selectedCoupon) {
        await couponsAPI.update(selectedCoupon.id, couponData);
        showMessage('success', 'Cupón actualizado exitosamente');
      } else {
        await couponsAPI.create(couponData);
        showMessage('success', 'Cupón creado exitosamente');
      }
      loadDashboardData();
      setSelectedCoupon(null);
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al guardar cupón');
    }
  };

  const handleToggleCoupon = async (id: number, isActive: boolean) => {
    try {
      await couponsAPI.toggle(id, !isActive);
      showMessage('success', `Cupón ${!isActive ? 'activado' : 'desactivado'} exitosamente`);
      loadDashboardData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al cambiar estado del cupón');
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return;
    
    try {
      await couponsAPI.delete(id);
      showMessage('success', 'Cupón eliminado exitosamente');
      loadDashboardData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al eliminar cupón');
    }
  };

  // Empleados
  const handleSaveEmployee = async (employeeData: any) => {
    try {
      if (selectedEmployee) {
        await usersAPI.updatePermissions(selectedEmployee.id, employeeData.permissions);
        showMessage('success', 'Permisos actualizados exitosamente');
      } else {
        await authAPI.createEmployee(employeeData);
        showMessage('success', 'Empleado creado y email enviado exitosamente');
      }
      loadDashboardData();
      setSelectedEmployee(null);
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al guardar empleado');
    }
  };

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      await usersAPI.toggleStatus(userId, !isActive);
      showMessage('success', `Usuario ${!isActive ? 'activado' : 'desactivado'} exitosamente`);
      loadDashboardData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al cambiar estado del usuario');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await usersAPI.delete(userId);
      showMessage('success', 'Usuario eliminado exitosamente');
      loadDashboardData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  // Pedidos
  const handleUpdateOrderStatus = async (orderId: number, status: string, trackingNumber?: string) => {
    try {
      await ordersAPI.updateStatus(orderId, { status, trackingNumber });
      showMessage('success', 'Estado del pedido actualizado');
      loadDashboardData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Error al actualizar pedido');
    }
  };

  const openOrderDetails = async (orderId: number) => {
    try {
      setLoading(true);
      const res = await ordersAPI.getById(orderId);
      setSelectedOrder(res.data);
      setOrderModalOpen(true);
    } catch (err) {
      console.error('Error cargando orden:', err);
      showMessage('error', 'No se pudieron cargar los detalles del pedido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
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
      active: 'Activo',
      draft: 'Borrador',
      archived: 'Archivado',
    };
    return statusMap[status] || status;
  };

  const stats = [
    {
      icon: <Package className="w-8 h-8" />,
      label: 'Total Productos',
      value: products.length,
      color: 'bg-primary-brown',
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      label: 'Pedidos Totales',
      value: orders.length,
      color: 'bg-primary-rose',
    },
    {
      icon: <Tag className="w-8 h-8" />,
      label: 'Cupones Activos',
      value: coupons.filter(c => c.isActive).length,
      color: 'bg-primary-gold',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: 'Ingresos',
      value: `€${orders.reduce((sum, o) => sum + parseFloat(o.total.toString()), 0).toFixed(2)}`,
      color: 'bg-primary-teal',
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-primary-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary-dark mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Bienvenido, {user?.firstName}</p>
        </motion.div>

        {/* Messages */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Stats Grid */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white rounded-xl shadow-custom p-6"
              >
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-primary-dark">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-custom mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-primary-brown text-primary-brown'
                    : 'border-transparent text-gray-500 hover:text-primary-brown'
                }`}
              >
                Vista General
              </button>
              {canEditProducts() && (
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'border-primary-brown text-primary-brown'
                      : 'border-transparent text-gray-500 hover:text-primary-brown'
                  }`}
                >
                  Productos
                </button>
              )}
              {canViewOrders() && (
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'border-primary-brown text-primary-brown'
                      : 'border-transparent text-gray-500 hover:text-primary-brown'
                  }`}
                >
                  Pedidos
                </button>
              )}
              {canCreateCoupons() && (
                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'coupons'
                      ? 'border-primary-brown text-primary-brown'
                      : 'border-transparent text-gray-500 hover:text-primary-brown'
                  }`}
                >
                  Cupones
                </button>
              )}
              {canManageUsers() && (
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'employees'
                      ? 'border-primary-brown text-primary-brown'
                      : 'border-transparent text-gray-500 hover:text-primary-brown'
                  }`}
                >
                  Empleados
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary-dark mb-4">
                    Resumen de Actividad
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
                      <div>
                        <p className="font-semibold text-primary-dark">Productos Activos</p>
                        <p className="text-sm text-gray-600">
                          {products.filter(p => p.status === 'active').length} de {products.length} productos
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-primary-brown">
                        {products.filter(p => p.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
                      <div>
                        <p className="font-semibold text-primary-dark">Pedidos Pendientes</p>
                        <p className="text-sm text-gray-600">Requieren atención</p>
                      </div>
                      <span className="text-2xl font-bold text-primary-rose">
                        {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-primary-dark">
                    Gestión de Productos
                  </h3>
                  {canEditProducts() && (
                    <Button
                      onClick={() => {
                        setSelectedProduct(null);
                        setProductModalOpen(true);
                      }}
                      variant="primary"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Producto
                    </Button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.images[0]?.url || 'https://via.placeholder.com/100'}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover mr-4"
                              />
                              <div>
                                <p className="font-semibold text-primary-dark">
                                  {product.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  SKU: {product.sku}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-primary-brown font-semibold">
                              €{parseFloat(product.price.toString()).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`${
                                product.inventory === 0
                                  ? 'text-red-600'
                                  : product.inventory < 10
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                              } font-semibold`}
                            >
                              {product.inventory}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                product.status
                              )}`}
                            >
                              {getStatusText(product.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {canEditProducts() && (
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setProductModalOpen(true);
                                  }}
                                  className="text-primary-brown hover:text-primary-gold transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                              )}
                              {canDeleteProducts() && (
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-xl font-semibold text-primary-dark mb-6">
                  Gestión de Pedidos
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                          Estado
                        </th>
                        {canEditOrders() && (
                          <th className="px-6 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                            Acciones
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-primary-dark">
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-700">{order.customerName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-primary-brown font-semibold">
                              €{parseFloat(order.total.toString()).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {canEditOrders() ? (
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="processing">Procesando</option>
                                <option value="shipped">Enviado</option>
                                <option value="delivered">Entregado</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            )}
                          </td>
                          {canEditOrders() && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                  onClick={() => openOrderDetails(order.id)}
                                className="text-primary-brown hover:text-primary-gold transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-primary-dark">
                    Gestión de Cupones
                  </h3>
                  {canCreateCoupons() && (
                    <Button
                      onClick={() => {
                        setSelectedCoupon(null);
                        setCouponModalOpen(true);
                      }}
                      variant="primary"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Cupón
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coupons.map((coupon) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`bg-white border-2 rounded-lg p-6 ${
                        coupon.isActive ? 'border-primary-brown' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-5 h-5 text-primary-brown" />
                          <h4 className="text-lg font-bold text-primary-dark">{coupon.code}</h4>
                        </div>
                        {canEditCoupons() && (
                          <button
                            onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                            className={`p-2 rounded-full transition-colors ${
                              coupon.isActive
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={coupon.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {coupon.isActive ? (
                              <Power className="w-4 h-4" />
                            ) : (
                              <PowerOff className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-2xl font-bold text-primary-brown">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `€${coupon.discountValue}`}
                        </p>
                        {coupon.minPurchaseAmount > 0 && (
                          <p className="text-sm text-gray-600">
                            Compra mínima: €{coupon.minPurchaseAmount}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Usos: {coupon.currentUses}
                          {coupon.maxUses ? ` / ${coupon.maxUses}` : ' (ilimitado)'}
                        </p>
                        {!coupon.isPermanent && coupon.endDate && (
                          <p className="text-sm text-gray-600">
                            Expira: {new Date(coupon.endDate).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {canEditCoupons() && (
                          <Button
                            onClick={() => {
                              setSelectedCoupon(coupon);
                              setCouponModalOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        )}
                        {canDeleteCoupons() && (
                          <Button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            variant="danger"
                            size="sm"
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-primary-dark">
                    Gestión de Empleados
                  </h3>
                  <Button
                    onClick={() => {
                      setSelectedEmployee(null);
                      setEmployeeModalOpen(true);
                    }}
                    variant="primary"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Empleado
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {employees.filter(e => e.role !== 'customer').map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-primary-dark">
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              employee.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {employee.role === 'admin' ? 'Administrador' : 'Empleado'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleUserStatus(employee.id, true)}
                          className={`p-2 rounded-full transition-colors ${
                            employee.role === 'admin'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={employee.role === 'admin' ? 'Admin activo' : 'Toggle status'}
                          disabled={employee.role === 'admin'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>

                      {employee.role === 'employee' && (
                        <div className="flex space-x-2 mt-4">
                          <Button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEmployeeModalOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Permisos
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(employee.id)}
                            variant="danger"
                            size="sm"
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modales */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      <CouponModal
        isOpen={couponModalOpen}
        onClose={() => {
          setCouponModalOpen(false);
          setSelectedCoupon(null);
        }}
        onSave={handleSaveCoupon}
        coupon={selectedCoupon}
      />

      <EmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => {
          setEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
      />
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminDashboard;