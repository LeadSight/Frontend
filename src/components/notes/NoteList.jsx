import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const NoteList = ({ notes, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4 italic">
        No notes available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map(note => (
        <div 
          key={note.id}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-800">{note.title}</h4>
            <div className="flex space-x-2">
              <Button
                onClick={() => onEdit(note)}
                variant="ghost"
                size="xs"
                icon={<Edit className="w-4 h-4" />}
                title="Edit Note"
              />
              <Button
                onClick={() => onDelete(note.id)}
                variant="ghost"
                size="xs"
                icon={<Trash2 className="w-4 h-4" />}
                className="text-red-600 hover:text-red-800"
                title="Delete Note"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{note.content}</p>
          <div className="text-xs text-gray-400">
            {note.createdAt} | Created by: {note.createdBy}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;