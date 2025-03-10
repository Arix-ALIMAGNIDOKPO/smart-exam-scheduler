
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, Filter, RefreshCcw, Search } from 'lucide-react';
import ScheduleTable from './ScheduleTable';

interface ScheduleExam {
  name: string;
  filiere: string;
  promotion: number;
  day: number;
  slot: number;
  room: string;
}

interface ScheduleResultProps {
  results: ScheduleExam[];
  totalPeriod: number;
  days: number;
  slotsPerDay: number;
  isLoading: boolean;
  error: string | null;
}

const ScheduleResult: React.FC<ScheduleResultProps> = ({ 
  results, 
  totalPeriod,
  days,
  slotsPerDay,
  isLoading,
  error
}) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFiliere, setFilterFiliere] = useState<string>('');
  const [filterPromotion, setFilterPromotion] = useState<string>('');
  
  const filieres = [...new Set(results.map(exam => exam.filiere))].sort();
  const promotions = [...new Set(results.map(exam => exam.promotion))].sort((a, b) => a - b);
  
  const filteredResults = results.filter(exam => {
    // Search by name or room
    const matchesSearch = searchQuery === '' || 
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by filiere
    const matchesFiliere = filterFiliere === '' || exam.filiere === filterFiliere;
    
    // Filter by promotion
    const matchesPromotion = filterPromotion === '' || 
      exam.promotion === parseInt(filterPromotion);
    
    return matchesSearch && matchesFiliere && matchesPromotion;
  });
  
  const handleDownloadPDF = () => {
    window.print();
    toast.success("Impression lancée", {
      description: "Le planning est en cours d'impression"
    });
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterFiliere('');
    setFilterPromotion('');
  };
  
  useEffect(() => {
    if (results.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);
  
  useEffect(() => {
    if (error) {
      toast.error("Erreur", {
        description: error
      });
    }
  }, [error]);
  
  if (isLoading) {
    return (
      <div className="my-8 text-center">
        <div className="inline-block p-3 rounded-full bg-blue-50">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="mt-4 font-medium text-lg">Génération du planning en cours...</h3>
        <p className="text-muted-foreground">Notre algorithme travaille pour trouver la meilleure solution</p>
      </div>
    );
  }
  
  if (error && !results.length) {
    return null; // Error is shown via toast
  }
  
  if (!results.length) {
    return (
      <div className="my-8 text-center p-10 border border-dashed rounded-xl bg-white">
        <div className="inline-block p-3 rounded-full bg-slate-100 mb-4">
          <Calendar className="text-slate-500" size={32} />
        </div>
        <h3 className="text-lg font-medium mb-2">Aucun planning généré</h3>
        <p className="text-muted-foreground mb-4">
          Complétez le formulaire pour générer un planning d'examens optimisé
        </p>
      </div>
    );
  }

  return (
    <div ref={resultRef} className="w-full animate-scale-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning d'examens</h2>
          <p className="text-muted-foreground">
            Période totale: <span className="font-medium text-foreground">{totalPeriod} créneaux</span> •
            Examens: <span className="font-medium text-foreground">{results.length}</span>
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
            onClick={handleDownloadPDF}
          >
            <Download size={16} className="mr-2" />
            Exporter
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 p-4 bg-white rounded-lg border flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un examen ou une salle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={filterFiliere}
            onChange={(e) => setFilterFiliere(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les filières</option>
            {filieres.map(filiere => (
              <option key={filiere} value={filiere}>{filiere}</option>
            ))}
          </select>
          
          <select
            value={filterPromotion}
            onChange={(e) => setFilterPromotion(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les promotions</option>
            {promotions.map(promotion => (
              <option key={promotion} value={promotion.toString()}>P{promotion}</option>
            ))}
          </select>
          
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-slate-100 flex items-center"
          >
            <RefreshCcw size={16} className="mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <ScheduleTable 
          results={filteredResults}
          days={days}
          slotsPerDay={slotsPerDay}
        />
      </div>
      
      {/* Stats summary */}
      {filteredResults.length !== results.length && (
        <div className="mt-4 text-sm text-slate-500 flex items-center">
          <Filter size={14} className="mr-2" />
          Affichage de {filteredResults.length} examens sur {results.length} au total
        </div>
      )}
    </div>
  );
};

export default ScheduleResult;
