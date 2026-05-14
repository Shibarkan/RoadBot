import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaFileInvoiceDollar,
  FaSpinner,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaShieldAlt,
  FaShippingFast,
  FaBox,
  FaHistory
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const [items, setItems] = useState([]);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // --- OPSI PENGIRIMAN LOKAL (JNE, J&T, KARGO) ---
  const shippingOptions = [
    { id: "jne_reg", name: "JNE Reguler (REG)", est: "Estimasi 3-5 Hari", cost: 50000, icon: <FaTruck /> },
    { id: "jnt_exp", name: "J&T Express", est: "Estimasi 1-2 Hari", cost: 150000, icon: <FaShippingFast /> },
    { id: "indah_kargo", name: "Indah Logistik Kargo", est: "Estimasi 5-7 Hari", cost: 350000, icon: <FaBox /> },
  ];
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions); // Default: JNE Reguler

  // --- 1. LOAD DATA KERANJANG ---
  useEffect(() => {
    window.scrollTo(0, 0);
    let loadedItems = mode === "direct" 
      ? JSON.parse(localStorage.getItem("roadfix_direct_buy")) || []
      : JSON.parse(localStorage.getItem("roadfix_cart")) || [];

    if (loadedItems.length === 0) {
      navigate("/marketplace");
    } else {
      setItems(loadedItems);
    }
  }, [mode, navigate]);

  // --- PERHITUNGAN HARGA DINAMIS ---
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ongkir = selectedShipping.cost; // Ongkir menyesuaikan pilihan
  const total = subtotal + ongkir;

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  // --- 2. FUNGSI PEMBAYARAN (SIMULASI INSTAN) ---
  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true); 

      const newOrderId = `RFX-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);
      
      if (mode === "direct") {
        localStorage.removeItem("roadfix_direct_buy");
      } else {
        localStorage.removeItem("roadfix_cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }

      const pastHistory = JSON.parse(localStorage.getItem("roadfix_history")) || [];
      const newOrderData = {
        orderId: newOrderId,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        total: total,
        // STATUS DISIMPAN SEBAGAI "DIPROSES" AGAR MASUK KE RIWAYAT SEBAGAI KUNING
        status: "Diproses", 
        items: items,
        shipping: selectedShipping.name 
      };
      localStorage.setItem("roadfix_history", JSON.stringify([newOrderData, ...pastHistory]));
      
      setTimeout(() => {
        setShowSuccess(false);
        setStep(3); 
        window.scrollTo(0, 0);
      }, 2000);

    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 px-4">
      
      {/* ================= NOTIFIKASI BERHASIL ================= */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-0 left-0 flex justify-center px-4 pointer-events-none z-50"
          >
            <div className="bg-green-500/90 backdrop-blur-xl border border-green-400 px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.4)] flex items-center gap-3">
              <FaCheckCircle className="text-white text-2xl" />
              <div>
                <p className="text-sm font-black text-white uppercase tracking-tight">Pembayaran Berhasil!</p>
                <p className="text-[10px] text-green-100 font-medium mt-0.5">Menerbitkan invoice pesanan Anda...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= STEP 1: REVIEW & ALAMAT ================= */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 mb-8 transition-colors">
            <FaArrowLeft /> Kembali
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#111827] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
                  <FaMapMarkerAlt className="text-cyan-400" /> Informasi Pengiriman
                </h2>
                <form id="form-checkout" onSubmit={handleNextStep} className="space-y-8">
                  {/* Form Alamat */}
                  <div className="space-y-5">
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input required type="text" placeholder="Nama Lengkap Penerima" 
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl pl-10 pr-4 py-4 focus:border-cyan-500 outline-none transition-all"
                        value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
                    </div>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input required type="number" placeholder="Nomor WhatsApp (Aktif)" 
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl pl-10 pr-4 py-4 focus:border-cyan-500 outline-none transition-all"
                        value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
                    </div>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-500 text-xs" />
                      <textarea required rows="4" placeholder="Alamat Lengkap (Jalan, No. Rumah, Kota, Kode Pos)" 
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl pl-10 pr-4 py-4 focus:border-cyan-500 outline-none transition-all"
                        value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
                    </div>
                  </div>

                  {/* Pilihan Kurir Pengiriman ala E-Commerce */}
                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
                      <FaTruck className="text-cyan-500" /> Pilih Ekspedisi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {shippingOptions.map((option) => (
                        <div 
                          key={option.id}
                          onClick={() => setSelectedShipping(option)}
                          className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-start gap-2 relative overflow-hidden
                            ${selectedShipping.id === option.id 
                              ? 'border-cyan-500 bg-cyan-500/10' 
                              : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                            }`}
                        >
                          {/* Centang hijau jika terpilih */}
                          {selectedShipping.id === option.id && (
                            <div className="absolute top-3 right-3 text-cyan-400">
                              <FaCheckCircle />
                            </div>
                          )}
                          <div className={`text-2xl ${selectedShipping.id === option.id ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {option.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{option.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{option.est}</p>
                            <p className="text-sm font-black text-cyan-400 mt-2">
                              {formatRupiah(option.cost)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Panel Ringkasan Harga */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 h-max sticky top-28 shadow-2xl">
              <h3 className="font-bold mb-6 text-gray-400 uppercase tracking-widest text-[10px]">Ringkasan Pesanan</h3>
              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-contain bg-gray-800 p-1" alt="" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 mt-0.5">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-400"><span>Subtotal Produk</span><span>{formatRupiah(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span className="flex flex-col">
                    Ongkos Kirim
                    <span className="text-[9px] text-cyan-500 font-bold mt-0.5">{selectedShipping.name}</span>
                  </span>
                  <span>{formatRupiah(ongkir)}</span>
                </div>
                <div className="flex justify-between font-black text-cyan-400 pt-3 border-t border-white/5 text-lg">
                  <span>Total Tagihan</span><span>{formatRupiah(total)}</span>
                </div>
              </div>
              <button form="form-checkout" type="submit" className="w-full py-4 mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                Lanjut Pembayaran
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= STEP 2: SIMULASI PEMBAYARAN ================= */}
      {step === 2 && (
        <div className="flex justify-center items-center py-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111827] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 text-xs uppercase font-bold transition-colors">
              <FaArrowLeft /> Kembali
            </button>
            
            <div className="text-center mb-8">
              <FaShieldAlt className="text-cyan-500 text-5xl mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Simulasi Pembayaran</h2>
              <p className="text-xs text-gray-400 leading-relaxed">Klik tombol di bawah ini untuk menyimulasikan proses pembayaran yang sukses secara otomatis.</p>
            </div>

            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-8 text-center shadow-inner">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1">Total Tagihan</p>
              <h2 className="text-3xl font-black text-cyan-400">{formatRupiah(total)}</h2>
              <p className="text-[10px] text-gray-500 mt-2 font-bold bg-gray-800/50 inline-block px-3 py-1 rounded-full">
                Termasuk Ongkir: <span className="text-cyan-500">{selectedShipping.name}</span>
              </p>
            </div>

            <button 
              onClick={handleSimulatePayment} 
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 ${isProcessing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-cyan-500 text-black shadow-[0_15px_30px_rgba(6,182,212,0.3)] active:scale-95'}`}
            >
              {isProcessing ? <><FaSpinner className="animate-spin" /> Memproses...</> : "Bayar Sekarang (Simulasi)"}
            </button>
          </motion.div>
        </div>
      )}

      {/* ================= STEP 3: INVOICE (STRUK) ================= */}
      {step === 3 && (
        <div className="flex justify-center items-center py-10">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-white text-black w-full max-w-md rounded-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)] relative">
            <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter text-blue-600">ROADFIX AI</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Bukti Pesanan Digital</p>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center"><span className="text-gray-500">No. Pesanan</span><span className="font-black">{orderId}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Penerima</span><span className="font-bold">{customer.name}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Waktu</span><span className="font-bold">{new Date().toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Ekspedisi</span><span className="font-bold text-blue-600">{selectedShipping.name}</span></div>
              
              {/* LUNAS DI SINI MENJADI WARNA BIRU */}
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500">Status Pembayaran</span>
                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-black text-[9px] uppercase border border-blue-200">
                  LUNAS
                </span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 my-6"></div>
            
            <div className="space-y-4 mb-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-[11px] font-black leading-tight uppercase">{item.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{item.quantity} x {formatRupiah(item.price)}</p>
                  </div>
                  <span className="text-[11px] font-bold">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-[11px] font-bold text-gray-400"><span>Subtotal Produk</span><span>{formatRupiah(subtotal)}</span></div>
              <div className="flex justify-between text-[11px] font-bold text-gray-400"><span>Ongkos Kirim ({selectedShipping.id.toUpperCase()})</span><span>{formatRupiah(ongkir)}</span></div>
              <div className="flex justify-between text-base font-black text-blue-700 pt-2 border-t border-gray-200 mt-2 uppercase italic tracking-tighter">
                <span>Total Bayar</span><span>{formatRupiah(total)}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 my-6 pt-6 text-center">
              <p className="text-[10px] text-gray-500 italic leading-relaxed">
                Pembayaran berhasil diverifikasi. Pesanan Anda akan segera kami serahkan ke pihak ekspedisi <span className="font-bold text-gray-700">{selectedShipping.name}</span>. Terima kasih!
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button onClick={() => window.print()} className="w-full py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold text-xs flex justify-center items-center gap-2 hover:bg-gray-100 transition-all">
                  <FaFileInvoiceDollar /> Simpan Struk (PDF)
                </button>
                <button onClick={() => navigate("/cart")} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-colors flex justify-center items-center gap-2">
                  <FaHistory className="text-sm" /> Cek Riwayat Pesanan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Checkout;