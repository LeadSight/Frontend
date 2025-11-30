import React from 'react';
import TableBase from './TableBase';
import ProbabilityScore from '../table/ProbabilityScore';
import { Plus, Eye } from 'lucide-react';

const TablePromotion = ({ data = [], onRowClick, onAddNote, onView, expandedRow = null, renderExpanded = null }) => {
  const columns = [
    { key: 'originalRank', label: 'Rank', headerClassName: 'text-center w-14', cellClassName: 'text-center w-14', render: (r) => <div className="text-center font-semibold">{r.originalRank ?? '-'}</div> },
    { key: 'customerId', label: 'Cust.ID', headerClassName: 'w-28 text-center', cellClassName: 'w-28 text-center' },
    { key: 'customerName', label: 'Cust.Name', headerClassName: 'text-left', cellClassName: 'text-left' },
    { key: 'hasLoan', label: 'Loan', headerClassName: 'w-20 text-center', cellClassName: 'w-20 text-center', render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${r.hasLoan === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{r.hasLoan}</span> },
    { key: 'hasDeposit', label: 'Deposite', headerClassName: 'w-20 text-center', cellClassName: 'w-20 text-center', render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${r.hasDeposit === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{r.hasDeposit}</span> },
    { key: 'housing', label: 'Housing', headerClassName: 'w-20 text-center', cellClassName: 'w-20 text-center', render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${r.housing === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{r.housing === 'yes' ? 'Yes' : 'No'}</span> },
    { key: 'hasDefault', label: 'Default', headerClassName: 'w-20 text-center', cellClassName: 'w-20 text-center', render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${r.hasDefault === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{r.hasDefault}</span> },
    { key: 'category', label: 'Category', headerClassName: 'w-28 text-center', cellClassName: 'w-28 text-center', render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${r.category === 'Priority' ? 'bg-purple-200 text-purple-800 border border-purple-200' : 'bg-gray-100 text-gray-600'}`}>{r.category}</span> },
    // Make the Probability column wide enough and prevent wrapping so the label and content stay on one line
    { key: 'probability', label: 'Probability Score', headerClassName: 'w-44 whitespace-nowrap', cellClassName: 'w-44 whitespace-nowrap overflow-visible max-w-none', render: (r) => <ProbabilityScore percentage={r.probability} /> },
    { key: 'action', label: 'Action', headerClassName: 'w-28 text-center', cellClassName: 'w-28 text-center', render: (r) => (
      <div className="flex space-x-2">
        <button onClick={(e) => { e.stopPropagation(); onAddNote && onAddNote(r); }} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" title="Add Note"><Plus className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); onView && onView(r); }} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
      </div>
    ) },
  ];

  return <TableBase columns={columns} data={data} rowKey={'id'} onRowClick={onRowClick} expandedRow={expandedRow} renderExpanded={renderExpanded} fit={true} />;
};

export default TablePromotion;
