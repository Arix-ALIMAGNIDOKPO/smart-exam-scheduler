
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import ScheduleForm from '@/components/ScheduleForm';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Set up intersection observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all elements with the reveal-element class
    const revealElements = document.querySelectorAll('.reveal-element, .stagger-reveal');
    revealElements.forEach((el) => observer.observe(el));
    
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <ScheduleForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
