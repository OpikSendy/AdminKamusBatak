import React from 'react';
import { X, Upload } from 'lucide-react';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-orange-600 rounded-full mr-3"></div>
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white hover:bg-opacity-70 rounded-full transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)] bg-gradient-to-br from-gray-50 to-white">
          {children}
        </div>
      </div>
    </div>
  );
};


export default Modal;