import React, { useState, useEffect } from "react";
import Galaxy from "../reactbits/Galaxy"; 
import Prism from "../reactbits/Prism";
import Hero from "../sections/Hero";
import Features from "../sections/Features";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false); 

  // =======================================================
  // 1. DETEKSI UKURAN LAYAR (MOBILE VS DESKTOP)
  // =======================================================
  useEffect(() => {
    const handleResize = () => {
      // Jika layar di bawah 768px, maka dianggap Mobile (HP)
      setIsMobile(window.innerWidth < 768);
    };

    // Eksekusi sekali saat pertama kali web dibuka
    handleResize();

    // Pantau terus kalau-kalau user nge-resize ukuran browsernya
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =======================================================
  // 2. LOGIKA LOADING ANIMASI
  // =======================================================
  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem("homeLoaded");

    if (hasLoadedBefore) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("homeLoaded", "true");
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, []);

  // KOMPONEN SILUET (SKELETON)
  const SkeletonHome = () => (
    <div className="w-full max-w-5xl flex flex-col items-center animate-pulse px-6">
      <div className="h-8 w-40 bg-gray-800/60 rounded-full mb-8"></div> 
      <div className="h-16 md:h-24 w-full max-w-3xl bg-gray-800/60 rounded-2xl mb-6"></div> 
      <div className="space-y-3 w-full max-w-2xl flex flex-col items-center mb-10">
        <div className="h-4 w-full bg-gray-800/60 rounded-full"></div> 
        <div className="h-4 w-5/6 bg-gray-800/60 rounded-full"></div> 
      </div>
      <div className="flex gap-4 mb-16">
        <div className="h-12 w-40 bg-gray-800/60 rounded-full"></div> 
        <div className="h-12 w-40 bg-gray-800/60 rounded-full"></div> 
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="h-48 bg-gray-800/60 rounded-3xl"></div>
        <div className="h-48 bg-gray-800/60 rounded-3xl"></div>
        <div className="h-48 bg-gray-800/60 rounded-3xl"></div>
      </div>
    </div>
  );

  return (
    <main className="pt-24 relative z-10 flex flex-col items-center min-h-screen">
      
      {/* ======================================================= */}
      {/* 🌌 BACKGROUND AREA (KONDISIONAL MOBILE / DESKTOP)       */}
      {/* ======================================================= */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        
        {/* LOGIKA 1: JIKA MOBILE, NYALAKAN GALAXY (PRISM MATI TOTAL) */}
        {isMobile && (
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
        )}

        {/* LOGIKA 2: JIKA BUKAN MOBILE (DESKTOP), NYALAKAN PRISM (GALAXY MATI TOTAL) */}
        {!isMobile && (
          <div className="absolute inset-0 w-full h-full">
            <Prism
              animationType="rotate"
              timeScale={0.5}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              hueShift={0}
              colorFrequency={1}
              noise={0}
              glow={1}
              resolutionScale={0.75}
            />
          </div>
        )}

      </div>

      {/* ======================================================= */}
      {/* 📦 KONTEN UTAMA HALAMAN                                */}
      {/* ======================================================= */}
      {isLoading ? (
        <section className="w-full flex justify-center py-20">
          <SkeletonHome />
        </section>
      ) : (
        <div className="w-full pointer-events-auto flex flex-col items-center transition-opacity duration-700 ease-in opacity-100">
          <Hero />
          <Features />
        </div>
      )}
      
    </main>
  );
};

export default Home;