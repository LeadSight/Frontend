import React, { useEffect, useState } from 'react';
import TablePromotion from '../components/common/TablePromotion';
import { initialCustomers } from '../data/initialData';
import NoteModal from '../components/notes/NoteModal';
import NoteList from '../components/notes/NoteList';
import DemographyCard from '../components/demography/DemographyCard';
import Navbar from '../components/layout/Navbar';
import { Plus } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import FilterButton from '../components/filter/FilterButton';
import FilterPanel from '../components/filter/FilterPanel';

const STORAGE_KEY = 'leadsight_customers_v1';

const Promotion = () => {
  const [customers, setCustomers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    // fallback: attach originalRank based on initial probability ordering
    const copy = [...initialCustomers];
    copy.sort((a, b) => {
      const pa = parseInt(a.probability.replace('%', '')) || 0;
      const pb = parseInt(b.probability.replace('%', '')) || 0;
      return pb - pa;
    });
    return copy.map((c, i) => ({ ...c, originalRank: i + 1 }));
  });

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(customers)); } catch { /* ignore */ }
  }, [customers]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({ rank: null, probabilityRanges: [], categories: [], ageRanges: [], balanceSort: null, hasDeposit: null, hasLoan: null });

  const filteredCustomers = React.useMemo(() => {
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
      (filters.hasDeposit == null || customer.hasDeposit === filters.hasDeposit) &&
      (filters.hasLoan == null || customer.hasLoan === filters.hasLoan)
    );

    const comparator = (a, b) => {
      if (filters.rank === 'lowest') return b.originalRank - a.originalRank;
      if (filters.rank === 'highest') return a.originalRank - b.originalRank;
      if (filters.balanceSort === 'lowest') return probabilityValue(a) - probabilityValue(b);
      if (filters.balanceSort === 'highest') return probabilityValue(b) - probabilityValue(a);
      return probabilityValue(b) - probabilityValue(a);
    };

    return filtered.sort(comparator);
  }, [customers, searchTerm, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const itemsPerPageOptions = (() => {
    const total = filteredCustomers.length;
    // generate clean multiples of 10 from 10 up to 100
    const options = [];
    for (let n = 10; n <= 100; n += 10) options.push(n);
    // include a final 'All' option (the total) so users can select to show everything
    if (total > 0 && !options.includes(total)) options.push(total);
    return options;
  })();

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // notes viewer state removed (inline viewer implemented)
  const [expandedRow, setExpandedRow] = useState(null);

  const openAddNote = (customer) => {
    setSelectedCustomer(customer);
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(true);
  };

  const openViewNotes = (customer) => {
    // toggle inline expanded row under the customer
    if (expandedRow === customer.id) {
      setExpandedRow(null);
      setSelectedCustomer(null);
    } else {
      setExpandedRow(customer.id);
      setSelectedCustomer(customer);
    }
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim() || !selectedCustomer) return;
    const newNote = {
      id: editingNote ? editingNote.id : +new Date(),
      title: noteTitle,
      content: noteContent,
      createdAt: new Date().toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdBy: 'Sales Name'
    };

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomer.id) {
        const notes = editingNote ? c.notes.map(n => n.id === editingNote.id ? newNote : n) : [...(c.notes || []), newNote];
        return { ...c, notes };
      }
      return c;
    }));

    setShowNoteModal(false);
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleEditNote = (note) => {
    if (!selectedCustomer) return;
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowNoteModal(true);
  };

  const handleDeleteNote = (noteId) => {
    if (!selectedCustomer) return;
    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) } : c));
  };

  // Filter panel handlers
  const handleApplyFilters = (appliedFilters) => {
    const f = appliedFilters || { rank: null, probabilityRanges: [], categories: [], ageRanges: [], balanceSort: null, hasDeposit: null, hasLoan: null };
    setFilters(f);
    setShowFilterPanel(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex gap-4 p-8">
        <Sidebar />

        <div className="flex-1">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Promotion</h1>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <SearchBar value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search customers..." />
                  </div>
                  <div>
                    <FilterButton onClick={() => setShowFilterPanel(true)} />
                  </div>
                </div>

                <TablePromotion
                  data={currentCustomers}

                  onAddNote={(c) => openAddNote(c)}
                  onView={(c) => openViewNotes(c)}
                  expandedRow={expandedRow}
                  renderExpanded={(row) => (
                    <div className="bg-white rounded-lg p-4 shadow-inner">
                      <div className="flex items-start justify-between mb-3 gap-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">Sales Notes</h3>
                            <button
                              onClick={() => openAddNote(row)}
                              className="text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add</span>
                            </button>
                          </div>
                          <NoteList
                            notes={row.notes || []}
                            onEdit={(note) => { setSelectedCustomer(row); handleEditNote(note); }}
                            onDelete={(noteId) => { setSelectedCustomer(row); handleDeleteNote(noteId); }}
                          />
                        </div>

                        <div className="w-80">
                          <DemographyCard customer={row} />
                        </div>
                      </div>
                    </div>
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
                  onPageChange={(p) => setCurrentPage(p)}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline expanded row will be rendered by TablePromotion via renderExpanded */}

      <NoteModal
        show={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleSaveNote}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        editingNote={editingNote}
      />

      <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default Promotion;
