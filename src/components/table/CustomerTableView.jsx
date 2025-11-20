import React from 'react';
import { Plus, Eye } from 'lucide-react';
import ProbabilityScore from '../table/ProbabilityScore';
import NoteList from '../notes/NoteList';
import DemographyCard from '../demography/DemographyCard';

const CustomerTableView = ({
  customers,
  startIndex,
  expandedRow,
  onToggleRow,
  onAddNote,
  onEditNote,
  onDeleteNote
}) => {
  if (customers.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
            No matching customer data
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {customers.map((customer, index) => (
        <React.Fragment key={customer.id}>
          <tr className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
            <td className="px-4 py-4 text-sm">{customer.originalRank ?? (startIndex + index + 1)}</td>
            <td className="px-4 py-4 text-sm font-medium text-purple-600">{customer.customerId}</td>
            <td className="px-4 py-4 text-sm font-medium">{customer.customerName}</td>
            <td className="px-4 py-4 text-sm">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                ${customer.hasLoan === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {customer.hasLoan}
              </span>
            </td>
            <td className="px-4 py-4 text-sm">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                ${customer.hasDeposit === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {customer.hasDeposit}
              </span>
            </td>
            <td className="px-4 py-4 text-sm">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                ${customer.hasDefault === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {customer.hasDefault}
              </span>
            </td>
            <td className="px-4 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    customer.category === 'Priority' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                    {customer.category}
                </span>
            </td>
            <td className="px-4 py-4">
              <ProbabilityScore percentage={customer.probability} />
            </td>
            <td className="px-4 py-4">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onAddNote(customer); }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Add Note"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleRow(customer.id); }}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="View Notes"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          
          {expandedRow === customer.id && (
            <tr className="bg-gray-50">
              <td colSpan="9" className="px-4 py-4">
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <div className="flex items-start justify-between mb-3 gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">Sales Notes</h3>
                        <button
                          onClick={() => onAddNote(customer)}
                          className="text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                      <NoteList
                        notes={customer.notes}
                        onEdit={(note) => onEditNote(customer, note)}
                        onDelete={(noteId) => onDeleteNote(customer.id, noteId)}
                      />
                    </div>

                    <div className="w-80">
                      <DemographyCard customer={customer} />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
};

export default CustomerTableView;
