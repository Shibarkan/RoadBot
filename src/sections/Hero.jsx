import React from "react";
import { FaRobot, FaSatelliteDish, FaTools, FaArrowRight, FaPlay } from "react-icons/fa";
import Shuffle from "../reactbits/Suffle"; // Pastikan path import ini benar ya!

const Hero = () => {
  return (
    <section id="home" className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-10 z-10">
      
      {/* BADGE (LENCANA) STATIS TAPI TEKSNYA SHUFFLE */}
      {/* Class animate-[bounce_3s_infinite] sudah dihapus agar lencana tetap diam */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-blue-500/30 backdrop-blur-md mb-8">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        
        {/* Teks dengan efek Shuffle */}
        <span className="font-medium text-cyan-300 tracking-wide flex items-center">
          <Shuffle
            text="SMART MOBILTY"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={8}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            loop={true}
            loopDelay={3} 
            tag="span" 
            className="!text-sm !normal-case !leading-normal !tracking-wide" 
          />
        </span>
      </div>

      {/* HEADLINE UTAMA */}
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl max-w-4xl">
        Sistem Perbaikan Jalan <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 animate-pulse">
          Otomatis Berbasis AI
        </span>
      </h1>

      {/* SUB-HEADLINE (DESKRIPSI) */}
      <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10 drop-shadow-md">
        Teknologi robot otomatis terintegrasi IoT untuk mendeteksi, memetakan, dan memperbaiki kerusakan infrastruktur jalan secara real-time dan efisien.
      </p>

      {/* TOMBOL AKSI (CALL TO ACTION) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur-md opacity-70 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300"></div>
          <button className="relative px-8 py-3.5 rounded-full bg-black border border-cyan-400/50 text-white font-semibold flex items-center gap-3 hover:scale-105 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]">
            <span>Lihat Demo Robot</span>
            <FaPlay className="text-cyan-400 text-sm" />
          </button>
        </div>

        <a href="#cara-kerja" className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white font-medium flex items-center gap-2 backdrop-blur-md transition-all duration-300">
          <span>Pelajari Cara Kerja</span>
          <FaArrowRight className="text-sm" />
        </a>
      </div>

      {/* KARTU HIGHLIGHT (FLOATING STATS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl w-full">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-blue-500/50 transition-colors">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
            <FaSatelliteDish className="text-2xl" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-white">IoT Sensor</h4>
            <p className="text-xs text-gray-400">Deteksi Real-time</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-400/50 transition-colors">
          <div className="p-3 bg-cyan-400/20 rounded-xl text-cyan-300">
            <FaRobot className="text-2xl" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-white">Cloud AI</h4>
            <p className="text-xs text-gray-400">Analisis Tingkat Kerusakan</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-blue-400/50 transition-colors">
          <div className="p-3 bg-blue-400/20 rounded-xl text-blue-300">
            <FaTools className="text-2xl" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-white">Auto Repair</h4>
            <p className="text-xs text-gray-400">Penambalan Otomatis</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;