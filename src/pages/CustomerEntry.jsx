import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import CustomerEntryContainer from '../components/customer/CustomerEntryContainer';
import ScrollToTop from '../components/ui/ScrollToTop';

const CustomerEntry = () => (
  <div className="min-h-screen bg-white">
    <Navbar />

    <div className="flex flex-col lg:flex-row gap-8 p-6">
      <Sidebar />
        <div className="flex-1 lg:ml-56 min-w-0">
        <CustomerEntryContainer />
      </div>
    </div>

    <ScrollToTop />
  </div>
);

export default CustomerEntry;
