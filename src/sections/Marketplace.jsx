import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaStar, FaRobot, FaTools, FaFire } from "react-icons/fa";
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

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <section id="marketplace" className="py-12 relative w-full bg-[#030712] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* SEARCH & FILTER (STIKER DI ATAS) */}
        <div className="sticky top-20 z-30 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 p-3 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
            {/* Search Box */}
            <div className="relative flex-grow group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari solusi perbaikan jalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/5 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-all"
              />
            </div>
            {/* Filter Tabs */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
              {["Semua", "Produk", "Jasa"].map((kategori) => (
                <button
                  key={kategori}
                  onClick={() => setFilter(kategori)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filter === kategori 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {kategori}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID (Gaya Marketplace: 2 Kolom di Mobile, 5 di Desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  className="group flex flex-col bg-gray-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-cyan-400/40 hover:bg-gray-800/60 transition-all duration-300 shadow-lg"
                >
                  {/* Image Section (Ukuran lebih kecil & proporsional) */}
                  <div className="relative aspect-square overflow-hidden bg-gray-800">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge Terlaris/Promo */}
                    {product.average_rating >= 4.8 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                        <FaFire className="text-[10px]" /> STAR+
                      </div>
                    )}
                  </div>

                  {/* Content Section (Padding lebih kecil) */}
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-medium text-gray-100 line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors h-10">
                      {product.name}
                    </h3>
                    
                    {/* Harga (Dibuat mencolok ala Shopee) */}
                    <div className="text-blue-400 font-bold text-base mb-2">
                      {formatRupiah(product.price)}
                    </div>

                    {/* Meta Info (Rating & Lokasi/Kategori) */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <FaStar className="text-yellow-500" />
                        <span>{product.average_rating}</span>
                        <span className="mx-1">|</span>
                        <span>Terjual 10+</span>
                      </div>
                    </div>

                    {/* Button Beli Cepat */}
                    <button 
                      onClick={() => alert(`Ditambahkan ke keranjang!`)}
                      className="mt-3 w-full py-2 bg-blue-600/10 border border-blue-600/30 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all uppercase tracking-wider"
                    >
                      + Keranjang
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm italic">Produk tidak ditemukan...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;