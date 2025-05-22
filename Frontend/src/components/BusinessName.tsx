import React from 'react';

const BusinessName: React.FC = () => {
  return (
    <div className="bg-[#f0f8ff] py-3 px-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="h-4 w-4 rounded-full bg-[#e91e63] mr-2"></div>
        <span className="text-gray-500">Enter Business Name</span>
      </div>
    </div>
  );
};

export default BusinessName;