// api.ts - TypeScript API wrapper for Billing Baba Flask Backend

import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'; // Update with your actual backend URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth token injector
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ AUTH ------------------

/**
 * Send OTP
 * Input: { phone: string }
 * Output: { success: boolean, message: string, otp_id: string, expires_in: number }
 */
export const sendOtp = (phone: string) => api.post('/auth/send-otp/', { phone });

/**
 * Verify OTP
 * Input: { phone: string, otp: string, otp_id: string }
 * Output: { success, message, user, tokens }
 */
export const verifyOtp = (data: { phone: string; otp: string; otp_id: string }) =>
  api.post('/auth/verify-otp/', data);

/**
 * Register user
 * Input: { phone, name, password, otp, otp_id, email? }
 * Output: { success, message, user, tokens }
 */
export const register = (data: {
  phone: string;
  name: string;
  password: string;
  otp: string;  
  otp_id: string;
  email?: string;
}) => api.post('/auth/register/', data);

/**
 * Login user
 * Input: { phone: string, password: string }
 * Output: { success, message, user, tokens }
 */
export const login = (data: { phone: string; password: string }) =>
  api.post('/auth/login/', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
// ------------------ COMPANIES ------------------

/**
 * Create Company
 * Input: { name, gst_number?, address, contact, logo? (base64) }
 * Output: { success, message, company }
 */
export const createCompany = (data: any) => api.post('/companies/', data);

/**
 * Get all Companies for user
 * Output: { success, companies: Company[] }
 */
export const getCompanies = () => api.get('/companies/');

// ------------------ PARTIES ------------------

/**
 * Create Party
 * Input: { name, type, phone?, email?, gst_number?, address, credit_limit?, payment_terms? }
 * Output: { success, message, party }
 */
export const createParty = (data: any) => api.post('/parties/', data);

/**
 * Get Parties
 * Params: type?, search?
 * Output: { success, count, parties }
 */
export const getParties = (params?: { type?: string; search?: string }) =>
  api.get('/parties/', { params });

// ------------------ ITEMS ------------------

/**
 * Create Item
 * Input: { name, type?, hsn_code?, category?, item_code?, unit?, pricing, stock, description?, image? }
 * Output: { success, message, item }
 */
export const createItem = (data: any) => api.post('/items/', data);

/**
 * Get Items
 * Params: search?, category?
 * Output: { success, count, items }
 */
export const getItems = (params?: { search?: string; category?: string }) =>
  api.get('/items/', { params });

// ------------------ INVOICES ------------------

/**
 * Create Invoice
 * Input: { party_id, invoice_date, due_date?, items, discount?, shipping_charges?, notes?, terms_conditions? }
 * Output: { success, message, invoice }
 */
export const createInvoice = (data: any) => api.post('/sales/invoices/', data);

/**
 * Get Invoices
 * Params: start_date?, end_date?, party_id?, status?
 * Output: { success, count, invoices, totals }
 */
export const getInvoices = (params?: any) => api.get('/sales/invoices/', { params });

// ------------------ ESTIMATES ------------------

/**
 * Create Estimate
 * Input: { party_id, estimate_date, valid_until?, items, notes?, terms_conditions? }
 * Output: { success, message, estimate }
 */
export const createEstimate = (data: any) => api.post('/sales/estimates/', data);

/**
 * Convert Estimate to Invoice
 * Input: { invoice_date, due_date? }
 * Output: { success, message, invoice }
 */
export const convertEstimateToInvoice = (estimateId: number, data: any) =>
  api.post(`/sales/estimates/${estimateId}/convert-to-invoice/`, data);

// ------------------ PAYMENTS ------------------

/**
 * Record Payment In
 * Input: { party_id, amount, payment_date, payment_method, reference_number?, invoices? }
 * Output: { success, message, payment }
 */
export const recordPayment = (data: any) => api.post('/payments/payment-in/', data);

// ------------------ BANK ACCOUNTS ------------------

/**
 * Create Bank Account
 * Input: { bank_name, account_number, account_holder_name, ifsc_code, branch?, account_type?, opening_balance? }
 * Output: { success, message, bank_account }
 */
export const createBankAccount = (data: any) => api.post('/cash-bank/bank-accounts/', data);

// ------------------ CASH-IN-HAND ------------------

/**
 * Get Cash In Hand
 * Output: { success, cash_in_hand: { current_balance, transactions } }
 */
export const getCashInHand = () => api.get('/cash-bank/cash-in-hand/');

// ------------------ DASHBOARD ------------------

/**
 * Get Dashboard Summary
 * Output: { success, dashboard: { summary, sales_chart, recent_transactions, pending_invoices } }
 */
export const getDashboard = () => api.get('/dashboard/');

// ------------------ REPORTS ------------------

/**
 * Get Sales Report
 * Params: start_date?, end_date?, party_id?
 * Output: { success, report: { summary, sales_by_party, sales_by_item } }
 */
export const getSalesReport = (params?: any) => api.get('/reports/sales/', { params });

/**
 * Get Party Statement
 * Input: party_id (as path param), start_date?, end_date?
 * Output: { success, statement }
 */
export const getPartyStatement = (partyId: number, params?: any) =>
  api.get(`/reports/party-statement/${partyId}/`, { params });

// ------------------ TODOS ------------------

/**
 * Create Todo
 * Input: { text, priority?, due_date? }
 * Output: { success, message, todo }
 */
export const createTodo = (data: any) => api.post('/todos/', data);

/**
 * Get Todos
 * Params: completed?
 * Output: { success, todos }
 */
export const getTodos = (params?: { completed?: string }) => api.get('/todos/', { params });

export const getProfile = () => api.get('/auth/me/');

export default api;