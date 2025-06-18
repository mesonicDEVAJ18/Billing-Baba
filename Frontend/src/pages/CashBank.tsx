import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Banknote, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCashInHand, createBankAccount } from '../api';
import toast from 'react-hot-toast';

interface BankAccount {
  id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  balance: number;
  account_type: string;
}

interface Transaction {
  id: number;
  type: 'in' | 'out';
  amount: number;
  description: string;
  date: string;
  account: string;
}

const CashBank = () => {

  const [cashInHand, setCashInHand] = useState(0);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'in',
      amount: 15000,
      description: 'Customer Payment - ABC Corp',
      date: '2025-05-20',
      account: 'Cash'
    },
    {
      id: 2,
      type: 'out',
      amount: 8000,
      description: 'Supplier Payment - XYZ Ltd',
      date: '2025-05-19',
      account: 'HDFC Bank'
    },
    {
      id: 3,
      type: 'in',
      amount: 25000,
      description: 'Sale Invoice #001',
      date: '2025-05-18',
      account: 'Cash'
    }
  ]);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
    account_type: 'savings',
    opening_balance: 0
  });

  const cashFlowData = [
    { date: '1 May', cashIn: 25000, cashOut: 15000 },
    { date: '7 May', cashIn: 30000, cashOut: 18000 },
    { date: '14 May', cashIn: 22000, cashOut: 12000 },
    { date: '21 May', cashIn: 35000, cashOut: 20000 },
    { date: '28 May', cashIn: 28000, cashOut: 16000 }
  ];

  useEffect(() => {
    fetchCashData();
  }, []);

  const fetchCashData = async () => {
    try {
      const response = await getCashInHand();
      setCashInHand(response.data.balance);

    } catch (error) {
      console.error('Failed to fetch cash data:', error);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await createBankAccount(accountForm);
      setBankAccounts([...bankAccounts, response.data]);
      setAccountForm({
        account_name: '',
        account_number: '',
        bank_name: '',
        account_type: 'savings',
        opening_balance: 0
      });
      setShowAddAccount(false);
      toast.success('Bank account added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add bank account');
    }
  };


  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalBalance = cashInHand + totalBankBalance;

  const totalCashIn = transactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalCashOut = transactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Cash & Bank</h1>
            <p className="text-gray-600 mt-1">Manage your cash flow and bank accounts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddAccount(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              Add Bank Account
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalBalance.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">+12%</span>
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cash in Hand</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {cashInHand.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <Banknote className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">Available</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cash In</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalCashIn.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">This month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cash Out</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalCashOut.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowDownLeft className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500 text-sm font-medium">This month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Cash Flow Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹ ${value}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="cashIn" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Cash In"
                />
                <Line 
                  type="monotone" 
                  dataKey="cashOut" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Cash Out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bank Accounts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Bank Accounts</h3>
            </div>
            <div className="p-6">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">No Bank Accounts</h4>
                  <p className="text-gray-600 mb-4">Add your first bank account to get started</p>
                  <button
                    onClick={() => setShowAddAccount(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Bank Account
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>

                          <h4 className="font-medium text-gray-800">{account.account_name}</h4>
                          <p className="text-sm text-gray-600">{account.bank_name}</p>
                          <p className="text-sm text-gray-500">****{account.account_number.slice(-4)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">₹ {account.balance.toLocaleString()}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {account.account_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'in' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.account} • {new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'in' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'in' ? '+' : '-'}₹ {transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Bank Account Modal */}
        {showAddAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add Bank Account</h2>
                <button
                  onClick={() => setShowAddAccount(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={accountForm.account_name}
                    onChange={(e) => setAccountForm({ ...accountForm, account_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter account name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={accountForm.bank_name}
                    onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={accountForm.account_number}
                    onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={accountForm.account_type}
                    onChange={(e) => setAccountForm({ ...accountForm, account_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="overdraft">Overdraft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    value={accountForm.opening_balance}
                    onChange={(e) => setAccountForm({ ...accountForm, opening_balance: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashBank;