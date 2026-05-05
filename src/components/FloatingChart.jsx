import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCart = () => {
  const location = useLocation();

  // Tombol hanya muncul di halaman Home (/) 
  // Agar di halaman Marketplace sendiri tidak muncul tombol ke Marketplace lagi
  if (location.pathname !== "/") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
        className="md:hidden fixed bottom-6 right-6 z-[99999]"
      >
        <Link to="/marketplace" className="relative flex items-center justify-end">
          {/* Label Tooltip */}
          <motion.span 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute right-16 bg-black/90 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 text-[10px] py-1.5 px-3 rounded-lg whitespace-nowrap shadow-2xl"
          >
            Beli Robot RoadFix →
          </motion.span>

          {/* Tombol Utama */}
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
            
            <button className="relative w-16 h-16 rounded-full bg-black border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-90 transition-all">
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] items-center justify-center text-white font-bold">!</span>
              </span>
            </button>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCart;