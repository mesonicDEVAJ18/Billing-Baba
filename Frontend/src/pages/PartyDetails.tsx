import React from 'react';
import { Plus } from 'lucide-react';

const PartyDetails = () => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Party Details</h1>
        <p className="text-gray-600 mb-2">
          Add your customers and suppliers to manage your business easily.
        </p>
        <p className="text-gray-600 mb-12">
          Track payments and grow your business without any hassle!
        </p>

        <div className="mb-12">
          <img
            src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg"
            alt="Party Details"
            className="w-96 mx-auto"
          />
        </div>

        <button className="bg-[#ff3366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#ff1a1a] transition-colors flex items-center gap-2 mx-auto">
          <Plus size={20} />
          Add Your First Party
        </button>
      </div>
    </div>
  );
};

export default PartyDetails;