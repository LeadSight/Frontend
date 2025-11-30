import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import DashboardContainer from '../components/dashboard/DashboardContainer';
import ScrollToTop from '../components/ui/ScrollToTop';

const Dashboard = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
    <Navbar />

      <div className="flex flex-col lg:flex-row gap-8 p-6">
      <Sidebar />
      <div className="flex-1 lg:ml-56 min-w-0">
        <DashboardContainer />
      </div>
    </div>

    <ScrollToTop />
  </div>
);

export default Dashboard;
