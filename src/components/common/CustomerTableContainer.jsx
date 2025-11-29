import React, { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import FilterButton from '../filter/FilterButton';
import FilterPanel from '../filter/FilterPanel';
import Pagination from './Pagination';
import TablePromotion from './TablePromotion';
import NoteModal from '../notes/NoteModal';
import ExpandedRowContent from './ExpandedRowContent';
import { useCustomers } from '../../hooks/useCustomers';
import { useCustomerFilters } from '../../hooks/useCustomerFilters';
import { useNoteManager } from '../../hooks/useNoteManager';
import { logActivity } from '../utils/activityLogger';

const CustomerTableContainer = () => {
  const { customers, setCustomers } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rank: null,
    probabilityRanges: [],
    categories: [],
    ageRanges: [],
    balanceSort: null,
    hasDeposit: null,
    hasLoan: null
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);

  const filteredCustomers = useCustomerFilters(customers, searchTerm, filters);

  const noteManager = useNoteManager(customers, setCustomers);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const itemsPerPageOptions = useMemo(() => {
    const total = filteredCustomers.length;
    const options = [];
    for (let n = 10; n <= 100; n += 10) options.push(n);
    if (total > 0 && !options.includes(total)) options.push(total);
    return options;
  }, [filteredCustomers.length]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters || {
      rank: null,
      probabilityRanges: [],
      categories: [],
      ageRanges: [],
      balanceSort: null,
      hasDeposit: null,
      hasLoan: null
    });
    setShowFilterPanel(false);
    setCurrentPage(1);

    const defaultShape = {
      rank: null,
      probabilityRanges: [],
      categories: [],
      ageRanges: [],
      balanceSort: null,
      hasDeposit: null,
      hasLoan: null
    };
    const isReset = JSON.stringify(appliedFilters) === JSON.stringify(defaultShape);
    logActivity(isReset ? 'filter_reset' : 'filter_applied', { filters: appliedFilters });
  };

  const toggleRow = (customerId) => {
    const next = expandedRow === customerId ? null : customerId;
    setExpandedRow(next);
    logActivity('row_toggled', { customerId, open: next !== null });
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan nama atau ID customer..."
          />
        </div>
        <FilterButton onClick={() => {
          setShowFilterPanel(true);
          logActivity('filter_open', {});
        }} />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <TablePromotion
          data={currentCustomers}
          onAddNote={noteManager.handleAddNote}
          onView={(customer) => toggleRow(customer.id)}
          expandedRow={expandedRow}
          renderExpanded={(row) => (
            <ExpandedRowContent
              customer={row}
              onAddNote={noteManager.handleAddNote}
              onEditNote={noteManager.handleEditNote}
              onDeleteNote={noteManager.handleDeleteNote}
            />
          )}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
          totalItems={filteredCustomers.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        />
      </div>

      <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      <NoteModal
        show={noteManager.showNoteModal}
        onClose={noteManager.closeNoteModal}
        onSave={noteManager.handleSaveNote}
        noteTitle={noteManager.noteTitle}
        setNoteTitle={noteManager.setNoteTitle}
        noteContent={noteManager.noteContent}
        setNoteContent={noteManager.setNoteContent}
        editingNote={noteManager.editingNote}
        maxLength={350}
      />
    </div>
  );
};

export default CustomerTableContainer;