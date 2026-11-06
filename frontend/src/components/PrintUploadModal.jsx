import React from 'react';
import PrintStudio from './PrintStudio';

export default function PrintUploadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto">
        <PrintStudio isModal={true} onClose={onClose} />
      </div>
    </div>
  );
}
