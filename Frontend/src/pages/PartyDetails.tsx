import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { getParties, createParty } from '../api';
import toast from 'react-hot-toast';

interface Party {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  party_type: 'customer' | 'supplier' | 'both';
  balance: number;
  created_at: string;
}

const PartyDetails = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [filteredParties, setFilteredParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier' | 'both'>('all');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    party_type: 'customer' as 'customer' | 'supplier' | 'both'
  });

  useEffect(() => {
    fetchParties();
  }, []);

  useEffect(() => {
    let filtered = parties;
    
    if (searchTerm) {
      filtered = filtered.filter(party =>
        party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.phone?.includes(searchTerm) ||
        party.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(party => party.party_type === filterType);
    }
    
    setFilteredParties(filtered);
  }, [parties, searchTerm, filterType]);

  const fetchParties = async () => {
    try {
      const response = await getParties();
      setParties(response.data);
    } catch (error) {
      console.error('Failed to fetch parties:', error);
      toast.error('Failed to load parties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Party name is required');
      return;
    }

    try {
      const response = await createParty(formData);
      setParties([...parties, response.data]);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        party_type: 'customer'
      });
      setShowAddForm(false);
      toast.success('Party added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add party');
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
            <h1 className="text-2xl font-semibold text-gray-800">Party Details</h1>
            <p className="text-gray-600 mt-1">Manage your customers and suppliers</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Plus size={20} />
            Add Party
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search parties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Types</option>
                <option value="customer">Customers</option>
                <option value="supplier">Suppliers</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parties List */}
        {filteredParties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Parties Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'No parties match your search criteria.' 
                : 'Add your first customer or supplier to get started.'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Add Your First Party
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParties.map((party) => (
              <div key={party.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{party.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        party.party_type === 'customer' 
                          ? 'bg-green-100 text-green-800'
                          : party.party_type === 'supplier'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {party.party_type === 'both' ? 'Customer & Supplier' : party.party_type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {party.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2" />
                        <span className="text-sm">{party.phone}</span>
                      </div>
                    )}
                    {party.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail size={16} className="mr-2" />
                        <span className="text-sm">{party.email}</span>
                      </div>
                    )}
                    {party.address && (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">{party.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Balance</span>
                      <span className={`font-semibold ${
                        party.balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹ {Math.abs(party.balance).toLocaleString()}
                        {party.balance < 0 && ' (You owe)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Party Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add New Party</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter party name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party Type
                  </label>
                  <select
                    name="party_type"
                    value={formData.party_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter address"
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
                    Add Party
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

export default PartyDetails;