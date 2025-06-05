import React from 'react';
import { ChevronDown } from 'lucide-react'; 

// Di ItemCard.js DAN ItemsCard.js

const backgroundPatterns = {
  'pattern-1': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20l10-10v20zM10 10l10 10H0z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-2': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='30' r='4'/%3E%3Ccircle cx='60' cy='30' r='4'/%3E%3Ccircle cx='30' cy='0' r='4'/%3E%3Ccircle cx='30' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-3': `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M0 0h42L0 44V0zm1 1v18.586L19.586 1H1z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-4': `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M10 10l10 10-10 10V10zM0 10h10v10H0V10zm20 0h10v10H20V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-5': `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M18 18v18h18v-18zM0 18v18h18v-18z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-6': `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle fill-rule='evenodd' cx='22' cy='22' r='6'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-7': `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M32 0l32 32-32 32L0 32z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-8': `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm0 8c8.837 0 16 7.163 16 16s-7.163 16-16 16S8 32.837 8 24 15.163 8 24 8z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-9': `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`, // Tambahkan baris ini
};

// Enhanced ItemsCard Component
const ItemsCard = ({ item, onClick, itemCount = 0 }) => {
  const IconComponent = item.icon;
  
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-opacity-50 transition-all duration-700 cursor-pointer transform hover:-translate-y-3 hover:scale-105"
      style={{
        borderColor: `${item.accentColor === 'red' ? '#ef4444' : 
                       item.accentColor === 'emerald' ? '#10b981' :
                       item.accentColor === 'teal' ? '#14b8a6' :
                       item.accentColor === 'amber' ? '#f59e0b' :
                       item.accentColor === 'purple' ? '#8b5cf6' :
                       item.accentColor === 'orange' ? '#f97316' :
                       item.accentColor === 'slate' ? '#64748b' :
                       item.accentColor === 'indigo' ? '#6366f1' :
                       item.accentColor === 'cyan' ? '#03a9f4' :  '#6b7280'}20`
      }}
    >
      {/* Animated Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700"
        style={{
          backgroundImage: backgroundPatterns[item.bgPattern],
          backgroundSize: '30px 30px',
          animation: 'float 6s ease-in-out infinite'
        }}
      ></div>
      
      {/* Gradient Header */}
      <div className={`${item.color} p-8 relative overflow-hidden`}>
        {/* Large Background Icon */}
        <div className="absolute -top-4 -right-4 opacity-20 group-hover:opacity-30 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
          <IconComponent size={140} className="text-white" />
        </div>
        
        {/* Floating Accent Elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-white bg-opacity-40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-white bg-opacity-60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white bg-opacity-50 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl group-hover:bg-opacity-30 transition-all duration-500">
              <IconComponent size={32} className="text-white" />
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-white bg-opacity-25 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg group-hover:bg-opacity-35 transition-all duration-500">
                {itemCount}
              </span>
              <span className="text-white text-opacity-80 text-xs mt-1 font-medium">items</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-100 transition-colors duration-500">
            {item.label}
          </h3>
          <p className="text-white text-opacity-90 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
      
      {/* Enhanced Content */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-gray-600 text-sm font-medium">
            Kelola data {item.label.toLowerCase()}
          </div>
          <div className={`flex items-center font-bold text-sm group-hover:scale-110 transition-all duration-500 ${
            item.accentColor === 'red' ? 'text-red-600 group-hover:text-red-700' :
            item.accentColor === 'emerald' ? 'text-emerald-600 group-hover:text-emerald-700' :
            item.accentColor === 'teal' ? 'text-teal-600 group-hover:text-teal-700' :
            item.accentColor === 'amber' ? 'text-amber-600 group-hover:text-amber-700' :
            item.accentColor === 'purple' ? 'text-purple-600 group-hover:text-purple-700' :
            item.accentColor === 'orange' ? 'text-orange-600 group-hover:text-orange-700' :
            item.accentColor === 'slate' ? 'text-slate-600 group-hover:text-slate-700' :
            item.accentColor === 'indigo' ? 'text-indigo-600 group-hover:text-indigo-700' : 
            item.accentColor === 'cyan' ? 'text-cyan-600 group-hover:text-indigo-700': 'text-gray-600'
          }`}>
            Kelola
            <ChevronDown size={18} className="ml-2 transform group-hover:rotate-180 transition-transform duration-500" />
          </div>
        </div>
      </div>
      
      {/* Enhanced Hover Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
        item.accentColor === 'red' ? 'bg-gradient-to-t from-red-600/10 to-transparent' :
        item.accentColor === 'emerald' ? 'bg-gradient-to-t from-emerald-600/10 to-transparent' :
        item.accentColor === 'teal' ? 'bg-gradient-to-t from-teal-600/10 to-transparent' :
        item.accentColor === 'amber' ? 'bg-gradient-to-t from-amber-600/10 to-transparent' :
        item.accentColor === 'purple' ? 'bg-gradient-to-t from-purple-600/10 to-transparent' :
        item.accentColor === 'orange' ? 'bg-gradient-to-t from-orange-600/10 to-transparent' :
        item.accentColor === 'slate' ? 'bg-gradient-to-t from-slate-600/10 to-transparent' :
        item.accentColor === 'indigo' ? 'bg-gradient-to-t from-indigo-600/10 to-transparent' : 
        item.accentColor === 'cyan' ? 'bg-gradient-to-t from-cyan-600/10 to-transparent': 'bg-gradient-to-t from-gray-600/10 to-transparent'
      }`}></div>
    </div>
  );
};


export default ItemsCard;