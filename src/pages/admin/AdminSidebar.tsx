import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Users, PawPrint, Settings, LogOut, ShieldCheck, Megaphone, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-admin-primary text-white shadow-lg' : 'hover:bg-gray-200'
    }`;
  
  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r flex flex-col">
      <div className="h-20 flex items-center justify-center border-b">
        <Link to="/admin" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-admin-primary" />
            <span className="text-xl font-bold text-brand-dark tracking-tight">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin" end className={navLinkClasses}>
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/alerts" className={navLinkClasses}>
          <AlertTriangle className="h-5 w-5 mr-3" />
          Alerts
        </NavLink>
        <NavLink to="/admin/moderation" className={navLinkClasses}>
          <ShieldCheck className="h-5 w-5 mr-3" />
          Moderation
        </NavLink>
        <NavLink to="/admin/members" className={navLinkClasses}>
          <Users className="h-5 w-5 mr-3" />
          Members
        </NavLink>
         <NavLink to="/admin/posts" className={navLinkClasses}>
          <FileText className="h-5 w-5 mr-3" />
          Posts
        </NavLink>
        <NavLink to="/admin/advertising" className={navLinkClasses}>
          <Megaphone className="h-5 w-5 mr-3" />
          Advertising
        </NavLink>
         <NavLink to="/admin/policies" className={navLinkClasses}>
          <FileText className="h-5 w-5 mr-3" />
          Policies
        </NavLink>
        <NavLink to="/admin/pets" className={navLinkClasses}>
          <PawPrint className="h-5 w-5 mr-3" />
          Pets
        </NavLink>
        <NavLink to="/admin/settings" className={navLinkClasses}>
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </NavLink>
      </nav>
      <div className="p-4 border-t">
         <Link to="/" className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-md mb-2">
            Back to Main Site
         </Link>
         <button onClick={logout} className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-md">
            <LogOut size={16} className="mr-2"/> Logout
         </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;