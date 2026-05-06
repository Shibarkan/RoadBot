import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import Marketplace from "./sections/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import UploadProduct from "./pages/UploadProduct"; // <--- 1. TAMBAHKAN IMPORT INI DI ATAS
import FloatingCart from "./components/FloatingChart";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
        
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* <--- 2. TARUH KODENYA DI SINI ---> */}
          <Route path="/upload" element={<UploadProduct />} /> 

        </Routes>

        <FloatingCart />
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;