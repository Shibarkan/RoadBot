import React from "react";
import { FaWifi, FaBrain, FaCogs } from "react-icons/fa"; // Pastikan react-icons sudah terinstal

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <FaWifi className="text-4xl text-blue-400 mb-4 group-hover:text-cyan-300 transition-colors duration-300" />,
      title: "1. Pemantauan IoT Real-Time",
      description:
        "Mengumpulkan data kondisi jalan melalui sensor getaran pada kendaraan, kamera pemantau, dan smartphone pengguna jalan secara langsung.",
    },
    {
      id: 2,
      icon: <FaBrain className="text-4xl text-blue-400 mb-4 group-hover:text-cyan-300 transition-colors duration-300" />,
      title: "2. Analisis AI & Cloud Server",
      description:
        "Data dikirim ke server dan dianalisis menggunakan Artificial Intelligence untuk menentukan lokasi dan tingkat keparahan kerusakan secara akurat.",
    },
    {
      id: 3,
      icon: <FaCogs className="text-4xl text-blue-400 mb-4 group-hover:text-cyan-300 transition-colors duration-300" />,
      title: "3. Robot Perbaikan Otomatis",
      description:
        "Robot aktuator menerima koordinat, menuju lokasi, melakukan pemindaian area, dan menambal jalan menggunakan aspal cair atau beton cepat kering.",
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Bagaimana <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RoadFix AI</span> Bekerja?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Sistem terintegrasi dari hulu ke hilir untuk mendeteksi dan memperbaiki infrastruktur secara cerdas.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden shadow-lg"
            >
              {/* Efek Glow Cahaya di Belakang Card saat Hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
              
              {/* Konten Card */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;