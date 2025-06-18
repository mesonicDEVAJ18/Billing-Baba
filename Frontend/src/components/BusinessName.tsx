import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCompanies } from '../api';

const BusinessName: React.FC = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('Enter Business Name');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanies();
        if (response.data.length > 0) {
          setBusinessName(response.data[0].name);

        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCompanies();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div className="bg-[#f0f8ff] py-3 px-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="h-4 w-4 rounded-full bg-[#e91e63] mr-2"></div>
        <span className="text-gray-500">
          {isLoading ? 'Loading...' : businessName}
        </span>
      </div>
    </div>
  );
};

export default BusinessName;