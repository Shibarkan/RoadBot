import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaPlus,
  FaTimes,
  FaMinus,
  FaCheckCircle,
  FaHeart,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Semua");

  // ================= CART =================
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  // ================= WISHLIST =================
  const [wishlist, setWishlist] = useState([]);
  const [showWishlistAlert, setShowWishlistAlert] =
    useState(false);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // ================= FETCH =================
  useEffect(() => {
    window.scrollTo(0, 0);

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("roadfix_wishlist")
      ) || [];

    setWishlist(savedWishlist);

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) throw error;

        setProducts(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= FORMAT =================
  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  // ================= CART =================
  const handleConfirmAdd = () => {
    const cart =
      JSON.parse(
        localStorage.getItem("roadfix_cart")
      ) || [];

    const exist = cart.find(
      (i) => i.id === selectedProduct.id
    );

    if (exist) {
      exist.quantity += qty;
    } else {
      cart.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image_url,
        shop_name:
          selectedProduct.shop_name ||
          "RoadFix Official Store",
        quantity: qty,
      });
    }

    localStorage.setItem(
      "roadfix_cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setShowCartPopup(false);

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // ================= WISHLIST =================
  const toggleWishlist = (product) => {
    let updatedWishlist = [...wishlist];

    const exists = updatedWishlist.find(
      (i) => i.id === product.id
    );

    if (exists) {
      updatedWishlist =
        updatedWishlist.filter(
          (i) => i.id !== product.id
        );
    } else {
      updatedWishlist.unshift(product);

      setShowWishlistAlert(true);

      setTimeout(() => {
        setShowWishlistAlert(false);
      }, 2500);
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "roadfix_wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // ================= FILTER =================
  const filteredProducts = [...products]
    .sort((a, b) => {
      const aWishlisted = wishlist.some(
        (i) => i.id === a.id
      );

      const bWishlisted = wishlist.some(
        (i) => i.id === b.id
      );

      return bWishlisted - aWishlisted;
    })
    .filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchFilter =
        filter === "Semua" ||
        item.category === filter;

      return matchSearch && matchFilter;
    });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  return (
    <section className="py-4 w-full bg-[#030712]/90 backdrop-blur-sm min-h-screen pt-20 overflow-x-hidden">
      
      {/* ================= ALERT CART ================= */}
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

              <span className="text-sm font-bold text-white">
                Berhasil masuk keranjang!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ALERT WISHLIST ================= */}
      <AnimatePresence>
        {showWishlistAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-40 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-pink-500/50 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] flex items-center gap-3">
              <FaHeart className="text-pink-400 text-xl" />

              <span className="text-sm font-bold text-white">
                Berhasil masuk wishlist!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL CART ================= */}
      <AnimatePresence>
        {showCartPopup && selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setShowCartPopup(false)
              }
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="relative bg-[#111827] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <button
                onClick={() =>
                  setShowCartPopup(false)
                }
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <FaTimes />
              </button>

              <h3 className="text-lg font-bold mb-6 italic text-center text-gray-400 text-xs tracking-widest uppercase">
                Pilih Jumlah
              </h3>

              <div className="flex items-center gap-4 mb-8">
                <img
                  src={selectedProduct.image_url}
                  className="w-16 h-16 rounded-xl object-cover"
                  alt=""
                />

                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {selectedProduct.name}
                  </p>

                  <p className="text-cyan-400 font-bold">
                    {formatRupiah(
                      selectedProduct.price
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  Jumlah
                </span>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() =>
                      setQty(
                        Math.max(1, qty - 1)
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white"
                  >
                    <FaMinus className="text-xs" />
                  </button>

                  <span className="text-xl font-black text-white">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      setQty(qty + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleConfirmAdd}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold uppercase tracking-tighter hover:scale-[1.01] transition-all"
              >
                Tambahkan Ke Keranjang
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-4">

        {/* ================= SEARCH ================= */}
        <div className="sticky top-16 z-30 mb-6 bg-[#030712]/80 backdrop-blur-md py-4">

          <div className="flex gap-3">

            {/* SEARCH */}
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                placeholder="Cari alat atau jasa konstruksi..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* FILTER */}
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="bg-gray-900 border border-gray-800 text-sm text-white px-4 py-3 rounded-xl focus:border-cyan-500 transition-all outline-none"
            >
              <option value="Semua">
                Semua
              </option>

              <option value="Produk">
                Produk
              </option>

              <option value="Jasa">
                Jasa
              </option>
            </select>

            {/* UPLOAD */}
            <button
              onClick={() =>
                navigate("/upload")
              }
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-t-cyan-500 border-white/10 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

              {currentProducts.map(
                (product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="group cursor-pointer bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all shadow-lg"
                  >

                    {/* IMAGE */}
                    <div
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                      className="aspect-square bg-gray-800 overflow-hidden relative"
                    >

                      {/* WISHLIST BADGE */}
                      {wishlist.some(
                        (i) =>
                          i.id === product.id
                      ) && (
                        <div className="absolute top-2 left-2 z-20 bg-pink-500 text-white text-[10px] px-2 py-1 rounded-full shadow-lg">
                          Wishlist
                        </div>
                      )}

                      <img
                        src={
                          product.image_url
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={product.name}
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-2">

                      <h3 className="text-[11px] text-gray-200 line-clamp-2 min-h-[32px]">
                        {product.name}
                      </h3>

                      <div className="flex justify-between items-end gap-2 mt-2">

                        {/* PRICE */}
                        <div>
                          <div className="text-cyan-400 text-xs font-black">
                            {formatRupiah(
                              product.price
                            )}
                          </div>

                          <div className="flex items-center text-[10px] text-gray-500 mt-1">
                            <FaStar className="text-yellow-400 mr-1" />

                            {product.average_rating ||
                              0}
                          </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex items-center gap-2">

                          {/* WISHLIST */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              toggleWishlist(
                                product
                              );
                            }}
                            className={`
                              p-2.5 rounded-xl transition-all
                              ${
                                wishlist.some(
                                  (i) =>
                                    i.id ===
                                    product.id
                                )
                                  ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                                  : "bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-white"
                              }
                            `}
                          >
                            <FaHeart className="text-sm" />
                          </button>

                          {/* CART */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedProduct(
                                product
                              );

                              setQty(1);

                              setShowCartPopup(
                                true
                              );
                            }}
                            className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-inner"
                          >
                            <FaShoppingCart className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

                {/* PREV */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all
                    ${
                      currentPage === 1
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                    }
                  `}
                >
                  Prev
                </button>

                {/* PAGE NUMBER */}
                {[...Array(totalPages)].map(
                  (_, index) => {
                    const page =
                      index + 1;

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`
                          w-10 h-10 rounded-xl text-sm font-bold transition-all
                          ${
                            currentPage ===
                            page
                              ? "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                              : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                          }
                        `}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                {/* NEXT */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all
                    ${
                      currentPage ===
                      totalPages
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                    }
                  `}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Marketplace;