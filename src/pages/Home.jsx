import React, { useState, useEffect } from "react";
import Galaxy from "../reactbits/Galaxy";
import Hero from "../sections/Hero";
import Features from "../sections/Features";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah pernah "loading" di sesi ini
    const hasLoadedBefore = sessionStorage.getItem("homeLoaded");

    if (hasLoadedBefore) {
      // Jika sudah pernah, langsung tampilkan tanpa loading
      setIsLoading(false);
    } else {
      // Jika baru pertama kali buka, berikan waktu render singkat (simulasi loading assets)
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("homeLoaded", "true");
      }, 1000); // 1 detik saja untuk impresi awal yang halus
      return () => clearTimeout(timer);
    }
  }, []);

  // KOMPONEN SILUET (SKELETON)
  const SkeletonHome = () => (
    <div className="w-full max-w-5xl flex flex-col items-center animate-pulse px-6">
      {/* Siluet Hero */}
      <div className="h-8 w-40 bg-gray-800/60 rounded-full mb-8"></div> {/* Badge */}
      <div className="h-16 md:h-24 w-full max-w-3xl bg-gray-800/60 rounded-2xl mb-6"></div> {/* Headline */}
      <div className="space-y-3 w-full max-w-2xl flex flex-col items-center mb-10">
        <div className="h-4 w-full bg-gray-800/60 rounded-full"></div> {/* Desc 1 */}
        <div className="h-4 w-5/6 bg-gray-800/60 rounded-full"></div> {/* Desc 2 */}
      </div>
      <div className="flex gap-4 mb-16">
        <div className="h-12 w-40 bg-gray-800/60 rounded-full"></div> {/* Button 1 */}
        <div className="h-12 w-40 bg-gray-800/60 rounded-full"></div> {/* Button 2 */}
      </div>
      
      {/* Siluet Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="h-48 bg-gray-800/60 rounded-3xl"></div>
        <div className="h-48 bg-gray-800/60 rounded-3xl"></div>
        <div className="h-48 bg-gray-800/60 rounded-3xl"></div>
      </div>
    </div>
  );

  return (
    <main className="pt-24 relative z-10 flex flex-col items-center min-h-screen">
      {/* 🌌 BACKGROUND GALAXY */}
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