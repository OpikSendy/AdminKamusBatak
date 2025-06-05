import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Pastikan path ini benar
import { MessageSquarePlus } from 'lucide-react';

const CommentSection = ({ itemId, itemType, comments = [], onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [anonName, setAnonName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert('Komentar tidak boleh kosong!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('komentar')
        .insert([
          {
            item_id: itemId,
            item_type: itemType,
            nama_anonim: anonName.trim() === '' ? 'Anonim' : anonName.trim(), // Default 'Anonim'
            komentar_text: commentText.trim(),
            is_approved: false, 
          },
        ]);

      if (error) {
        throw error;
      }

      alert('Komentar Anda berhasil dikirim! Menunggu persetujuan admin.');
      setCommentText('');
      setAnonName('');
      setShowForm(false); // Sembunyikan form setelah submit
      if (onCommentAdded) {
        onCommentAdded(); // Panggil callback jika ada (misal untuk refresh daftar komentar)
      }
    } catch (error) {
      console.error('Error submitting comment:', error.message);
      alert('Gagal mengirim komentar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <MessageSquarePlus size={28} className="text-red-600" />
        Komentar
      </h3>

      {/* Daftar Komentar yang Disetujui */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span className="font-semibold text-gray-700">{comment.nama_anonim}</span>
                <span>{new Date(comment.tanggal_komentar).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}</span>
              </div>
              <p className="text-gray-800 text-base leading-relaxed">{comment.komentar_text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Belum ada komentar yang disetujui.</p>
      )}

      {/* Form Komentar */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors mb-4"
      >
        <MessageSquarePlus size={18} />
        {showForm ? 'Sembunyikan Form Komentar' : 'Berikan Komentar'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmitComment} className="space-y-4 mt-4">
          <div>
            <label htmlFor="anonName" className="block text-sm font-medium text-gray-700 mb-1">Nama (Opsional):</label>
            <input
              type="text"
              id="anonName"
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              placeholder="Nama Anda (misal: Pengunjung Batak)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">Komentar Anda:</label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis komentar Anda di sini..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-y"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;