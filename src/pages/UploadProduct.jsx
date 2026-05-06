import React, { useState } from "react";
import { FaPlus, FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const UploadProduct = () => {
  const navigate = useNavigate();
  
  // State untuk Data Teks
  const [formData, setFormData] = useState({
    name: "",
    category: "Produk",
    price: "",
    stock: "",
    description: ""
  });

  // State untuk Gambar (Maksimal 6)
  const [images, setImages] = useState(Array(6).fill(null)); 
  const [previews, setPreviews] = useState(Array(6).fill(null)); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menangani input teks
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Menangani pemilihan gambar
  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  // Menghapus gambar dari kotak
  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
  };

  // FUNGSI UTAMA SUBMIT KE SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Validasi: Pastikan foto utama (kotak pertama) ada[cite: 1]
      if (!images[0]) {
        alert("⚠️ Foto Utama (Kotak pertama) wajib diisi!");
        setIsSubmitting(false);
        return;
      }

      const uploadedUrls = [];

      // 2. Upload setiap gambar ke Supabase Storage[cite: 1]
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          // Membuat nama file unik agar tidak bentrok[cite: 1]
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product_images') 
            .upload(fileName, file);

          if (uploadError) throw new Error(`Gagal upload foto ke-${i + 1}: ${uploadError.message}`);

          // Ambil URL Publik gambar tersebut[cite: 1]
          const { data } = supabase.storage
            .from('product_images')
            .getPublicUrl(fileName);

          if (data?.publicUrl) {
            uploadedUrls.push(data.publicUrl);
          }
        }
      }

      // 3. Simpan data teks & URL gambar ke tabel 'products'[cite: 1]
      const { error: dbError } = await supabase.from("products").insert([
        {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description,
          image_url: uploadedUrls[0],    // Foto pertama sebagai thumbnail[cite: 1]
          image_gallery: uploadedUrls,  // Semua foto dalam bentuk array[cite: 1]
        }
      ]);

      if (dbError) throw dbError;

      // 4. Notifikasi Berhasil
      alert("✅ Produk Berhasil Ditayangkan!");
      navigate("/marketplace"); 

    } catch (error) {
      console.error("Detail Error:", error);
      alert(`❌ Terjadi Kesalahan:\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#030712] min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto bg-gray-900/60 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Form */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaUpload className="text-cyan-400" /> Tambah Produk Baru
          </h2>
          <p className="text-gray-400 text-xs mt-1">Lengkapi data di bawah untuk menjual produk atau jasa Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* BAGIAN 1: UPLOAD GAMBAR */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Foto Produk (Maks 6) <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  {preview ? (
                    <div className="w-full h-full rounded-lg overflow-hidden border border-cyan-500/50 group relative">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 w-full bg-cyan-500/80 text-white text-[9px] text-center py-0.5 font-bold italic">
                          UTAMA
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-cyan-400 hover:bg-cyan-400/5 transition-all cursor-pointer text-gray-500 hover:text-cyan-400">
                      <FaPlus className="text-lg mb-1" />
                      <span className="text-[8px] text-center uppercase font-bold">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(index, e)} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN 2: DETAIL PRODUK */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nama Produk/Jasa</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleInputChange}
                className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none transition-all"
                placeholder="Contoh: Robot RoadFix Pro V.1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
                <select 
                  name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none"
                >
                  <option value="Produk">Produk Fisik</option>
                  <option value="Jasa">Layanan Jasa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Harga (Rp)</label>
                <input 
                  type="number" name="price" required value={formData.price} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none"
                  placeholder="Harga tanpa titik (Contoh: 500000)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stok Tersedia</label>
                <input 
                  type="number" name="stock" required value={formData.stock} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi Lengkap</label>
              <textarea 
                name="description" required rows="4" value={formData.description} onChange={handleInputChange}
                className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none resize-none"
                placeholder="Jelaskan detail spesifikasi dan kelebihan produk..."
              ></textarea>
            </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 transition-all font-semibold"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold py-3 hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><FaSpinner className="animate-spin" /> Mengunggah...</>
              ) : (
                "Simpan & Tampilkan Produk"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadProduct;