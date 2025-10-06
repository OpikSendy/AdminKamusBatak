import React from 'react';
import { Edit2, Trash2, Eye, Star, Clock, Video, Calendar, User, CheckCircle, XCircle } from 'lucide-react'; // Tambahkan User, CheckCircle, XCircle

// Enhanced Pattern Definitions0
const backgroundPatterns = {
  'pattern-1': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20l10-10v20zM10 10l10 10H0z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-2': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='30' r='4'/%3E%3Ccircle cx='60' cy='30' r='4'/%3E%3Ccircle cx='30' cy='0' r='4'/%3E%3Ccircle cx='30' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-3': `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M0 0h42L0 44V0zm1 1v18.586L19.586 1H1z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-4': `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M10 10l10 10-10 10V10zM0 10h10v10H0V10zm20 0h10v10H20V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-5': `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M18 18v18h18v-18zM0 18v18h18v-18z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-6': `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle fill-rule='evenodd' cx='22' cy='22' r='6'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-7': `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M32 0l32 32-32 32L0 32z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-8': `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm0 8c8.837 0 16 7.163 16 16s-7.163 16-16 16S8 32.837 8 24 15.163 8 24 8z'/%3E%3C/g%3E%3C/svg%3E")`,
  'pattern-9': `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
};

// Helper function to format date
const formatCommentDate = (dateString) => {
  if (!dateString) return "Tidak diketahui";
  try {
    // Assuming dateString is ISO format, e.g., "2023-10-27T10:00:00.000Z"
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Fallback to original string if formatting fails
  }
};

// Enhanced ItemCard Component
const ItemCard = ({ item, onEdit, onDelete, onView, menuItem }) => {
  // Determine if the current menuItem is 'komentar'
  const isCommentModule = menuItem.id === 'komentar';

  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-opacity-50 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105">
      <div className="relative">
        {item.foto ? (
          <div className="relative overflow-hidden">
            <img src={item.foto} alt={item.nama} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div className={`w-full h-56 ${menuItem.color} flex items-center justify-center relative overflow-hidden`}>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: backgroundPatterns[menuItem.bgPattern],
                backgroundSize: '40px 40px'
              }}
            ></div>
            <menuItem.icon size={64} className="text-white opacity-80 group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}

        <div className="absolute top-4 right-4">
          <div className={`p-3 ${menuItem.color} bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <menuItem.icon size={18} className="text-white" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
        {/* Judul akan menjadi komentar_text jika ini modul komentar */}
        <h3 className={`font-bold text-xl text-gray-800 mb-2 group-hover:transition-colors duration-500 ${
          menuItem.accentColor === 'red' ? 'group-hover:text-red-600' :
          menuItem.accentColor === 'emerald' ? 'group-hover:text-emerald-600' :
          menuItem.accentColor === 'teal' ? 'group-hover:text-teal-600' :
          menuItem.accentColor === 'amber' ? 'group-hover:text-amber-600' :
          menuItem.accentColor === 'purple' ? 'group-hover:text-purple-600' :
          menuItem.accentColor === 'orange' ? 'group-hover:text-orange-600' :
          menuItem.accentColor === 'slate' ? 'group-hover:text-slate-600' :
          menuItem.accentColor === 'indigo' ? 'group-hover:text-indigo-600' : 'group-hover:text-gray-600'
        }`}>
          {isCommentModule ? (item.komentar_text ? item.komentar_text.substring(0, 50) + '...' : 'Tidak ada Komentar') : item.nama}
        </h3>

        {/* Enhanced metadata with colors */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.jenis && (
            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
              item.jenis === 'makanan'
                ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200'
                : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
            }`}>
              {item.jenis}
            </span>
          )}

          {item.rating && (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 rounded-full shadow-sm">
              <Star size={14} className="text-yellow-600 mr-1" fill="currentColor" />
              <span className="text-xs font-bold text-yellow-800">{item.rating}</span>
            </div>
          )}

          {item.durasi && (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full shadow-sm">
              <Clock size={14} className="text-green-600 mr-1" />
              <span className="text-xs font-bold text-green-800">{item.durasi}</span>
            </div>
          )}

          {item.video && (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 rounded-full shadow-sm">
              <Video size={14} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-800">Video</span>
            </div>
          )}

          {/* --- Komentar Spesifik --- */}
          {isCommentModule && (
            <>
              {item.nama_anonim && (
                <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200 rounded-full shadow-sm">
                  <User size={14} className="text-gray-600 mr-1" />
                  <span className="text-xs font-bold text-gray-800">{item.nama_anonim}</span>
                </div>
              )}

              {item.tanggal_komentar && (
                <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-full shadow-sm">
                  <Calendar size={14} className="text-purple-600 mr-1" />
                  <span className="text-xs font-bold text-purple-800">{formatCommentDate(item.tanggal_komentar)}</span>
                </div>
              )}

              {typeof item.is_approved === 'boolean' && (
                <div className={`flex items-center px-3 py-1.5 rounded-full shadow-sm ${
                  item.is_approved
                    ? 'bg-gradient-to-r from-green-100 to-teal-100 border border-green-200'
                    : 'bg-gradient-to-r from-red-100 to-orange-100 border border-red-200'
                }`}>
                  {item.is_approved ? (
                    <CheckCircle size={14} className="text-green-600 mr-1" />
                  ) : (
                    <XCircle size={14} className="text-red-600 mr-1" />
                  )}
                  <span className={`text-xs font-bold ${
                    item.is_approved ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {item.is_approved ? 'Disetujui' : 'Belum Disetujui'}
                  </span>
                </div>
              )}
            </>
          )}
          {/* --- Akhir Komentar Spesifik --- */}

        </div>

        {/* Komentar teks akan tampil sebagai deskripsi yang dapat dipotong */}
        {item.komentar_text && isCommentModule && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {item.komentar_text}
          </p>
        )}
        {item.deskripsi && !isCommentModule && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {item.deskripsi}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => onView && onView(item)}
            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <Eye size={16} className="mr-2" />
            Lihat
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-700 rounded-2xl hover:from-blue-200 hover:to-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <Edit2 size={16} className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-bold bg-gradient-to-r from-red-100 to-pink-200 text-red-700 rounded-2xl hover:from-red-200 hover:to-pink-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <Trash2 size={16} className="mr-2" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;