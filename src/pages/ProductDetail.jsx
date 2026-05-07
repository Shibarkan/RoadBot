import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaStore,
  FaArrowLeft,
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaTimes,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBullhorn,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const thumbRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const { data: mainProduct, error: mainError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (mainError) throw mainError;
      setProduct(mainProduct);

      const gallery =
        mainProduct.image_gallery?.length > 0
          ? mainProduct.image_gallery
          : [mainProduct.image_url];
      setImages(gallery);

      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .neq("id", id)
        .limit(6);
      setRelatedProducts(relatedData || []);
    } catch (error) {
      console.error("Gagal memuat:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollThumb = (direction) => {
    if (thumbRef.current) {
      const scrollAmount = 200;
      thumbRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const confirmAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("roadfix_cart")) || [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    localStorage.setItem("roadfix_cart", JSON.stringify(cart));

    // TAMBAHKAN BARIS INI:
    window.dispatchEvent(new Event("cartUpdated"));

    setShowQtyModal(false);
    setShowAlert(true);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        shop_name: product.shop_name || "RoadFix Official Store",
        quantity: qty,
      });
    }

    localStorage.setItem("roadfix_cart", JSON.stringify(cart));
    setShowQtyModal(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="bg-[#030712] min-h-screen pb-24 md:pb-12 text-white overflow-x-hidden">
      {/* ALERT SUKSES */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-cyan-500/50 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-3">
              <FaCheckCircle className="text-cyan-400 text-xl" />
              <span className="text-sm font-bold">Produk masuk keranjang!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL KUANTITAS */}
      <AnimatePresence>
        {showQtyModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQtyModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#111827] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <button
                onClick={() => setShowQtyModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <FaTimes />
              </button>
              <h3 className="text-lg font-bold mb-6 italic text-center text-gray-400 text-xs tracking-widest uppercase">
                Pilih Jumlah
              </h3>

              <div className="flex items-center gap-4 mb-8">
                <img
                  src={product.image_url}
                  className="w-16 h-16 rounded-xl object-cover"
                  alt=""
                />
                <div>
                  <p className="text-sm font-medium line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-cyan-400 font-bold">
                    {formatRupiah(product.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  Jumlah
                </span>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="text-xl font-black">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <button
                onClick={confirmAddToCart}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold uppercase tracking-tighter"
              >
                Konfirmasi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER NAVIGATION */}
      <div className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-lg px-4 py-3 border-b border-white/10 md:pt-24 md:border-none">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 border border-white/20"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <span className="text-white font-medium md:hidden truncate text-sm">
            Detail Produk
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 md:mt-12">
        {/* ================= AREA IKLAN (BANNER ORANYE) ================= */}
        <div className="w-full h-20 md:h-28 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl md:rounded-3xl mb-10 flex items-center px-6 md:px-10 relative overflow-hidden group shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
          <div className="z-10">
            <div className="flex items-center gap-2 text-white mb-1">
              <FaBullhorn className="text-sm animate-bounce" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                Special Promo
              </span>
            </div>
            <h3 className="text-white font-black text-sm md:text-xl italic tracking-tighter uppercase">
              Diskon Hingga 20% Hari Ini!
            </h3>
            <p className="text-orange-100 text-[8px] md:text-xs font-medium">
              Gunakan kode{" "}
              <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                ROADFIX2026
              </span>{" "}
              saat checkout.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 -skew-x-12 translate-x-12 transition-transform group-hover:translate-x-8" />
          <FaStore className="absolute right-6 md:right-10 text-6xl md:text-8xl text-black/10 -rotate-12 group-hover:scale-110 transition-transform" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 mb-12">
          {/* FOTO PRODUK */}
          <div className="flex flex-col relative bg-gray-900 md:bg-transparent">
            <div className="relative w-full h-[45vh] md:h-auto md:aspect-square bg-gray-800 md:rounded-3xl overflow-hidden shadow-2xl border border-white/5">
              <div
                id="image-slider"
                onScroll={(e) =>
                  setCurrentIndex(
                    Math.round(e.target.scrollLeft / e.target.offsetWidth),
                  )
                }
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-full h-full flex-shrink-0 snap-center object-cover"
                    alt=""
                  />
                ))}
              </div>

              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black px-2.5 py-1 rounded-sm shadow-lg">
                MALL
              </div>

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

            {/* Thumbnail dengan tombol >< */}
            <div className="relative mt-4 group">
              <button
                onClick={() => scrollThumb("left")}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-900/80 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <div
                ref={thumbRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-1"
              >
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const slider = document.getElementById("image-slider");
                      if (slider)
                        slider.scrollLeft = index * slider.offsetWidth;
                      setCurrentIndex(index);
                    }}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-cyan-400 scale-95"
                        : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollThumb("right")}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-900/80 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>

          {/* INFO PRODUK */}
          <div className="flex flex-col px-0 pt-6 md:pt-0">
            <div className="text-3xl md:text-5xl font-black text-cyan-400 tracking-tight mb-2">
              {formatRupiah(product?.price)}
            </div>
            <h1 className="text-xl md:text-3xl font-bold mb-4 leading-tight">
              {product?.name}
            </h1>

            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400 mb-8 divide-x divide-gray-700 pb-4 border-b border-white/5">
              <div className="flex items-center gap-1 text-yellow-400 pr-3">
                <span className="font-bold text-white underline decoration-yellow-400 mr-1">
                  {product?.average_rating || 0}
                </span>
                <FaStar />{" "}
                <span className="text-gray-500">
                  ({product?.rating_count || 0})
                </span>
              </div>
              <div className="pl-3">
                <span className="text-white font-medium">
                  {product?.sold || 0}
                </span>{" "}
                Terjual
              </div>
              <div className="pl-3">Stok: {product?.stock}</div>
            </div>

            <div className="hidden md:flex gap-4 mt-auto">
              <button
                onClick={() => setShowQtyModal(true)}
                className="flex-1 py-4 rounded-xl border border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center gap-2 transition-all hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/5"
              >
                <FaShoppingCart /> + Keranjang
              </button>
              <button
                onClick={() => alert("BELUM ADA SISRTEM CEO BLOKKK")}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.02]"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* GARANSI & DESKRIPSI */}
        <div className="space-y-8 mb-16">
          <div className="p-5 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-4 shadow-xl">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 text-2xl flex-shrink-0 shadow-inner">
              <FaShieldAlt />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1 uppercase tracking-tighter text-sm">
                Proteksi RoadFix AI
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                Setiap unit produk dilindungi garansi resmi dan dukungan teknisi
                RoadFix AI 24/7 untuk memastikan kelancaran infrastruktur Anda.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-cyan-400 rounded-full" /> Detail Produk
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-line bg-[#111827]/50 p-6 rounded-3xl border border-white/5 shadow-inner">
              Kategori:{" "}
              <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs ml-2">
                {product?.category}
              </span>
              <br />
              <br />
              {product?.description}
              <br />
              <br />
              * Garansi resmi RoadFix AI selama 1 Tahun.
              <br />
              * Pemasangan dan instalasi software sudah termasuk dalam paket
              pembelian.
              <br />* Pengiriman unit robot dilakukan menggunakan armada khusus
              kami.
            </div>
          </div>
        </div>

        {/* REKOMENDASI PRODUK */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight italic">
              Rekomendasi Lainnya
            </h2>
            <Link
              to="/marketplace"
              className="text-cyan-400 text-xs font-bold hover:underline tracking-widest uppercase"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map((rel) => (
              <Link
                to={`/product/${rel.id}`}
                key={rel.id}
                className="bg-gray-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-400/40 transition-all group flex flex-col shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-gray-800">
                  <img
                    src={rel.image_url}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-[11px] text-gray-300 line-clamp-1 mb-2 font-medium">
                    {rel.name}
                  </h3>
                  <div className="text-cyan-400 font-black text-xs">
                    {formatRupiah(rel.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#030712]/95 backdrop-blur-xl border-t border-white/10 z-50 flex pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button className="flex flex-col items-center justify-center w-1/4 py-3 bg-gray-900 text-gray-400 border-r border-white/5">
          <FaStore className="text-xl mb-1" />
          <span className="text-[9px] font-bold">Toko</span>
        </button>
        <button
          onClick={() => setShowQtyModal(true)}
          className="w-1/4 py-3 bg-gray-900 text-gray-400 flex flex-col items-center justify-center border-r border-white/5"
        >
          <FaShoppingCart className="text-xl mb-1" />
          <span className="text-[9px] font-bold">Keranjang</span>
        </button>
        <button
          onClick={() => navigate("/checkout")}
          className="w-2/4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs uppercase tracking-tighter"
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
