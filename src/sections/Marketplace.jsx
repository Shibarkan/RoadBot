import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase"; 
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    window.scrollTo(0, 0);

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

  // Format Rupiah standar Shopee (Rp xxx.xxx)
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <section id="marketplace" className="py-4 relative w-full bg-[#030712] min-h-screen pt-20">
      <div className="max-w-[1200px] mx-auto px-2 md:px-4">
        
        {/* ================= HEADER PENCARIAN (Gaya Nempel di Atas) ================= */}
        <div className="sticky top-16 md:top-20 z-30 mb-4 bg-[#030712] pt-2 pb-2">
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Cari di RoadFix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            {/* Filter */}
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="Semua">Semua</option>
              <option value="Produk">Produk</option>
              <option value="Jasa">Jasa</option>
            </select>
          </div>
        </div>

        {/* ================= GRID PRODUK SHOPEE-STYLE (2 Kolom di HP) ================= */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-800 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer group flex flex-col bg-[#1a1d24] border border-gray-800 rounded-md overflow-hidden hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  {/* GAMBAR PRODUK KOTAK 1:1 */}
                  <div className="relative aspect-square overflow-hidden bg-gray-800">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Badge Mall / Star */}
                    <div className="absolute top-0 left-0 bg-cyan-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md shadow-sm">
                      MALL
                    </div>
                  </div>

                  {/* INFO PRODUK */}
                  <div className="p-2 flex flex-col flex-grow">
                    {/* Judul: 2 Baris Pas */}
                    <h3 className="text-xs md:text-sm text-gray-200 line-clamp-2 leading-tight h-[34px] mb-2 group-hover:text-cyan-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Harga dan Keranjang (Diletakkan di bawah pakai mt-auto) */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-cyan-400 font-semibold text-sm md:text-base tracking-tight truncate pr-1">
                          {formatRupiah(product.price)}
                        </div>
                        {/* Ikon Keranjang Mini */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Berhasil masuk keranjang!`);
                          }}
                          className="text-gray-400 hover:text-white bg-gray-800 hover:bg-cyan-500 p-1.5 rounded-full transition-colors shrink-0"
                        >
                          <FaShoppingCart className="text-[10px] md:text-xs" />
                        </button>
                      </div>

                      {/* Info Rating dan Terjual */}
                      <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-500">
                        <FaStar className="text-yellow-400 text-[8px] md:text-[10px]" />
                        <span>{product.average_rating}</span>
                        <span className="mx-0.5 border-l border-gray-600 h-2"></span>
                        <span className="truncate">Terjual 10+</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ================= KOSONG ================= */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <FaStore className="text-4xl text-gray-600 mb-2" />
            <p className="text-gray-400 text-sm">Produk tidak ditemukan.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;