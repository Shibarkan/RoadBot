import React from "react";
import { FaWifi, FaBrain, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <FaWifi className="text-4xl text-blue-400 mb-4 group-hover:text-cyan-300 transition-colors duration-300" />,
      title: "1. Pemantauan IoT Real-Time",
      description:
        "Mengumpulkan data kondisi jalan melalui sensor getaran pada kendaraan, kamera pemantau, dan smartphone secara langsung.",
    },
    {
      id: 2,
      icon: <FaBrain className="text-4xl text-blue-400 mb-4 group-hover:text-cyan-300 transition-colors duration-300" />,
      title: "2. Analisis AI & Cloud Server",
      description:
        "Data dikirim ke server dan dianalisis menggunakan Artificial Intelligence untuk menentukan lokasi dan tingkat keparahan secara akurat.",
    },
    {
      id: 3,
      icon: <FaCogs className="text-4xl text-blue-400 mb-4 group-hover:text-cyan-300 transition-colors duration-300" />,
      title: "3. Robot Perbaikan Otomatis",
      description:
        "Robot aktuator menerima koordinat, menuju lokasi, melakukan pemindaian area, dan menambal jalan secara otomatis.",
    },
  ];

  // Variasi animasi container (Induk)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Muncul satu per satu dengan cepat
      },
    },
  };

  // Variasi animasi kartu (Anak)
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <section id="cara-kerja" className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* JUDUL SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Bagaimana <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RoadFix AI</span> Bekerja?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Sistem terintegrasi dari hulu ke hilir untuk mendeteksi dan memperbaiki infrastruktur secara cerdas.
          </p>
        </motion.div>

        {/* GRID CARDS (Mirip Grid Marketplace) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              variants={itemVariants}
              key={feature.id}
              className="relative group bg-[#1a1d24]/60 backdrop-blur-md border border-gray-800 p-8 rounded-3xl hover:border-cyan-400/50 transition-all duration-300 overflow-hidden shadow-lg"
            >
              {/* Efek Glow di belakang kartu saat hover */}
              <div className="absolute -inset-1 bg-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              {/* Konten Card */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;