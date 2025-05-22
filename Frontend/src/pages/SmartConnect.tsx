import React from 'react';

const SmartConnect = () => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Party Smart Connect</h1>
        <p className="text-gray-600 mb-12">
          Seamlessly Connect WhatsApp for Smarter Business Communication
        </p>

        <div className="mb-12">
          <img
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
            alt="Smart Connect"
            className="w-96 mx-auto"
          />
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/users.svg" alt="Users" className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Effortless Party Interaction</h3>
            <p className="text-gray-600 text-sm">
              Connect with your parties via WhatsApp in Vyapar
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" alt="Security" className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Secured Party Conversations</h3>
            <p className="text-gray-600 text-sm">
              Only chats with your business are visible for secure communication.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/trending-up.svg" alt="Efficiency" className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Enhance Business Efficiency</h3>
            <p className="text-gray-600 text-sm">
              Save time and boost productivity with enhanced messaging features.
            </p>
          </div>
        </div>

        <button className="bg-[#ff3366] text-white px-8 py-3 rounded-full font-medium hover:bg-[#ff1a1a] transition-colors">
          Link my WhatsApp
        </button>
      </div>
    </div>
  );
};

export default SmartConnect;