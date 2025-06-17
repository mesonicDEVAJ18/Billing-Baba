import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar, TrendingUp, FileText, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getSalesReport, getPartyStatement } from '../api';

interface SalesData {
  date: string;
  sales: number;
  profit: number;
}

interface PartyData {
  name: string;
  sales: number;
  outstanding: number;
}

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState('this-month');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [partyData, setPartyData] = useState<PartyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: TrendingUp, color: 'blue' },
    { id: 'party', name: 'Party Statement', icon: Users, color: 'green' },
    { id: 'profit', name: 'Profit & Loss', icon: DollarSign, color: 'purple' },
    { id: 'daybook', name: 'Daybook', icon: FileText, color: 'orange' }
  ];

  const mockSalesData = [
    { date: '1 May', sales: 25000, profit: 5000 },
    { date: '7 May', sales: 30000, profit: 6000 },
    { date: '14 May', sales: 22000, profit: 4400 },
    { date: '21 May', sales: 35000, profit: 7000 },
    { date: '28 May', sales: 28000, profit: 5600 }
  ];

  const mockPartyData = [
    { name: 'ABC Electronics', sales: 45000, outstanding: 12000 },
    { name: 'XYZ Trading', sales: 32000, outstanding: 8000 },
    { name: 'PQR Industries', sales: 28000, outstanding: 5000 },
    { name: 'LMN Corp', sales: 22000, outstanding: 3000 }
  ];

  const profitData = [
    { category: 'Sales Revenue', amount: 140000, color: '#10b981' },
    { category: 'Cost of Goods', amount: -84000, color: '#ef4444' },
    { category: 'Operating Expenses', amount: -25000, color: '#f59e0b' },
    { category: 'Net Profit', amount: 31000, color: '#3b82f6' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchReportData();
  }, [activeReport, dateRange]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      if (activeReport === 'sales') {
        // const response = await getSalesReport({ start_date: '2025-05-01', end_date: '2025-05-31' });
        setSalesData(mockSalesData);
      } else if (activeReport === 'party') {
        setPartyData(mockPartyData);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading report...');
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">₹ 1,40,000</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Profit</p>
              <p className="text-2xl font-bold text-gray-800">₹ 28,000</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Sale</p>
              <p className="text-2xl font-bold text-gray-800">₹ 28,000</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-800">20%</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹ ${value}`, '']} />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} name="Sales" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPartyReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Party Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {partyData.map((party, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{party.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">₹ {party.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">₹ {party.outstanding.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      party.outstanding === 0 
                        ? 'bg-green-100 text-green-800'
                        : party.outstanding < 10000
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {party.outstanding === 0 ? 'Clear' : party.outstanding < 10000 ? 'Low' : 'High'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Outstanding Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={partyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="outstanding"
              >
                {partyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹ ${value}`, 'Outstanding']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderProfitReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Profit & Loss Statement</h3>
        <div className="space-y-4">
          {profitData.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{item.category}</span>
              <span className={`font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.amount >= 0 ? '+' : ''}₹ {Math.abs(item.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Profit Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData.filter(item => item.amount !== 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹ ${Math.abs(value as number)}`, '']} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDaybookReport = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Daily Transactions</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[
            { time: '09:30 AM', description: 'Sale Invoice #001', type: 'Sale', amount: 15000 },
            { time: '11:15 AM', description: 'Purchase Bill #PB001', type: 'Purchase', amount: -8000 },
            { time: '02:30 PM', description: 'Customer Payment', type: 'Payment In', amount: 12000 },
            { time: '04:45 PM', description: 'Office Rent', type: 'Expense', amount: -5000 }
          ].map((transaction, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.time} • {transaction.type}</p>
              </div>
              <span className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount >= 0 ? '+' : ''}₹ {Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
            <p className="text-gray-600 mt-1">Analyze your business performance</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Download size={20} />
              Download
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeReport === report.id
                    ? `border-${report.color}-500 bg-${report.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                    activeReport === report.id
                      ? `bg-${report.color}-100`
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      activeReport === report.id
                        ? `text-${report.color}-600`
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    activeReport === report.id
                      ? `text-${report.color}-700`
                      : 'text-gray-700'
                  }`}>
                    {report.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Report Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {activeReport === 'sales' && renderSalesReport()}
            {activeReport === 'party' && renderPartyReport()}
            {activeReport === 'profit' && renderProfitReport()}
            {activeReport === 'daybook' && renderDaybookReport()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;