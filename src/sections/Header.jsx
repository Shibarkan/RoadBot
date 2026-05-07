import React, { useState, useEffect } from "react";
import { FaRobot, FaPlus, FaShoppingCart } from "react-icons/fa"; // Tambahkan FaShoppingCart
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from 'lucide-react';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0); // State untuk jumlah item di keranjang
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi untuk menghitung total item di keranjang
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("roadfix_cart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    // Ambil data awal saat mount
    updateCartCount();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Listener untuk mendeteksi perubahan storage (antar tab atau window)
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", updateCartCount);
    
    // Listener custom event untuk update real-time di halaman yang sama
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleNavClick = (e, item) => {
    if (item.name === "Cara Kerja") {
      e.preventDefault();
      if (location.pathname === "/") {
        const el = document.getElementById("cara-kerja");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/#cara-kerja");
      }
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: "Beranda ", path: "/" },
    { name: "Produk", path: "/marketplace" },
    { name: "Cara Kerja", path: "/#cara-kerja" },
  ];

  return (
    <header className="fixed w-full top-0 left-0 z-50">
      <div
        className={`absolute inset-0 backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/80 border-b border-white/10 shadow-lg"
            : "bg-black/40"
        }`}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer group">
          <FaRobot className="text-3xl text-blue-400 group-hover:text-cyan-300 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
          <div>
            <span className="text-white">RoadFix</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 ml-1">AI</span>
          </div>
        </Link>

        {/* NAVIGASI DESKTOP */}
        <nav className="hidden md:flex gap-8 lg:gap-10 text-gray-300 font-medium items-center">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className={`relative group py-1 transition-colors hover:text-white ${
                location.pathname === item.path ? "text-cyan-400" : ""
              }`}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* ACTIONS RIGHT */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* KERANJANG BELANJA */}
          <Link 
            to="/cart" 
            className="relative p-2.5 text-gray-300 hover:text-cyan-400 transition-all hover:bg-white/5 rounded-full"
          >
            <FaShoppingCart className="text-xl md:text-2xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/upload"
            className="hidden md:flex px-5 py-2.5 bg-white/5 border border-white/10 hover:border-cyan-400 rounded-full text-sm font-bold text-white transition-all items-center gap-2"
          >
            <FaPlus className="text-cyan-400" /> Jual Produk
          </Link>

          {/* BUTTON BELANJA */}
          <div className="hidden md:block relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full blur-md opacity-60 animate-pulse group-hover:opacity-100 transition-all"></div>
            <Link
              to="/marketplace"
              className="relative px-7 py-2.5 rounded-full bg-black border border-cyan-300/40 text-white font-semibold flex items-center gap-2 group-hover:border-cyan-300 transition-all duration-300 transform group-hover:scale-105"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:text-white transition-colors">
                Belanja Sekarang
              </span>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300 hover:text-cyan-300 p-2">
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all ${isOpen ? "rotate-45 translate-y-[9px]" : ""}`}></span>
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all ${isOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden absolute w-full ${isOpen ? "max-h-[600px] opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
        <div className="bg-gray-900/95 backdrop-blur-xl px-4 py-4 space-y-2 border-t border-white/10 shadow-2xl">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="font-medium">{item.name}</span>
              <ChevronRight className={location.pathname === "/cart" ? "text-cyan-400" : ""} />
            </Link>
          ))}
          <div className="pt-6 pb-4 px-2 flex flex-col gap-3">
            <Link to="/cart" onClick={() => setIsOpen(false)} className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 font-bold flex justify-center items-center gap-2">
               <FaShoppingCart /> Lihat Keranjang ({cartCount})
            </Link>
            <Link to="/upload" onClick={() => setIsOpen(false)} className="w-full py-3 bg-white/5 border border-white/20 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2">
              <FaPlus className="text-cyan-400" /> Jual Produk
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;