// src/components/forms/DynamicFormField.jsx
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // Pastikan path ini benar

const DynamicFormField = ({ fields, onSubmit, initialData = {}, relationalData = {}, activeMenuItemId, modalType }) => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({}); // State untuk menyimpan error validasi

  useEffect(() => {
  console.log("Initial Data received by DynamicFormField:", initialData); // Tambahkan ini
  const transformedInitialData = { ...initialData };
  fields.forEach(field => {
    if (field.type === 'boolean_text' && !transformedInitialData[field.name]) {
      transformedInitialData[field.name] = "Tidak"; // Default to "Tidak" if not set
    }
    if (field.type === 'checkbox') {
      console.log(`Field '${field.name}' type: checkbox, initial value:`, initialData[field.name], `(typeof: ${typeof initialData[field.name]})`); // Tambahkan ini
      transformedInitialData[field.name] = typeof initialData[field.name] === 'boolean' ? initialData[field.name] : false;
    }
  });
  console.log("Transformed formData before setting state:", transformedInitialData); // Tambahkan ini
  setFormData(transformedInitialData);
  setValidationErrors({});
}, [initialData, fields]); // Tambahkan `fields` sebagai dependency

  // Fungsi untuk menangani perubahan input
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Hapus error validasi jika field sudah diisi
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Fungsi untuk menangani perubahan checkbox untuk tipe boolean_text
  const handleBooleanTextChange = (name, isChecked) => {
    handleChange(name, isChecked ? 'Ya' : 'Tidak');
  };

  // BARU: Fungsi untuk menangani perubahan checkbox untuk tipe 'checkbox' (boolean asli)
  const handleCheckboxChange = (name, isChecked) => {
    handleChange(name, isChecked); // Langsung simpan nilai boolean (true/false)
  };


  const handleSpecificFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!activeMenuItemId) {
      console.error("activeMenuItemId is not provided to DynamicFormField for file upload.");
      alert("Error: Active menu item ID is missing for file upload.");
      return;
    }

    console.log('activeMenuItemId (from DynamicFormField):', activeMenuItemId);
    const bucketName = `${activeMenuItemId}`;
    console.log('Bucket name being used (from DynamicFormField):', bucketName);

    // Pastikan nama file unik untuk menghindari tabrakan dan sanitasi
    const fileName = `${fieldName}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`; 

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading file from DynamicFormField:', uploadError.message);
        alert('Gagal mengupload file: ' + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

      if (publicUrlData && publicUrlData.publicUrl) {
        handleChange(fieldName, publicUrlData.publicUrl);
        console.log('File uploaded successfully. Public URL (from DynamicFormField):', publicUrlData.publicUrl);
      } else {
        console.error('Failed to get public URL from DynamicFormField.');
        alert('Gagal mendapatkan URL publik file.');
      }
    } catch (uploadError) {
      console.error('Unexpected error during file upload from DynamicFormField:', uploadError);
      alert('Terjadi kesalahan tak terduga saat mengupload file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({}); // Reset validation errors on new submission attempt

    // Validasi field wajib
    let hasError = false;
    const newErrors = {};

    fields.forEach(field => {
      if (field.required) {
        if (field.type === 'file') {
          if (!formData[field.name] || typeof formData[field.name] !== 'string') {
            newErrors[field.name] = `${field.label} wajib diisi.`;
            hasError = true;
          }
        } else if (field.type === 'boolean_text') {
          // Untuk boolean_text, pastikan nilainya 'Ya' atau 'Tidak'.
          if (!formData[field.name]) {
            newErrors[field.name] = `${field.label} wajib dipilih.`;
            hasError = true;
          }
        } else if (field.type === 'checkbox') { // BARU: Validasi untuk type 'checkbox'
          // Untuk checkbox, pastikan nilainya boolean (true/false)
          if (typeof formData[field.name] !== 'boolean') {
            newErrors[field.name] = `${field.label} wajib dipilih.`;
            hasError = true;
          }
        }
        else {
          // Untuk tipe lain, pastikan ada nilai dan bukan string kosong
          if (!formData[field.name] || String(formData[field.name]).trim() === '') {
            newErrors[field.name] = `${field.label} wajib diisi.`;
            hasError = true;
          }
        }
      }
    });

    if (hasError) {
      setValidationErrors(newErrors);
      alert('Harap lengkapi semua field yang wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    // --- PENTING: Pindahkan logika dataToSubmit ke sini ---
    const dataToSubmit = { ...formData };

    // Hapus properti 'id' jika modalType adalah 'add'
    // ini memastikan Supabase menggunakan nilai default gen_random_uuid()
    if (modalType === 'add') {
      delete dataToSubmit.id;
    }

    // Hapus field yang editable:false dan kosong/null/undefined jika mode 'add' atau jika DB punya default
    fields.forEach(field => {
      // Jika field tidak bisa diedit DAN nilainya kosong/null/undefined
      // DAN jika kita dalam mode 'add' atau jika field tersebut memiliki DEFAULT di DB (seperti tanggal_komentar, nama_anonim)
      if (field.editable === false && (dataToSubmit[field.name] === '' || dataToSubmit[field.name] === null || dataToSubmit[field.name] === undefined)) {
        // Khusus untuk tanggal_komentar dan nama_anonim, biarkan DB yang mengurus defaultnya
        if (field.name === 'tanggal_komentar' || field.name === 'nama_anonim') {
          delete dataToSubmit[field.name];
        }
        // Untuk field 'id', pastikan dihapus jika modalType adalah 'add' dan tidak ada nilai
        if (field.name === 'id' && modalType === 'add' && !dataToSubmit[field.name]) {
          delete dataToSubmit[field.name];
        }
        // Untuk field lain yang editable:false dan kosong, Anda bisa memutuskan apakah akan menghapusnya
        // atau membiarkannya. Tergantung apakah DB dapat menerima NULL atau ada DEFAULT.
        // Contoh: if (field.name !== 'tanggal_komentar' && field.name !== 'nama_anonim') { /* do something */ }
      }
    });
    // --- AKHIR PENTING ---

    try {
      await onSubmit(dataToSubmit); // Ganti formData dengan dataToSubmit
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const commonClasses = "w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm";
    const isError = validationErrors[field.name];

    const isDisabled = field.editable === false && modalType === 'edit';

    return (
      <div className={
        `relative ${field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}
         ${field.type === 'boolean_text' || field.type === 'checkbox' ? 'md:col-span-2' : ''}
        ` // Sesuaikan span untuk checkbox agar rapi
      }>
        <label htmlFor={field.name} className="block text-sm font-bold text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.type === 'text' || field.type === 'number' ? (
          <input
            type={field.type}
            id={field.name} // Tambahkan id
            className={`${commonClasses} ${isError ? 'border-red-500' : ''} ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            required={field.required}
            disabled={isDisabled}
          />
        ) : field.type === 'textarea' ? (
          <textarea
            id={field.name} // Tambahkan id
            className={`${commonClasses} min-h-[120px] resize-y ${isError ? 'border-red-500' : ''} ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            rows={4}
            required={field.required}
            disabled={isDisabled}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.name} // Tambahkan id
            className={`${commonClasses} ${isError ? 'border-red-500' : ''} ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={isDisabled}
          >
            <option value="">Pilih {field.label}</option>
            {field.relation && relationalData[field.relation] ? (
              relationalData[field.relation].map(option => (
                <option key={option.id} value={option.id}>
                  {option.nama}
                </option>
              ))
            ) : field.options ? (
              field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            ) : null}
          </select>
        ) : field.type === 'file' ? (
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id={field.name}
              accept="image/*"
              onChange={(e) => handleSpecificFileUpload(e, field.name)}
              required={field.required && !formData[field.name]}
              disabled={isDisabled}
            />
            <label
              htmlFor={field.name}
              className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 bg-gray-50
                ${isError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}
                ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <div className="text-center">
                <Upload size={48} className={`mx-auto mb-4 ${isError ? 'text-red-500' : 'text-gray-400'}`} />
                <p className={`font-medium ${isError ? 'text-red-700' : 'text-gray-600'}`}>
                  Klik untuk upload {field.label.toLowerCase()}
                </p>
                <p className="text-gray-400 text-sm mt-1">PNG, JPG hingga 10MB</p>
              </div>
              {isDisabled && formData[field.name] && typeof formData[field.name] === 'string' && (
                <div className="mt-2 text-center text-sm text-gray-500">
                  File: {formData[field.name].split('/').pop()}
                </div>
              )}
            </label>
            {formData[field.name] && typeof formData[field.name] === 'string' && (
              <div className="mt-4 flex flex-col items-center">
                <img src={formData[field.name]} alt="Preview" className="max-w-full h-32 object-cover rounded-2xl border border-gray-200" />
                <span className="text-gray-500 text-sm mt-2">File sudah diupload</span>
                <button
                  type="button"
                  onClick={() => handleChange(field.name, '')}
                  className="text-red-500 text-sm mt-1 hover:underline"
                >
                  Ganti Foto
                </button>
              </div>
            )}
            {isError && <p className="text-red-500 text-sm mt-1">{validationErrors[field.name]}</p>}
          </div>
        ) : field.type === 'boolean_text' ? ( // KASUS UNTUK BOOLEAN_TEXT
          <div className="flex items-center space-x-3 mt-3">
            <input
              type="checkbox"
              id={field.name} // Tambahkan id
              className={`form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500 ${isError ? 'border-red-500' : ''} ${isDisabled ? 'cursor-not-allowed' : ''}`}
              checked={formData[field.name] === 'Ya'}
              onChange={(e) => handleBooleanTextChange(field.name, e.target.checked)}
              disabled={isDisabled}
            />
            <span className={`text-gray-700 font-medium ${isError ? 'text-red-700' : ''}`}>
              {formData[field.name] === 'Ya' ? 'Ya' : 'Tidak'}
            </span>
            {isError && <p className="text-red-500 text-sm ml-2">{validationErrors[field.name]}</p>}
          </div>
        ) : field.type === 'checkbox' ? ( // BARU: KASUS UNTUK TIPE 'checkbox' (BOOLEAN ASLI)
          <div className="flex items-center space-x-3 mt-3">
            <input
              type="checkbox"
              id={field.name} // Tambahkan id
              className={`form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500 ${isError ? 'border-red-500' : ''} ${isDisabled ? 'cursor-not-allowed' : ''}`}
              checked={formData[field.name] === true} // Cek langsung nilai boolean
              onChange={(e) => handleCheckboxChange(field.name, e.target.checked)} // Panggil fungsi baru
              disabled={isDisabled}
            />
            <span className={`text-gray-700 font-medium ${isError ? 'text-red-700' : ''}`}>
              {/* Teks bisa disesuaikan, misalnya 'Disetujui'/'Belum Disetujui' */}
              {formData[field.name] === true ? 'Disetujui' : 'Belum Disetujui'}
            </span>
            {isError && <p className="text-red-500 text-sm ml-2">{validationErrors[field.name]}</p>}
          </div>
        ) : null}
        {/* Tampilkan pesan error di bawah field jika ada (untuk tipe text, number, textarea, select) */}
        {isError && field.type !== 'file' && field.type !== 'boolean_text' && field.type !== 'checkbox' && ( // Tambahkan field.type !== 'checkbox'
          <p className="text-red-500 text-sm mt-1">{validationErrors[field.name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(field => (
          <React.Fragment key={field.name}> {/* Gunakan Fragment karena renderField sudah membungkus div */}
            {renderField(field)}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </form>
  );
};

export default DynamicFormField;