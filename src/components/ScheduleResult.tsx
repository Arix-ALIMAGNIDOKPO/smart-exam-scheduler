
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
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
      <div className="my-16 text-center">
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
    return null;
  }

  return (
    <div ref={resultRef} className="my-16 animate-scale-in">
      <div className="text-center mb-8">
        <div className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
          Planning généré
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Votre planning d'examens</h2>
        <p className="text-muted-foreground">
          Période totale d'examen: <span className="font-medium text-foreground">{totalPeriod} créneaux</span>
        </p>
      </div>
      
      <div className="rounded-xl border bg-white shadow-medium overflow-hidden">
        <ScheduleTable 
          results={results}
          days={days}
          slotsPerDay={slotsPerDay}
        />
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors"
          onClick={() => window.print()}
        >
          Imprimer ce planning
        </button>
      </div>
    </div>
  );
};

export default ScheduleResult;
