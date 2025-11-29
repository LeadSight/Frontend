import { Plus } from "lucide-react";
import DemographyCard from "../demography/DemographyCard";
import NoteList from "../notes/NoteList";
import Button from "../ui/Button";

// Tambahkan prop 'hideNotes' dengan default false
const ExpandedRowContent = ({
  customer,
  onAddNote,
  onEditNote,
  onDeleteNote,
  hideNotes = false,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-inner">
      <div className="flex items-start justify-between mb-3 gap-6">
        {/* LOGIKA: Jika hideNotes = false, maka tampilkan Sales Notes. Jika true, hilangkan. */}
        {!hideNotes && (
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
        )}

        {/* LOGIKA POSISI: Jika notes hilang, container jadi full width dan rata kanan (justify-end) */}
        <div className={hideNotes ? "w-full flex justify-end" : "w-80"}>
          <div className="w-80">
            <DemographyCard customer={customer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedRowContent;
