import React from 'react';
import { Package } from 'lucide-react';

interface InvoiceFormProps {
  updateInvoiceData: (data: any) => void;
  invoiceData: any;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ updateInvoiceData, invoiceData }) => {
  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInvoiceData({
      ...invoiceData,
      customerName: e.target.value
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    updateInvoiceData({
      ...invoiceData,
      amount: value,
      balance: value
    });
  };

  const handleReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const balance = (parseFloat(invoiceData.amount || '0') - parseFloat(value || '0')).toFixed(2);
    
    updateInvoiceData({
      ...invoiceData,
      received: value,
      balance: balance
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-8">
        <h2 className="text-xl font-medium flex items-center text-gray-800">
          <span className="mr-2">🚀</span>
          Enter details to make your first Sale
        </h2>
        <p className="text-gray-600 mt-2">First sale is made in less than a minute on Billing Baba</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
            <span className="text-lg">i</span>
          </div>
          <h3 className="text-lg font-medium">Invoice Details :</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-600 mb-1">Invoice Number :</label>
            <div className="text-gray-800">01</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Invoice Date :</label>
            <div className="text-gray-800">20-05-2025</div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
            <Users size={18} />
          </div>
          <h3 className="text-lg font-medium">Bill To :</h3>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Customer Name*</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={invoiceData.customerName || ''}
            onChange={handleCustomerNameChange}
          />
        </div>
      </div>
      
      <div className="border border-dashed border-blue-400 rounded-md p-4 mb-8 flex flex-col items-center justify-center">
        <button className="text-blue-500 flex items-center">
          <Package size={20} className="mr-2" />
          Add Sample Item
        </button>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
            <span className="text-lg">₹</span>
          </div>
          <h3 className="text-lg font-medium">Invoice Calculation :</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-gray-600 mb-1">Invoice Amount*</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-700">₹</span>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                value={invoiceData.amount || '0.00'}
                onChange={handleAmountChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-600 mb-1">Received</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-700">₹</span>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                value={invoiceData.received || '0.00'}
                onChange={handleReceivedChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#ebf6f1] p-4 rounded-md mb-8 flex justify-between items-center">
        <div className="text-gray-700">Balance</div>
        <div className="text-green-600 font-medium">₹ {invoiceData.balance || '0.00'}</div>
      </div>
      
      <div className="flex justify-center">
        <button className="bg-[#c7d1e7] text-gray-700 px-6 py-2 rounded-full flex items-center">
          <span className="mr-2">📝</span>
          Create Your First Invoice
        </button>
      </div>
    </div>
  );
};

function Users(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default InvoiceForm;