import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BusinessName from '../components/BusinessName';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import VyaparNetwork from './VyaparNetwork';
import SmartConnect from './SmartConnect';
import PartyDetails from './PartyDetails';
import Items from './Items';
import BankAccounts from './BankAccounts';
import CashInHand from './CashInHand';
import Cheques from './Cheques';
import LoanAccounts from './LoanAccounts';
import SaleInvoices from './SaleInvoices';
import EstimateQuotation from './EstimateQuotation';
import PaymentIn from './PaymentIn';
import SaleOrder from './SaleOrder';
import DeliveryChallan from './DeliveryChallan';
import SaleReturnCreditNote from './SaleReturnCreditNote';
import VyaparPOS from './VyaparPOS';

function Dashboard() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Add new inventory items', completed: false },
    { id: 2, text: 'Follow up with pending payments', completed: true },
    { id: 3, text: 'Review monthly sales report', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const salesData = [
    { date: '1 May', amount: 0 },
    { date: '7 May', amount: 0 },
    { date: '14 May', amount: 0 },
    { date: '21 May', amount: 20000 },
    { date: '28 May', amount: 0 }
  ];

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const Home = () => (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-2">Total Receivable</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold">₹ 0</span>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-500">↓</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">You don't have any receivables as of now.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-2">Total Payable</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold">₹ 0</span>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500">↑</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">You don't have any payables as of now.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-600">Total Sale</h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="text-2xl font-semibold mb-4">₹ 20,000</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ background: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`₹ ${value}`, 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-600">Most Used Reports</h3>
              <button className="text-blue-500 text-sm">View All</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['Sale Report', 'All Transactions', 'Daybook Report', 'Party Statement'].map((report) => (
                <div key={report} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">{report}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-4">Todo List</h3>
          <form onSubmit={addTodo} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new task"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <button type="submit" className="bg-blue-500 text-white rounded-md px-3 py-2">
                <Plus size={16} />
              </button>
            </div>
          </form>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="rounded text-blue-500"
                  />
                  <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BusinessName />
          <div className="flex-1 bg-[#f0f8ff] overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/parties/network" element={<VyaparNetwork />} />
              <Route path="/parties/smart-connect" element={<SmartConnect />} />
              <Route path="/parties/details" element={<PartyDetails />} />
              <Route path="/items" element={<Items />} />
              <Route path="/sale/invoices" element={<SaleInvoices />} />
              <Route path="/sale/estimate-quotation" element={<EstimateQuotation />} />
              <Route path="/sale/payment-in" element={<PaymentIn />} />
              <Route path="/sale/sale-order" element={<SaleOrder />} />
              <Route path="/sale/delivery-challan" element={<DeliveryChallan />} />
              <Route path="/sale/sale-return-credit-note" element={<SaleReturnCreditNote />} />
              <Route path="/sale/vyapar-pos" element={<VyaparPOS />} />
              <Route path="/bank-accounts" element={<BankAccounts />} />
              <Route path="/cash-in-hand" element={<CashInHand />} />
              <Route path="/cheques" element={<Cheques />} />
              <Route path="/loan-accounts" element={<LoanAccounts />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;