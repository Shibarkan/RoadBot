import React, { useState, useEffect } from "react";
import { FaRobot, FaPlus } from "react-icons/fa"; // <-- FaPlus ditambahkan di sini
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Cara Kerja", path: "/#cara-kerja" },
  ];

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
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer group"
        >
          <FaRobot className="text-3xl text-blue-400 group-hover:text-cyan-300 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <div>
            <span className="text-white group-hover:text-blue-400 transition-colors duration-300">
              RoadFix
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300">
              AI
            </span>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex gap-8 lg:gap-10 text-gray-300 font-medium items-center">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative group py-1 transition-colors duration-300 hover:text-white ${
                location.pathname === item.path ? "text-cyan-400" : ""
              }`}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* ================= CTA BUTTONS (DESKTOP) ================= */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Tombol Jual Produk (Desktop) */}
          <Link
            to="/upload"
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-cyan-400 rounded-full text-sm font-bold text-white transition-all flex items-center gap-2 hover:bg-white/10"
          >
            <FaPlus className="text-cyan-400" /> Jual Produk
          </Link>

          {/* Tombol Belanja */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full blur-md opacity-60 animate-pulse group-hover:animate-none group-hover:opacity-100 group-hover:blur-xl transition-all duration-300"></div>
            <Link
              to="/marketplace"
              className="relative px-7 py-2.5 rounded-full bg-black border border-cyan-300/40 text-white font-semibold flex items-center gap-2 group-hover:border-cyan-300 transition-all duration-300 transform group-hover:scale-105 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:text-white transition-colors duration-300">
                Belanja Sekarang
              </span>
              <svg
                className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 group-hover:text-white transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-cyan-300 focus:outline-none p-2 transition-colors duration-300"
          >
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span
                className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[9px]" : ""}`}
              ></span>
              <span
                className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden absolute w-full ${
          isOpen
            ? "max-h-[600px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur-xl px-4 py-4 space-y-2 border-t border-white/10 shadow-2xl">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">{item.name}</span>
              <svg
                className="w-4 h-4 text-cyan-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}

          {/* ================= CTA BUTTONS (MOBILE) ================= */}
          <div className="pt-6 pb-4 px-2 flex flex-col gap-3">
            
            {/* Tombol Belanja Mobile */}
            <Link
              to="/marketplace"
              onClick={() => setIsOpen(false)}
              className="relative w-full group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-xl blur-md opacity-50 animate-pulse transition-all duration-300"></div>
              <div className="relative w-full py-3 rounded-xl bg-black border border-cyan-300/40 text-white font-semibold flex justify-center items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Belanja Sekarang
                </span>
              </div>
            </Link>
            
            {/* Tombol Jual Mobile (Disusun ke bawah agar tidak tergencet) */}
            <Link
              to="/upload"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-white/5 border border-white/20 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:border-cyan-400 transition-all flex items-center justify-center gap-2"
            >
              <FaPlus className="text-cyan-400" /> Jual Produk
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;