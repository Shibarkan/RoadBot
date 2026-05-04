import React from "react";
import Header from "./sections/Header"; // Sesuaikan path jika perlu
import Galaxy from "./reactbits/Galaxy"

function App() {
  return (
    // HAPUS bg-black dari sini agar tidak menutupi canvas di belakangnya
    <div className="relative min-h-screen text-white overflow-hidden">
      
      {/* 🌌 BACKGROUND GALAXY */}
      {/* Pindahkan bg-black ke sini, dan gunakan z-0 sebagai layer paling dasar */}
      <div className="fixed inset-0 z-0 bg-black">
        <Galaxy
          mouseRepulsion
          mouseInteraction={false}
          density={1}
          glowIntensity={0.3}
          saturation={0.8}
          hueShift={160}
          twinkleIntensity={0.5}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={4}
          starSpeed={0.5}
          speed={1}
        />
      </div>

      {/* HEADER */}
      {/* Header sudah memiliki fixed dan z-50 di dalamnya, jadi aman */}
      <Header />

      {/* CONTENT */}
      {/* Tambahkan relative dan z-10 agar konten tampil di ATAS background Galaxy */}
      <main className="pt-24 px-6 relative z-10 pointer-events-none">
        <section className="text-center py-20 pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Smart Road Repair <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">AI</span>
          </h1>

          <p className="text-gray-300 max-w-xl mx-auto drop-shadow-md">
            Robot ajib bisa nambal jalan otomatis.
          </p>
        </section>
      </main>

    </div>
  );
}

export default App;