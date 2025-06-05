// src/components/BatakAdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Search, Grid, List } from 'lucide-react';

// Komponen
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ItemCard from '../components/common/ItemCard';
import DynamicFormField from '../components/forms/DynamicFormField'; 
import ItemsCard from '../components/common/ItemsCard';
import CommentSection from '../components/common/CommentSection'; 

// Konfigurasi & Service
import { menuItems } from '../config/menuItems';
import { supabase } from '../lib/supabaseClient';
import { supabaseService } from '../services/supabaseService';

const BatakAdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState(null); // Mulai dengan null untuk tampilan utama
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({});
  const [relations, setRelations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvedComments, setApprovedComments] = useState([]);
  const [modalType, setModalType] = useState(''); // add, edit, view
  const [formData, setFormData] = useState({}); // initialData untuk DynamicFormField
  const [selectedItem, setSelectedItem] = useState(null); // Digunakan untuk menyimpan item lengkap saat di-view
  const [viewMode, setViewMode] = useState('grid');

  const activeMenuItem = menuItems.find(item => item.id === activeMenu);

  const currentData = data[activeMenu] || [];

 const filteredData = currentData.filter(item => {
  if (activeMenu === 'komentar') {
    // Filter komentar berdasarkan nama_anonim atau komentar_text
    const namaAnonim = item.nama_anonim?.toLowerCase() || '';
    const komentarText = item.komentar_text?.toLowerCase() || '';
    return namaAnonim.includes(searchTerm.toLowerCase()) || komentarText.includes(searchTerm.toLowerCase());
  } else {
    // Filter modul lain berdasarkan nama
    return item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
  }
});

  // Fetch relasi untuk dropdown
  const fetchRelations = useCallback(async () => {
    try {
      const fetchedRelations = {};
      // Fetch semua data dari setiap tabel yang mungkin menjadi relasi
      for (const item of menuItems) {
        if (item.table) {
          fetchedRelations[item.table] = await supabaseService.fetchData(item.table);
        }
      }
      setRelations(fetchedRelations);
    } catch (error) {
      console.error('Error fetching all relations:', error);
    }
  }, []);

  // Fetch data utama untuk menu yang aktif
  const fetchData = useCallback(async () => {
    if (!activeMenuItem) return;
    try {
      setIsLoading(true);
      const result = await supabaseService.fetchData(activeMenuItem.table);
      setData(prev => ({ ...prev, [activeMenu]: result }));
    } catch (error) {
      console.error(`Error fetching ${activeMenuItem.table}:`, error);
      alert(`Gagal memuat data ${activeMenuItem.label}`);
    } finally {
      setIsLoading(false);
    }
  }, [activeMenu, activeMenuItem]);

  useEffect(() => {
    fetchRelations(); // Panggil fetchRelations hanya sekali saat komponen mount
  }, [fetchRelations]);

  useEffect(() => {
    if (activeMenu) {
      fetchData(); // Panggil fetchData setiap kali activeMenu berubah
    }
  }, [activeMenu, fetchData]);


  const handleAdd = () => {
    const initialData = {};
    activeMenuItem.fields.forEach(field => {
      if (field.type === 'checkbox') {
        // Mengubah inisialisasi dari string "false" menjadi boolean false
        initialData[field.name] = false; 
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    const dataForForm = { ...item };
    activeMenuItem.fields.forEach(field => {
      if (field.type === 'checkbox') {
        // HAPUS BARIS KONVERSI STRING INI!
        // dataForForm[field.name] = dataForForm[field.name] ? "true" : "false"; 
        // Biarkan dataForForm[field.name] tetap boolean (true/false) yang didapat dari DB.
      } else if (field.type === 'file' && !dataForForm[field.name]) {
        dataForForm[field.name] = '';
      }
    });
    setFormData(dataForForm);
    setSelectedItem(item);
    setModalType('edit');
    setIsModalOpen(true);
};

  // Di dalam BatakAdminDashboard.jsx
const handleDelete = async (itemToDelete) => {
    const confirmationText = activeMenu === 'komentar'
        ? `komentar dari "${itemToDelete.nama_anonim || 'Anonim'}"`
        : itemToDelete.nama;

    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${confirmationText}?`)) {
        return;
    }
    setIsLoading(true);

    // --- TAMBAH INI UNTUK DEBUGGING ---
    console.log("Attempting to delete item:", itemToDelete);
    console.log("Item ID to delete:", itemToDelete.id);
    console.log("Active Table:", activeMenuItem.table);
    // --- AKHIR DEBUGGING ---

    try {
        // ... (file deletion logic)

        // Pastikan ID valid sebelum memanggil delete
        if (!itemToDelete.id) {
            throw new Error("ID of item to delete is undefined or null.");
        }

        await supabaseService.deleteData(activeMenuItem.table, itemToDelete.id);
        await fetchData();
        alert('Data berhasil dihapus!');
    } catch (error) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data: ' + error.message);
    } finally {
        setIsLoading(false);
    }
};
  // --- PERBAIKAN handleView ---
  const handleView = async (item) => { // Buat async
    const dataToView = { ...item };

    // Untuk field relasional, ganti ID dengan nama aslinya untuk ditampilkan
    activeMenuItem.fields.forEach(field => {
      if (field.relation && dataToView[field.name]) {
        const relationTable = field.relation;
        const relatedItem = relations[relationTable]?.find(rel => rel.id === dataToView[field.name]);
        if (relatedItem) {
          dataToView[field.name] = relatedItem.nama;
        }
      }
      // PERBAIKAN PENTING DI SINI:
      if (field.type === 'checkbox') {
        // Periksa apakah nilainya benar-benar boolean true, bukan string "true"
        dataToView[field.name] = dataToView[field.name] === true ? "Ya" : "Tidak";
      }
      if (dataToView[field.name] === null || dataToView[field.name] === undefined || String(dataToView[field.name]).trim() === '') {
        dataToView[field.name] = '-';
      }
    });

  setFormData(dataToView);
  setSelectedItem(item); // Ini seharusnya selectedItem, bukan selectedComment, jika ini untuk detail item, bukan detail komentar
  setModalType('view');
  setIsModalOpen(true);

  // --- Fetch komentar yang disetujui untuk item ini ---
  if (item.id && activeMenuItem.table) {
    try {
      const { data: fetchedComments, error } = await supabase
        .from('komentar')
        .select('*')
        .eq('item_id', item.id)
        .eq('item_type', activeMenuItem.table)
        .eq('is_approved', true) 
        .order('tanggal_komentar', { ascending: false });

      if (error) {
        console.error('Error fetching approved comments:', error.message);
        setApprovedComments([]);
      } else {
        setApprovedComments(fetchedComments);
      }
    } catch (error) {
      console.error('Unexpected error fetching comments:', error);
      setApprovedComments([]);
    }
  } else {
    setApprovedComments([]);
  }
};

// Fungsi untuk merefresh komentar setelah ada yang baru dikirim (dari sisi pengguna)
const refreshComments = useCallback(async () => {
  if (selectedItem && activeMenuItem) { // Pastikan selectedItem di sini merujuk ke item yang detailnya sedang dilihat
    try {
      const { data: fetchedComments, error } = await supabase
        .from('komentar')
        .select('*')
        .eq('item_id', selectedItem.id)
        .eq('item_type', activeMenuItem.table)
        .eq('is_approved', true)
        .order('tanggal_komentar', { ascending: false });

      if (error) {
        console.error('Error refreshing approved comments:', error.message);
        setApprovedComments([]);
      } else {
        setApprovedComments(fetchedComments);
      }
    } catch (error) {
      console.error('Unexpected error refreshing comments:', error);
      setApprovedComments([]);
    }
  }
}, [selectedItem, activeMenuItem]);
  // --- AKHIR PERBAIKAN handleView ---


  // Ini adalah handleSubmit yang dipanggil oleh DynamicFormField setelah formnya diisi dan file diunggah
  const handleDynamicFormSubmit = async (submittedFormData) => {
  setIsLoading(true);
  console.log("FormData diterima dari DynamicFormField (sudah termasuk URL foto):", submittedFormData);

  const finalDataForDB = { ...submittedFormData };
  activeMenuItem.fields.forEach(field => {
    if (field.type === 'checkbox') {
      // Karena DynamicFormField sudah mengembalikan nilai boolean (true/false)
      // kita tidak perlu melakukan konversi string lagi. Cukup tetapkan nilainya.
      finalDataForDB[field.name] = submittedFormData[field.name]; 
    }
  });


    try {
      let apiResponse;
      if (modalType === 'add') {
        apiResponse = await supabaseService.insertData(activeMenuItem.table, finalDataForDB);
      } else if (modalType === 'edit') {
        apiResponse = await supabaseService.updateData(activeMenuItem.table, submittedFormData.id, finalDataForDB);
      }

      console.log("Respons dari Supabase Service:", apiResponse);

      await fetchData();
      setIsModalOpen(false);
      alert('Data berhasil disimpan!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  if (!activeMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Budaya Batak
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Sistem Manajemen Warisan Budaya Batak - Melestarikan kekayaan tradisi dan adat istiadat suku Batak untuk generasi mendatang
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <ItemsCard
                key={item.id}
                item={item}
                onClick={() => setActiveMenu(item.id)}
                itemCount={data[item.id]?.length || 0}
              />
            ))}
          </div>
        </div>

        <footer className="bg-white border-t border-gray-200 mt-20 py-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500">
            <p>© 2025 Sistem Budaya Batak - Melestarikan Warisan Leluhur</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveMenu(null)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              aria-label="Kembali"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className={`p-3 ${activeMenuItem.color} rounded-xl shadow-md`}>
                <activeMenuItem.icon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  {activeMenuItem.label}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {activeMenuItem.description}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus size={20} />
            <span>Tambah {activeMenuItem.label}</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Cari ${activeMenuItem.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
                {filteredData.length} item
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <activeMenuItem.icon size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'Tidak ada hasil pencarian' : `Belum ada data ${activeMenuItem.label.toLowerCase()}`}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `Tidak ditemukan ${activeMenuItem.label.toLowerCase()} dengan kata kunci "${searchTerm}"`
                  : `Mulai dengan menambahkan ${activeMenuItem.label.toLowerCase()} pertama Anda`
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  <Plus size={20} className="mr-2" />
                  Tambah {activeMenuItem.label}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredData.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                menuItem={activeMenuItem}
              />
            ))}
          </div>
        )}
      </main>

       <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setApprovedComments([]); // Reset komentar saat modal ditutup
        }}
        title={`${modalType === 'add' ? 'Tambah' : modalType === 'edit' ? 'Edit' : 'Detail'} ${activeMenuItem?.label}`}
      >
        {modalType === 'view' ? (
          <div className="space-y-6">
            {activeMenuItem.fields.some(f => f.name === 'foto' && f.type === 'file') && formData.foto && formData.foto !== '-' && (
              <div className="text-center mb-6">
                <img
                  src={formData.foto}
                  alt={formData.nama || activeMenuItem.label}
                  className="max-w-full h-64 object-cover rounded-xl shadow-lg mx-auto"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {activeMenuItem.fields.map((field) => {
                if (field.type === 'file' && field.name === 'foto') {
                  return null;
                }

                return (
                  <div key={field.name} className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex-1 flex items-center">
                      {field.type === 'file' ? (
                        formData[field.name] && formData[field.name] !== '-' ? (
                          <img src={formData[field.name]} alt={field.label} className="w-full h-24 object-cover rounded-lg" />
                        ) : (
                          <span className="text-gray-500">Tidak ada file</span>
                        )
                      ) : field.type === 'textarea' ? (
                          <p className="text-gray-800 whitespace-pre-wrap">{formData[field.name] || '-'}</p>
                      ) : (
                          <span className="text-gray-800">{formData[field.name] || '-'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* --- INTEGRASI COMMENTSECTION --- */}
            {selectedItem && activeMenuItem && (
              <CommentSection
                itemId={selectedItem.id}
                itemType={activeMenuItem.table}
                comments={approvedComments}
                onCommentAdded={refreshComments} // Panggil refreshComments setelah komentar ditambahkan
              />
            )}
            {/* --- AKHIR INTEGRASI COMMENTSECTION --- */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <DynamicFormField
            fields={activeMenuItem.fields}
            initialData={formData}
            relationalData={relations}
            onSubmit={handleDynamicFormSubmit}
            activeMenuItemId={activeMenuItem.id}
            modalType={modalType}
          />
        )}
      </Modal>
    </div>
  );
};

export default BatakAdminDashboard;