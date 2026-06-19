import { FiAlertTriangle, FiX } from "react-icons/fi";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--theme-bg-card)] border-2.5 border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] w-full max-w-sm animate-in fade-in zoom-in duration-200 rounded-2xl overflow-hidden">
        <div className="border-b-2 border-[var(--theme-border)] p-4 flex items-center justify-between bg-[var(--theme-bg-workspace)]">
          <div className="flex items-center gap-1.5 text-[var(--theme-text-primary)] font-heading font-extrabold text-sm">
            <FiAlertTriangle size={16} className="text-amber-500" />
            <span>Confirm Deletion</span>
          </div>
          <button onClick={onClose} className="text-[var(--theme-text-secondary)] hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1 transition-colors rounded-md cursor-pointer border border-transparent hover:border-black">
            <FiX size={16} />
          </button>
        </div>
        
        <div className="p-5">
          <h4 className="text-base font-heading font-extrabold text-[var(--theme-text-primary)] mb-2">
            Are you absolutely sure?
          </h4>
          <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] mb-6 font-sans font-semibold leading-relaxed">
            This action cannot be undone. This will permanently delete {itemName ? <span className="font-heading font-extrabold text-[var(--tag-pink-text)] bg-[var(--tag-pink-bg)] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_black]">"{itemName}"</span> : "this record"} from the database.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 neo-brutal-btn bg-white hover:bg-[var(--tag-gray-bg)] py-2 text-xs"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 neo-brutal-btn bg-[var(--tag-red-bg)] text-[var(--tag-red-text)] py-2 text-xs"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
