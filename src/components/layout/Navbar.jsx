import React from "react";
import { LogOut } from "lucide-react";
import { motion as Motion } from 'framer-motion';
import logo from '../../assets/picture/LeadSightLogo.png';

const Navbar = () => {
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
        <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Dashboard
        </button>

        <button className="text-black-600 font-bold border-b-2 border-purple-600 pb-1">
          Promotion
        </button>

        <div className="flex items-center space-x-3 border-l pl-4 cursor-pointer group">
          <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
            <span className="text-white font-semibold">SN</span>
          </div>

          <div className="text-left">
            <div className="font-semibold text-sm group-hover:text-purple-700 transition-colors">Sales Name</div>
            <div className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors">Sales@gmail.com</div>
          </div>

          <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;