import React from "react";
import {
  FaRobot,
  FaSatelliteDish,
  FaTools,
  FaPlay,
  FaShoppingCart,
} from "react-icons/fa";

// Pastikan import ini sesuai dengan struktur folder kamu
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ModelViewer from "../components/ModelViewer"; 

const Hero = () => {
  // ================= ANIMATIONS =================
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const rotationAnimation = {
    rotate: 360,
    transition: { duration: 30, repeat: Infinity, ease: "linear" },
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 md:pt-32 pb-16 font-['Outfit',_sans-serif]"
    >
      {/* ================= INJECT GOOGLE FONTS ================= */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;900&display=swap');
        `}
      </style>

      {/* ================= BACKGROUND ================= */}

      {/* GRID */}
      <div className="absolute inset-0 opacity-20 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px] animate-gridMove"></div>
      </div>

      {/* GLOW ORBS */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[140px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[140px] animate-pulse pointer-events-none"></div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* ================= LEFT CONTENT ================= */}

        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* BADGE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInDown}
            whileHover={{ scale: 1.05 }}
            className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-full overflow-hidden group mb-8"
          >
            <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 animate-spin-slow">
              <div className="w-full h-full bg-black rounded-full"></div>
            </div>
            <div className="absolute inset-0 bg-cyan-500/10 blur-xl group-hover:bg-cyan-400/20 transition-all duration-500 pointer-events-none"></div>
            <span className="relative z-10 font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-xs sm:text-sm uppercase font-['Space_Grotesk',_sans-serif]">
              SMART MOBILITY
            </span>
          </motion.div>

          {/* TITLE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tighter text-white mb-6 font-['Space_Grotesk',_sans-serif]">
              Sistem Perbaikan
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse">
                Jalan AI Otomatis
              </span>
            </h1>
          </motion.div>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed mb-10 font-light"
          >
            Teknologi robot otomatis berbasis AI dan IoT untuk mendeteksi,
            memetakan, dan memperbaiki kerusakan jalan secara real-time dengan
            sistem pintar yang cepat, presisi, dan efisien.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
          >
            {/* DEMO BUTTON */}
            <motion.div variants={fadeInUp} className="relative group w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
              <a
                href="https://youtube.com/shorts/_6HzLIJPH2A?si=z6f13K8cg2jf_P-l"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-8 py-4 rounded-full bg-black border border-cyan-500/40 text-white font-semibold flex items-center justify-center gap-3 hover:scale-[1.03] transition-all duration-300"
              >
                <span>Lihat Demo</span>
                <FaPlay className="text-cyan-400 text-sm" />
              </a>
            </motion.div>

            {/* MARKETPLACE BUTTON */}
            <motion.div variants={fadeInUp}>
              <Link
                to="/marketplace"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-200 font-semibold flex items-center justify-center gap-3 hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300"
              >
                <FaShoppingCart className="text-cyan-400" />
                <span>Beli Unit</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ================= RIGHT CONTENT (3D LOCAL MODEL) ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInRight}
          className="relative flex justify-center items-center w-full min-h-[350px] sm:min-h-[450px]"
        >
          {/* ROTATING GYROSCOPE (DEKORASI BELAKANG) */}
          <motion.div
            animate={rotationAnimation}
            className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-cyan-500/5 opacity-40 pointer-events-none"
            style={{
              boxShadow:
                "0 0 40px rgba(0,255,255,0.03), inset 0 0 40px rgba(0,255,255,0.015)",
            }}
          >
            <div className="absolute inset-[15%] rounded-full border border-cyan-400/5"></div>
            <div className="absolute inset-[30%] rounded-full border border-blue-400/5"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-400/5 rotate-45"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-400/5 -rotate-45"></div>
          </motion.div>

          {/* BIG GLOW */}
          <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-cyan-400/10 blur-[100px] sm:blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

          {/* REACT THREE FIBER MODEL VIEWER CONTAINER (BERSIH TOTAL) */}
          <div className="relative z-20 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] cursor-grab active:cursor-grabbing">
            <ModelViewer
              url="/models/robot.glb" // Memanggil file dari public/models/robot.glb
              width="100%"
              height="100%"
              modelXOffset={0}
              modelYOffset={-0.1}
              defaultRotationX={-30} 
              defaultRotationY={45} 
              defaultZoom={2.5} // Ubah angka ini jika modelnya kekecilan/kebesaran
              minZoomDistance={1}
              maxZoomDistance={10}
              enableMouseParallax={false} 
              enableManualRotation={true} 
              enableHoverRotation={false} 
              enableManualZoom={true} 
              ambientIntensity={0.5} 
              keyLightIntensity={2} 
              fillLightIntensity={1} 
              rimLightIntensity={2} 
              environmentPreset="night" 
              autoFrame={true} 
              fadeIn={true}
              autoRotate={true} 
              autoRotateSpeed={0.3}
              showScreenshotButton={false} // Mematikan tombol screenshot bawaan viewer
            />
          </div>

          {/* FLOATING INFO PANEL */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="
              absolute
              -bottom-5
              -left-3
              sm:-bottom-8
              sm:-left-10
              bg-[#111827]/80
              backdrop-blur-xl
              border border-white/10
              px-5 py-4
              rounded-2xl
              shadow-[0_10px_40px_rgba(0,0,0,0.45)]
              min-w-[230px]
              z-30
              pointer-events-none
            "
          >
            <p className="text-white font-semibold text-sm tracking-wide mb-3">
              Sistem Operasional Jalan
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-10">
                <span className="text-gray-400">Mode</span>
                <span className="text-white">Automated</span>
              </div>
              <div className="flex items-center justify-between gap-10">
                <span className="text-gray-400">Coverage</span>
                <span className="text-white">24 Area</span>
              </div>
              <div className="flex items-center justify-between gap-10">
                <span className="text-gray-400">Status</span>
                <span className="text-white">Operational</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ================= FEATURE CARDS ================= */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mt-12 sm:mt-20">
        {/* CARD 1 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="group bg-gradient-to-br from-[#111827]/80 to-black/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500"
        >
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl w-fit mb-5 text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <FaSatelliteDish className="text-3xl" />
          </div>
          <h4 className="text-white font-bold text-xl mb-2 font-['Space_Grotesk',_sans-serif]">
            IoT Sensor
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Sistem sensor cerdas mendeteksi kerusakan jalan secara otomatis
            selama 24 jam nonstop.
          </p>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="group bg-gradient-to-br from-[#111827]/80 to-black/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl hover:border-cyan-400/40 hover:-translate-y-2 transition-all duration-500"
        >
          <div className="p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl w-fit mb-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300">
            <FaRobot className="text-3xl" />
          </div>
          <h4 className="text-white font-bold text-xl mb-2 font-['Space_Grotesk',_sans-serif]">
            Cloud AI
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            AI menganalisis tingkat kerusakan dan menentukan metode perbaikan
            terbaik secara otomatis.
          </p>
        </motion.div>

        {/* CARD 3 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="group bg-gradient-to-br from-[#111827]/80 to-black/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl hover:border-emerald-400/40 hover:-translate-y-2 transition-all duration-500"
        >
          <div className="p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl w-fit mb-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <FaTools className="text-3xl" />
          </div>
          <h4 className="text-white font-bold text-xl mb-2 font-['Space_Grotesk',_sans-serif]">
            Auto Repair
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Robot melakukan penambalan jalan dengan cepat dan presisi untuk
            meminimalisir kerusakan lebih lanjut.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;