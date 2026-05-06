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
      description: "Sensor getaran dan kamera smartphone menangkap data kerusakan jalan secara instan.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      icon: <FaBrain />,
      step: "02",
      title: "AI Analysis",
      description: "Cloud server menganalisis tingkat keparahan dan menentukan prioritas perbaikan.",
      color: "from-purple-500 to-blue-400",
    },
    {
      id: 3,
      icon: <FaCogs />,
      step: "03",
      title: "Auto Repair",
      description: "Robot aktuator bergerak ke lokasi dan menambal jalan dengan material cepat kering.",
      color: "from-cyan-500 to-emerald-400",
    },
  ];

  return (
    <section id="cara-kerja" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* JUDUL SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tighter">
            Alur Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RoadFix AI</span>
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Teknologi cerdas untuk infrastruktur masa depan yang lebih aman dan efisien.
          </p>
        </motion.div>

        {/* GRID LAYOUT DENGAN GARIS PENGHUBUNG */}
        <div className="relative">
          {/* Garis Dekoratif (Hanya muncul di Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 -translate-y-1/2"></div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
                }}
                className="relative group"
              >
                {/* Nomor Urut Besar di Background */}
                <span className="absolute -top-10 -left-4 text-8xl font-black text-white/[0.03] pointer-events-none group-hover:text-cyan-500/10 transition-colors duration-500">
                  {feature.step}
                </span>

                <div className="relative z-10 bg-[#1a1d24]/40 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] hover:border-cyan-500/50 transition-all duration-500 shadow-2xl h-full flex flex-col items-center text-center">
                  
                  {/* Icon Container dengan Glow sesuai tema warna */}
                  <div className={`p-5 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <div className="text-3xl text-white">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Indikator Panah Mobile */}
                  {index < 2 && (
                    <div className="md:hidden mt-8 text-cyan-500 animate-bounce">
                      ↓
                    </div>
                  )}
                </div>

                {/* Dot Konektor di Desktop */}
                <div className="hidden md:block absolute top-1/2 -right-6 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4] -translate-y-1/2 z-20 group-last:hidden"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Features;