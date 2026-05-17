import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaShoppingCart,
  FaStore,
  FaHistory,
  FaReceipt,
  FaBoxOpen,
  FaClock,
  FaHeart,
} from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();

  // ================= TAB =================
  const [activeTab, setActiveTab] = useState("cart");

  // ================= DATA =================
  const [cartItems, setCartItems] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // ================= LOAD STORAGE =================
  useEffect(() => {
    window.scrollTo(0, 0);

    const savedCart =
      JSON.parse(localStorage.getItem("roadfix_cart")) || [];

    setCartItems(savedCart);

    const savedHistory =
      JSON.parse(localStorage.getItem("roadfix_history")) || [];

    setHistoryOrders(savedHistory);

    const savedWishlist =
      JSON.parse(localStorage.getItem("roadfix_wishlist")) || [];

    setWishlistItems(savedWishlist);

  }, []);

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // ================= UPDATE QTY =================
  const updateQty = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);

        return {
          ...item,
          quantity: newQty,
        };
      }

      return item;
    });

    setCartItems(updatedCart);

    localStorage.setItem(
      "roadfix_cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ================= REMOVE CART =================
  const removeItem = (id) => {
    const filteredCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(filteredCart);

    localStorage.setItem(
      "roadfix_cart",
      JSON.stringify(filteredCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ================= REMOVE WISHLIST =================
  const removeWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.id !== id
    );

    setWishlistItems(updatedWishlist);

    localStorage.setItem(
      "roadfix_wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // ================= ADD TO CART =================
  const addWishlistToCart = (item) => {
    const cart =
      JSON.parse(localStorage.getItem("roadfix_cart")) || [];

    const exist = cart.find((i) => i.id === item.id);

    if (exist) {
      exist.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image_url,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "roadfix_cart",
      JSON.stringify(cart)
    );

    setCartItems(cart);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ================= TOTAL =================
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-[#030712] min-h-screen pt-24 pb-32 px-4 md:px-6">

      <div className="max-w-4xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-8">

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft />
            </button>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              Pesanan Saya
            </h1>
          </div>

          {/* ================= TAB MENU ================= */}
          <div className="flex gap-6 border-b border-gray-800 overflow-x-auto">

            {/* CART */}
            <button
              onClick={() => setActiveTab("cart")}
              className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 relative whitespace-nowrap ${
                activeTab === "cart"
                  ? "text-cyan-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaShoppingCart />

              Keranjang

              {cartItems.length > 0 && (
                <span className="bg-cyan-500 text-black text-[9px] px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}

              {activeTab === "cart" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-t-full" />
              )}
            </button>

            {/* WISHLIST */}
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 relative whitespace-nowrap ${
                activeTab === "wishlist"
                  ? "text-pink-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaHeart />

              Wishlist

              {wishlistItems.length > 0 && (
                <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {wishlistItems.length}
                </span>
              )}

              {activeTab === "wishlist" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-400 rounded-t-full" />
              )}
            </button>

            {/* HISTORY */}
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 relative whitespace-nowrap ${
                activeTab === "history"
                  ? "text-cyan-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaHistory />

              Riwayat

              {historyOrders.length > 0 && (
                <span className="bg-gray-700 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {historyOrders.length}
                </span>
              )}

              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* ================= CART ================= */}
        {/* ================================================= */}

        {activeTab === "cart" && (
          cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-3xl border border-white/5">

              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.1)]">

                <FaShoppingCart className="text-gray-500 text-3xl" />
              </div>

              <h2 className="text-white text-xl font-bold mb-2 tracking-tight">
                Keranjangmu Kosong
              </h2>

              <p className="text-gray-500 text-sm text-center mb-8">
                Wah, sepertinya kamu belum memilih alat atau jasa konstruksi.
              </p>

              <Link
                to="/marketplace"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ITEM */}
              <div className="lg:col-span-2 space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-lg"
                  >

                    {/* STORE */}
                    <div className="flex items-center gap-2 text-gray-400 text-xs border-b border-white/5 pb-3">

                      <FaStore className="text-cyan-400" />

                      <span className="font-bold text-gray-300 uppercase tracking-widest">
                        {item.shop_name ||
                          "RoadFix Official"}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="flex gap-4">

                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0 border border-white/10 p-1 flex justify-center items-center">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">

                        <div
                          onClick={() =>
                            navigate(`/product/${item.id}`)
                          }
                          className="cursor-pointer hover:text-cyan-400 transition-colors"
                        >
                          <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">
                            {item.name}
                          </h3>

                          <p className="text-cyan-400 font-bold text-sm mt-1">
                            {formatRupiah(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">

                          {/* QTY */}
                          <div className="flex items-center border border-gray-700 rounded-lg bg-black/40 overflow-hidden">

                            <button
                              onClick={() =>
                                updateQty(item.id, -1)
                              }
                              className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>

                            <span className="px-4 text-white text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQty(item.id, 1)
                              }
                              className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors p-2"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="lg:col-span-1">

                <div className="bg-[#111827] border border-white/5 rounded-3xl p-6 sticky top-24 shadow-2xl">

                  <h2 className="text-white font-bold mb-4">
                    Ringkasan Belanja
                  </h2>

                  <div className="space-y-3 mb-6 pb-6 border-b border-white/10">

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Total Harga
                      </span>

                      <span className="text-white">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Diskon
                      </span>

                      <span className="text-emerald-400 font-medium">
                        - Rp 0
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-8">

                    <span className="text-white font-bold">
                      Total Tagihan
                    </span>

                    <span className="text-cyan-400 font-black text-xl">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/checkout")
                    }
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Checkout Sekarang
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* ================================================= */}
        {/* ================= WISHLIST ================= */}
        {/* ================================================= */}

        {activeTab === "wishlist" && (
          wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-3xl border border-white/5">

              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-white/10">

                <FaHeart className="text-pink-400 text-3xl" />
              </div>

              <h2 className="text-white text-xl font-bold mb-2 tracking-tight">
                Wishlist Masih Kosong
              </h2>

              <p className="text-gray-500 text-sm text-center mb-8">
                Simpan produk favoritmu di wishlist.
              </p>

              <Link
                to="/marketplace"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold"
              >
                Jelajahi Produk
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all shadow-lg group"
                >

                  {/* IMAGE */}
                  <div
                    onClick={() =>
                      navigate(`/product/${item.id}`)
                    }
                    className="aspect-square bg-gray-800 overflow-hidden cursor-pointer relative"
                  >

                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3 right-3 bg-pink-500 text-white p-2 rounded-full shadow-lg">

                      <FaHeart className="text-xs" />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <h3 className="text-white text-sm font-medium line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h3>

                    <p className="text-pink-400 font-black mt-2">
                      {formatRupiah(item.price)}
                    </p>

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-4">

                      <button
                        onClick={() =>
                          addWishlistToCart(item)
                        }
                        className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white text-xs font-bold"
                      >
                        Keranjang
                      </button>

                      <button
                        onClick={() =>
                          removeWishlist(item.id)
                        }
                        className="w-11 flex justify-center items-center bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ================================================= */}
        {/* ================= HISTORY ================= */}
        {/* ================================================= */}

        {activeTab === "history" && (
          historyOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-3xl border border-white/5">

              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-white/10">

                <FaBoxOpen className="text-gray-500 text-3xl" />
              </div>

              <h2 className="text-white text-xl font-bold mb-2 tracking-tight">
                Belum Ada Riwayat
              </h2>

              <p className="text-gray-500 text-sm text-center mb-8">
                Kamu belum pernah melakukan pemesanan sebelumnya.
              </p>

              <button
                onClick={() => setActiveTab("cart")}
                className="text-cyan-400 text-sm font-bold hover:underline"
              >
                Lihat Keranjang
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {historyOrders.map((order, index) => (
                <div
                  key={index}
                  className="bg-[#111827] border border-white/5 rounded-3xl p-5 shadow-lg"
                >

                  {/* HEADER */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">

                    <div className="flex items-center gap-3">

                      <FaReceipt className="text-cyan-400 text-lg" />

                      <div>
                        <p className="text-white font-bold text-sm">
                          {order.orderId}
                        </p>

                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                          {order.date}
                        </p>
                      </div>
                    </div>

                    <span className="bg-yellow-100 text-yellow-600 px-2.5 py-1 rounded-md font-black text-[9px] uppercase flex items-center gap-1 border border-yellow-200">

                      <FaClock />

                      {order.status}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-4 mb-4">

                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-center"
                      >

                        <img
                          src={item.image}
                          className="w-12 h-12 rounded-lg bg-gray-800 object-contain p-1"
                          alt=""
                        />

                        <div className="flex-1 min-w-0">

                          <p className="text-white font-medium text-xs line-clamp-1">
                            {item.name}
                          </p>

                          <p className="text-gray-500 text-[10px] mt-0.5">
                            {item.quantity} barang x{" "}
                            {formatRupiah(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">

                    <div>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                        Total Belanja
                      </p>

                      <p className="text-cyan-400 font-black text-sm">
                        {formatRupiah(order.total)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate("/marketplace")
                      }
                      className="px-4 py-2 border border-cyan-500 text-cyan-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors"
                    >
                      Beli Lagi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default Cart;