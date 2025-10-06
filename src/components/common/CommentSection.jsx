import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MessageSquarePlus, Upload, X, Image } from 'lucide-react';

const CommentSection = ({ itemId, itemType, comments = [], onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [anonName, setAnonName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Handle file selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (PNG, JPG, atau JPEG)');
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected photo
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Upload foto ke Supabase Storage
  const uploadPhotoToStorage = async (file) => {
    try {
      setIsUploading(true);

      // Buat nama file yang unik
      const fileExt = file.name.split('.').pop();
      const fileName = `comment_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `komentar/${fileName}`;

      // Upload ke bucket 'komentar'
      const { data, error } = await supabase.storage
        .from('komentar')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }

      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage
        .from('komentar')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Gagal mendapatkan URL publik foto');
      }

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadPhotoToStorage:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert('Komentar tidak boleh kosong!');
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = null;

      // Upload foto jika ada
      if (photoFile) {
        photoUrl = await uploadPhotoToStorage(photoFile);
      }

      // Insert komentar ke database
      const { data, error } = await supabase
        .from('komentar')
        .insert([
          {
            item_id: itemId,
            item_type: itemType,
            nama_anonim: anonName.trim() === '' ? 'Anonim' : anonName.trim(),
            komentar_text: commentText.trim(),
            foto_komentar: photoUrl,
            is_approved: false,
          },
        ]);

      if (error) {
        throw error;
      }

      alert('Komentar Anda berhasil dikirim! Menunggu persetujuan admin.');
      
      // Reset
      setCommentText('');
      setAnonName('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowForm(false);

      // Callback untuk refresh daftar komentar
      if (onCommentAdded) {
        onCommentAdded();
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
              <div className="flex items-start gap-4">
                {/* Foto Komentar jika ada */}
                {comment.foto_komentar && (
                  <div className="flex-shrink-0">
                    <img
                      src={comment.foto_komentar}
                      alt="Foto komentar"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(comment.foto_komentar, '_blank')}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span className="font-semibold text-gray-700">{comment.nama_anonim}</span>
                    <span>
                      {new Date(comment.tanggal_komentar).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-800 text-base leading-relaxed">{comment.komentar_text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Belum ada komentar yang disetujui.</p>
      )}

      {/* Tombol Toggle Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors mb-4"
      >
        <MessageSquarePlus size={18} />
        {showForm ? 'Sembunyikan Form Komentar' : 'Berikan Komentar'}
      </button>

      {/* Form Komentar */}
      {showForm && (
        <div className="space-y-4 mt-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          {/* Input Nama */}
          <div>
            <label htmlFor="anonName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama (Opsional):
            </label>
            <input
              type="text"
              id="anonName"
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              placeholder="Nama Anda (misal: Pengunjung Batak)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Input Komentar */}
          <div>
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">
              Komentar Anda:
            </label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis komentar Anda di sini..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all"
            />
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image size={16} className="inline mr-1" />
              Tambah Foto (Opsional):
            </label>

            {!photoPreview ? (
              <div className="relative">
                <input
                  type="file"
                  id="photoUpload"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <label
                  htmlFor="photoUpload"
                  className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Upload size={40} className="text-gray-400 mb-3" />
                  <p className="font-medium text-gray-600">Klik untuk upload foto</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG hingga 5MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={18} />
                </button>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    <strong>{photoFile?.name}</strong> ({(photoFile?.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmitComment}
            disabled={isSubmitting || isUploading || !commentText.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading
              ? 'Mengupload foto...'
              : isSubmitting
              ? 'Mengirim...'
              : 'Kirim Komentar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;