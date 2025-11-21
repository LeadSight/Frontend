import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import NoteList from '../notes/NoteList';
import DemographyCard from '../demography/DemographyCard';

const ExpandedRowContent = ({ customer, onAddNote, onEditNote, onDeleteNote }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-inner">
      <div className="flex items-start justify-between mb-3 gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Sales Notes</h3>
            <Button
              onClick={() => onAddNote(customer)}
              variant="default"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>
          <NoteList
            notes={customer.notes || []}
            onEdit={(note) => onEditNote(customer, note)}
            onDelete={(noteId) => onDeleteNote(customer.id, noteId)}
          />
        </div>

        <div className="w-80">
          <DemographyCard customer={customer} />
        </div>
      </div>
    </div>
  );
};

export default ExpandedRowContent;