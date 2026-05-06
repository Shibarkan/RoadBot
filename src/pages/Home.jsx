import React from "react";
import Galaxy from "../reactbits/Galaxy";
import Hero from "../sections/Hero";
import Features from "../sections/Features";

const Home = () => {
  // isLoading dan useEffect timer sudah dihapus agar tidak ada jeda skeleton abu-abu
  return (
    <main className="pt-24 relative z-10 flex flex-col items-center">
      {/* 🌌 BACKGROUND GALAXY KHUSUS DI HOME */}
      <div className="fixed inset-0 -z-10 bg-black">
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

      {/* Konten langsung ditampilkan tanpa pengecekan isLoading */}
      <div className="w-full pointer-events-auto flex flex-col items-center">
        <Hero />
        <Features />
      </div>
    </main>
  );
};

export default Home;