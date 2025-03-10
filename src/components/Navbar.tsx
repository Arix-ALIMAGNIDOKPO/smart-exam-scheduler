
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all h-[90px] duration-300 ease-in-out glass-nav",
        scrolled ? "py-3 shadow-soft" : "py-5"
      )}
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium flex items-center space-x-2 text-primary"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 6V12L16 14" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="tracking-tight">ExamOptim</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8 items-center">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-primary transition-colors duration-200"
          >
            Accueil
          </Link>
          <Link 
            to="/about" 
            className="text-foreground/80 hover:text-primary transition-colors duration-200"
          >
            À propos
          </Link>
          <a 
            href="#schedule-form" 
            className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Générer un planning
          </a>
        </nav>
        
        <button className="md:hidden text-foreground">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
