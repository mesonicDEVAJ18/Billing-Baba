import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const routeOptions = [
  { label: 'Home', path: '/' },
  { label: 'Party Details', path: '/parties/details' },
  { label: 'Smart Connect', path: '/parties/smart-connect' },
  { label: 'Network', path: '/parties/network' },
  { label: 'Sale', path: '/sale' },
  { label: 'Items', path: '/items' },
  { label: 'Purchase & Expense', path: '/purchase-expense' },
  { label: 'Cash & Bank', path: '/cash-bank' },
  { label: 'Reports', path: '/reports' },
  { label: 'My Company', path: '/mycompany' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRoutes = routeOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-[230px] bg-[#1a1d37] text-white flex flex-col h-screen">
      {/* Search */}
      <div className="px-4 pt-4 relative z-10">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm mb-2 text-gray-800"
        />

        {searchQuery && (
          <div className="bg-white border rounded-md shadow-md max-h-40 overflow-y-auto absolute w-full left-4 right-4">
            {filteredRoutes.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No matches found</div>
            ) : (
              filteredRoutes.map((route) => (
                <div
                  key={route.path}
                  onClick={() => {
                    navigate(route.path);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                >
                  {route.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
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

        <Link to="/sale">
          <SidebarItem icon={<CreditCard size={20} />} text="Sale" isActive={location.pathname === '/sale'} />
        </Link>

        <Link to="/items">
          <SidebarItem icon={<Package size={20} />} text="Items" isActive={location.pathname === '/items'} hasPlus />
        </Link>

        <Link to="/purchase-expense">
          <SidebarItem icon={<ShoppingCart size={20} />} text="Purchase & Expense" isActive={location.pathname === '/purchase-expense'} hasDropdown />
        </Link>

        <SidebarItem icon={<BarChart2 size={20} />} text="Grow Your Business" hasDropdown />

        <Link to="/cash-bank">
          <SidebarItem icon={<ShoppingBag size={20} />} text="Cash & Bank" isActive={location.pathname === '/cash-bank'} hasDropdown />
        </Link>

        <Link to="/reports">
          <SidebarItem icon={<PieChart size={20} />} text="Reports" isActive={location.pathname === '/reports'} />
        </Link>

        <SidebarItem icon={<Repeat size={20} />} text="Sync, Share & Backup" hasDropdown />
        <SidebarItem icon={<Settings size={20} />} text="Utilities" hasDropdown />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<CreditCard size={20} />} text="Plans & Pricing" />
        
        <Link to="/mycompany">
          <SidebarItem icon={<Home size={20} />} text="My Company" isActive={location.pathname === '/mycompany'} />
        </Link>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.phone}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#2d3052] rounded-md transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
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