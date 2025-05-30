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
  ChevronRight
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

          <Link to="/Sale">
          <SidebarItem icon={<Home size={20} />} text="Sale" isActive={location.pathname === '/'} />
        </Link>
        </div>

        <SidebarItem icon={<Package size={20} />} text="Items" hasPlus />
        {/* <SidebarItem icon={<CreditCard size={20} />} text="Sale" hasDropdown /> */}
        <SidebarItem icon={<ShoppingCart size={20} />} text="Purchase & Expense" hasDropdown />
        <SidebarItem icon={<BarChart2 size={20} />} text="Grow Your Business" hasDropdown />
        <SidebarItem icon={<ShoppingBag size={20} />} text="Cash & Bank" hasDropdown />
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