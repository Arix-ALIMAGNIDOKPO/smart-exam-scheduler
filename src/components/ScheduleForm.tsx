
import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle, LayoutGrid, CalendarClock, BookOpen } from 'lucide-react';
import ExamField from './ExamField';
import RoomField from './RoomField';

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

interface ScheduleFormProps {
  onResults: (results: any[], total: number, daysCount: number, slots: number) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
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

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onResults, setIsLoading, setError }) => {
  const [days, setDays] = useState<number>(3);
  const [slotsPerDay, setSlotsPerDay] = useState<number>(10);
  const [margin, setMargin] = useState<number>(1);
  const [exams, setExams] = useState<Exam[]>([{ ...initialExam }]);
  const [rooms, setRooms] = useState<Room[]>([{ ...initialRoom }]);
  
  const [results, setResults] = useState<ScheduleResult['results']>([]);
  const [totalPeriod, setTotalPeriod] = useState<number>(0);
  // Rename these variables to avoid conflict with props
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  
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
    
    // Use both the local state and the props
    setFormIsLoading(true);
    setIsLoading(true);
    setFormError(null);
    setError(null);
    setRetryCount(0);
    
    // Create the payload outside the try block so we can reuse it
    const payload = {
      days,
      slots_per_day: slotsPerDay,
      margin,
      exams,
      rooms
    };

    await fetchSchedule(payload);
  };

  const fetchSchedule = async (payload: any, retries = 0) => {
    try {
      // Using a CORS proxy to bypass CORS issues if they exist
      // const API_URL = 'https://cors-anywhere.herokuapp.com/https://examoptim.onrender.com/api/schedule';
      const API_URL = 'https://examoptim.onrender.com/api/schedule';
      
      // Log the request for debugging
      console.log('Sending request to:', API_URL);
      console.log('Request payload:', JSON.stringify(payload));
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add additional headers that might help with CORS
          'Access-Control-Allow-Origin': '*',
        },
        // Add credentials if needed
        // credentials: 'include',
        body: JSON.stringify(payload),
      });
      
      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data: ScheduleResult = await response.json();
      
      if (data.status === 'success') {
        setResults(data.results);
        setTotalPeriod(data.total_period);
        onResults(data.results, data.total_period, days, slotsPerDay);
        toast.success("Planning généré avec succès !");
      } else {
        const errorMessage = data.message || "Une erreur est survenue lors de la génération du planning.";
        setFormError(errorMessage);
        setError(errorMessage);
        toast.error("Erreur", {
          description: errorMessage
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      
      // If server is potentially waking up, retry a few times
      if (retries < 3) {
        const retryDelay = (retries + 1) * 2000; // Exponential backoff
        setRetryCount(retries + 1);
        
        toast.info("Tentative de reconnexion", {
          description: `Tentative ${retries + 1}/3. Le serveur se réveille peut-être...`
        });
        
        // Wait and retry
        setTimeout(() => {
          fetchSchedule(payload, retries + 1);
        }, retryDelay);
        return;
      }
      
      // After all retries, show error
      const errorMessage = "Impossible de communiquer avec le serveur. Veuillez réessayer plus tard. Le serveur est peut-être en cours de maintenance ou de démarrage.";
      setFormError(errorMessage);
      setError(errorMessage);
      toast.error("Échec de connexion", {
        description: errorMessage
      });
    } finally {
      if (retries === 0 || retries >= 3) {
        setFormIsLoading(false);
        setIsLoading(false);
      }
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
              disabled={formIsLoading}
              className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg font-medium disabled:opacity-70"
            >
              {formIsLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {retryCount > 0 ? `Tentative ${retryCount}/3...` : 'Génération en cours...'}
                </span>
              ) : 'Générer le planning'}
            </button>
          </div>
          
          {/* Connection status */}
          {formError && (
            <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-700">
              <p className="font-medium">Problème de connexion:</p>
              <p>{formError}</p>
              <p className="mt-2 text-xs">
                Note: Le serveur d'API est hébergé sur Render et peut être en mode veille. 
                Il peut prendre jusqu'à 50 secondes pour démarrer s'il n'a pas été utilisé récemment.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ScheduleForm;
