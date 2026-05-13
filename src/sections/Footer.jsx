import React, { useState } from "react";
import { 
  FaRobot, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("idle"); 

  // Varians untuk animasi Grid Column muncul berurutan (Staggered)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Jeda antar elemen anak
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Teks animasi berjalan disesuaikan dengan produk utama
  const marqueeText = " ROADFIX PRO V.1 • CROWD-METRIC BOX (CMB) • CIVIL ENGINEERING AI • AUTONOMOUS REPAIR • EDGE COMPUTING • ";

  // ========================================================
  // FUNGSI KIRIM EMAIL OTOMATIS KE PELANGGAN VIA EMAILJS
  // ========================================================
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus("loading");

    // ========================================================
    // KODE EMAILJS KAMU (Tinggal Isi Service ID & Public Key)
    // ========================================================
    const serviceID = "service_yxlmfte";    // <--- GANTI INI
    const templateID = "template_c2rye5o";  // <--- SUDAH SESUAI
    const publicKey = "EtKAxQyHUJk7EuYQn";    // <--- GANTI INI

    try {
      if(serviceID === "YOUR_SERVICE_ID" || publicKey === "YOUR_PUBLIC_KEY") {
        throw new Error("EmailJS Credentials belum diisi");
      }

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceID,
          template_id: templateID,
          user_id: publicKey,
          template_params: {
            user_email: email, 
            reply_to: "kelompok2iot@gmail.com"
          }
        })
      });

      if (response.ok) {
        setSubscribeStatus("success");
        setEmail(""); 
        
        setTimeout(() => {
          setSubscribeStatus("idle");
        }, 3000);
      } else {
        alert("Gagal mengirim. Cek Service ID, Public Key, atau kuota EmailJS.");
        setSubscribeStatus("idle");
      }
    } catch (error) {
      console.error("Error:", error);
      if(error.message === "EmailJS Credentials belum diisi") {
        alert("Tombol simulasi berhasil di-klik, tapi email nyata tidak terkirim karena Service ID / Public Key belum diisi di kode.");
      } else {
        alert("Terjadi kesalahan jaringan.");
      }
      setSubscribeStatus("idle");
    }
  };

  return (
    <footer className="relative w-full bg-[#02040a] border-t border-white/5 pt-8 pb-8 overflow-hidden z-10 font-sans">
      
      {/* ================= BACKGROUND AMBIENT GLOW ================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-3/4 h-32 bg-blue-600/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* ================= TEKS BERJALAN INFINITY ================= */}
      <div className="w-full overflow-hidden flex border-b border-white/5 pb-8 mb-12 relative group">
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#02040a] to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#02040a] to-transparent z-10"></div>

        <motion.div 
          className="flex whitespace-nowrap w-max"
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          whileHover={{ animationPlayState: "paused" }} 
        >
          <div className="flex text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 opacity-40 select-none tracking-tight">
            <span className="pr-6">{marqueeText} {marqueeText} {marqueeText}</span>
            <span className="pr-6">{marqueeText} {marqueeText} {marqueeText}</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        
        {/* ================= BUNGKUS GRID UTAMA (Diperbaiki Tag Penutupnya) ================= */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} 
          variants={containerVariants}
        >
          
          {/* KOLOM 1: BRAND & DESKRIPSI */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-6">
            <div className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight cursor-pointer group w-max">
              <FaRobot className="text-3xl text-cyan-400 group-hover:text-white transform group-hover:rotate-[360deg] transition-all duration-700 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <div>
                <span className="text-white">RoadFix</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> AI</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed md:pr-4 font-light">
              Menghadirkan revolusi pemeliharaan infrastruktur dan pemantauan tata kota. Paduan Civil Engineering dan Artificial Intelligence untuk Smart City masa depan.
            </p>
            
            <div className="flex gap-3.5 pt-2" style={{ perspective: '1000px' }}>
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-[#0a0f1a] border border-white/5 flex items-center justify-center text-gray-500 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-700 hover:[transform:rotateY(180deg)] shadow-inner group"
                >
                  <div className="transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                    <Icon className="text-sm" />
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* KOLOM 2: TAUTAN CEPAT */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-7 relative inline-block tracking-wide">
              Produk & Solusi
              <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
            </h3>
            <ul className="space-y-3.5">
              {[
                "RoadFix Pro V.1 (Patcher)", 
                "Crowd-Metric Box (CMB)", 
                "Civil Engineering AI", 
                "Layanan DPU & Tol", 
                "Kawasan Industri"
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center gap-3 w-max relative group overflow-hidden pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-800 border border-gray-700 group-hover:bg-cyan-400 group-hover:border-cyan-300 transition-all duration-300"></span>
                    <span>{item}</span>
                    <span className="absolute bottom-0 left-0 w-full h-px bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* KOLOM 3: KONTAK */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-7 relative inline-block tracking-wide">
              Hubungi Kami
              <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
            </h3>
            <ul className="space-y-5">
              {[
                { icon: FaMapMarkerAlt, text: "Universitas Diponegoro, Semarang." },
                { icon: FaPhoneAlt, text: "083156980314" },
                { icon: FaEnvelope, text: "kelompok2iot@gmail.com" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-gray-400 text-sm group cursor-pointer hover:text-white transition-colors duration-300">
                  <item.icon className="text-cyan-500 mt-1 flex-shrink-0 group-hover:text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
                  <span className="leading-relaxed font-light">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* KOLOM 4: NEWSLETTER */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-7 relative inline-block tracking-wide">
              Berlangganan
              <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-5 font-light leading-relaxed">
              Dapatkan info terkini terkait rilis CMB 2026 dan jadwal pameran RoadFix Pro.
            </p>
            <form className="flex flex-col gap-3.5" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeStatus === "loading" || subscribeStatus === "success"}
                placeholder="Masukkan email Anda" 
                className="w-full px-4.5 py-3 rounded-xl bg-[#0a0f1a] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-50 font-light text-sm"
                required
              />
              <button 
                type="submit" 
                disabled={subscribeStatus === "loading" || subscribeStatus === "success"}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all duration-500 transform flex items-center justify-center gap-2.5 
                  ${subscribeStatus === "success" 
                    ? "bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.5)] scale-100" 
                    : subscribeStatus === "loading"
                    ? "bg-gray-700 text-gray-400 cursor-wait scale-98"
                    : "bg-cyan-500 hover:bg-cyan-400 text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-[1.03] active:scale-95"
                  }`}
              >
                {subscribeStatus === "loading" ? (
                  <><FaSpinner className="animate-spin text-sm" /> Memproses...</>
                ) : subscribeStatus === "success" ? (
                  <><FaCheckCircle className="text-sm" /> Berhasil Berlangganan!</>
                ) : (
                  "Langganan Sekarang"
                )}
              </button>
            </form>
          </motion.div>

        </motion.div> {/* <--- INI TAG YANG TADI TYPO, SUDAH BENAR SEKARANG */}

        {/* ================= GARIS PEMISAH & COPYRIGHT ================= */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-5"
        >
          <p className="text-gray-600 text-xs text-center md:text-left font-light leading-relaxed">
            &copy; {new Date().getFullYear()} Kelompok 2 IoT. All rights reserved. <br className="md:hidden" />
            Innovating Smart City Infrastructure.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            {["Kebijakan Privasi", "Syarat & Ketentuan"].map(link => (
              <a href="#" key={link} className="hover:text-cyan-400 transition-colors duration-300 relative group overflow-hidden w-max">
                {link}
                <span className="absolute bottom-0 left-0 w-full h-px bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;