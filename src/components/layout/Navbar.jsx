import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion as Motion } from 'framer-motion';
import logo from '../../assets/picture/LeadSightLogo.png';
import { logout } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    logoutUser();

    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white px-6 py-4 flex justify-between border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Motion.img
          src={logo}
          alt="LeadSight logo"
          className="w-10 h-10 object-contain"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />

        <Motion.span
          className="text-xl font-bold text-purple-600"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          LeadSight
        </Motion.span>
      </div>

      <div className="flex items-center space-x-6">
        <Link
          to="/dashboard"
          className={`transition-colors duration-200 ${
            isActive('/dashboard')
              ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/promotion"
          className={`transition-colors duration-200 ${
            isActive('/promotion')
              ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Promotion
        </Link>

        <div className="flex items-center space-x-3 border-l pl-4 group">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-purple-100/50">
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
              <span className="text-white font-semibold">SN</span>
            </div>

            <div className="text-left">
              <div className="font-semibold text-sm group-hover:text-purple-700 transition-colors">
                {user}
              </div>
              <div className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors">
                {user}
              </div>
            </div>
          </div>

          {/* Logout Button - Fit to Icon Only */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group/logout"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-500 group-hover/logout:text-orange-500 transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;