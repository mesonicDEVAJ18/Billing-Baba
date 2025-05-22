import React from 'react';
import { RefreshCw, Phone, Volume2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-sm font-medium">Company</span>
          <span className="text-gray-700 text-sm font-medium">Help</span>
          <span className="text-gray-700 text-sm font-medium">Shortcuts</span>
          <RefreshCw size={16} className="text-gray-600" />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-gray-700 text-sm">Customer Support :</span>
        <div className="flex items-center">
          <Phone size={16} className="text-gray-600 mr-1" />
          <span className="text-gray-700 text-sm">(+91) 9333 911 911</span>
        </div>
        <span className="mx-1">|</span>
        <div className="flex items-center">
          <Volume2 size={16} className="text-gray-600 mr-1" />
          <span className="text-blue-500 text-sm">Get Instant Online Support</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 text-gray-600">−</button>
        <button className="px-3 py-1 text-gray-600">□</button>
        <button className="px-3 py-1 text-gray-600">×</button>
      </div>
    </header>
  );
};

export default Header;