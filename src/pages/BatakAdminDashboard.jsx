// src/pages/BatakAdminDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  Search,
  Grid,
  List,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { confirm } from 'react-confirm-box';

// Komponen
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ItemCard from "../components/common/ItemCard";
import DynamicFormField from "../components/forms/DynamicFormField";
import ItemsCard from "../components/common/ItemsCard";
import CommentSection from "../components/common/CommentSection";
import CommentReport from "../components/reports/CommentReport";
import ValidationPanel from "../components/admin/ValidationPanel";

// Konfigurasi & Service
import { menuItems } from "../config/menuItems";
import { supabase } from "../lib/supabaseClient";
import { supabaseService } from "../services/supabaseService";

const BatakAdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({});
  const [relations, setRelations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvedComments, setApprovedComments] = useState([]);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const activeMenuItem = menuItems.find((item) => item.id === activeMenu);
  const currentData = data[activeMenu] || [];

  // Filter pencarian
  const filteredData = currentData.filter((item) => {
    if (activeMenu === "komentar") {
      const namaAnonim = item.nama_anonim?.toLowerCase() || "";
      const komentarText = item.komentar_text?.toLowerCase() || "";
      return (
        namaAnonim.includes(searchTerm.toLowerCase()) ||
        komentarText.includes(searchTerm.toLowerCase())
      );
    } else {
      return item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  // Fetch relasi (dropdown dsb)
  const fetchRelations = useCallback(async () => {
    try {
      const fetchedRelations = {};
      for (const item of menuItems) {
        if (item.table) {
          fetchedRelations[item.table] = await supabaseService.fetchData(
            item.table
          );
        }
      }
      setRelations(fetchedRelations);
    } catch (error) {
      console.error("Error fetching relations:", error);
    }
  }, []);

  // Fetch data utama menu aktif
  const fetchData = useCallback(async () => {
    if (!activeMenuItem) return;

    try {
      setIsLoading(true);
      const result = await supabaseService.fetchData(activeMenuItem.table);
      setData((prev) => ({ ...prev, [activeMenu]: result }));
    } catch (error) {
      console.error(`Error fetching ${activeMenuItem.table}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [activeMenu, activeMenuItem]);

  useEffect(() => {
    fetchRelations();
  }, [fetchRelations]);

  useEffect(() => {
    if (activeMenu) fetchData();
  }, [activeMenu, fetchData]);

  // ✅ Integrasi Validasi User
  if (activeMenu === "validasi-user") {
    return <ValidationPanel setActiveMenu={setActiveMenu} />;
  }

  // ✅ Integrasi Laporan Komentar
  if (activeMenu === "laporan-komentar") {
    const commentData = data["komentar"] || [];
    return <CommentReport comments={commentData} setActiveMenu={setActiveMenu} />;
  }

  // Handle Submit Form (Add/Edit)
  const handleFormSubmit = async (submitData) => {
    try {
      // Tambahkan metadata untuk data dari admin
      const dataWithMeta = {
        ...submitData,
        input_source: 'admin',
        is_validated: true,
        validated_at: new Date().toISOString(),
        validated_by: 'admin'
      };

      if (modalType === "add") {
        await supabaseService.insertData(activeMenuItem.table, dataWithMeta);
        alert("Data berhasil ditambahkan!");
      } else if (modalType === "edit" && selectedItem) {
        await supabaseService.updateData(
          activeMenuItem.table,
          selectedItem.id,
          dataWithMeta
        );
        alert("Data berhasil diperbarui!");
      }

      setIsModalOpen(false);
      setFormData({});
      setSelectedItem(null);
      await fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal menyimpan data: " + error.message);
    }
  };

  // Handle Edit
  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalType("edit");
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (item) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${item.nama || 'data ini'}?`)) {
      return;
    }

    try {
      await supabaseService.deleteData(activeMenuItem.table, item.id);
      alert("Data berhasil dihapus!");
      await fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data: " + error.message);
    }
  };

  // Handle View (bisa dikembangkan lebih lanjut)
  const handleView = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalType("view");
    setIsModalOpen(true);
  };

  // Tampilan awal
  if (!activeMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Budaya Batak
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Sistem Manajemen Warisan Budaya Batak
          </p>
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

        <footer className="bg-white border-t border-gray-200 mt-20 py-8 text-center text-gray-500">
          © 2025 Sistem Budaya Batak
        </footer>
      </div>
    );
  }

  // Tampilan daftar item (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg border-b border-gray-200 px-6 py-6 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveMenu(null)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className={`p-3 ${activeMenuItem.color} rounded-xl shadow-md`}>
              <activeMenuItem.icon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeMenuItem.label}
              </h1>
              <p className="text-gray-600 text-sm">
                {activeMenuItem.description}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({});
            setModalType("add");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Tambah {activeMenuItem.label}
        </button>
      </header>

      {/* Konten utama */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl border p-12">
              <MessageSquare
                size={64}
                className="mx-auto text-gray-300 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Tidak ada data
              </h3>
              <p className="text-gray-600">
                Tambahkan {activeMenuItem.label.toLowerCase()} pertama Anda
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredData.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
                onView={() => handleView(item)}
                menuItem={activeMenuItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal untuk Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({});
          setSelectedItem(null);
        }}
        title={
          modalType === "add"
            ? `Tambah ${activeMenuItem.label}`
            : modalType === "edit"
            ? `Edit ${activeMenuItem.label}`
            : `Detail ${activeMenuItem.label}`
        }
      >
        {modalType === "view" ? (
          <div className="space-y-4">
            {/* Tampilan detail read-only */}
            {Object.entries(formData).map(([key, value]) => {
              if (key === "id" || key === "created_at" || key === "input_source" || key === "is_validated") return null;
              
              return (
                <div key={key} className="border-b border-gray-200 pb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  {key === "foto" || key.includes("foto") ? (
                    <img src={value} alt={key} className="w-full max-h-64 object-cover rounded-xl border" />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                      {typeof value === "boolean" ? (value ? "Ya" : "Tidak") : value || "-"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <DynamicFormField
            fields={activeMenuItem.fields}
            onSubmit={handleFormSubmit}
            initialData={formData}
            relationalData={relations}
            activeMenuItemId={activeMenuItem.id}
            modalType={modalType}
          />
        )}
      </Modal>
    </div>
  );
};

export default BatakAdminDashboard;