import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaFileInvoiceDollar, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { items, subtotal, ongkir, total, customer, orderId, status } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!orderId) navigate("/");
  }, [orderId, navigate]);

  if (!orderId) return null;

  const formatRupiah = (angka) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  return (
    /* 1. Tambahkan print:bg-white dan print:pt-0 agar tidak ada jarak kosong di atas saat print */
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-12 px-4 flex justify-center items-center print:bg-white print:pt-0 print:pb-0 print:block">
      
      {/* 2. Tambahkan print:shadow-none dan print:m-0 agar struk menempel ke pinggir kertas print */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white text-black w-full max-w-md rounded-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)] relative print:shadow-none print:max-w-full print:p-4"
      >
        
        {/* Header Struk */}
        <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 print:w-12 print:h-12">
            <FaCheckCircle className="text-4xl text-green-500 print:text-2xl" />
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-blue-600">ROADFIX AI</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Bukti Pesanan Digital</p>
        </div>

        {/* Info Order */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">No. Pesanan</span>
            <span className="font-black">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Penerima</span>
            <span className="font-bold">{customer?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Waktu</span>
            <span className="font-bold">{new Date().toLocaleString('id-ID')}</span>
          </div>
          
          <div className="flex justify-between items-center pt-1">
            <span className="text-gray-500">Status</span>
            <span className="bg-green-100 text-green-600 px-2.5 py-1 rounded-md font-black text-[9px] uppercase flex items-center gap-1 border border-green-200 print:border-none">
              <FaClock /> {status || "MENUNGGU KONFIRMASI"}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 my-6 print:my-4"></div>

        {/* Daftar Barang */}
        <div className="space-y-4 mb-6 print:space-y-2 print:mb-4">
          {items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-[11px] font-black leading-tight uppercase">{item.name}</p>
                <p className="text-[10px] text-gray-500 mt-1">{item.quantity} x {formatRupiah(item.price)}</p>
              </div>
              <span className="text-[11px] font-bold">{formatRupiah(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="space-y-2 pt-4 border-t border-gray-100 print:pt-2">
          <div className="flex justify-between text-[11px] font-bold text-gray-400">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-gray-400">
            <span>Ongkos Kirim</span>
            <span>{formatRupiah(ongkir)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-blue-700 pt-3 border-t border-gray-200 mt-2 uppercase italic tracking-tighter">
            <span>Total Bayar</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Footer Struk */}
        <div className="border-t-2 border-dashed border-gray-200 my-6 pt-6 text-center print:my-4 print:pt-4">
          <p className="text-[10px] text-gray-500 italic leading-relaxed">
            Pesanan Anda sedang diproses. Terima kasih telah memilih RoadFix AI!
          </p>
          
          {/* 3. Sembunyikan tombol saat sedang diprint dengan print:hidden */}
          <div className="mt-6 flex flex-col gap-3 print:hidden">
            <button 
              onClick={() => window.print()} 
              className="w-full py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold text-xs flex justify-center items-center gap-2 hover:bg-gray-100 transition-all"
            >
              <FaFileInvoiceDollar /> Simpan Struk (PDF)
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Invoice;