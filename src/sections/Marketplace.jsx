import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaStar, FaFire } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase"; 

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === "Semua" || item.category === filter;
    return matchSearch && matchFilter;
  });

  // Modifikasi format Rupiah agar lebih ringkas di layar kecil (menghilangkan Rp jika terlalu panjang, dll)
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <section id="marketplace" className="py-6 relative w-full bg-[#030712] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4">
        
        {/* SEARCH & FILTER (STIKER DI ATAS - DIKOMPRES) */}
        <div className="sticky top-16 z-30 mb-4 space-y-2">
          <div className="flex flex-col md:flex-row gap-2 p-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
            {/* Search Box */}
            <div className="relative flex-grow group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder="Cari solusi perbaikan jalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/50 border border-white/5 text-xs text-white focus:outline-none focus:border-cyan-400/50 transition-all"
              />
            </div>
            {/* Filter Tabs */}
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 overflow-x-auto hide-scrollbar">
              {["Semua", "Produk", "Jasa"].map((kategori) => (
                <button
                  key={kategori}
                  onClick={() => setFilter(kategori)}
                  className={`px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                    filter === kategori 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {kategori}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID (SUPER DENSE: HP 4-5 Kolom, Tablet 6 Kolom, PC 8-10 Kolom) */}
        {isLoading ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 md:gap-2">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 md:gap-2">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  className="group flex flex-col bg-gray-900/40 border border-white/5 rounded-lg overflow-hidden hover:border-cyan-400/40 hover:bg-gray-800/60 transition-all duration-300"
                >
                  {/* Image Section (Kotak Sempurna) */}
                  <div className="relative aspect-square overflow-hidden bg-gray-800">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Badge STAR+ Mikro */}
                    {product.average_rating >= 4.8 && (
                      <div className="absolute top-1 left-1 bg-red-500 text-[6px] sm:text-[8px] font-black px-1 py-0.5 rounded flex items-center gap-0.5 shadow-md">
                        <FaFire className="text-[6px]" /> STAR+
                      </div>
                    )}
                  </div>

                  {/* Content Section (Super Kompres) */}
                  <div className="p-1.5 sm:p-2 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Judul Produk (Maks 2 Baris, Font Sangat Kecil) */}
                      <h3 className="text-[9px] sm:text-[11px] font-medium text-gray-100 line-clamp-2 leading-tight mb-1 group-hover:text-cyan-300 transition-colors h-6 sm:h-8">
                        {product.name}
                      </h3>
                      
                      {/* Harga (Truncate agar tidak keluar batas) */}
                      <div className="text-blue-400 font-bold text-[9px] sm:text-xs mb-1 truncate">
                        {formatRupiah(product.price)}
                      </div>
                    </div>

                    <div>
                      {/* Meta Info (Rating & Terjual - Ukuran Nano) */}
                      <div className="flex items-center gap-1 text-[7px] sm:text-[9px] text-gray-400 mb-1.5">
                        <FaStar className="text-yellow-500 text-[7px] sm:text-[9px]" />
                        <span>{product.average_rating}</span>
                        <span className="mx-0.5">|</span>
                        <span className="truncate">Tjl 10+</span>
                      </div>

                      {/* Button Beli Cepat (Ikon + Teks) */}
                      <button 
                        onClick={() => alert(`Masuk Keranjang!`)}
                        className="w-full py-1 bg-blue-600/10 border border-blue-600/30 text-blue-400 rounded text-[8px] sm:text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                      >
                        <FaShoppingCart className="text-[8px] sm:text-[10px]" /> 
                        <span className="hidden xs:inline">Beli</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xs italic">Produk tidak ditemukan...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;