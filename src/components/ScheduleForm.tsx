
import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle, LayoutGrid, CalendarClock, BookOpen } from 'lucide-react';
import ExamField from './ExamField';
import RoomField from './RoomField';
import ScheduleResult from './ScheduleResult';

interface Exam {
  name: string;
  duration: number;
  students: number;
  promotion: number;
  filiere: string;
}

interface Room {
  name: string;
  capacity: number;
}

interface ScheduleResult {
  status: string;
  results: Array<{
    name: string;
    filiere: string;
    promotion: number;
    day: number;
    slot: number;
    room: string;
  }>;
  total_period: number;
  message?: string;
}

const initialExam: Exam = {
  name: '',
  duration: 0,
  students: 0,
  promotion: 0,
  filiere: ''
};

const initialRoom: Room = {
  name: '',
  capacity: 0
};

const ScheduleForm: React.FC = () => {
  const [days, setDays] = useState<number>(3);
  const [slotsPerDay, setSlotsPerDay] = useState<number>(10);
  const [margin, setMargin] = useState<number>(1);
  const [exams, setExams] = useState<Exam[]>([{ ...initialExam }]);
  const [rooms, setRooms] = useState<Room[]>([{ ...initialRoom }]);
  
  const [results, setResults] = useState<ScheduleResult['results']>([]);
  const [totalPeriod, setTotalPeriod] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddExam = () => {
    setExams([...exams, { ...initialExam }]);
  };
  
  const handleAddRoom = () => {
    setRooms([...rooms, { ...initialRoom }]);
  };
  
  const handleRemoveExam = (index: number) => {
    setExams(exams.filter((_, i) => i !== index));
  };
  
  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };
  
  const updateExam = (index: number, field: string, value: string | number) => {
    const updatedExams = [...exams];
    updatedExams[index] = { 
      ...updatedExams[index], 
      [field]: value 
    };
    setExams(updatedExams);
  };
  
  const updateRoom = (index: number, field: string, value: string | number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { 
      ...updatedRooms[index], 
      [field]: value 
    };
    setRooms(updatedRooms);
  };
  
  const isFormValid = () => {
    if (days < 1 || slotsPerDay < 1 || margin < 0) {
      return false;
    }
    
    const isExamsValid = exams.every(exam => 
      exam.name.trim() !== '' && 
      exam.duration > 0 && 
      exam.students > 0 && 
      exam.promotion > 0 && 
      exam.filiere.trim() !== ''
    );
    
    const isRoomsValid = rooms.every(room => 
      room.name.trim() !== '' && 
      room.capacity > 0
    );
    
    return isExamsValid && isRoomsValid;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Formulaire incomplet", {
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = {
        days,
        slots_per_day: slotsPerDay,
        margin,
        exams,
        rooms
      };
      
      const response = await fetch('https://examoptim.onrender.com/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data: ScheduleResult = await response.json();
      
      if (data.status === 'success') {
        setResults(data.results);
        setTotalPeriod(data.total_period);
        toast.success("Planning généré avec succès !");
      } else {
        setError(data.message || "Une erreur est survenue lors de la génération du planning.");
      }
    } catch (err) {
      setError("Impossible de communiquer avec le serveur. Veuillez réessayer plus tard.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="schedule-form" className="py-16 relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full opacity-50 blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-50 rounded-full opacity-40 blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Générer un planning d'examens</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complétez le formulaire avec vos contraintes pour générer un planning 
            d'examens optimisé. Notre algorithme trouve la meilleure allocation possible.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* General parameters */}
          <div className="glass-card rounded-xl p-6 shadow-medium">
            <h3 className="text-lg font-medium mb-5">Paramètres généraux</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                  Nombre de jours
                </label>
                <input
                  id="days"
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="slots-per-day" className="block text-sm font-medium text-gray-700">
                  Créneaux par jour
                </label>
                <input
                  id="slots-per-day"
                  type="number"
                  min="1"
                  value={slotsPerDay}
                  onChange={(e) => setSlotsPerDay(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="margin" className="block text-sm font-medium text-gray-700">
                  Marge entre examens
                </label>
                <input
                  id="margin"
                  type="number"
                  min="0"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Exams */}
          <div className="glass-card rounded-xl p-6 shadow-medium">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium">Examens</h3>
              <button
                type="button"
                onClick={handleAddExam}
                className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <PlusCircle className="mr-1" size={16} />
                Ajouter un examen
              </button>
            </div>
            
            <div className="space-y-4">
              {exams.map((exam, index) => (
                <ExamField
                  key={index}
                  exam={exam}
                  index={index}
                  onUpdate={updateExam}
                  onRemove={handleRemoveExam}
                />
              ))}
            </div>
          </div>
          
          {/* Rooms */}
          <div className="glass-card rounded-xl p-6 shadow-medium">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium">Salles</h3>
              <button
                type="button"
                onClick={handleAddRoom}
                className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <PlusCircle className="mr-1" size={16} />
                Ajouter une salle
              </button>
            </div>
            
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <RoomField
                  key={index}
                  room={room}
                  index={index}
                  onUpdate={updateRoom}
                  onRemove={handleRemoveRoom}
                />
              ))}
            </div>
          </div>
          
          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg font-medium disabled:opacity-70"
            >
              {isLoading ? 'Génération en cours...' : 'Générer le planning'}
            </button>
          </div>
        </form>
        
        {/* Results section */}
        <ScheduleResult 
          results={results}
          totalPeriod={totalPeriod}
          days={days}
          slotsPerDay={slotsPerDay}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </section>
  );
};

export default ScheduleForm;
