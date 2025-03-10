
import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            textRef.current?.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#e0f2fe,transparent_40%)]"></div>
      
      <div 
        ref={textRef}
        className="container max-w-6xl mx-auto px-4 sm:px-6 stagger-reveal"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
            Optimisation d'emploi du temps
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
            <span className="block">Planification intelligente</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              des examens
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ExamOptim optimise l'allocation des ressources pour vos examens, 
            tout en respectant les contraintes institutionnelles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#schedule-form" 
              className="px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg font-medium"
            >
              Générer un planning
            </a>
            <a 
              href="/about" 
              className="px-6 py-3 rounded-full bg-white border border-gray-200 text-foreground hover:bg-gray-50 transition-colors shadow-soft font-medium"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent -z-10"></div>
    </section>
  );
};

export default Hero;
