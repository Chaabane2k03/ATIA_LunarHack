import React from 'react';
import { Link } from 'react-router-dom';
import LogoUTM from '/UTM.png';
import LogoMin from '/Ministre.png';
export default function LandingPage() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <nav className="bg-white/90 backdrop-blur-lg py-3 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 border-b border-gray-200/70 shadow-sm">
      {/* Mobile Header */}
      <div className="w-full flex justify-between items-center sm:hidden">
        <div className="flex items-center space-x-3">
          <img 
            src={LogoUTM}
            alt="University Logo" 
            className="h-10 transition-all hover:scale-105 hover:opacity-90 active:scale-95"
          />
          <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Campus Compass
          </h1>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:flex w-full justify-between items-center">
        {/* Left side - Logo + Smart Bot */}
        <div className="flex items-center space-x-6">
          <img 
            src="/UTM.png" 
            alt="University Logo" 
            className="h-12 transition-all hover:scale-105 hover:opacity-90 active:scale-95"
          />
          <Link to="/smart-bot" >
            <div className="cursor-pointer px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95">
              Smart Bot
            </div>
          </Link>
        </div>

        {/* Center - Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Campus Compass 
        </h1>

        {/* Right side - Lost & Found + Logo */}
        <div className="flex items-center space-x-6">
          <Link to="/lost-found" >
            <div className="cursor-pointer px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50/70 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95">
              Lost & Found
            </div>
          </Link>
          <img 
            src={LogoMin}
            alt="Ministry Logo" 
            className="h-12 transition-all hover:scale-105 hover:opacity-90 active:scale-95" 
          />
        </div>
      </div>
    </nav>




      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-blue-100 opacity-10 blur-xl"></div>
        <div className="absolute -top-20 -right-20 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-green-100 opacity-10 blur-xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-blue-100 opacity-5 blur-lg"></div>

        <div className="max-w-4xl space-y-6 sm:space-y-8 relative z-10">
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
              Beta Version
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Campus Compass</span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
            Navigate your campus effortlessly, find rooms instantly, get help with administrative procedures, 
            and report lost or found items - all in one place!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link 
              to="/smart-bot" 
              className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium text-base sm:text-lg group overflow-hidden"
            >
              <span className="relative text-white z-10">Get Started with Bot</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              to="/lost-found" 
              className="relative bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium text-base sm:text-lg group overflow-hidden"
            >
              <span className="relative text-white z-10">Go to Lost & Found</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
        </div>

        {/* Stats/Features section */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto w-full px-4 relative z-10">
          {[
            { value: "24/7", label: "Assistant Available" },
            { value: "500+", label: "Happy Students" },
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-100"
            >
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{item.value}</p>
              <p className="text-sm sm:text-base text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-4 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col justify-center md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-2 md:mb-0">
            © {new Date().getFullYear()} Campus Compass . All rights reserved.
          </p>
          
        </div>
      </footer>
    </div>
  );
}