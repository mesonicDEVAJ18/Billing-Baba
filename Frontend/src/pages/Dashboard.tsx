import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BusinessName from '../components/BusinessName';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import VyaparNetwork from './VyaparNetwork';
import SmartConnect from './SmartConnect';
import PartyDetails from './PartyDetails';
import Items from './Items';
import Sale from './Sale';

function Dashboard() {
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    amount: '0.00',
    received: '0.00',
    balance: '0.00'
  });

  const updateInvoiceData = (data: any) => {
    setInvoiceData(data);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BusinessName />
          <div className="flex-1 bg-[#f0f8ff] overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
                      <InvoiceForm 
                        updateInvoiceData={updateInvoiceData}
                        invoiceData={invoiceData}
                      />
                      <InvoicePreview 
                        invoiceData={invoiceData}
                      />
                    </div>
                  </div>
                }
              />
              <Route path="/parties/network" element={<VyaparNetwork />} />
              <Route path="/parties/smart-connect" element={<SmartConnect />} />
              <Route path="/parties/details" element={<PartyDetails />} />
              <Route path="/items" element={<Items />} />
              <Route path="/sale" element={<Sale />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;