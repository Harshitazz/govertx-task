// src/components/Modal.js
import React from 'react';

const Modal = ({ credits, onClose, message }) => {
  return (
<div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm w-full h-full flex justify-center items-center  bg-opacity-80 z-50"
      onClick={onClose} // Close modal when clicking outside
    >      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-green-600 text-2xl font-bold">🎉 +{credits} Credits!</h2>
        <p className="mt-2">{message}</p>
        
      </div>
    </div>
  );
};

export default Modal;
