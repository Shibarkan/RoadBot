import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaQrcode, FaUpload, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const PaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [proofFile, setProofFile] = useState(null);

  // Tangkap data yang dilempar dari halaman Checkout
  const { items, subtotal, ongkir, total, customer, mode } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    // Jika tidak ada data, kembalikan ke marketplace
    if (!total) navigate("/marketplace");
  }, [total, navigate]);

  const formatRupiah = (angka) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  // Handle saat gambar bukti transfer dipilih
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files) {
      setProofFile(e.target.files);
    }
  };

  // Handle konfirmasi pembayaran manual
  const handleConfirmPayment = () => {
    if (!proofFile) {
      alert("Harap unggah bukti transfer terlebih dahulu!");
      return;
    }

    setIsProcessing(true);

    // Simulasi upload dan konfirmasi (2 detik)
    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `RFX-${Date.now()}`;
      
      // Bersihkan Keranjang
      if (mode === "direct") localStorage.removeItem("roadfix_direct_buy");
      else {
        localStorage.removeItem("roadfix_cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }
      
      // Lempar ke halaman Invoice dengan membawa data
      navigate("/invoice", { 
        state: { items, subtotal, ongkir, total, customer, orderId, status: "Menunggu Konfirmasi" } 
      });
    }, 2000);
  };

  if (!total) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 px-4 flex justify-center items-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111827] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
        
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 text-xs uppercase font-bold transition-colors">
          <FaArrowLeft /> Kembali
        </button>
        
        <div className="text-center mb-6">
          <FaQrcode className="text-cyan-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Scan QRIS Berikut</h2>
          <p className="text-xs text-gray-400">Gunakan aplikasi M-Banking atau E-Wallet Anda (GoPay, OVO, Dana, ShopeePay, dll).</p>
        </div>

        {/* --- GANTI GAMBAR INI DENGAN QRIS ASLI KAMU NANTI --- */}
        <div className="bg-white p-4 rounded-3xl mx-auto w-48 h-48 mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
            alt="QRIS RoadFix" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-8 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1">Transfer Tepat Sesuai Nominal</p>
          <h2 className="text-3xl font-black text-cyan-400">{formatRupiah(total)}</h2>
        </div>

        {/* Upload Bukti Pembayaran */}
        <div className="mb-8">
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold text-center">
            Upload Bukti Transfer
          </label>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
              id="upload-proof"
            />
            <label 
              htmlFor="upload-proof" 
              className={`flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${proofFile ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-600 bg-gray-900/50 hover:border-cyan-500 hover:text-cyan-400'}`}
            >
              {proofFile ? (
                <><FaCheckCircle /> {proofFile.name.substring(0, 20)}...</>
              ) : (
                <><FaUpload /> Pilih Gambar Bukti Transfer</>
              )}
            </label>
          </div>
        </div>

        <button 
          onClick={handleConfirmPayment} 
          disabled={isProcessing}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 ${proofFile ? 'bg-cyan-500 text-black shadow-[0_15px_30px_rgba(6,182,212,0.3)] active:scale-95' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
          {isProcessing ? <FaSpinner className="animate-spin" /> : "Konfirmasi Pembayaran"}
        </button>

      </motion.div>
    </div>
  );
};

export default PaymentGateway;