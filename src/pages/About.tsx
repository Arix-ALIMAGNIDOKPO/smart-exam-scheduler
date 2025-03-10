
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-16">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 reveal-element">
              <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                À propos d'ExamOptim
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
                Notre approche de l'optimisation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment nous simplifions la planification des examens grâce à notre algorithme d'optimisation avancé.
              </p>
            </div>
            
            <div className="prose prose-slate mx-auto lg:prose-lg reveal-element">
              <h2>Présentation du Système</h2>
              
              <h3>Objectif de l'application</h3>
              <ul>
                <li>
                  <strong>Optimisation des Plannings :</strong> Minimiser la durée totale de la période d'examen en concentrant les sessions sur le moins de jours possible.
                </li>
                <li>
                  <strong>Gestion des Conflits :</strong> Assurer qu'aucun examen ne chevauche un autre pour les mêmes ressources (même salle ou promotions incompatibles) et respecter les marges de transition entre examens.
                </li>
                <li>
                  <strong>Flexibilité :</strong> Permettre la modification dynamique des paramètres (nombre de jours, créneaux par jour, marge, etc.) ainsi que la saisie de multiples examens et salles.
                </li>
              </ul>
              
              <h3>Composants Techniques</h3>
              <ul>
                <li>
                  <strong>Interface Web :</strong> Un formulaire intuitif qui recueille les données nécessaires (jours, créneaux, examens, salles, etc.).
                </li>
                <li>
                  <strong>API Intégrée :</strong> L'API REST (basée sur Flask) reçoit vos données en JSON, exécute l'algorithme d'optimisation et renvoie le planning généré.
                </li>
                <li>
                  <strong>Algorithme d'Optimisation :</strong> Construit avec OR-Tools et le solveur CP-SAT, il prend en compte les contraintes de capacité, horaires, promotions, et marge de transition pour trouver la meilleure configuration possible.
                </li>
              </ul>
              
              <h2>Processus de Génération du Planning</h2>
              
              <h3>Fonctionnement de l'Optimisation</h3>
              <ol>
                <li>
                  <strong>Saisie des Données :</strong> Vous remplissez le formulaire avec les informations requises.
                </li>
                <li>
                  <strong>Transmission à l'API :</strong> L'interface envoie les données via un appel POST à l'endpoint de l'API.
                </li>
                <li>
                  <strong>Exécution de l'Algorithme :</strong> L'algorithme calcule pour chaque examen son jour et son créneau horaire, tout en respectant les contraintes.
                </li>
                <li>
                  <strong>Affichage des Résultats :</strong> Une fois le traitement terminé, le planning généré vous est présenté sous forme de tableau.
                </li>
              </ol>
              
              <h2>Utilisation Avancée et Intégration de l'API</h2>
              
              <h3>Pour les Développeurs</h3>
              <p>
                Notre API est disponible pour les intégrations externes. Elle offre deux endpoints principaux :
              </p>
              <ul>
                <li>
                  <code>GET /api/schedule/format</code> : Pour obtenir un exemple du format attendu.
                </li>
                <li>
                  <code>POST /api/schedule</code> : Pour lancer l'optimisation avec vos données.
                </li>
              </ul>
              
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
                <h3 className="text-blue-800 mb-3">Prêt à optimiser votre planning d'examens ?</h3>
                <p className="text-blue-700 mb-4">
                  Commencez dès maintenant à utiliser notre outil intelligent pour générer un planning optimal.
                </p>
                <Link
                  to="/#schedule-form"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Générer mon planning
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
