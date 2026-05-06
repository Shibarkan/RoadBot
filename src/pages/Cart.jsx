import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart, FaStore } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // 1. Ambil data dari LocalStorage saat halaman dibuka
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("roadfix_cart")) || [];
    setCartItems(savedCart);
  }, []);

  // 2. Fungsi Update Kuantitas
  const updateQty = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("roadfix_cart", JSON.stringify(updatedCart)); // Simpan perubahan ke HP[cite: 1]
  };

  // 3. Fungsi Hapus Item
  const removeItem = (id) => {
    const filteredCart = cartItems.filter((item) => item.id !== id);
    setCartItems(filteredCart);
    localStorage.setItem("roadfix_cart", JSON.stringify(filteredCart)); // Update LocalStorage[cite: 1]
  };

  // 4. Hitung Total Belanja
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <FaShoppingCart className="text-gray-600 text-3xl" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">Keranjangmu Kosong</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Wah, sepertinya kamu belum memilih alat tempur RoadFix AI.</p>
        <Link to="/marketplace" className="px-8 py-3 bg-cyan-500 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#030712] min-h-screen pt-24 pb-32 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Bagian Atas */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Keranjang Belanja</h1>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md font-bold">
            {cartItems.length} Item
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIST ITEM KERANJANG */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-gray-900/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
                
                {/* Info Toko */}
                <div className="flex items-center gap-2 text-gray-400 text-xs border-b border-white/5 pb-3">
                  <FaStore className="text-cyan-400" />
                  <span className="font-bold text-gray-300">{item.shop || "RoadFix Official"}</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-medium text-sm md:text-base line-clamp-1">{item.name}</h3>
                      <p className="text-cyan-400 font-bold text-sm mt-1">{formatRupiah(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Kontrol Qty */}
                      <div className="flex items-center border border-gray-700 rounded-lg bg-black/40 overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1.5 md:p-2 text-gray-400 hover:text-white">
                          <FaMinus className="text-[10px]" />
                        </button>
                        <span className="px-4 text-white text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1.5 md:p-2 text-gray-400 hover:text-white">
                          <FaPlus className="text-[10px]" />
                        </button>
                      </div>

                      {/* Tombol Hapus */}
                      <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RINGKASAN BELANJA */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold mb-4">Ringkasan Belanja</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Harga ({cartItems.length} barang)</span>
                  <span className="text-white">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Diskon</span>
                  <span className="text-emerald-400">- Rp 0</span>
                </div>
              </div>
              <div className="flex justify-between mb-8">
                <span className="text-white font-bold">Total Tagihan</span>
                <span className="text-cyan-400 font-black text-xl">{formatRupiah(totalPrice)}</span>
              </div>
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;