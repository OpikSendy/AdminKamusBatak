// src/components/admin/ValidationPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  User,
  Calendar
} from 'lucide-react';
import { confirm } from 'react-confirm-box';
import { validationService } from '../../services/validationService';
import Modal from '../common/Modal';

const ValidationPanel = ({ setActiveMenu }) => {
  const [pendingData, setPendingData] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({});

  const tableLabels = {
    'suku': 'Suku',
    'marga': 'Marga',
    'submarga': 'Sub Marga',
    'rumah_adat': 'Rumah Adat',
    'pakaian_tradisional': 'Pakaian Tradisional',
    'kuliner_tradisional': 'Kuliner Tradisional',
    'senjata_tradisional': 'Senjata Tradisional',
    'tarian_tradisional': 'Tarian Tradisional'
  };

  useEffect(() => {
    loadPendingCounts();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadPendingData(selectedTable);
    }
  }, [selectedTable]);

  const loadPendingCounts = async () => {
    try {
      setIsLoading(true);
      const counts = await validationService.getPendingCounts();
      setPendingCounts(counts);
    } catch (error) {
      console.error('Error loading pending counts:', error);
      alert('Gagal memuat jumlah data pending');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingData = async (table) => {
    try {
      setIsLoading(true);
      const data = await validationService.fetchPendingData(table);
      setPendingData(prev => ({ ...prev, [table]: data }));
    } catch (error) {
      console.error('Error loading pending data:', error);
      alert('Gagal memuat data pending');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (table, id) => {
    if (!confirm('Apakah Anda yakin ingin menyetujui data ini?')) return;

    try {
      await validationService.approveData(table, id);
      alert('Data berhasil disetujui!');
      await loadPendingData(table);
      await loadPendingCounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error approving data:', error);
      alert('Gagal menyetujui data: ' + error.message);
    }
  };

  const handleReject = async (table, id) => {
    if (!confirm('Apakah Anda yakin ingin menolak dan menghapus data ini?')) return;

    try {
      await validationService.rejectData(table, id);
      alert('Data berhasil ditolak dan dihapus!');
      await loadPendingData(table);
      await loadPendingCounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error rejecting data:', error);
      alert('Gagal menolak data: ' + error.message);
    }
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Jika belum memilih tabel, tampilkan daftar tabel
  if (!selectedTable) {
    const totalPending = Object.values(pendingCounts).reduce((sum, count) => sum + count, 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveMenu(null)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <X size={24} />
                </button>
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
                  <Clock size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Validasi Data User</h1>
                  <p className="text-gray-600 mt-1">Kelola data yang dikirim oleh pengguna mobile</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600">{totalPending}</div>
                <div className="text-sm text-gray-500">Total Pending</div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Tentang Validasi Data</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Data yang dikirim oleh pengguna mobile akan masuk ke sistem sebagai "Pending". 
                Anda dapat meninjau, menyetujui, atau menolak data tersebut. Data yang disetujui 
                akan langsung muncul di aplikasi mobile.
              </p>
            </div>
          </div>

          {/* Grid Tabel */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(tableLabels).map(([table, label]) => {
                const count = pendingCounts[table] || 0;
                return (
                  <button
                    key={table}
                    onClick={() => setSelectedTable(table)}
                    className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                        <Clock size={24} className="text-orange-600" />
                      </div>
                      {count > 0 && (
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {count}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{label}</h3>
                    <p className="text-sm text-gray-600">
                      {count > 0 ? `${count} data menunggu validasi` : 'Tidak ada data pending'}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tampilan detail tabel yang dipilih
  const currentData = pendingData[selectedTable] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedTable(null)}
                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
              >
                <X size={24} />
              </button>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
                <Clock size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Validasi {tableLabels[selectedTable]}
                </h2>
                <p className="text-gray-600">{currentData.length} data menunggu persetujuan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <CheckCircle size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Data Pending</h3>
            <p className="text-gray-600">Semua data telah divalidasi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.map((item) => (
              <ValidationCard
                key={item.id}
                item={item}
                table={selectedTable}
                onView={() => openDetailModal(item)}
                onApprove={() => handleApprove(selectedTable, item.id)}
                onReject={() => handleReject(selectedTable, item.id)}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {isModalOpen && selectedItem && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Detail ${tableLabels[selectedTable]}`}
          >
            <DetailView
              item={selectedItem}
              table={selectedTable}
              onApprove={() => handleApprove(selectedTable, selectedItem.id)}
              onReject={() => handleReject(selectedTable, selectedItem.id)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

// Komponen Card untuk setiap item pending
const ValidationCard = ({ item, table, onView, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Foto Preview */}
      {item.foto && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={item.foto} 
            alt={item.nama} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} />
            Pending
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {item.nama || item.komentar_text?.substring(0, 50) || 'Tidak ada nama'}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User size={14} className="mr-2" />
            Dari: User Mobile
          </div>
          {item.created_at && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-2" />
              {new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Eye size={16} className="mr-1" />
            Detail
          </button>
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-colors"
          >
            <CheckCircle size={16} className="mr-1" />
            Setuju
          </button>
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-colors"
          >
            <XCircle size={16} className="mr-1" />
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk menampilkan detail lengkap
const DetailView = ({ item, table, onApprove, onReject }) => {
  const renderField = (label, value) => {
    if (!value) return null;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        <div className="text-gray-800 bg-gray-50 p-3 rounded-lg">
          {typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Foto jika ada */}
      {item.foto && (
        <div className="mb-6">
          <img 
            src={item.foto} 
            alt={item.nama} 
            className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200"
          />
        </div>
      )}

      {/* Semua field yang ada */}
      {renderField('Nama', item.nama)}
      {renderField('Deskripsi', item.deskripsi)}
      {renderField('Sejarah', item.sejarah)}
      {renderField('Bangunan', item.bangunan)}
      {renderField('Ornamen', item.ornamen)}
      {renderField('Fungsi', item.fungsi)}
      {renderField('Pelestarian', item.pelestarian)}
      {renderField('Bahan', item.bahan)}
      {renderField('Kelengkapan', item.kelengkapan)}
      {renderField('Material', item.material)}
      {renderField('Simbolisme', item.simbol)}
      {renderField('Penggunaan', item.penggunaan)}
      {renderField('Gerakan', item.gerakan)}
      {renderField('Kostum', item.kostum)}
      {renderField('Resep', item.resep)}
      {renderField('Jenis', item.jenis)}
      {renderField('Rating', item.rating)}
      {renderField('Waktu', item.waktu)}
      {renderField('Durasi', item.durasi)}
      {renderField('Kategori', item.kategori)}
      {renderField('Video', item.video)}
      {renderField('Pertahanan', item.pertahanan)}
      {renderField('Perburuan', item.perburuan)}
      {renderField('Seremonial', item.seremonial)}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          <CheckCircle size={20} className="mr-2" />
          Setujui Data
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
        >
          <XCircle size={20} className="mr-2" />
          Tolak Data
        </button>
      </div>
    </div>
  );
};

export default ValidationPanel;