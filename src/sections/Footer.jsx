import React from "react";
import { 
  FaRobot, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt 
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Teks untuk animasi berjalan (marquee)
  const marqueeText = " ROADFIX AI • SMART MOBILITY • AUTOMATED REPAIR • IOT SENSORS • CLOUD ANALYTICS •";

  return (
    <footer className="relative w-full bg-black/80 backdrop-blur-xl border-t border-white/10 pt-8 pb-8 overflow-hidden z-10">
      
      {/* Efek Cahaya di Background Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/20 blur-[100px] -z-10"></div>

      {/* TEKS BERJALAN INFINITY (MARQUEE) */}
      <div className="w-full overflow-hidden flex border-b border-white/10 pb-8 mb-12">
        <motion.div 
          className="flex whitespace-nowrap text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 opacity-40 select-none"
          animate={{ x: [0, -1035] }} // Bergerak ke kiri secara terus-menerus
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {/* Mengulang teks 4 kali agar bisa looping tanpa terputus di layar besar */}
          <span>{marqueeText}{marqueeText}{marqueeText}{marqueeText}</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* BUNGKUS GRID UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* KOLOM 1: BRAND & DESKRIPSI */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer group">
              <FaRobot className="text-3xl text-blue-400 group-hover:text-cyan-300 transform group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              <div>
                <span className="text-white">RoadFix</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"> AI</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Membangun masa depan infrastruktur dengan teknologi IoT dan Artificial Intelligence. Kami menghadirkan solusi pemeliharaan jalan yang cerdas, cepat, dan efisien.
            </p>
            
            {/* Sosial Media - Animasi Putar seperti Koin (3D Coin Flip) */}
            <div className="flex gap-4" style={{ perspective: '1000px' }}>
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-700 hover:[transform:rotateY(360deg)] shadow-lg"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* KOLOM 2: TAUTAN CEPAT (PRODUK & LAYANAN) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: "easeOut" } }
            }}
          >
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Produk Robotik
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {[
                "Robot 1 (Scanner IoT)", 
                "Robot 2 (Patcher Otomatis)", 
                "Robot 3 (Heavy Duty)", 
                "Robot 4 (Drone Pemantau)", 
                "Robot 5 (AI Analytics Unit)"
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-cyan-300 text-sm flex items-center gap-2 group transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-cyan-300 group-hover:scale-150 transition-all"></span>
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* KOLOM 3: KONTAK & INFO */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }
            }}
          >
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-400 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm group cursor-pointer hover:text-cyan-300 transition-colors">
                <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0 group-hover:animate-bounce" />
                <span>Universitas Diponegoro<br/>Jl. Prof. Sudarto No.13, Tembalang, Kota Semarang, Jawa Tengah 50275</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group cursor-pointer hover:text-cyan-300 transition-colors">
                <FaPhoneAlt className="text-blue-400 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                <span>083156980314</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group cursor-pointer hover:text-cyan-300 transition-colors">
                <FaEnvelope className="text-blue-400 flex-shrink-0 group-hover:-rotate-12 transition-transform" />
                <span>kelompok2iot@gmail.com</span>
              </li>
            </ul>
          </motion.div>

          {/* KOLOM 4: NEWSLETTER */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } }
            }}
          >
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Berlangganan
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-400 rounded-full"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Dapatkan pembaruan terbaru tentang teknologi perbaikan infrastruktur dari kami.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Masukkan email Anda" 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all transform hover:scale-[1.02] active:scale-95"
              >
                Langganan Sekarang
              </button>
            </form>
          </motion.div>

        </div>

        {/* GARIS PEMISAH & COPYRIGHT */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5 }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Kelompok 2 IoT. All rights reserved. <br className="md:hidden" />
            Designed for Smart Mobility.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-cyan-300 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-cyan-300 transition-colors">Syarat & Ketentuan</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;