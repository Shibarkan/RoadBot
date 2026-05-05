import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "../supabase"; // Sesuaikan path ini dengan letak file supabase.js Anda!

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Pencarian dan Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Semua"); // Bisa 'Semua', 'Produk', atau 'Jasa'

  // Fungsi untuk mengambil data dari Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mengambil semua data dari tabel 'products'
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }); // Urutkan dari yang terbaru

        if (error) throw error;
        
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Logika Filter dan Search
  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === "Semua" || item.category === filter;
    return matchSearch && matchFilter;
  });

  // Fungsi format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <section id="produk" className="py-24 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER MARKETPLACE */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg text-white">
            Katalog <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Produk & Jasa</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Temukan solusi terbaik untuk pemeliharaan infrastruktur Anda.
          </p>
        </div>

        {/* SEARCH BAR & FILTER OPTIONS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          
          {/* Tabs Filter */}
          <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            {["Semua", "Produk", "Jasa"].map((kategori) => (
              <button
                key={kategori}
                onClick={() => setFilter(kategori)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === kategori 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari robot atau jasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* GRID KARTU PRODUK */}
        {isLoading ? (
          <div className="text-center text-cyan-400 animate-pulse py-20">Memuat katalog dari database...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">Produk tidak ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={product.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group shadow-lg flex flex-col"
              >
                {/* Gambar Produk */}
                <div className="relative h-56 overflow-hidden bg-gray-900">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-cyan-300">
                    {product.category}
                  </div>
                </div>

                {/* Info Produk */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                    <FaStar />
                    <span className="text-gray-300 ml-1 font-medium">{product.average_rating}</span>
                  </div>

                  {/* Deskripsi Singkat */}
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                    {product.description}
                  </p>

                  {/* Harga dan Tombol Beli */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-extrabold text-white">
                      {formatRupiah(product.price)}
                    </span>
                    <button 
                      onClick={() => alert(`Fitur keranjang untuk ${product.name} akan segera dibuat!`)}
                      className="p-3 bg-blue-600/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-colors border border-blue-500/30 hover:border-blue-500"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Marketplace;