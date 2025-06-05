import React from 'react';
// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-red-600 rounded-full animate-spin"></div>
      <div className="absolute top-2 left-2 w-16 h-16 border-4 border-orange-200 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
    </div>
    <p className="mt-6 text-gray-700 font-bold text-lg">Memuat data budaya Batak...</p>
    <div className="mt-2 flex space-x-1">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
    </div>
  </div>
);

export default LoadingSpinner;