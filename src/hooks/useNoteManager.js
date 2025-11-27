import { useState } from 'react';
import { logActivity } from '../components/utils/activityLogger';
import { useAuth } from './useAuth';
import { addNote, editNote, deleteNote } from '../api/api';

export const useNoteManager = (customers, setCustomers) => {
  const { user, token } = useAuth();
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
    setNoteContent(note.body);
    setShowNoteModal(true);
  };

  const handleDeleteNote = async (customerId, noteId) => {
    await deleteNote(token, noteId);
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

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim() || !selectedCustomer) return;

    const newNote = {
      title: noteTitle,
      body: noteContent,
      createdAt: new Date().toISOString(),
      customerId: selectedCustomer.id,
      sales: user,
    };

    if (editingNote) {
      await editNote(token, editingNote.id, newNote);
    } else {
      await addNote(token, newNote);
    }

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