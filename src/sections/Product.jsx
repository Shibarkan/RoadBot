import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewProducts = async () => {
      try {
        // Mengambil produk terbaru
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5); // Ambil 5 data

        if (error) throw error;
        setProducts(data);
      } catch (error) {
        console.error("Gagal memuat produk preview:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviewProducts();
  }, []);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  // Duplikasi array agar animasi marquee tidak pernah terputus (infinite loop)
  const marqueeProducts = [...products, ...products, ...products, ...products];

  return (
    <section className="py-16 w-full bg-[#030712] relative z-10 overflow-hidden">
      
      {/* --- INJEKSI CSS UNTUK ANIMASI MARQUEE --- */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); } 
        }
        .animate-marquee {
          animation: scroll 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER SECTION PREVIEW */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-1 bg-cyan-400 rounded-full"></div>
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">
                Katalog Kami
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Produk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Unggulan</span>
            </h2>
          </div>
          
          <Link 
            to="/marketplace" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-cyan-400 transition-colors group"
          >
            Lihat Semua 
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-t-cyan-500 border-white/10 rounded-full animate-spin"></div>
          </div>
        ) : (
          /* ================= MARQUEE CONTAINER ================= */
          <div 
            className="relative w-full"
            // Efek gradasi transparan di sisi kiri & kanan (Fade Edges)
            style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
          >
            <div className="flex gap-4 w-max animate-marquee py-4">
              {marqueeProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-[180px] md:w-[260px] flex-shrink-0 group cursor-pointer bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all shadow-lg flex flex-col"
                >
                  {/* GAMBAR (Tetap aman dengan object-contain) */}
                  <div className="aspect-square bg-gray-800/50 overflow-hidden flex items-center justify-center p-3">
                    <img 
                      src={product.image_url} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name}
                    />
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="text-xs md:text-sm text-gray-200 line-clamp-2 font-medium mb-3">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-cyan-400 text-xs md:text-sm font-black">
                          {formatRupiah(product.price)}
                        </div>
                        <div className="flex items-center text-[9px] md:text-xs text-gray-500 mt-1">
                          <FaStar className="text-yellow-400 mr-1"/>
                          {product.average_rating || 0} 
                        </div>
                      </div>

                      <div className="p-2 bg-gray-800 text-gray-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-inner">
                        <FaShoppingCart className="text-[10px] md:text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOMBOL LIHAT SEMUA UNTUK MOBILE */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link 
            to="/marketplace" 
            className="px-6 py-3 bg-gray-900 border border-white/10 rounded-xl text-sm font-bold text-white flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            Lihat Semua Produk <FaArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Product;