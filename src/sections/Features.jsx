import React, { useEffect, useRef } from "react";
import { 
  FaWifi, 
  FaBrain, 
  FaCogs, 
  FaRobot, 
  FaLeaf, 
  FaBolt, 
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaArrowUp
} from "react-icons/fa";
import { motion, useInView, animate } from "framer-motion";
import Product from "./Product";

// ================= KOMPONEN ANGKA BERJALAN =================
const AnimatedCounter = ({ from = 0, to, prefix = "", suffix = "", decimals = 0, duration = 2.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, prefix, suffix, decimals, duration]);

  return <span ref={ref}>{prefix}{from}{suffix}</span>;
};
// ==========================================================

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <FaWifi />,
      step: "01",
      title: "IoT Real-Time",
      description: "Sensor getaran dan kamera smartphone menangkap data kondisi jalan secara instan.",
      color: "from-blue-500 to-cyan-400",
      direction: -100, 
      rotate: -10,
      animDuration: 3, 
      status: "SENSORS ACTIVE",
    },
    {
      id: 2,
      icon: <FaBrain />,
      step: "02",
      title: "AI Analysis",
      description: "Cloud server menganalisis tingkat keparahan dan menentukan prioritas perbaikan.",
      color: "from-purple-500 to-blue-400",
      direction: 0,
      rotate: 0,
      animDuration: 4.5, 
      status: "PROCESSING DATA",
    },
    {
      id: 3,
      icon: <FaCogs />,
      step: "03",
      title: "Auto Repair",
      description: "Robot aktuator menerima koordinat, menuju lokasi, dan menambal jalan secara otomatis.",
      color: "from-cyan-500 to-emerald-400",
      direction: 100,
      rotate: 10,
      animDuration: 3.5, 
      status: "SYSTEM STANDBY",
    },
  ];

  const coreTechs = [
    {
      icon: <FaRobot />,
      title: "Navigasi LiDAR otonom",
      desc: "Menghindari rintangan dan lalu lintas dengan akurasi pemetaan 3D real-time.",
      colSpan: "md:col-span-2",
    },
    {
      icon: <FaBolt />,
      title: "Edge Computing",
      desc: "Pemrosesan data di tempat tanpa latensi cloud.",
      colSpan: "md:col-span-1",
    },
    {
      icon: <FaLeaf />,
      title: "Eco-Patch Material",
      desc: "Menggunakan aspal daur ulang cepat kering ramah lingkungan.",
      colSpan: "md:col-span-1",
    },
    {
      icon: <FaChartLine />,
      title: "Command Center",
      desc: "Pantau seluruh armada robot dari satu dashboard terpusat 24/7.",
      colSpan: "md:col-span-2",
    },
  ];

  return (
    // DI SINI PERUBAHANNYA: bg-[#030712] dihapus dan diganti bg-transparent
    <section id="cara-kerja" className="py-16 md:py-24 relative z-10 bg-transparent w-full overflow-hidden">
      
      {/* ================= BACKGROUND GLOW ================= */}
      {/* Glow tetap dipertahankan karena sifatnya transparan dan menambah estetika di atas galaksi */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-20 w-64 h-64 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-64 h-64 md:w-96 md:h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= SECTION 1: ALUR KERJA ================= */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6 tracking-tighter text-white">
            Alur Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RoadFix AI</span>
          </h2>
          <div className="h-1 md:h-1.5 w-16 md:w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-lg leading-relaxed">
            Sistem terintegrasi untuk deteksi dan perbaikan infrastruktur jalan secara presisi tanpa intervensi manusia.
          </p>
        </motion.div>

        <div className="relative mb-24 md:mb-40">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-800/50 -z-10 -translate-y-1/2 overflow-hidden rounded-full">
            <motion.div
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-1/4 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: feature.direction, y: 50, rotateY: feature.rotate, scale: index === 1 ? 0.5 : 1 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12, delay: index * 0.1 } }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative group"
              >
                <span className="absolute -top-8 md:-top-10 -left-2 md:-left-4 text-6xl md:text-8xl font-black text-white/[0.03] pointer-events-none group-hover:text-cyan-500/10 transition-colors duration-500">
                  {feature.step}
                </span>

                {/* Glassmorphism di sini bikin teks tetap terbaca walau background galaksi terang */}
                <div className="relative z-10 bg-[#111827]/70 backdrop-blur-xl border border-gray-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:border-cyan-500/50 transition-all duration-400 shadow-2xl h-full flex flex-col items-center text-center group-hover:-translate-y-2 md:group-hover:-translate-y-4">
                  
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2">
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-[8px] md:text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{feature.status}</span>
                  </div>

                  <div className="perspective-1000 mb-4 md:mb-6 mt-4">
                    <motion.div animate={{ rotateY: 360 }} transition={{ duration: feature.animDuration, repeat: Infinity, ease: "linear", delay: index * 0.5 }} className={`p-4 md:p-5 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg flex items-center justify-center relative`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl opacity-50`}></div>
                      <div className="text-2xl md:text-3xl text-white relative z-10">{feature.icon}</div>
                    </motion.div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4 group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{feature.description}</p>
                </div>
                
                <div className="hidden md:block absolute top-1/2 -right-6 w-3 h-3 bg-gray-800 border-2 border-cyan-500 rounded-full group-hover:bg-cyan-500 group-hover:shadow-[0_0_15px_#06b6d4] transition-all duration-300 -translate-y-1/2 z-20 group-last:hidden"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 2: TEKNOLOGI INTI ================= */}
        <div className="mb-24 md:mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight">Teknologi Di Balik Layar</h2>
            <p className="text-gray-400 mt-2 md:mt-4 text-sm md:text-base max-w-2xl mx-auto">Dirancang menggunakan standar industri 4.0 dan material generasi terbaru.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
            {coreTechs.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -20px 0px" }} 
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className={`relative overflow-hidden bg-gradient-to-br from-[#111827]/60 to-black/30 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl hover:border-cyan-400/40 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.2)] hover:-translate-y-2 transition-all duration-500 ease-out group col-span-1 ${tech.colSpan}`}
              >
                <div className="absolute -top-16 -right-16 w-32 h-32 md:w-40 md:h-40 bg-cyan-500/0 rounded-full blur-[40px] group-hover:bg-cyan-500/20 transition-all duration-700 ease-in-out pointer-events-none"></div>

                <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 bg-gray-800/80 rounded-2xl flex items-center justify-center text-cyan-400 text-xl md:text-2xl mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-all duration-500 border border-white/5 group-hover:border-cyan-500/50 shadow-inner">
                  {tech.icon}
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {tech.title}
                  </h3>
                  <p className="text-sm md:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {tech.desc}
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 md:h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 3: STATISTIK ================= */}
        <div className="mb-24 md:mb-32 max-w-6xl mx-auto bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-cyan-500/20 rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex justify-center text-cyan-400 text-3xl md:text-4xl mb-3 md:mb-4"><FaClock /></div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tighter">
                <AnimatedCounter to={5} prefix="< " suffix=" Menit" duration={2} />
              </h4>
              <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest">Waktu Eksekusi Patching</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="flex justify-center text-blue-400 text-3xl md:text-4xl mb-3 md:mb-4"><FaCheckCircle /></div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tighter">
                <AnimatedCounter to={99.8} decimals={1} suffix="%" duration={2.5} />
              </h4>
              <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest">Akurasi Deteksi AI</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <div className="flex justify-center text-emerald-400 text-3xl md:text-4xl mb-3 md:mb-4"><FaArrowUp /></div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tighter">
                <AnimatedCounter to={60} suffix="%" duration={2.5} />
              </h4>
              <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest">Lebih Hemat Biaya</p>
            </motion.div>
          </div>
        </div>

      </div>
      
      {/* ================= PRODUCT CAROUSEL ================= */}
      {/* bg-[#02040a] dihapus dan diganti bg-transparent */}
      <div className="mt-10 border-t border-white/5 pt-16 md:pt-20 bg-transparent">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 tracking-tight">Mulai Transformasi Infrastruktur Anda</h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">Pilih unit robot RoadFix AI yang sesuai dengan kebutuhan skala kota Anda.</p>
        </div>
        <Product />
      </div>

    </section>
  );
};

export default Features;