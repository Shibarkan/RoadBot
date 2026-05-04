import React, { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Home", "Produk", "Jasa", "Cara Kerja", "Kontak"];

  return (
    <header className="fixed w-full top-0 left-0 z-50">
      {/* Latar Belakang Dinamis */}
      <div
        className={`absolute inset-0 backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/80 border-b border-white/10 shadow-lg"
            : "bg-black/40"
        }`}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer group">
          <FaRobot className="text-3xl text-blue-400 group-hover:text-cyan-300 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <div>
            <span className="text-white group-hover:text-blue-400 transition-colors duration-300">
              RoadFix
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300">
              AI
            </span>
          </div>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex gap-8 lg:gap-10 text-gray-300 font-medium">
          {menuItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="relative group py-1 hover:text-white transition-colors duration-300"
            >
              {item}
              <span className="absolute left-1/2 right-1/2 -bottom-1 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 group-hover:left-0 group-hover:right-0 rounded-full"></span>
            </a>
          ))}
        </nav>

        {/* CTA BUTTON (DESKTOP) SINKRON DENGAN TEKS "AI" */}
        <div className="hidden md:block relative group">
          {/* Latar Belakang Glow (Menggunakan gradasi yang sama dengan AI) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full blur-md opacity-60 animate-pulse group-hover:animate-none group-hover:opacity-100 group-hover:blur-xl transition-all duration-300"></div>
          
          <button className="relative px-7 py-2.5 rounded-full bg-black border border-cyan-300/40 text-white font-semibold flex items-center gap-2 group-hover:border-cyan-300 transition-all duration-300 transform group-hover:scale-105 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:text-white transition-colors duration-300">
              Mulai Sekarang
            </span>
            <svg className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-cyan-300 focus:outline-none p-2 transition-colors duration-300"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[9px]" : ""}`}></span>
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden absolute w-full ${
          isOpen ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur-xl px-4 py-4 space-y-2 border-t border-white/10 shadow-2xl">
          {menuItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">{item}</span>
              <svg className="w-4 h-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
          
          <div className="pt-6 pb-4 px-4 flex justify-center">
             {/* CTA BUTTON (MOBILE) SINKRON DENGAN TEKS "AI" */}
             <div className="relative w-full group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-xl blur-md opacity-60 animate-pulse group-hover:animate-none group-hover:opacity-100 group-hover:blur-xl transition-all duration-300"></div>
               <button className="relative w-full py-3 rounded-xl bg-black border border-cyan-300/40 text-white font-semibold shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] active:scale-95 transition-transform flex justify-center items-center gap-2">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Mulai Sekarang
                 </span>
                 <svg className="w-5 h-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                 </svg>
               </button>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;