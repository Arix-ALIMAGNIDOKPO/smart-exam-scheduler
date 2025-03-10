import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, Filter, Printer, RefreshCcw, Search, Calendar, Edit, FileJson, Check, X } from 'lucide-react';
import ScheduleTable from './ScheduleTable';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';

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

const promotionLabels: Record<number, string> = {
  1: "Licence 1",
  2: "Licence 2",
  3: "Licence 3",
  4: "Master 1",
  5: "Master 2"
};

const filieres = ["IA", "GL", "SI", "SEIOT", "IM", "SIRI"];

const ScheduleResult: React.FC<ScheduleResultProps> = ({ 
  results, 
  totalPeriod,
  days,
  slotsPerDay,
  isLoading,
  error
}) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFiliere, setFilterFiliere] = useState<string>('');
  const [filterPromotion, setFilterPromotion] = useState<string>('');
  const [startHour, setStartHour] = useState<number>(8);

  const [editingResults, setEditingResults] = useState<ScheduleExam[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingExam, setEditingExam] = useState<ScheduleExam | null>(null);

  useEffect(() => {
    if (results.length > 0 && editingResults.length === 0) {
      setEditingResults([...results]);
    }
  }, [results]);

  const filieres = [...new Set(results.map(exam => exam.filiere))].sort();
  const promotions = [...new Set(results.map(exam => exam.promotion))].sort((a, b) => a - b);

  const filteredResults = (isEditing ? editingResults : results).filter(exam => {
    const matchesSearch = searchQuery === '' || 
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFiliere = filterFiliere === '' || exam.filiere === filterFiliere;
    
    const matchesPromotion = filterPromotion === '' || 
      exam.promotion === parseInt(filterPromotion);
    
    return matchesSearch && matchesFiliere && matchesPromotion;
  });

  const handleDownloadPDF = async () => {
    if (!tableRef.current) return;
    
    toast.info("Préparation du PDF...");
    
    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Planning des examens', 15, 15);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Période: ${totalPeriod} créneaux • Examens: ${results.length}`, 15, 22);
      pdf.text(`Généré le ${new Date().toLocaleString()}`, 15, 28);
      
      pdf.addImage(imgData, 'PNG', 15, 35, imgWidth, imgHeight);
      pdf.save('planning-examens.pdf');
      
      toast.success("PDF téléchargé avec succès!");
    } catch (err) {
      console.error("Erreur lors de la génération du PDF:", err);
      toast.error("Échec du téléchargement", {
        description: "Une erreur s'est produite lors de la génération du PDF."
      });
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + 
      encodeURIComponent(JSON.stringify(isEditing ? editingResults : results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "planning-examens.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Données JSON exportées avec succès!");
  };

  const handlePrint = () => {
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

  const handleEditExam = (exam: ScheduleExam) => {
    setEditingExam({...exam});
  };

  const handleEditSave = () => {
    if (!editingExam) return;
    
    const updatedResults = editingResults.map(exam => 
      exam.name === editingExam.name && 
      exam.day === editingExam.day && 
      exam.slot === editingExam.slot && 
      exam.room === editingExam.room 
        ? editingExam 
        : exam
    );
    
    setEditingResults(updatedResults);
    setEditingExam(null);
    
    toast.success("Modifications enregistrées", {
      description: "Les modifications ont été appliquées au planning."
    });
  };

  const handleEditCancel = () => {
    setEditingExam(null);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditingExam(null);
    } else {
      setIsEditing(true);
      setEditingResults([...results]);
    }
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
      <div className="my-8 text-center p-8">
        <div className="inline-block p-3 rounded-full bg-blue-50 mb-4">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    return null;
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

  const EditModal = () => {
    if (!editingExam) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Modifier un examen</h3>
            <button 
              onClick={handleEditCancel}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'examen</label>
              <input 
                type="text" 
                value={editingExam.name}
                onChange={(e) => setEditingExam({...editingExam, name: e.target.value})}
                className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Filière</label>
              <select
                value={editingExam.filiere}
                onChange={(e) => setEditingExam({...editingExam, filiere: e.target.value})}
                className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm"
              >
                {filieres.map(filiere => (
                  <option key={filiere} value={filiere}>{filiere}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Promotion</label>
              <select
                value={editingExam.promotion}
                onChange={(e) => setEditingExam({...editingExam, promotion: parseInt(e.target.value)})}
                className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm"
              >
                {Object.entries(promotionLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Jour</label>
              <select
                value={editingExam.day}
                onChange={(e) => setEditingExam({...editingExam, day: parseInt(e.target.value)})}
                className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm"
              >
                {Array.from({length: days}, (_, i) => (
                  <option key={i} value={i}>Jour {i+1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Créneau horaire</label>
              <select
                value={editingExam.slot}
                onChange={(e) => setEditingExam({...editingExam, slot: parseInt(e.target.value)})}
                className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm"
              >
                {Array.from({length: slotsPerDay}, (_, i) => (
                  <option key={i} value={i}>{startHour + i}:00 - {startHour + i + 1}:00</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Salle</label>
              <select
                value={editingExam.room}
                onChange={(e) => setEditingExam({...editingExam, room: e.target.value})}
                className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm"
              >
                {[...new Set(results.map(exam => exam.room))].sort().map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={handleEditCancel}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              onClick={handleEditSave}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center"
            >
              <Check size={16} className="mr-1" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={resultRef} className="w-full animate-scale-in">
      {editingExam && <EditModal />}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning d'examens</h2>
          <p className="text-muted-foreground">
            Période totale: <span className="font-medium text-foreground">{totalPeriod} heures</span> •
            Examens: <span className="font-medium text-foreground">{results.length}</span>
            {isEditing && <span className="text-primary font-medium ml-2">• Mode édition</span>}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button 
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center border border-slate-200 shadow-sm"
            onClick={handlePrint}
          >
            <Printer size={16} className="mr-2" />
            Imprimer
          </button>
          
          <button 
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center border border-slate-200 shadow-sm"
            onClick={handleDownloadPDF}
          >
            <Download size={16} className="mr-2" />
            PDF
          </button>
          
          <button 
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center border border-slate-200 shadow-sm"
            onClick={handleExportJSON}
          >
            <FileJson size={16} className="mr-2" />
            JSON
          </button>
          
          <button 
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm",
              isEditing 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-primary hover:bg-primary/90 text-white"
            )}
            onClick={toggleEditMode}
          >
            {isEditing ? (
              <>
                <Check size={16} className="mr-2" />
                Terminer
              </>
            ) : (
              <>
                <Edit size={16} className="mr-2" />
                Modifier
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm flex flex-col md:flex-row gap-4">
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
              <option key={promotion} value={promotion.toString()}>
                {promotionLabels[promotion] || `P${promotion}`}
              </option>
            ))}
          </select>
          
          <select
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Début à 7h</option>
            <option value="8">Début à 8h</option>
            <option value="9">Début à 9h</option>
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
      
      <div ref={tableRef} className="rounded-xl border bg-white shadow-sm overflow-hidden print:shadow-none print:border-none">
        <ScheduleTable 
          results={filteredResults}
          days={days}
          slotsPerDay={slotsPerDay}
          startHour={startHour}
        />
      </div>
      
      {filteredResults.length !== (isEditing ? editingResults : results).length && (
        <div className="mt-4 text-sm text-slate-500 flex items-center">
          <Filter size={14} className="mr-2" />
          Affichage de {filteredResults.length} examens sur {(isEditing ? editingResults : results).length} au total
        </div>
      )}
    </div>
  );
};

export default ScheduleResult;
