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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--theme-bg-card)] border-[4px] border-[var(--theme-border)] shadow-[8px_8px_0px_0px_var(--theme-border)] w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="bg-[var(--neo-pink)] border-b-[4px] border-[var(--theme-border)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1A1A1A] font-black uppercase tracking-wider text-xl">
            <FiAlertTriangle size={24} />
            <span>Warning!</span>
          </div>
          <button onClick={onClose} className="text-[#1A1A1A] hover:bg-black/10 p-1 transition-colors">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-xl font-black text-[#1A1A1A] mb-2 uppercase">
            Are you sure?
          </p>
          <p className="font-medium text-[var(--theme-text-secondary)] mb-8">
            This action cannot be undone. This will permanently delete {itemName ? <span className="font-bold text-[var(--neo-pink)] bg-gray-100 px-1">"{itemName}"</span> : "this item"} from your portfolio.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 font-black uppercase tracking-widest border-[3px] border-[var(--theme-border)] bg-gray-200 text-[#1A1A1A] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 font-black uppercase tracking-widest border-[3px] border-[var(--theme-border)] bg-[var(--neo-pink)] text-[#1A1A1A] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
