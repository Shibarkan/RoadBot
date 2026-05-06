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

  // FUNGSI SUBMIT KE SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Validasi: Pastikan foto utama (kotak pertama) ada
      if (!images[0]) {
        alert("Foto Utama (Kotak pertama) wajib diisi!");
        setIsSubmitting(false);
        return;
      }

      const uploadedUrls = [];

      // 2. Upload setiap gambar yang ada isinya ke Supabase Storage
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`; 

          // Proses Upload ke Bucket
          const { error: uploadError } = await supabase.storage
            .from('product_images') 
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false // Jangan timpa file jika nama sama
            });

          if (uploadError) {
            console.error("Error Storage:", uploadError);
            throw new Error(`Gagal upload foto ke-${i + 1}: ${uploadError.message}`);
          }

          // Pengambilan URL Public (Cara Supabase v2 yang paling aman)
          const { data } = supabase.storage
            .from('product_images')
            .getPublicUrl(filePath);

          if (data && data.publicUrl) {
            uploadedUrls.push(data.publicUrl);
          }
        }
      }

      // 3. Simpan data teks & URL gambar ke tabel 'products'
      const { error: dbError } = await supabase.from("products").insert([
        {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description,
          image_url: uploadedUrls[0], // Foto utama (string)
          image_gallery: uploadedUrls, // Semua foto (array of strings)
        }
      ]);

      if (dbError) {
        console.error("Error Database:", dbError);
        throw new Error(`Gagal menyimpan ke database: ${dbError.message}`);
      }

      alert("Produk berhasil ditambahkan!");
      navigate("/marketplace"); // Kembali ke halaman toko

    } catch (error) {
      console.error("Gagal Total:", error);
      // Pesan error sekarang akan memunculkan teks asli dari Supabase agar mudah dilacak
      alert(`Terjadi kesalahan:\n${error.message}`);
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
          <p className="text-gray-400 text-xs mt-1">Unggah detail produk atau jasa RoadFix Anda di sini.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* ================= BAGIAN 1: UPLOAD GAMBAR (6 KOTAK) ================= */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Foto Produk <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  {/* Jika ada preview, tampilkan gambarnya */}
                  {preview ? (
                    <div className="w-full h-full rounded-lg overflow-hidden border border-cyan-500/50 group relative">
                      <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      {/* Tombol Hapus Silang */}
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                      {/* Label Utama untuk kotak pertama */}
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 w-full bg-cyan-500/80 text-white text-[9px] text-center py-0.5 font-bold">
                          FOTO UTAMA
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Jika kosong, tampilkan kotak Upload (+) */
                    <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg hover:border-cyan-400 hover:bg-cyan-400/5 transition-colors cursor-pointer text-gray-500 hover:text-cyan-400 group">
                      <FaPlus className="text-lg md:text-xl mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] md:text-[10px] text-center px-1">
                        {index === 0 ? "Foto Utama" : "Tambah Foto"}
                      </span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden" 
                        onChange={(e) => handleImageChange(index, e)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-[10px] mt-2 italic">Format: JPG, PNG, WEBP. Maks 6 foto. Kotak pertama wajib diisi.</p>
          </div>

          {/* ================= BAGIAN 2: INFORMASI PRODUK ================= */}
          <div className="space-y-4">
            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nama Produk/Jasa <span className="text-red-500">*</span></label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleInputChange}
                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Contoh: Robot Patcher Aspal Otomatis"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kategori <span className="text-red-500">*</span></label>
                <select 
                  name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Produk">Produk Fisik / Hardware</option>
                  <option value="Jasa">Layanan Jasa / Sewa</option>
                </select>
              </div>

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Harga (Rp) <span className="text-red-500">*</span></label>
                <input 
                  type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="15000000"
                />
              </div>

              {/* Stok */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stok <span className="text-red-500">*</span></label>
                <input 
                  type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="Masukkan jumlah stok"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi Produk <span className="text-red-500">*</span></label>
              <textarea 
                name="description" required rows="5" value={formData.description} onChange={handleInputChange}
                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Tuliskan spesifikasi, keunggulan, dan ketentuan produk secara detail..."
              ></textarea>
            </div>
          </div>

          {/* ================= TOMBOL SUBMIT ================= */}
          <div className="pt-4 border-t border-white/5 flex gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold py-3 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><FaSpinner className="animate-spin" /> Sedang Mengunggah...</>
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