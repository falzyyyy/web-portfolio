import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import { FiX, FiCheck } from "react-icons/fi";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspect?: number;
}

export default function ImageCropperModal({ isOpen, imageSrc, onClose, onCropComplete, aspect = 1 }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteAction = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
        if (croppedImageBlob) {
          onCropComplete(croppedImageBlob);
        }
      } catch (e) {
        console.error("Failed to crop image", e);
      }
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="bg-[var(--theme-bg-card)] border-2.5 border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] w-full max-w-xl flex flex-col max-h-[85vh] rounded-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-[var(--theme-border)] bg-[var(--theme-bg-workspace)]">
          <h2 className="text-sm font-heading font-extrabold text-[var(--theme-text-primary)]">Crop Image</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent hover:border-black transition-all rounded-md text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[40vh] sm:h-[45vh] bg-zinc-100 dark:bg-zinc-900 border-b-2 border-[var(--theme-border)]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteAction}
            onZoomChange={setZoom}
            style={{
              containerStyle: { backgroundColor: '#f9f9f9' },
              cropAreaStyle: { border: '2.5px solid var(--theme-border)' }
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-[var(--theme-bg-card)] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full flex items-center gap-3">
            <label className="text-xs font-mono font-bold text-[var(--theme-text-secondary)] uppercase">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[var(--notion-blue)]"
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] py-2 text-xs flex items-center justify-center gap-1.5"
          >
            <FiCheck size={14} /> 
            <span>Apply Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
