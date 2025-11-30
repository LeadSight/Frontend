import { useState } from 'react';
import { logActivity } from '../components/utils/activityLogger';

export const useNoteManager = (customers, setCustomers) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAddNote = (customer) => {
    setSelectedCustomer(customer);
    setShowNoteModal(true);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  const handleEditNote = (customer, note) => {
    setSelectedCustomer(customer);
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowNoteModal(true);
  };

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

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim() || !selectedCustomer) return;

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
        return { ...customer, notes: [...(customer.notes || []), newNote] };
      }
      return customer;
    }));

    logActivity(editingNote ? 'note_edited' : 'note_added', { 
      customerId: selectedCustomer.id, 
      note: newNote 
    });

    setShowNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  return {
    showNoteModal,
    noteTitle,
    setNoteTitle,
    noteContent,
    setNoteContent,
    editingNote,
    selectedCustomer,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleSaveNote,
    closeNoteModal
  };
};