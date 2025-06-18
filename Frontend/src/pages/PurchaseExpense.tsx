import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, TrendingUp, TrendingDown, ShoppingCart, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Purchase {
  id: number;
  supplier_name: string;
  bill_number: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  category: string;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  payment_method: string;
}

const PurchaseExpense = () => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'expenses'>('purchases');
  const [purchases] = useState<Purchase[]>([
    {
      id: 1,
      supplier_name: 'ABC Suppliers',
      bill_number: 'BILL-001',
      amount: 25000,
      date: '2025-05-20',
      status: 'paid',
      category: 'Inventory'
    },
    {
      id: 2,
      supplier_name: 'XYZ Trading',
      bill_number: 'BILL-002',
      amount: 15000,
      date: '2025-05-18',
      status: 'pending',
      category: 'Raw Materials'
    }
  ]);

  const [expenses] = useState<Expense[]>([
    {
      id: 1,
      description: 'Office Rent',
      amount: 12000,
      date: '2025-05-01',
      category: 'Rent',
      payment_method: 'Bank Transfer'
    },
    {
      id: 2,
      description: 'Electricity Bill',
      amount: 3500,
      date: '2025-05-15',
      category: 'Utilities',
      payment_method: 'Cash'
    }
  ]);

  const monthlyData = [
    { month: 'Jan', purchases: 45000, expenses: 25000 },
    { month: 'Feb', purchases: 52000, expenses: 28000 },
    { month: 'Mar', purchases: 48000, expenses: 26000 },
    { month: 'Apr', purchases: 61000, expenses: 32000 },
    { month: 'May', purchases: 40000, expenses: 15500 }
  ];

  const expenseCategories = [
    { name: 'Rent', value: 12000, color: '#0088FE' },
    { name: 'Utilities', value: 3500, color: '#00C49F' },
    { name: 'Marketing', value: 5000, color: '#FFBB28' },
    { name: 'Travel', value: 2000, color: '#FF8042' },
    { name: 'Others', value: 3000, color: '#8884D8' }
  ];

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingPayments = purchases.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Purchase & Expense</h1>
            <p className="text-gray-600 mt-1">Track your purchases and manage expenses</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
              <Plus size={20} />
              Add Purchase
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
              <Plus size={20} />
              Add Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Purchases</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalPurchases.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-blue-500 text-sm font-medium">+15%</span>
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">-8%</span>
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {pendingPayments.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-orange-500 text-sm font-medium">{purchases.filter(p => p.status === 'pending').length} bills</span>
                  <span className="text-gray-400 text-sm ml-1">pending</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {(totalPurchases + totalExpenses).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-purple-500 text-sm font-medium">+12%</span>
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹ ${value}`, '']} />
                  <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
                  <Bar dataKey="expenses" fill="#10b981" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Categories</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹ ${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchases'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('purchases')}
              >
                Purchases ({purchases.length})
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expenses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('expenses')}
              >
                Expenses ({expenses.length})
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Categories</option>
                  <option value="inventory">Inventory</option>
                  <option value="rent">Rent</option>
                  <option value="utilities">Utilities</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'purchases' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Supplier</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Bill Number</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Category</th>
                      <th className="text-right py-3 text-gray-600 font-medium">Amount</th>
                      <th className="text-center py-3 text-gray-600 font-medium">Status</th>
                      <th className="text-center py-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">{new Date(purchase.date).toLocaleDateString()}</td>
                        <td className="py-4 font-medium">{purchase.supplier_name}</td>
                        <td className="py-4">{purchase.bill_number}</td>
                        <td className="py-4">{purchase.category}</td>
                        <td className="py-4 text-right font-medium">₹ {purchase.amount.toLocaleString()}</td>
                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            purchase.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : purchase.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {purchase.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Description</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Category</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Payment Method</th>
                      <th className="text-right py-3 text-gray-600 font-medium">Amount</th>
                      <th className="text-center py-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="py-4 font-medium">{expense.description}</td>
                        <td className="py-4">{expense.category}</td>
                        <td className="py-4">{expense.payment_method}</td>
                        <td className="py-4 text-right font-medium">₹ {expense.amount.toLocaleString()}</td>
                        <td className="py-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseExpense;