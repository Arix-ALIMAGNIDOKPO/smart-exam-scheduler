
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Lightbulb, Code, Clock, Box, FileCode, Github } from 'lucide-react';

const About = () => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-16">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 reveal-element">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                Optimisation des examens
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Notre approche d'ExamOptim
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
                Découvrez comment nous simplifions la planification des examens grâce à notre algorithme d'optimisation intelligent.
              </p>
            </div>
            
            {/* Features section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
              <div className="bg-white p-8 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-medium reveal-element">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="text-blue-700" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Objectifs principaux</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">•</div>
                    <span>Minimiser la durée totale de la période d'examen</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">•</div>
                    <span>Éviter les chevauchements pour les mêmes ressources</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">•</div>
                    <span>Assurer les marges de transition entre examens</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">•</div>
                    <span>Offrir une flexibilité maximale aux administrateurs</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-medium reveal-element">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Code className="text-indigo-700" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Architecture technique</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-indigo-600">•</div>
                    <span>Interface React interactive et responsive</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-indigo-600">•</div>
                    <span>API REST basée sur Flask avec optimisation OR-Tools</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-indigo-600">•</div>
                    <span>Solveur CP-SAT pour la résolution des contraintes</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-indigo-600">•</div>
                    <span>Communication JSON pour l'échange de données</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Process section */}
            <div className="mb-20 reveal-element">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Notre processus en 4 étapes</h2>
                <p className="text-slate-700 max-w-2xl mx-auto">
                  Voici comment notre système transforme vos contraintes en planning optimisé
                </p>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 h-full w-1 bg-blue-100 transform -translate-x-1/2 hidden md:block"></div>
                
                {/* Process steps */}
                <div className="space-y-12 relative">
                  {/* Step 1 */}
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 text-right">
                      <div className="bg-white p-6 rounded-xl shadow-soft inline-block">
                        <h3 className="text-xl font-semibold mb-2 text-blue-700">1. Saisie des données</h3>
                        <p className="text-slate-600">
                          Saisissez vos paramètres, examens et salles disponibles dans notre interface intuitive
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                        1
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12"></div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 text-right order-1 md:order-2">
                    </div>
                    <div className="flex items-center justify-center z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 order-2 md:order-1">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                        2
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 order-3 md:order-3">
                      <div className="bg-white p-6 rounded-xl shadow-soft inline-block">
                        <h3 className="text-xl font-semibold mb-2 text-blue-700">2. Transmission à l'API</h3>
                        <p className="text-slate-600">
                          Les données sont envoyées à notre API qui prépare le modèle d'optimisation
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 text-right">
                      <div className="bg-white p-6 rounded-xl shadow-soft inline-block">
                        <h3 className="text-xl font-semibold mb-2 text-blue-700">3. Exécution de l'algorithme</h3>
                        <p className="text-slate-600">
                          Notre solveur CP-SAT trouve la solution optimale respectant toutes vos contraintes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                        3
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12"></div>
                  </div>
                  
                  {/* Step 4 */}
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 text-right order-1 md:order-2">
                    </div>
                    <div className="flex items-center justify-center z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 order-2 md:order-1">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                        4
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 order-3 md:order-3">
                      <div className="bg-white p-6 rounded-xl shadow-soft inline-block">
                        <h3 className="text-xl font-semibold mb-2 text-blue-700">4. Visualisation des résultats</h3>
                        <p className="text-slate-600">
                          Consultez, filtrez et exportez le planning généré dans un format facile à comprendre
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* API section */}
            <div className="bg-white p-8 rounded-2xl shadow-medium mb-20 reveal-element">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Pour les développeurs</h2>
                <p className="text-slate-700 mb-6">
                  Notre API est disponible pour les intégrations externes. Voici les endpoints principaux:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">GET</div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 font-mono">/api/schedule/format</h4>
                        <p className="text-slate-600 mt-1">Récupérer le format de données attendu par l'API</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800">POST</div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 font-mono">/api/schedule</h4>
                        <p className="text-slate-600 mt-1">Envoyer vos données et recevoir un planning optimisé</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Exemple de requête</h3>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-slate-400">JSON Request</span>
                  </div>
                  <pre className="p-4 text-sm text-blue-400 overflow-x-auto">
{`{
  "days": 3,
  "slots_per_day": 10,
  "margin": 1,
  "exams": [
    {
      "name": "Algorithmique",
      "duration": 2,
      "students": 60,
      "promotion": 1,
      "filiere": "IA"
    }
  ],
  "rooms": [
    {
      "name": "Amphi A",
      "capacity": 100
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* CTA section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center text-white reveal-element">
              <h2 className="text-3xl font-bold mb-4">Prêt à optimiser votre planning d'examens?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Commencez dès maintenant à utiliser notre outil intelligent pour générer un planning optimal
                et réduire les conflits d'horaires.
              </p>
              <Link
                to="/#schedule-form"
                className="inline-flex items-center px-8 py-3 rounded-full bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-lg font-medium text-lg"
              >
                Générer mon planning
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
