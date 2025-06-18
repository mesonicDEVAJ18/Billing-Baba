import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Edit, Trash2, Package } from 'lucide-react';
import { getItems, createItem } from '../api';
import toast from 'react-hot-toast';

interface Item {
  id: number;
  name: string;
  type?: string;
  hsn_code?: string;
  category?: string;
  item_code?: string;
  unit?: string;
  pricing: {
    sale_price: number;
    purchase_price?: number;
    tax_rate?: number;
  };
  stock?: {
    current_stock?: number;
    min_stock?: number;
  };
  description?: string;
  created_at: string;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState<'product' | 'service'>('product');
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
    hsn_code: '',
    category: '',
    item_code: '',
    unit: '',
    sale_price: '',
    purchase_price: '',
    tax_rate: '18',
    current_stock: '',
    min_stock: '',
    description: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      toast.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Item name is required');
      return;
    }

    if (!formData.sale_price || parseFloat(formData.sale_price) <= 0) {
      toast.error('Valid sale price is required');
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        type: formData.type,
        hsn_code: formData.hsn_code,
        category: formData.category,
        item_code: formData.item_code,
        unit: formData.unit,
        pricing: {
          sale_price: parseFloat(formData.sale_price),
          purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
          tax_rate: formData.tax_rate ? parseFloat(formData.tax_rate) : undefined
        },
        stock: formData.type === 'product' ? {
          current_stock: formData.current_stock ? parseInt(formData.current_stock) : undefined,
          min_stock: formData.min_stock ? parseInt(formData.min_stock) : undefined
        } : undefined,
        description: formData.description
      };

      const response = await createItem(itemData);
      if (response.data.success) {
        setItems([...items, response.data.item]);
        setFormData({
          name: '',
          type: 'product',
          hsn_code: '',
          category: '',
          item_code: '',
          unit: '',
          sale_price: '',
          purchase_price: '',
          tax_rate: '18',
          current_stock: '',
          min_stock: '',
          description: ''
        });
        setShowAddForm(false);
        toast.success('Item added successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Items</h1>
            <p className="text-gray-600 mt-1">Manage your products and services</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Items Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'No items match your search criteria.' 
                : 'Add your first product or service to get started.'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.item_code && (
                            <div className="text-sm text-gray-500">Code: {item.item_code}</div>
                          )}
                          {item.hsn_code && (
                            <div className="text-sm text-gray-500">HSN: {item.hsn_code}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹ {item.pricing.sale_price.toLocaleString()}
                        </div>
                        {item.unit && (
                          <div className="text-sm text-gray-500">per {item.unit}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.stock?.current_stock !== undefined ? item.stock.current_stock : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add New Item</h2>
                <div className="flex items-center gap-4">
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
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Code
                    </label>
                    <input
                      type="text"
                      name="item_code"
                      value={formData.item_code}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter item code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter category"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., pcs, kg, ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      name="hsn_code"
                      value={formData.hsn_code}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter HSN code"
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price *
                      </label>
                      <input
                        type="number"
                        name="sale_price"
                        value={formData.sale_price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Price
                      </label>
                      <input
                        type="number"
                        name="purchase_price"
                        value={formData.purchase_price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Rate (%)
                      </label>
                      <select
                        name="tax_rate"
                        value={formData.tax_rate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>

                    {itemType === 'product' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Stock
                          </label>
                          <input
                            type="number"
                            name="current_stock"
                            value={formData.current_stock}
                            onChange={handleInputChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Stock
                          </label>
                          <input
                            type="number"
                            name="min_stock"
                            value={formData.min_stock}
                            onChange={handleInputChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter item description"
                  />
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
                    Add Item
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

export default Items;