import React, { useState, useEffect } from "react";
import Header from "./sections/Header";
import Galaxy from "./reactbits/Galaxy";
import Features from "./sections/Features";
import Hero from "./sections/Hero";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🌌 BACKGROUND GALAXY */}
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

      <Header />

      <main className="pt-24 relative z-10 pointer-events-none flex flex-col items-center">
        
        {isLoading ? (
          <section className="text-center py-20 pointer-events-auto w-full max-w-4xl flex flex-col items-center px-6 min-h-[80vh] justify-center">
            <div className="w-full flex flex-col items-center gap-6 animate-pulse">
              <div className="h-8 w-48 bg-gray-700/60 rounded-full mb-4"></div>
              <div className="h-14 md:h-20 w-full bg-gray-700/60 rounded-2xl"></div>
              <div className="w-full max-w-2xl space-y-3 flex flex-col items-center mt-4">
                <div className="h-4 w-full bg-gray-700/60 rounded-full"></div>
                <div className="h-4 w-5/6 bg-gray-700/60 rounded-full"></div>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="h-12 w-48 bg-gray-700/60 rounded-full"></div>
                <div className="h-12 w-48 bg-gray-700/60 rounded-full"></div>
              </div>
            </div>
          </section>
        ) : (
          <div className="w-full transition-opacity duration-1000 ease-in-out opacity-100 animate-[fadeIn_1s_ease-in-out] pointer-events-auto flex flex-col items-center">
            {/* PANGGIL KOMPONEN HERO DI SINI */}
            <Hero />
            
            {/* PANGGIL KOMPONEN FEATURES DI SINI */}
            <Features />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;