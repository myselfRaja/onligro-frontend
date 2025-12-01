"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <header
  className={`
    w-full fixed top-0 left-0 z-50 
    backdrop-blur-md bg-white/80 border-b border-gray-200 
    transition-all duration-300
    ${scrolled ? "py-2 shadow-sm" : "py-4 shadow-none"}
  `}
>
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

        {/* LOGO */}
        <div className="text-2xl font-bold tracking-tight">OnliGro</div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 text-sm">
         <a href="/" className="nav-link hover:text-black transition">Home</a>
         <a href="/salons" className="nav-link hover:text-black transition">Find Salon</a>
          <a href="/login" className="nav-link :hover:text-black transition">Login</a>

          <a
            href="/register"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Get Started
          </a>
        </nav>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden flex flex-col gap-[5px]"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[2px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black"></span>
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div
  className={`
    md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-5 text-gray-700
    transition-all duration-300 ease-out 
    ${open ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
  `}
>

          <a href="/" className="text-base" onClick={() => setOpen(false)}>
            Home
          </a>

          <a href="/salons" className="text-base" onClick={() => setOpen(false)}>
            Find Salons
          </a>

          <a href="/login" className="text-base" onClick={() => setOpen(false)}>
            Login
          </a>

          <a
            href="/register"
            className="mt-2 px-4 py-3 bg-black text-white rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
