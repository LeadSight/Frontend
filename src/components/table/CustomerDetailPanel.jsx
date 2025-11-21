import React from 'react';
import { X } from 'lucide-react';

const CustomerDetailPanel = ({ show, onClose, customer }) => {
  if (!show || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-[500px] h-full overflow-y-auto shadow-2xl animate-slideIn">
        
        {/* Header */}
        <div className="bg-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Customer ID</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">ID:</span>
              <span className="font-semibold">{customer.customerId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Name:</span>
              <span className="font-semibold">{customer.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Category:</span>
              <span className="px-3 py-1 bg-yellow-400 text-purple-900 rounded-full text-sm font-semibold">
                {customer.category}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Score:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: customer.probability }}
                  ></div>
                </div>
                <span className="font-bold">{customer.probability}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demografi Section */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Demografi</h3>
          <div className="space-y-3">
            <DetailRow label="Age" value={customer.age} />
            <DetailRow label="Job" value={customer.job} />
            <DetailRow label="Marital Status" value={customer.marital} />
            <DetailRow label="Education" value={customer.education} />
            <DetailRow label="Default" value={customer.default} status />
            <DetailRow label="Housing" value={customer.housing} status />
            <DetailRow label="Loan" value={customer.loan} status />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Informasi Komunikasi</h3>
          <div className="space-y-3">
            <DetailRow label="Contact" value={customer.contact} />
            <DetailRow label="Month" value={customer.month} />
            <DetailRow label="Day of Week" value={customer.day_of_week} />
            <DetailRow label="Duration (sec)" value={customer.duration} />
            <DetailRow label="Campaign" value={customer.campaign} />
            <DetailRow label="Pdays" value={customer.pdays} />
            <DetailRow label="Previous" value={customer.previous} />
            <DetailRow label="Poutcome" value={customer.poutcome} />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Indikator Ekonomi</h3>
          <div className="space-y-3">
            <DetailRow label="Emp. Var. Rate" value={customer.emp_var_rate} />
            <DetailRow label="Cons. Price Index" value={customer.cons_price_idx} />
            <DetailRow label="Cons. Conf. Index" value={customer.cons_conf_idx} />
            <DetailRow label="Euribor 3m" value={customer.euribor3m} />
            <DetailRow label="Nr. Employed" value={customer.nr_employed} />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Target Promosi</h3>
          <div className="space-y-3">
            <DetailRow label="Subscribed Deposit" value={customer.y} status />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, status }) => {
  const getStatusColor = (val) => {
    if (val === 'Yes' || val === 'Yes') return 'bg-green-100 text-green-700';
    if (val === 'no' || val === 'No') return 'bg-red-100 text-red-700';
    return '';
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      {status ? (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(value)}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm text-gray-800 font-semibold">{value}</span>
      )}
    </div>
  );
};

export default CustomerDetailPanel;