import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import CustomerTableContainer from '../components/common/CustomerTableContainer';

const Promotion = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex gap-8 p-5">
        <Sidebar />
        <CustomerTableContainer />
      </div>
    </div>
  );
};

export default Promotion;