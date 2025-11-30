import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import CustomerTableContainer from '../components/common/CustomerTableContainer';
import ScrollToTop from '../components/ui/ScrollToTop';

const Promotion = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col lg:flex-row gap-8 p-6">
        <Sidebar />
        <div className="flex-1 lg:ml-56">
          <CustomerTableContainer />
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Promotion;