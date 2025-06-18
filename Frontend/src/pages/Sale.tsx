import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, CalendarIcon, PrinterIcon, ChartBarIcon, ArrowUpIcon, EllipsisHorizontalIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getInvoices, createInvoice, getParties, getItems } from '../api';
import toast from 'react-hot-toast';

interface Invoice {
  id: number;
  invoice_number: string;
  party_name: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  invoice_date: string;
  status: string;
  payment_type: string;
}

interface Party {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  sale_price: number;
}

const Sale: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dateRange] = useState({ start: '01/05/2025', end: '31/05/2025' });
  const [formData, setFormData] = useState({
    party_id: '',
    items: [{ item_id: '', quantity: 1, rate: 0, amount: 0 }],
    payment_type: 'cash',
    paid_amount: 0,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesResponse, partiesResponse, itemsResponse] = await Promise.all([
        getInvoices(),
        getParties(),
        getItems()
      ]);
      
      setInvoices(invoicesResponse.data);
      setParties(partiesResponse.data);
      setItems(itemsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
    const totalReceived = invoices.reduce((sum, invoice) => sum + invoice.paid_amount, 0);
    const totalBalance = invoices.reduce((sum, invoice) => sum + invoice.balance_amount, 0);
    
    return { totalSales, totalReceived, totalBalance };
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'item_id') {
      const selectedItem = items.find(item => item.id === parseInt(value));
      if (selectedItem) {
        newItems[index].rate = selectedItem.sale_price;
        newItems[index].amount = selectedItem.sale_price * newItems[index].quantity;
      }
    } else if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_id: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.party_id) {
      toast.error('Please select a party');
      return;
    }

    if (formData.items.some(item => !item.item_id)) {
      toast.error('Please select items');
      return;
    }

    try {
      const invoiceData = {
        party_id: parseInt(formData.party_id),
        items: formData.items.map(item => ({
          item_id: parseInt(item.item_id),
          quantity: item.quantity,
          rate: item.rate
        })),
        payment_type: formData.payment_type,
        paid_amount: formData.paid_amount,
        notes: formData.notes
      };

      const response = await createInvoice(invoiceData);
      setInvoices([response.data, ...invoices]);
      setShowAddForm(false);
      setFormData({
        party_id: '',
        items: [{ item_id: '', quantity: 1, rate: 0, amount: 0 }],
        payment_type: 'cash',
        paid_amount: 0,
        notes: ''
      });
      toast.success('Invoice created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  const { totalSales, totalReceived, totalBalance } = calculateTotals();

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">Sale Invoices</h1>
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Sale
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
              <div className="text-2xl font-semibold">₹ {totalSales.toLocaleString()}</div>
              <div className="flex gap-4 mt-2 text-gray-500">
                <span>Received: ₹ {totalReceived.toLocaleString()}</span>
                <span>Balance: ₹ {totalBalance.toLocaleString()}</span>
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
          
          {invoices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PrinterIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Invoices Yet</h3>
              <p className="text-gray-600 mb-6">Create your first sale invoice to get started</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Create First Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-gray-600">Date</th>
                    <th className="text-left p-4 text-gray-600">Invoice No</th>
                    <th className="text-left p-4 text-gray-600">Party Name</th>
                    <th className="text-left p-4 text-gray-600">Payment Type</th>
                    <th className="text-right p-4 text-gray-600">Amount</th>
                    <th className="text-right p-4 text-gray-600">Balance</th>
                    <th className="text-center p-4 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                      <td className="p-4">{invoice.invoice_number}</td>
                      <td className="p-4 text-blue-600">{invoice.party_name}</td>
                      <td className="p-4 capitalize">{invoice.payment_type}</td>
                      <td className="p-4 text-right">₹ {invoice.total_amount.toLocaleString()}</td>
                      <td className="p-4 text-right">₹ {invoice.balance_amount.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <EyeIcon className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <PencilIcon className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <PrinterIcon className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Invoice Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Create Sale Invoice</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PlusIcon className="h-6 w-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Party Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Party *
                  </label>
                  <select
                    value={formData.party_id}
                    onChange={(e) => setFormData({ ...formData, party_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Choose a party</option>
                    {parties.map((party) => (
                      <option key={party.id} value={party.id}>
                        {party.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Items *
                    </label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-5">
                          <select
                            value={item.item_id}
                            onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          >
                            <option value="">Select Item</option>
                            {items.map((itm) => (
                              <option key={itm.id} value={itm.id}>
                                {itm.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Qty"
                            min="1"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Rate"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.amount}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                            placeholder="Amount"
                            readOnly
                          />
                        </div>
                        <div className="col-span-1">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Type
                    </label>
                    <select
                      value={formData.payment_type}
                      onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="credit">Credit</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paid Amount
                    </label>
                    <input
                      type="number"
                      value={formData.paid_amount}
                      onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max={calculateTotal()}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Add any notes..."
                  />
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₹ {calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Balance:</span>
                    <span>₹ {(calculateTotal() - formData.paid_amount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Create Invoice
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

export default Sale;