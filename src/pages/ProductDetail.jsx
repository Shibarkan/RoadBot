import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaStore,
  FaArrowLeft,
  FaChevronRight,
} from "react-icons/fa";
import { supabase } from "../supabase";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Slider Gambar & Kuantitas
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil data produk utama
        const { data: mainProduct, error: mainError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (mainError) throw mainError;
        setProduct(mainProduct);

        // Siapkan galeri gambar
        const gallery =
          mainProduct.image_gallery && mainProduct.image_gallery.length > 0
            ? mainProduct.image_gallery
            : [mainProduct.image_url];

        setImages(gallery);
        setActiveImage(gallery[0]);

        // 2. Ambil data produk terkait (Rekomendasi Lainnya)
        const { data: relatedData, error: relatedError } = await supabase
          .from("products")
          .select("*")
          .neq("id", id) // Kecualikan produk yang sedang dilihat
          .limit(5);

        // Pastikan error tidak menghentikan aplikasi, cukup set array kosong jika gagal/kosong
        if (relatedError) {
          console.warn("Gagal memuat rekomendasi:", relatedError.message);
          setRelatedProducts([]);
        } else {
          setRelatedProducts(relatedData || []);
        }

      } catch (error) {
        console.error("Gagal memuat detail produk:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Fungsi pengganti gambar saat diklik dari thumbnail (desktop)
  const setActiveImage = (imgUrl) => {
    const index = images.findIndex((img) => img === imgUrl);
    if (index !== -1) setCurrentIndex(index);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Geser gambar di mobile
  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center pt-20">
        <h2 className="text-white text-xl mb-4">Produk tidak ditemukan.</h2>
        <button
          onClick={() => navigate("/marketplace")}
          className="text-cyan-400 border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400/10 transition-colors"
        >
          Kembali ke Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#030712] min-h-screen pb-24 md:pb-12">
      {/* HEADER MOBILE */}
      <div className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-lg px-4 py-3 border-b border-white/10 md:pt-24 md:border-none md:bg-transparent md:backdrop-blur-none">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white border border-white/20 hover:bg-white/10 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <span className="text-white font-medium md:hidden truncate">
            Detail Produk
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-0 md:px-6 mt-0 md:mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 mb-12">
          
          {/* ================= BAGIAN KIRI: GALERI GAMBAR ================= */}
          <div className="flex flex-col relative bg-gray-900 md:bg-transparent">
            <div className="relative w-full h-[45vh] md:h-auto md:aspect-square bg-gray-800 md:rounded-2xl overflow-hidden shadow-lg border-b md:border border-white/10">
              
              {/* Area Slider */}
              <div
                id="image-slider"
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
                onScroll={handleScroll}
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full flex-shrink-0 snap-center object-cover"
                  />
                ))}
              </div>

              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black px-2.5 py-1 rounded-sm shadow-lg">
                MALL
              </div>

              {/* Indikator Titik (Dots) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2 py-1.5 rounded-full backdrop-blur-md">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-3.5 bg-cyan-400"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail untuk Desktop */}
            <div className="hidden md:flex gap-3 overflow-x-auto hide-scrollbar mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Logika menggeser scrollbar saat thumbnail desktop diklik
                    const slider = document.getElementById("image-slider");
                    if(slider) {
                      slider.scrollLeft = index * slider.offsetWidth;
                    }
                    setCurrentIndex(index);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-cyan-400"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= BAGIAN KANAN: INFO PRODUK ================= */}
          <div className="flex flex-col px-4 md:px-0 pt-4 md:pt-0">
            <div className="mb-2">
              <div className="text-2xl md:text-4xl font-black text-cyan-400 tracking-tight">
                {formatRupiah(product.price)}
              </div>
            </div>

            <h1 className="text-lg md:text-2xl font-medium text-white mb-3 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-[11px] md:text-sm text-gray-400 mb-6 divide-x divide-gray-700 pb-4 border-b border-white/5">
              <div className="flex items-center gap-1 text-yellow-400 pr-3">
                <span className="font-bold text-white underline decoration-yellow-400">
                  {product.average_rating}
                </span>
                <FaStar className="text-[10px] md:text-sm" />
                <FaStar className="text-[10px] md:text-sm" />
                <FaStar className="text-[10px] md:text-sm" />
                <FaStar className="text-[10px] md:text-sm" />
                <FaStar className="text-gray-600 text-[10px] md:text-sm" />
              </div>
              <div className="pl-3"><span className="text-white font-medium">10+</span> Penilaian</div>
              <div className="pl-3"><span className="text-white font-medium">25+</span> Terjual</div>
            </div>

            {/* Kuantitas Desktop */}
            <div className="hidden md:flex items-center gap-6 mb-8">
              <span className="text-gray-400 text-sm font-medium">Kuantitas</span>
              <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700">-</button>
                <div className="px-6 py-2 bg-transparent text-white border-x border-gray-700">{qty}</div>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700">+</button>
              </div>
              <span className="text-gray-500 text-xs">Sisa {product.stock} buah</span>
            </div>

            {/* Tombol Aksi Desktop */}
            <div className="hidden md:flex gap-4 mt-auto">
              <button
                onClick={() => alert("Dimasukkan ke keranjang!")}
                className="flex-1 py-4 rounded-xl border border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-colors"
              >
                <FaShoppingCart /> Masukkan Keranjang
              </button>
              <button
                onClick={() => alert("Lanjut ke Pembayaran")}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* ================= PROFIL TOKO ================= */}
        <div className="px-4 md:px-0">
          <div className="bg-[#111827]/80 border border-white/10 rounded-xl p-3 md:p-6 flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-lg md:text-2xl shadow-lg">
                <FaStore />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm md:text-lg">RoadFix Official Store</h3>
                <p className="text-gray-400 text-[10px] md:text-sm">Aktif 5 menit lalu | Kota Semarang</p>
              </div>
            </div>
            <button className="px-3 py-1.5 border border-cyan-400/50 text-cyan-400 text-[10px] md:text-sm rounded-lg hover:bg-cyan-400/10 transition-colors font-semibold">
              Kunjungi Toko
            </button>
          </div>
        </div>

        {/* ================= DESKRIPSI PRODUK ================= */}
        <div className="px-4 md:px-0 mb-8">
          <h2 className="text-sm md:text-xl font-bold text-white mb-4">Spesifikasi & Deskripsi</h2>
          <div className="text-gray-400 text-xs md:text-base leading-relaxed whitespace-pre-line bg-[#111827]/50 p-4 rounded-xl border border-white/5">
            Kategori: <span className="text-cyan-400 font-bold">{product.category}</span>
            <br /><br />
            {product.description}
            <br /><br />
            * Garansi resmi RoadFix AI selama 1 Tahun.<br />
            * Pemasangan dan instalasi software sudah termasuk dalam paket pembelian.<br />
            * Pengiriman unit robot dilakukan menggunakan armada khusus kami.
          </div>
        </div>

        {/* ================= PRODUK LAIN DARI TOKO INI ================= */}
        <div className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-xl font-bold text-white">Rekomendasi Lainnya</h2>
            <Link to="/marketplace" className="text-cyan-400 text-xs flex items-center gap-1 hover:underline">
              Lihat Semua <FaChevronRight className="text-[8px]" />
            </Link>
          </div>

          {/* Fallback jika tidak ada produk terkait */}
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {relatedProducts.map((relProduct) => (
                <Link
                  to={`/product/${relProduct.id}`}
                  key={relProduct.id}
                  className="bg-gray-900 border border-white/5 rounded-lg overflow-hidden hover:border-cyan-400/40 transition-colors group flex flex-col"
                >
                  <div className="aspect-square bg-gray-800 overflow-hidden">
                    <img
                      src={relProduct.image_url}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2 flex flex-col flex-grow justify-between">
                    <h3 className="text-[10px] text-gray-200 line-clamp-2 leading-tight mb-1">
                      {relProduct.name}
                    </h3>
                    <div className="text-cyan-400 font-bold text-[10px] truncate">
                      {formatRupiah(relProduct.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-700 rounded-xl bg-gray-900/30">
              <p className="text-gray-500 text-xs">Belum ada rekomendasi produk lain.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= FIXED BOTTOM BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#030712] border-t border-gray-800 z-50 flex pb-safe">
        <button className="flex flex-col items-center justify-center w-1/4 py-2 bg-gray-900 text-gray-300 hover:text-cyan-400 border-r border-gray-800 transition-colors">
          <FaStore className="text-base mb-1" />
          <span className="text-[8px]">Toko</span>
        </button>
        <button
          onClick={() => alert("Dimasukkan ke keranjang!")}
          className="w-1/4 py-2 bg-gray-900 text-gray-300 hover:text-cyan-400 flex flex-col items-center justify-center transition-colors"
        >
          <FaShoppingCart className="text-base mb-1" />
          <span className="text-[8px]">Keranjang</span>
        </button>
        <button
          onClick={() => alert("Lanjut ke Pembayaran")}
          className="w-2/4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm"
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;