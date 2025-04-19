import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
        {/* Left logo */}
        <div className="flex items-center space-x-8">
          <img 
            src="/UTM.png" 
            alt="Logo Left" 
            className="h-12 transition-all hover:scale-105 hover:opacity-90" 
          />
          <a 
            href="#smart-bot" 
            className="text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 hidden md:block px-3 py-1 rounded-lg hover:bg-blue-50"
          >
            Smart Bot
          </a>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Smart Campus Assistant
        </h1>

        {/* Right elements */}
        <div className="flex items-center space-x-8">
          <a 
            href="#lost-found" 
            className="text-gray-700 font-medium hover:text-green-600 transition-all duration-300 hidden md:block px-3 py-1 rounded-lg hover:bg-green-50"
          >
            Lost & Found
          </a>
          <img 
            src="/Ministre.png" 
            alt="Logo Right" 
            className="h-12 transition-all hover:scale-105 hover:opacity-90" 
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-6 py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-100 opacity-10 blur-xl"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-green-100 opacity-10 blur-xl"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-100 opacity-5 blur-lg"></div>
        
        <div className="max-w-4xl space-y-8 relative z-10">
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Beta Version
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Smart Campus</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Navigate your campus effortlessly, find rooms instantly, get help with administrative procedures, 
            and report lost or found items - all in one place!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="#smart-bot" 
              className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium text-lg group overflow-hidden"
            >
              <span className="relative z-10">Get Started with Bot</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a 
              href="#lost-found" 
              className="relative bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium text-lg group overflow-hidden"
            >
              <span className="relative z-10">Go to Lost & Found</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </div>
        </div>
        
        {/* Stats/Features section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto w-full relative z-10">
          {[
            { value: "100+", label: "Rooms Mapped" },
            { value: "24/7", label: "Assistant Available" },
            { value: "500+", label: "Happy Students" },
            { value: "Instant", label: "Item Reports" }
          ].map((item, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-3xl font-bold text-gray-800 mb-2">{item.value}</p>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}