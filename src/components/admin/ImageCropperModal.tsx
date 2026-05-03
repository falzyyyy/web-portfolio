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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--theme-bg)] border-[4px] border-[var(--theme-border)] shadow-[8px_8px_0px_0px_var(--theme-border)] w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-[4px] border-[var(--theme-border)] bg-[var(--neo-cyan)]">
          <h2 className="text-xl font-black uppercase">Crop Image</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--neo-pink)] border-2 border-transparent hover:border-[var(--theme-border)] transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteAction}
            onZoomChange={setZoom}
            style={{
              containerStyle: { backgroundColor: '#f0f0f0' },
              cropAreaStyle: { border: '4px solid var(--theme-border)' }
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t-[4px] border-[var(--theme-border)] bg-[var(--theme-bg-card)] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full flex items-center gap-4">
            <label className="font-bold uppercase text-sm">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--neo-purple)]"
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto bg-[var(--neo-yellow)] font-black uppercase px-6 py-2 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <FiCheck size={18} /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
