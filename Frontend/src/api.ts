import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// AUTH
/**
 * POST /signup/
 * Input: { email: string, password: string, password2: string }
 * Output: { token: string, user: { id: number, email: string } }
 */
export const signup = (data: { email: string; password: string; password2: string }) =>
  api.post('/signup/', data);

/**
 * POST /login/
 * Input: { email: string, password: string }
 * Output: { token: string, user: { id: number, email: string } }
 */
export const login = (data: { email: string; password: string }) =>
  api.post('/login/', data);

/**
 * GET /me/
 * Header: Authorization: Bearer <token>
 * Output: { id: number, email: string }
 */
export const getMe = () => api.get('/me/');

// DASHBOARD
/**
 * GET /summary/
 * Output: { total_sales: string, total_customers: number, total_invoices: number, total_products: number, last_updated: string }
 */
export const getSummary = () => api.get('/summary/');

/**
 * GET /invoices/recent/
 * Output: Array<{ id: string, customer: string, amount: string, status: string, date: string }>
 */
export const getRecentInvoices = () => api.get('/invoices/recent/');

// CUSTOMERS
/** GET /customers/ */
export const getCustomers = () => api.get('/customers/');
/** POST /customers/ */
export const addCustomer = (data: any) => api.post('/customers/', data);
/** GET /customers/:id/ */
export const getCustomer = (id: number) => api.get(`/customers/${id}/`);
/** PUT /customers/:id/ */
export const updateCustomer = (id: number, data: any) => api.put(`/customers/${id}/`, data);
/** DELETE /customers/:id/ */
export const deleteCustomer = (id: number) => api.delete(`/customers/${id}/`);

// INVOICES
/** GET /invoices/ */
export const getInvoices = () => api.get('/invoices/');
/** POST /invoices/ */
export const addInvoice = (data: any) => api.post('/invoices/', data);
/** GET /invoices/:id/ */
export const getInvoice = (id: number) => api.get(`/invoices/${id}/`);
/** PUT /invoices/:id/ */
export const updateInvoice = (id: number, data: any) => api.put(`/invoices/${id}/`, data);
/** DELETE /invoices/:id/ */
export const deleteInvoice = (id: number) => api.delete(`/invoices/${id}/`);

// PRODUCTS
/** GET /products/ */
export const getProducts = () => api.get('/products/');
/** POST /products/ */
export const addProduct = (data: any) => api.post('/products/', data);
/** GET /products/:id/ */
export const getProduct = (id: number) => api.get(`/products/${id}/`);
/** PUT /products/:id/ */
export const updateProduct = (id: number, data: any) => api.put(`/products/${id}/`, data);
/** DELETE /products/:id/ */
export const deleteProduct = (id: number) => api.delete(`/products/${id}/`);

// SALES
/** GET /sales/ */
export const getSales = () => api.get('/sales/');
/** GET /sales/top-products/ */
export const getTopProducts = () => api.get('/sales/top-products/');

export default api;