import React, { useState } from 'react';
import { ChevronDownIcon, CalendarIcon, PrinterIcon, ChartBarIcon, ArrowUpIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface Transaction {
  date: string;
  invoiceNo: number;
  partyName: string;
  transaction: string;
  paymentType: string;
  amount: number;
  balance: number;
}

const Sale: React.FC = () => {
  const [dateRange] = useState({ start: '01/05/2025', end: '31/05/2025' });
  
  const transactions: Transaction[] = [
    {
      date: '25/05/2025',
      invoiceNo: 1,
      partyName: 'ansh varma',
      transaction: 'Sale',
      paymentType: 'Cash',
      amount: 1000,
      balance: 1000
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">Sale Invoices</h1>
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <span>+</span> Add Sale
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-gray-600">This Month</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span>{dateRange.start}</span>
            <span>To</span>
            <span>{dateRange.end}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <span>All Firms</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-500 mb-2">Total Sales Amount</h2>
              <div className="text-2xl font-semibold">₹ 1,000</div>
              <div className="flex gap-4 mt-2 text-gray-500">
                <span>Received: ₹ 0</span>
                <span>Balance: ₹ 1,000</span>
              </div>
            </div>
            <div className="flex items-center text-green-500">
              <span>100%</span>
              <ArrowUpIcon className="h-4 w-4 ml-1" />
              <span className="text-gray-400 text-sm ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <PrinterIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-gray-600">Date</th>
                <th className="text-left p-4 text-gray-600">Invoice no</th>
                <th className="text-left p-4 text-gray-600">Party Name</th>
                <th className="text-left p-4 text-gray-600">Transaction</th>
                <th className="text-left p-4 text-gray-600">Payment Type</th>
                <th className="text-right p-4 text-gray-600">Amount</th>
                <th className="text-right p-4 text-gray-600">Balance</th>
                <th className="text-center p-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.invoiceNo} className="border-b hover:bg-gray-50">
                  <td className="p-4">{transaction.date}</td>
                  <td className="p-4">{transaction.invoiceNo}</td>
                  <td className="p-4 text-blue-600">{transaction.partyName}</td>
                  <td className="p-4">{transaction.transaction}</td>
                  <td className="p-4">{transaction.paymentType}</td>
                  <td className="p-4 text-right">₹ {transaction.amount}</td>
                  <td className="p-4 text-right">₹ {transaction.balance}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <PrinterIcon className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <EllipsisHorizontalIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sale;