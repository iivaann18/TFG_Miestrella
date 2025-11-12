import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🔗 API URL:', API_URL);

// Crear instancia de axios con configuración por defecto
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // necesario para cookies
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout');
    }
    
    if (error.response) {
      console.error(`❌ ${error.response.status} - ${error.response.data?.error || error.message}`);
      
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('❌ No response from server:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    console.log('🔑 Enviando login request:', { email, password: '***' });
    return apiClient.post('/auth/login', { email, password });
  },
  
  register: (data: any) =>
    apiClient.post('/auth/register', data),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  getProfile: () =>
    apiClient.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),
  
  changePassword: (data: any) =>
    apiClient.put('/auth/change-password', data),
  
  createEmployee: (data: any) =>
    apiClient.post('/auth/create-employee', data),
};

// Products API
export const productsAPI = {
  getAll: () =>
    apiClient.get('/products'),
  
  getById: (id: number) =>
    apiClient.get(`/products/${id}`),
  
  getByHandle: (handle: string) =>
    apiClient.get(`/products/handle/${handle}`),
  
  create: (data: any) =>
    apiClient.post('/products', data),
  
  update: (id: number, data: any) =>
    apiClient.put(`/products/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/products/${id}`),
};

// Orders API - CORREGIDO con createPaymentIntent
export const ordersAPI = {
  create: (data: any) =>
    apiClient.post('/orders', data),
  
  createPaymentIntent: (data: any) =>
    apiClient.post('/payments/create-payment-intent', data),
  
  getUserOrders: () =>
    apiClient.get('/orders/user'),
  
  getById: (id: number) =>
    apiClient.get(`/orders/${id}`),
  
  getAllOrders: () =>
    apiClient.get('/orders'),
  
  updateStatus: (id: number, data: any) =>
    apiClient.patch(`/orders/${id}/status`, data),
  getInvoice: (id: number) =>
    apiClient.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
};

// Payments API - AÑADIDO
export const paymentsAPI = {
  createPaymentIntent: (data: any) =>
    apiClient.post('/payments/create-payment-intent', data),
  
  confirmPayment: (paymentIntentId: string) =>
    apiClient.post('/payments/confirm-payment', { paymentIntentId }),
  
  getPaymentStatus: (paymentIntentId: string) =>
    apiClient.get(`/payments/status/${paymentIntentId}`),
};

// Coupons API
export const couponsAPI = {
  getAll: () =>
    apiClient.get('/coupons'),
  
  getByCode: (code: string) =>
    apiClient.get(`/coupons/${code}`),
  
  validate: (code: string, total: number) =>
    apiClient.post('/coupons/validate', { code, total }),
  
  create: (data: any) =>
    apiClient.post('/coupons', data),
  
  update: (id: number, data: any) =>
    apiClient.put(`/coupons/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/coupons/${id}`),
  
  toggle: (id: number, isActive: boolean) =>
    apiClient.patch(`/coupons/${id}/toggle`, { isActive }),
};

// Users API
export const usersAPI = {
  getAll: () =>
    apiClient.get('/users'),
  
  getById: (id: number) =>
    apiClient.get(`/users/${id}`),
  
  updatePermissions: (id: number, permissions: any) =>
    apiClient.put(`/users/${id}/permissions`, { permissions }),
  
  toggleStatus: (id: number, isActive: boolean) =>
    apiClient.patch(`/users/${id}/toggle`, { isActive }),
  
  delete: (id: number) =>
    apiClient.delete(`/users/${id}`),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (data: { email: string; name?: string }) =>
    apiClient.post('/newsletter/subscribe', data),
  
  unsubscribe: (email: string) =>
    apiClient.post('/newsletter/unsubscribe', { email }),
  
  getAll: () =>
    apiClient.get('/newsletter'),
};

export default apiClient;