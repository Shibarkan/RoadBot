import React from "react";
import { FaWifi, FaBrain, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";

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
      animDuration: 3, // Durasi putar unik
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
      animDuration: 4.5, // Lebih lambat
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
      animDuration: 3.5, // Menengah
    },
  ];

  return (
    <section id="cara-kerja" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* JUDUL SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tighter text-white">
            Alur Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RoadFix AI</span>
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Sistem terintegrasi untuk deteksi dan perbaikan infrastruktur secara cerdas.
          </p>
        </motion.div>

        {/* GRID LAYOUT */}
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ 
                  opacity: 0, 
                  x: feature.direction, 
                  y: 50,
                  rotateY: feature.rotate,
                  scale: index === 1 ? 0.5 : 1 
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  rotateY: 0,
                  scale: 1,
                  transition: { 
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay: index * 0.1 
                  }
                }}
                viewport={{ once: false, amount: 0.2 }}
                className="relative group"
              >
                {/* Nomor Urut */}
                <span className="absolute -top-10 -left-4 text-8xl font-black text-white/[0.03] pointer-events-none group-hover:text-cyan-500/10 transition-colors duration-500">
                  {feature.step}
                </span>

                <div className="relative z-10 bg-[#1a1d24]/40 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] hover:border-cyan-500/50 transition-all duration-400 shadow-2xl h-full flex flex-col items-center text-center group-hover:-translate-y-4">
                  
                  {/* ICON CONTAINER: RANDOMIZED AUTOMATIC SPIN */}
                  <div className="perspective-1000 mb-6">
                    <motion.div 
                      animate={{ rotateY: 360 }}
                      transition={{ 
                        duration: feature.animDuration, // Kecepatan putar beda-beda
                        repeat: Infinity, 
                        ease: "linear",
                        delay: index * 0.5 // Waktu mulai putar juga beda-beda
                      }}
                      className={`p-5 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg flex items-center justify-center`}
                    >
                      <div className="text-3xl text-white">
                        {feature.icon}
                      </div>
                    </motion.div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Indikator Mobile */}
                  {index < 2 && (
                    <div className="md:hidden mt-8 text-cyan-500 animate-bounce">↓</div>
                  )}
                </div>

                {/* Dot Konektor Desktop */}
                <div className="hidden md:block absolute top-1/2 -right-6 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4] -translate-y-1/2 z-20 group-last:hidden"></div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;