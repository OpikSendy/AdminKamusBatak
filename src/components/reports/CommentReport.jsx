// src/components/common/CommentReport.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  MessageSquare,
  User,
  CheckCircle,
  XCircle,
  Filter,
  Camera,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Komponen utama untuk rekap komentar
const CommentReport = ({ onRefresh, setActiveMenu }) => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [periodType, setPeriodType] = useState('mingguan'); 
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [isLoading, setIsLoading] = useState(true);
  const [periods, setPeriods] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    withPhoto: 0
  });

  // Fetch data komentar dari Supabase
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('komentar')
        .select('*')
        .order('tanggal_komentar', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Gagal memuat komentar:', err.message);
      alert('Gagal memuat komentar dari database.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate daftar periode
  useEffect(() => {
    const generatePeriods = () => {
      const now = new Date();
      const periodList = [];

      if (periodType === 'mingguan') {
        for (let i = 0; i < 12; i++) {
          const endDate = new Date(now);
          endDate.setDate(endDate.getDate() - i * 7);
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);

          periodList.push({
            value: `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`,
            label: `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            startDate,
            endDate
          });
        }
      } else {
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periodList.push({
            value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            label: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            startDate: new Date(date.getFullYear(), date.getMonth(), 1),
            endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
          });
        }
      }

      setPeriods(periodList);
      if (periodList.length > 0) setSelectedPeriod(periodList[0].value);
    };

    generatePeriods();
  }, [periodType]);

  // Load data pertama kali
  useEffect(() => {
    fetchComments();
  }, []);

  // Filter komentar berdasarkan periode & status
  useEffect(() => {
    if (!selectedPeriod || comments.length === 0) return;

    const currentPeriod = periods.find(p => p.value === selectedPeriod);
    if (!currentPeriod) return;

    let filtered = comments.filter(comment => {
      const commentDate = new Date(comment.tanggal_komentar);
      return commentDate >= currentPeriod.startDate && commentDate <= currentPeriod.endDate;
    });

    if (statusFilter === 'approved') {
      filtered = filtered.filter(c => c.is_approved);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter(c => !c.is_approved);
    }

    setFilteredComments(filtered);
    setStats({
      total: filtered.length,
      approved: filtered.filter(c => c.is_approved).length,
      pending: filtered.filter(c => !c.is_approved).length,
      withPhoto: filtered.filter(c => c.foto_komentar).length
    });
  }, [selectedPeriod, comments, statusFilter, periods]);

  // Export ke CSV
  const exportToCSV = () => {
    const headers = ['Tanggal', 'Nama', 'Komentar', 'Item', 'Status', 'Ada Foto'];
    const rows = filteredComments.map(c => [
      new Date(c.tanggal_komentar).toLocaleDateString('id-ID'),
      c.nama_anonim,
      c.komentar_text,
      `${c.item_name || '-'} (${c.item_type || '-'})`,
      c.is_approved ? 'Disetujui' : 'Belum Disetujui',
      c.foto_komentar ? 'Ya' : 'Tidak'
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rekap-komentar-${selectedPeriod}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data komentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveMenu(null)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              >
                <X size={24} />
              </button>
              <div className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl">
                <MessageSquare size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Rekap Komentar</h1>
                <p className="text-gray-600 mt-1">Laporan dan statistik komentar pengguna</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterSelect
              label="Tipe Periode"
              icon={<Filter size={16} />}
              value={periodType}
              onChange={setPeriodType}
              options={[
                { value: 'mingguan', label: 'Mingguan' },
                { value: 'bulanan', label: 'Bulanan' }
              ]}
            />
            <FilterSelect
              label="Pilih Periode"
              icon={<Calendar size={16} />}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={periods.map(p => ({ value: p.value, label: p.label }))}
            />
            <FilterSelect
              label="Status Komentar"
              icon={<CheckCircle size={16} />}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua' },
                { value: 'approved', label: 'Disetujui' },
                { value: 'pending', label: 'Belum Disetujui' }
              ]}
            />
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={MessageSquare} label="Total Komentar" value={stats.total} color="from-blue-500 to-blue-600" />
          <StatCard icon={CheckCircle} label="Disetujui" value={stats.approved} color="from-green-500 to-emerald-600" />
          <StatCard icon={XCircle} label="Belum Disetujui" value={stats.pending} color="from-orange-500 to-red-600" />
          <StatCard icon={Camera} label="Dengan Foto" value={stats.withPhoto} color="from-purple-500 to-indigo-600" />
        </div>

        {/* Daftar Komentar */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-red-600" />
            Detail Komentar
          </h2>

          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada komentar pada periode ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable components
const FilterSelect = ({ label, icon, value, onChange, options }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-gradient-to-br ${color} rounded-xl`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-3xl font-bold text-gray-800">{value}</span>
    </div>
    <p className="text-gray-600 font-medium">{label}</p>
  </div>
);

const CommentCard = ({ comment }) => (
  <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
    <div className="flex gap-4">
      {comment.foto_komentar && (
        <img
          src={comment.foto_komentar}
          alt="Foto komentar"
          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200"
        />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{comment.nama_anonim}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.tanggal_komentar).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              comment.is_approved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}
          >
            {comment.is_approved ? (
              <>
                <CheckCircle size={14} /> Disetujui
              </>
            ) : (
              <>
                <XCircle size={14} /> Pending
              </>
            )}
          </span>
        </div>

        <p className="text-gray-700 mb-3 leading-relaxed">{comment.komentar_text}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg font-medium">{comment.item_name}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{comment.item_type?.replace(/_/g, ' ')}</span>
        </div>
      </div>
    </div>
  </div>
);

export default CommentReport;
