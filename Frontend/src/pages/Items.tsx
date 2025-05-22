import React, { useState } from 'react';
import { Search, Settings, X, Camera } from 'lucide-react';

const Items = () => {
  const [itemType, setItemType] = useState<'product' | 'service'>('product');
  const [activeTab, setActiveTab] = useState<'pricing' | 'stock'>('pricing');
  
  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Add Item</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                className={`px-4 py-1 rounded-md transition-colors ${
                  itemType === 'product' ? 'bg-white shadow-sm' : ''
                }`}
                onClick={() => setItemType('product')}
              >
                Product
              </button>
              <button
                className={`px-4 py-1 rounded-md transition-colors ${
                  itemType === 'service' ? 'bg-white shadow-sm' : ''
                }`}
                onClick={() => setItemType('service')}
              >
                Service
              </button>
            </div>
            <button>
              <Settings size={20} className="text-gray-500" />
            </button>
            <button>
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter item name"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Item HSN</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 pr-8"
                    placeholder="Search HSN"
                  />
                  <Search size={18} className="absolute right-2 top-2.5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">&nbsp;</label>
                <button className="h-[42px] px-4 bg-blue-50 text-blue-500 rounded-md">
                  Select Unit
                </button>
              </div>
              <div>
                <label className="block text-sm mb-1">&nbsp;</label>
                <button className="h-[42px] px-4 bg-blue-50 text-blue-500 rounded-md flex items-center">
                  <Camera size={18} className="mr-2" />
                  Add Item Image
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option>Select Category</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Item Code</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter item code"
                />
              </div>
              <div className="flex items-end">
                <button className="h-[42px] px-4 bg-blue-50 text-blue-500 rounded-md">
                  Assign Code
                </button>
              </div>
            </div>
          </div>

          <div className="border-b mb-6">
            <div className="flex space-x-6">
              <button
                className={`px-4 py-2 ${
                  activeTab === 'pricing'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'stock'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('stock')}
              >
                Stock
              </button>
            </div>
          </div>

          {activeTab === 'pricing' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg mb-4">Sale Price</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="Sale Price"
                    />
                  </div>
                  <div>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option>Without Tax</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md p-2"
                      placeholder="Disc. On Sale Price"
                    />
                    <select className="w-32 border border-gray-300 rounded-md p-2">
                      <option>Percentage</option>
                    </select>
                  </div>
                </div>
                <button className="text-blue-500 mt-4">+ Add Wholesale Price</button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg mb-4">Purchase Price</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md p-2"
                      placeholder="Purchase Price"
                    />
                    <select className="w-40 border border-gray-300 rounded-md p-2">
                      <option>Without Tax</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-4">Taxes</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tax Rate</label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option>None</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-4 border-t bg-gray-50">
          <button className="px-6 py-2 text-blue-500">Save & New</button>
          <button className="px-8 py-2 bg-blue-500 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Items;