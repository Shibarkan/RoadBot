import React from "react";
import Header from "./sections/Header";

function App() {
  return (
    <div>
      <Header />

      {/* Biar konten ga ketutup header */}
    <div className="bg-black min-h-screen text-white pt-24">
        <h1 className="text-center text-3xl font-bold">
          Welcome to RoadFixAI 
        </h1>
      </div>
    </div>
  );
}

export default App;