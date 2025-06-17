import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const sendOtp = (phone: string) =>
  axiosInstance.post('/auth/send-otp/', { phone });

export const verifyOtp = (phone: string, otp: string, otp_id: string) =>
  axiosInstance.post('/auth/verify-otp/', { phone, otp, otp_id });

export const register = (data: {
  phone: string;
  name: string;
  email?: string;
  password: string;
  otp: string;
  otp_id: string;
}) => axiosInstance.post('/auth/register/', data);

export const login = (phone: string, password: string) =>
  axiosInstance.post('/auth/login/', { phone, password });

// Company APIs
export const createCompany = (company: any) =>
  axiosInstance.post('/companies/', company);

export const getCompanies = () =>
  axiosInstance.get('/companies/');

// Party APIs
export const createParty = (party: any) =>
  axiosInstance.post('/parties/', party);

export const getParties = (params?: { type?: string; search?: string }) =>
  axiosInstance.get('/parties/', { params });

// Item APIs
export const createItem = (item: any) =>
  axiosInstance.post('/items/', item);

export const getItems = (params?: { category?: string; search?: string }) =>
  axiosInstance.get('/items/', { params });

// Invoice APIs
export const createInvoice = (invoice: any) =>
  axiosInstance.post('/sales/invoices/', invoice);

export const getInvoices = (params?: {
  start_date?: string;
  end_date?: string;
  party_id?: string;
  status?: string;
}) => axiosInstance.get('/sales/invoices/', { params });

// Estimate APIs
export const createEstimate = (estimate: any) =>
  axiosInstance.post('/sales/estimates/', estimate);

export const convertEstimateToInvoice = (estimate_id: number, data: any) =>
  axiosInstance.post(`/sales/estimates/${estimate_id}/convert-to-invoice/`, data);

// Payment APIs
export const recordPaymentIn = (payment: any) =>
  axiosInstance.post('/payments/payment-in/', payment);

// Bank Account APIs
export const createBankAccount = (account: any) =>
  axiosInstance.post('/cash-bank/bank-accounts/', account);

// Cash APIs
export const getCashInHand = () =>
  axiosInstance.get('/cash-bank/cash-in-hand/');

// Dashboard API
export const getDashboard = () =>
  axiosInstance.get('/dashboard/');

// Reports
export const getSalesReport = (params?: {
  start_date?: string;
  end_date?: string;
  party_id?: string;
}) => axiosInstance.get('/reports/sales/', { params });

export const getPartyStatement = (party_id: number, params?: {
  start_date?: string;
  end_date?: string;
}) => axiosInstance.get(`/reports/party-statement/${party_id}/`, { params });

// Todo APIs
export const createTodo = (todo: any) =>
  axiosInstance.post('/todos/', todo);

export const getTodos = (params?: { completed?: string }) =>
  axiosInstance.get('/todos/', { params });