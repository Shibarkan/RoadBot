import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import Marketplace from "./sections/Marketplace";

function App() {
  return (
    // Router membungkus seluruh aplikasi agar bisa pindah halaman
    <Router>
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
        
        {/* Header akan selalu tampil di halaman mana pun */}
        <Header />
        
        {/* Routes menentukan halaman mana yang dirender berdasarkan URL */}
        <Routes>
          {/* URL "/" akan menampilkan halaman Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* URL "/marketplace" akan menampilkan halaman Katalog Produk */}
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>

        {/* Footer akan selalu tampil di halaman mana pun */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;