import React, { useState, useMemo, useEffect } from 'react';
import { initialCustomers } from '../../data/initialData';
import NoteModal from '../notes/NoteModal';
import CustomerTableView from './CustomerTableView';
import Pagination from '../common/Pagination';
import SearchBar from "../common/SearchBar";
import FilterButton from "../filter/FilterButton";
import FilterPanel from "../filter/FilterPanel";
import { logActivity } from '../utils/activityLogger';

const CustomerTable = () => {
  const STORAGE_KEY = 'leadsight_customers_v1';

  const [customers, setCustomers] = useState(() => {
    // Load from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // if originalRank present, assume data was previously built
          const hasRank = parsed.every(c => typeof c.originalRank === 'number');
          if (hasRank) return parsed;
          // otherwise compute originalRank mapping from initialCustomers
          const ranking = [...initialCustomers].sort((a, b) => {
            const pa = parseInt(a.probability.replace('%', '')) || 0;
            const pb = parseInt(b.probability.replace('%', '')) || 0;
            return pb - pa;
          });
          const rankMap = {};
          ranking.forEach((c, i) => { rankMap[c.id] = i + 1; });
          return parsed.map(c => ({ ...c, originalRank: rankMap[c.id] ?? null }));
        }
      }
    } catch {
      // ignore and fall back to initialCustomers
    }

    // fallback: attach originalRank based on initial probability ordering (highest = rank 1)
    const copy = [...initialCustomers];
    copy.sort((a, b) => {
      const pa = parseInt(a.probability.replace('%', '')) || 0;
      const pb = parseInt(b.probability.replace('%', '')) || 0;
      return pb - pa;
    });
    return copy.map((c, i) => ({ ...c, originalRank: i + 1 }));
  });

  // persist to localStorage whenever changing
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (err) {
      // ignore storage errors
      console.warn('Failed to persist customers to localStorage', err);
    }
  }, [customers]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({ rank: null, probabilityRanges: [], categories: [], ageRanges: [], balanceSort: null, hasDeposit: null, hasLoan: null });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const MAX_TITLE_LENGTH = 350;

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    const matchesSearch = (customer) =>
      searchTerm === '' ||
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = (customer) => {
      if (!filters.categories || filters.categories.length === 0) return true;
      return filters.categories.includes(customer.category);
    };

    const probabilityValue = (customer) => parseInt(customer.probability.replace('%', '')) || 0;

    const matchesProbability = (customer) => {
      if (!filters.probabilityRanges || filters.probabilityRanges.length === 0) return true;
      const val = probabilityValue(customer);
      return filters.probabilityRanges.some(range => {
        if (range === '<10%') return val < 10;
        if (range === '10%-30%') return val >= 10 && val <= 30;
        if (range === '30%-50%') return val >= 30 && val <= 50;
        if (range === '50%-70%') return val >= 50 && val <= 70;
        if (range === '70%-90%') return val >= 70 && val <= 90;
        if (range === '>90%') return val > 90;
        return false;
      });
    };

    const matchesAge = (customer) => {
      if (!filters.ageRanges || filters.ageRanges.length === 0) return true;
      const age = customer.age || 0;
      return filters.ageRanges.some(range => {
        if (range === '<30 yo') return age < 30;
        if (range === '30-50 yo') return age >= 30 && age <= 50;
        if (range === '50-70 yo') return age >= 50 && age <= 70;
        if (range === '>70 yo') return age > 70;
        return false;
      });
    };

    const filtered = customers.filter(customer =>
      matchesSearch(customer) &&
      matchesCategory(customer) &&
      matchesProbability(customer) &&
      matchesAge(customer) &&

      // hasDeposit filter
      (filters.hasDeposit == null || customer.hasDeposit === filters.hasDeposit) &&
      // hasLoan filter
      (filters.hasLoan == null || customer.hasLoan === filters.hasLoan)
    );

    // Choose sorting based on rank or balanceSort preference
    const comparator = (a, b) => {
      // If rank filter is set, sort by originalRank (preserve original numbering)
      if (filters.rank === 'lowest') return b.originalRank - a.originalRank; // show bottom ranks first
      if (filters.rank === 'highest') return a.originalRank - b.originalRank; // show top ranks first

      // If balanceSort specified, sort by probability value
      if (filters.balanceSort === 'lowest') return probabilityValue(a) - probabilityValue(b);
      if (filters.balanceSort === 'highest') return probabilityValue(b) - probabilityValue(a);

      // Default: sort by probability descending (highest first)
      return probabilityValue(b) - probabilityValue(a);
    };

    return filtered.sort(comparator);
  }, [customers, searchTerm, filters]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const itemsPerPageOptions = useMemo(() => {
    const total = filteredCustomers.length;
    const opts = [];
    for (let n = 10; n <= 100; n += 10) opts.push(n);
    if (total > 0 && !opts.includes(total)) opts.push(total);
    return opts;
  }, [filteredCustomers.length]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleRow = (customerId) => {
    const next = expandedRow === customerId ? null : customerId;
    setExpandedRow(next);
    logActivity('row_toggled', { customerId, open: next !== null });
  };

  // **Add Note Handler**
  const handleAddNote = (customer) => {
    setSelectedCustomer(customer);
    setShowNoteModal(true);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  // **Edit Note Handler**
  const handleEditNote = (customer, note) => {
    setSelectedCustomer(customer);
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowNoteModal(true);
  };

  // **Delete Note Handler**
  const handleDeleteNote = (customerId, noteId) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          notes: customer.notes.filter(note => note.id !== noteId)
        };
      }
      return customer;
    }));
    logActivity('note_deleted', { customerId, noteId });
  };

  // **Save Note Handler**
  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote = {
      id: editingNote ? editingNote.id : +new Date(),
      title: noteTitle,
      content: noteContent,
      createdAt: new Date().toLocaleString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      createdBy: 'Sales Name'
    };

    setCustomers(customers.map(customer => {
      if (customer.id === selectedCustomer.id) {
        if (editingNote) {
          return {
            ...customer,
            notes: customer.notes.map(note =>
              note.id === editingNote.id ? newNote : note
            )
          };
        }
        return { ...customer, notes: [...customer.notes, newNote] };
      }
      return customer;
    }));

    // log note add/edit
    logActivity(editingNote ? 'note_edited' : 'note_added', { customerId: selectedCustomer.id, note: newNote });

    setShowNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  // apply filters when FilterPanel calls onApply
  const handleApplyFilters = (appliedFilters) => {
    const f = appliedFilters || { rank: null, probabilityRanges: [], categories: [], ageRanges: [], balanceSort: null, hasDeposit: null, hasLoan: null };
    setFilters(f);
    setShowFilterPanel(false);
    setCurrentPage(1);

    // detect reset by checking minimal/default shape
    const defaultShape = { rank: null, probabilityRanges: [], categories: [], ageRanges: [], balanceSort: null, hasDeposit: null, hasLoan: null };
    const isReset = JSON.stringify(f) === JSON.stringify(defaultShape);
    logActivity(isReset ? 'filter_reset' : 'filter_applied', { filters: f });
  };

  return (
    <div className="flex-1">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan nama atau ID customer..."
          />
        </div>
        <FilterButton onClick={() => { setShowFilterPanel(true); logActivity('filter_open', {}); }} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cust. ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cust. Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Loan</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deposite</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Default</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Probability Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>

          <CustomerTableView
            customers={currentCustomers}
            startIndex={startIndex}
            expandedRow={expandedRow}
            onToggleRow={toggleRow}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
          totalItems={filteredCustomers.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(e) => setItemsPerPage(Number(e.target.value))}
        />
      </div>

      <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      {/* Note Modal */}
      <NoteModal
        show={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setNoteTitle('');
          setNoteContent('');
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        editingNote={editingNote}
        maxLength={MAX_TITLE_LENGTH}
      />
    </div>
  );
};

export default CustomerTable;
