import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plus, X, TrendingUp, TrendingDown, Users, FileText, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BusinessName from '../components/BusinessName';
import VyaparNetwork from './VyaparNetwork';
import MyCompany from './MyCompany';
import SmartConnect from './SmartConnect';
import PartyDetails from './PartyDetails';
import Items from './Items';
import Sale from './Sale';
import PurchaseExpense from './PurchaseExpense';
import CashBank from './CashBank';
import Reports from './Reports';
import { getDashboard, getTodos, createTodo } from '../api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalReceivable: 0,
    totalPayable: 0,
    totalSales: 0,
    salesData: [],
    recentTransactions: [],
    topCustomers: [],
    monthlyComparison: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, todosResponse] = await Promise.all([
          getDashboard(),
          getTodos()
        ]);
        
        setDashboardData(dashboardResponse.data);
        setTodos(todosResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      const response = await createTodo({ text: newTodo, completed: false });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo: any) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo: any) => todo.id !== id));
  };

  // Focus search input on Ctrl+F / Cmd+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const salesData = [
    { date: '1 May', amount: 0 },
    { date: '7 May', amount: 5000 },
    { date: '14 May', amount: 12000 },
    { date: '21 May', amount: 20000 },
    { date: '28 May', amount: 18000 }
  ];

  const expenseData = [
    { category: 'Inventory', amount: 15000 },
    { category: 'Rent', amount: 8000 },
    { category: 'Utilities', amount: 3000 },
    { category: 'Marketing', amount: 5000 },
    { category: 'Others', amount: 2000 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const Home = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Receivable</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹ {dashboardData.totalReceivable.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+12%</span>
                <span className="text-gray-400 text-sm ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Payable</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹ {dashboardData.totalPayable.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500 text-sm font-medium">-5%</span>
                <span className="text-gray-400 text-sm ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹ {dashboardData.totalSales.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-500 text-sm font-medium">+25%</span>
                <span className="text-gray-400 text-sm ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">156</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-purple-500 text-sm font-medium">+8%</span>
                <span className="text-gray-400 text-sm ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sales Trend</h3>
            <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    background: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                  formatter={(value) => [`₹ ${value}`, 'Sales']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹ ${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View All</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 1, type: 'Sale', party: 'ABC Electronics', amount: 15000, date: '2 hours ago', status: 'completed' },
                { id: 2, type: 'Purchase', party: 'XYZ Suppliers', amount: -8000, date: '5 hours ago', status: 'pending' },
                { id: 3, type: 'Payment', party: 'Customer Payment', amount: 12000, date: '1 day ago', status: 'completed' },
                { id: 4, type: 'Expense', party: 'Office Rent', amount: -5000, date: '2 days ago', status: 'completed' }
              ].map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">{transaction.party}</p>
                      <p className="text-sm text-gray-500">{transaction.type} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₹ {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Todo List</h3>
          </div>
          <div className="p-6">
            <form onSubmit={addTodo} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add new task"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </form>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {todos.map((todo: any) => (
                <div key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)} 
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {todos.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No tasks yet. Add one above!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <BusinessName />
            <div className="flex-1 bg-[#f0f8ff] flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
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
              <Route path="/sale" element={<Sale />} />
              <Route path="/purchase-expense" element={<PurchaseExpense />} />
              <Route path="/cash-bank" element={<CashBank />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/mycompany" element={<MyCompany />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;