import React from 'react';
import { Search } from 'lucide-react';

const VyaparNetwork = () => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Your Network</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Network"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-[#f0f8ff] px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Invoices</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="text-gray-600">Connected Users</div>
        <div className="text-gray-600">Balance</div>
      </div>

      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-32 h-32 bg-[#f0f8ff] rounded-full flex items-center justify-center mb-6">
          <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/file-text.svg" alt="No invoices" className="w-16 h-16 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No Invoice Shared</h3>
        <p className="text-gray-500 text-center">
          You have not sent or received an invoice<br />with this party yet
        </p>
      </div>
    </div>
  );
};

export default VyaparNetwork;