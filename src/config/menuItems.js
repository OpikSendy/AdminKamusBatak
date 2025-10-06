// src/config/menuItems.js
import {
  Users, Home, Shirt, Utensils, Sword, Music,
  Mountain, TreePine, MessageSquareText, BarChart3, Clock
} from 'lucide-react';

export const menuItems = [
  {
    id: 'validasi-user',
    label: 'Validasi Data User',
    icon: Clock,
    color: 'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700',
    bgPattern: 'pattern-10',
    description: 'Validasi data yang dikirim oleh pengguna mobile',
    accentColor: 'orange',
    isSpecialModule: true, 
  },
  {
    id: 'suku',
    table: 'suku',
    label: 'Suku',
    icon: Users,
    color: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
    bgPattern: 'pattern-1',
    description: 'Kelola data suku-suku Batak',
    accentColor: 'red',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Suku', required: true },
      { name: 'foto', type: 'file', label: 'Foto Suku', required: true }
    ]
  },
  {
    id: 'marga',
    table: 'marga',
    label: 'Marga',
    icon: Mountain,
    color: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
    bgPattern: 'pattern-2',
    description: 'Kelola data marga dalam suku Batak',
    accentColor: 'emerald',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Marga', required: true },
      { name: 'suku_id', type: 'select', label: 'Suku', required: true, relation: 'suku' },
      { name: 'foto', type: 'file', label: 'Foto Marga', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true }
    ]
  },
  {
    id: 'submarga',
    table: 'submarga',
    label: 'Sub Marga',
    icon: TreePine,
    color: 'bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700',
    bgPattern: 'pattern-3',
    description: 'Kelola data sub marga',
    accentColor: 'teal',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Sub Marga', required: true },
      { name: 'marga_id', type: 'select', label: 'Marga', required: true, relation: 'marga' },
      { name: 'foto', type: 'file', label: 'Foto Sub Marga', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true }
    ]
  },
  {
    id: 'rumah',
    table: 'rumah_adat',
    label: 'Rumah Adat',
    icon: Home,
    color: 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-700',
    bgPattern: 'pattern-4',
    description: 'Kelola data rumah adat Batak',
    accentColor: 'amber',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Rumah Adat', required: true },
      { name: 'suku_id', type: 'select', label: 'Suku', required: true, relation: 'suku' },
      { name: 'foto', type: 'file', label: 'Foto Rumah Adat', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true },
      { name: 'feature1', type: 'text', label: 'Fitur 1', required: true },
      { name: 'feature2', type: 'text', label: 'Fitur 2', required: true },
      { name: 'feature3', type: 'text', label: 'Fitur 3', required: true },
      { name: 'item1', type: 'text', label: 'Item 1', required: true },
      { name: 'item2', type: 'text', label: 'Item 2', required: true },
      { name: 'item3', type: 'text', label: 'Item 3', required: true },
      { name: 'sejarah', type: 'textarea', label: 'Sejarah', required: true },
      { name: 'bangunan', type: 'textarea', label: 'Detail Bangunan', required: true },
      { name: 'ornamen', type: 'textarea', label: 'Ornamen', required: true },
      { name: 'fungsi', type: 'textarea', label: 'Fungsi', required: true },
      { name: 'pelestarian', type: 'textarea', label: 'Pelestarian', required: true }
    ]
  },
  {
    id: 'pakaian',
    table: 'pakaian_tradisional',
    label: 'Pakaian Tradisional',
    icon: Shirt,
    color: 'bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700',
    bgPattern: 'pattern-5',
    description: 'Kelola data pakaian tradisional Batak',
    accentColor: 'purple',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Pakaian', required: true },
      { name: 'suku_id', type: 'select', label: 'Suku', required: true, relation: 'suku' },
      { name: 'foto', type: 'file', label: 'Foto Pakaian', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true },
      { name: 'sejarah', type: 'textarea', label: 'Sejarah', required: true },
      { name: 'bahan', type: 'textarea', label: 'Bahan', required: true },
      { name: 'kelengkapan', type: 'textarea', label: 'Kelengkapan', required: true },
      { name: 'feature1', type: 'text', label: 'Fitur 1', required: true },
      { name: 'feature2', type: 'text', label: 'Fitur 2', required: true },
      { name: 'feature3', type: 'text', label: 'Fitur 3', required: true }
    ]
  },
  {
    id: 'kuliner',
    table: 'kuliner_tradisional',
    label: 'Kuliner Tradisional',
    icon: Utensils,
    color: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600',
    bgPattern: 'pattern-6',
    description: 'Kelola data kuliner tradisional Batak',
    accentColor: 'orange',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Kuliner', required: true },
      { name: 'suku_id', type: 'select', label: 'Suku', required: true, relation: 'suku' },
      { name: 'jenis', type: 'select', label: 'Jenis', required: true, options: [
        { value: 'makanan', label: 'Makanan' },
        { value: 'minuman', label: 'Minuman' }
      ]},
      { name: 'foto', type: 'file', label: 'Foto Kuliner', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true },
      { name: 'rating', type: 'text', label: 'Rating', required: true },
      { name: 'waktu', type: 'text', label: 'Waktu Penyajian/Konsumsi', required: true },
      { name: 'resep', type: 'textarea', label: 'Resep', required: true }
    ]
  },
  {
    id: 'senjata',
    table: 'senjata_tradisional',
    label: 'Senjata Tradisional',
    icon: Sword,
    color: 'bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800',
    bgPattern: 'pattern-7',
    description: 'Kelola data senjata tradisional Batak',
    accentColor: 'slate',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Senjata', required: true },
      { name: 'suku_id', type: 'select', label: 'Suku', required: true, relation: 'suku' },
      { name: 'foto', type: 'file', label: 'Foto Senjata', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true },
      { name: 'feature1', type: 'text', label: 'Fitur 1', required: true },
      { name: 'feature2', type: 'text', label: 'Fitur 2', required: true },
      { name: 'feature3', type: 'text', label: 'Fitur 3', required: true },
      { name: 'sejarah', type: 'textarea', label: 'Sejarah', required: true },
      { name: 'material', type: 'textarea', label: 'Material', required: true },
      { name: 'simbol', type: 'textarea', label: 'Simbolisme', required: true },
      { name: 'penggunaan', type: 'textarea', label: 'Penggunaan', required: true },
      { name: 'pertahanan', type: 'boolean_text', label: 'Untuk Pertahanan?', required: true },
      { name: 'perburuan', type: 'boolean_text', label: 'Untuk Perburuan?', required: true },
      { name: 'seremonial', type: 'boolean_text', label: 'Untuk Seremonial?', required: true }
    ]
  },
  {
    id: 'tarian',
    table: 'tarian_tradisional',
    label: 'Tarian Tradisional',
    icon: Music,
    color: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700',
    bgPattern: 'pattern-8',
    description: 'Kelola data tarian tradisional Batak',
    accentColor: 'indigo',
    fields: [
      { name: 'nama', type: 'text', label: 'Nama Tarian', required: true },
      { name: 'suku_id', type: 'select', label: 'Suku', required: true, relation: 'suku' },
      { name: 'foto', type: 'file', label: 'Foto Tarian', required: true },
      { name: 'deskripsi', type: 'textarea', label: 'Deskripsi', required: true },
      { name: 'sejarah', type: 'textarea', label: 'Sejarah', required: true },
      { name: 'gerakan', type: 'textarea', label: 'Gerakan', required: true },
      { name: 'kostum', type: 'textarea', label: 'Kostum', required: true },
      { name: 'feature1', type: 'text', label: 'Fitur 1', required: true },
      { name: 'feature2', type: 'text', label: 'Fitur 2', required: true },
      { name: 'feature3', type: 'text', label: 'Fitur 3', required: true },
      { name: 'video', type: 'text', label: 'URL Video', required: true },
      { name: 'kategori', type: 'text', label: 'Kategori', required: true },
      { name: 'durasi', type: 'text', label: 'Durasi', required: true },
      { name: 'event', type: 'textarea', label: 'Event Penggunaan', required: true }
    ]
  },
  {
    id: 'komentar',
    table: 'komentar',
    label: 'Komentar',
    icon: MessageSquareText,
    color: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
    bgPattern: 'pattern-9',
    description: 'Kelola Komentar Pengguna',
    accentColor: 'cyan',
    fields: [
      { name: 'item_id', label: 'ID Item', type: 'text', required: true, editable: false },
      { name: 'item_type', label: 'Item yang Dikomentari', type: 'text', required: true, editable: false },
      { name: 'nama_anonim', label: 'Nama Anonim', type: 'text', required: false, editable: false },
      { name: 'komentar_text', label: 'Isi Komentar', type: 'textarea', required: true, editable: false },
      { name: 'foto_komentar', label: 'Foto Komentar', type: 'file', required: false, editable: false },
      { name: 'tanggal_komentar', label: 'Tanggal Komentar', type: 'text', required: false, editable: false },
      { name: 'is_approved', label: 'Disetujui', type: 'checkbox', required: false },
    ],
  },
  {
    id: 'laporan-komentar',
    label: 'Laporan Komentar',
    icon: BarChart3,
    color: 'bg-gradient-to-br from-purple-500 via-pink-600 to-red-700',
    bgPattern: 'pattern-10',
    description: 'Rekap dan statistik komentar',
    accentColor: 'purple',
    isSpecialModule: true,
  },
];