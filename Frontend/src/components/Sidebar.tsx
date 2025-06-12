import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  ShoppingCart, 
  BarChart2, 
  PieChart,
  Repeat, 
  Settings, 
  Package, 
  ChevronRight,
  Building2,
  Wallet,
  FileCheck,
  Landmark
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-[230px] bg-[#1a1d37] text-white flex flex-col h-screen">
      <div className="p-4 mb-4">
        <button className="bg-[#2d3052] text-white px-4 py-2 rounded-md w-full text-left">
          Open Anything (Ctrl+F)
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <Link to="/">
          <SidebarItem icon={<Home size={20} />} text="Home" isActive={location.pathname === '/'} />
        </Link>

        <div>
          <SidebarItem icon={<Users size={20} />} text="Parties" hasDropdown />
          <div className="pl-8 bg-[#151729]">
            <Link to="/parties/details">
              <SidebarSubItem text="Party Details" isActive={location.pathname === '/parties/details'} hasPlus />
            </Link>
            <Link to="/parties/smart-connect">
              <SidebarSubItem text="Smart Connect" isActive={location.pathname === '/parties/smart-connect'} />
            </Link>
            <Link to="/parties/network">
              <SidebarSubItem text="Network" isActive={location.pathname === '/parties/network'} />
            </Link>
          </div>
        </div>

        <Link to="/items">
          <SidebarItem icon={<Package size={20} />} text="Items" hasPlus />
        </Link>
        
        <div>
          <SidebarItem icon={<CreditCard size={20} />} text="Sale" hasDropdown />
          <div className="pl-8 bg-[#151729]">
            <Link to="/sale/invoices">
              <SidebarSubItem text="Sale Invoices" isActive={location.pathname === '/sale/invoices'} hasPlus />
            </Link>
            <Link to="/sale/estimate-quotation">
              <SidebarSubItem text="Estimate/ Quotation" isActive={location.pathname === '/sale/estimate-quotation'} hasPlus />
            </Link>
            <Link to="/sale/payment-in">
              <SidebarSubItem text="Payment In" isActive={location.pathname === '/sale/payment-in'} hasPlus />
            </Link>
            <Link to="/sale/sale-order">
              <SidebarSubItem text="Sale Order" isActive={location.pathname === '/sale/sale-order'} hasPlus />
            </Link>
            <Link to="/sale/delivery-challan">
              <SidebarSubItem text="Delivery Challan" isActive={location.pathname === '/sale/delivery-challan'} hasPlus />
            </Link>
            <Link to="/sale/sale-return-credit-note">
              <SidebarSubItem text="Sale Return/ Credit Note" isActive={location.pathname === '/sale/sale-return-credit-note'} hasPlus />
            </Link>
            <Link to="/sale/vyapar-pos">
              <SidebarSubItem text="Billing-Baba POS" isActive={location.pathname === '/sale/vyapar-pos'} />
            </Link>
          </div>
        </div>
        
        <SidebarItem icon={<ShoppingCart size={20} />} text="Purchase & Expense" hasDropdown />
        <SidebarItem icon={<BarChart2 size={20} />} text="Grow Your Business" hasDropdown />
        
        <div>
          <SidebarItem icon={<ShoppingBag size={20} />} text="Cash & Bank" hasDropdown />
          <div className="pl-8 bg-[#151729]">
            <Link to="/bank-accounts">
              <SidebarSubItem text="Bank Accounts" isActive={location.pathname === '/bank-accounts'} hasPlus />
            </Link>
            <Link to="/cash-in-hand">
              <SidebarSubItem text="Cash In Hand" isActive={location.pathname === '/cash-in-hand'} hasPlus />
            </Link>
            <Link to="/cheques">
              <SidebarSubItem text="Cheques" isActive={location.pathname === '/cheques'} />
            </Link>
            <Link to="/loan-accounts">
              <SidebarSubItem text="Loan Accounts" isActive={location.pathname === '/loan-accounts'} hasPlus />
            </Link>
          </div>
        </div>

        <SidebarItem icon={<PieChart size={20} />} text="Reports" />
        <SidebarItem icon={<Repeat size={20} />} text="Sync, Share & Backup" hasDropdown />
        <SidebarItem icon={<Settings size={20} />} text="Utilities" hasDropdown />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<CreditCard size={20} />} text="Plans & Pricing" />
      </div>
      
      <div className="mt-auto p-4 border-t border-[#2d3052]">
        <button className="text-white w-full flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2 text-[#1a1d37] text-xs">M</span>
            <span>My Company</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  hasDropdown?: boolean;
  hasPlus?: boolean;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, hasDropdown, hasPlus, isActive }) => {
  return (
    <div className={`flex items-center justify-between px-4 py-3 hover:bg-[#2d3052] cursor-pointer ${isActive ? 'bg-[#2d3052]' : ''}`}>
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </div>
      {hasDropdown && <ChevronRight size={16} />}
      {hasPlus && <span className="text-lg font-bold">+</span>}
    </div>
  );
};

interface SidebarSubItemProps {
  text: string;
  hasPlus?: boolean;
  isActive?: boolean;
}

const SidebarSubItem: React.FC<SidebarSubItemProps> = ({ text, hasPlus, isActive }) => {
  return (
    <div className={`flex items-center justify-between py-2 px-4 hover:bg-[#2d3052] cursor-pointer ${isActive ? 'bg-[#2d3052]' : ''}`}>
      <span className="text-sm">{text}</span>
      {hasPlus && <span className="text-lg font-bold">+</span>}
    </div>
  );
};

export default Sidebar;