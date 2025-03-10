
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScheduleExam {
  name: string;
  filiere: string;
  promotion: number;
  day: number;
  slot: number;
  room: string;
}

interface ScheduleTableProps {
  results: ScheduleExam[];
  days: number;
  slotsPerDay: number;
  startHour?: number; // Heure de début par défaut
}

// Fonction pour convertir des slots en heures lisibles
const slotToTime = (slot: number, startHour: number = 8): string => {
  const hour = startHour + slot;
  return `${hour}:00 - ${hour + 1}:00`;
};

// Fonction pour déterminer le jour de la semaine
const getDayName = (dayIndex: number): string => {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  return days[dayIndex % 7];
};

// Conversion des codes de promotion en noms lisibles
const getPromotionName = (promotion: number): string => {
  const promotions = {
    1: "L1",
    2: "L2",
    3: "L3",
    4: "M1",
    5: "M2"
  };
  return promotions[promotion as keyof typeof promotions] || `P${promotion}`;
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  results, 
  days, 
  slotsPerDay,
  startHour = 8 
}) => {
  const [visibleCells, setVisibleCells] = useState<number>(0);
  const [hoveredExam, setHoveredExam] = useState<ScheduleExam | null>(null);
  const [isCompactView, setIsCompactView] = useState<boolean>(false);
  
  // Get all unique room names
  const rooms = [...new Set(results.map(exam => exam.room))].sort();
  
  useEffect(() => {
    // Animate cells appearing one by one
    const totalCells = days * slotsPerDay * rooms.length;
    let count = 0;
    
    const interval = setInterval(() => {
      count += 10; // Increment by 10 to make animation faster
      setVisibleCells(prev => Math.min(prev + 10, totalCells));
      
      if (count >= totalCells) {
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [days, slotsPerDay, rooms.length]);
  
  // Generate day labels
  const dayLabels = Array.from({ length: days }, (_, i) => `Jour ${i + 1} (${getDayName(i)})`);
  
  // Helper to get exams for a specific day, slot and room
  const getExamsForCell = (day: number, slot: number, room: string) => {
    return results.filter(
      exam => exam.day === day && exam.slot === slot && exam.room === room
    );
  };
  
  // Calculate a cell's visibility index
  const getCellIndex = (dayIndex: number, slotIndex: number, roomIndex: number) => {
    return (dayIndex * slotsPerDay * rooms.length) + (slotIndex * rooms.length) + roomIndex;
  };

  // Get all the slots that would be covered by an exam (based on its duration)
  const getExamCoveredSlots = (exam: ScheduleExam) => {
    const slots = [];
    // Find the exam in the results array to get its duration
    const examDetails = results.find(e => 
      e.name === exam.name && 
      e.day === exam.day && 
      e.slot === exam.slot &&
      e.room === exam.room
    );
    
    if (!examDetails) return slots;
    
    // We don't have duration in the results, so we'll estimate it based on other exams
    // For now, use 1 as default duration
    const duration = 1;
    
    for (let i = 0; i < duration; i++) {
      slots.push({
        day: exam.day,
        slot: exam.slot + i,
        room: exam.room
      });
    }
    
    return slots;
  };
  
  // Check if a cell is covered by the currently hovered exam
  const isCellHighlighted = (day: number, slot: number, room: string) => {
    if (!hoveredExam) return false;
    
    const coveredSlots = getExamCoveredSlots(hoveredExam);
    return coveredSlots.some(s => s.day === day && s.slot === slot && s.room === room);
  };

  // Get color based on filière
  const getFiliereColor = (filiere: string): string => {
    const colorMap: {[key: string]: string} = {
      'IA': 'bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200',
      'GL': 'bg-green-100 border-green-200 text-green-800 hover:bg-green-200',
      'SI': 'bg-purple-100 border-purple-200 text-purple-800 hover:bg-purple-200',
      'SEIOT': 'bg-orange-100 border-orange-200 text-orange-800 hover:bg-orange-200',
      'IM': 'bg-rose-100 border-rose-200 text-rose-800 hover:bg-rose-200',
      'SIRI': 'bg-cyan-100 border-cyan-200 text-cyan-800 hover:bg-cyan-200'
    };
    
    return colorMap[filiere] || 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200';
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-500">
          {results.length} examens programmés
        </span>
        <button 
          className="text-sm flex items-center text-slate-600 hover:text-primary px-2 py-1 rounded border border-slate-200 hover:border-primary"
          onClick={() => setIsCompactView(!isCompactView)}
        >
          {isCompactView ? 'Vue détaillée' : 'Vue compacte'}
        </button>
      </div>
      
      <table className="min-w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wider">
            <th className="p-3 text-left font-medium border-b border-slate-200">Créneau</th>
            {dayLabels.map((day, dayIndex) => (
              <th
                key={dayIndex}
                colSpan={rooms.length}
                className="p-3 text-center font-medium border-l border-b border-slate-200"
              >
                {day}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-50 text-slate-500 text-xs">
            <th className="p-3 text-left font-medium border-b border-slate-200"></th>
            {dayLabels.map((_, dayIndex) => (
              rooms.map((room, roomIndex) => (
                <th 
                  key={`${dayIndex}-${roomIndex}`}
                  className="p-2 text-center font-medium border-l border-b border-slate-200 min-w-40"
                >
                  {room}
                </th>
              ))
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: slotsPerDay }, (_, slotIndex) => (
            <tr 
              key={slotIndex}
              className={slotIndex % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}
            >
              <td className="p-3 text-center font-medium text-slate-700 border-t border-slate-200">
                <span className="whitespace-nowrap">{slotToTime(slotIndex, startHour)}</span>
              </td>
              
              {Array.from({ length: days }, (_, dayIndex) => (
                rooms.map((room, roomIndex) => {
                  const exams = getExamsForCell(dayIndex, slotIndex, room);
                  const cellIndex = getCellIndex(dayIndex, slotIndex, roomIndex);
                  const isHighlighted = isCellHighlighted(dayIndex, slotIndex, room);
                  
                  return (
                    <td 
                      key={`${dayIndex}-${slotIndex}-${roomIndex}`}
                      className={cn(
                        "p-2 border-t border-l border-slate-200 transition-all relative overflow-hidden",
                        visibleCells > cellIndex ? "opacity-100" : "opacity-0",
                        isHighlighted ? "bg-blue-50" : ""
                      )}
                      style={{ 
                        transitionDelay: `${cellIndex * 0.005}s`,
                        height: isCompactView ? "60px" : "76px" 
                      }}
                    >
                      {exams.map((exam, examIndex) => (
                        <div 
                          key={examIndex}
                          className={cn(
                            "rounded-lg p-2 text-sm border shadow-sm transition-colors",
                            hoveredExam && hoveredExam.name === exam.name && hoveredExam.day === exam.day && hoveredExam.slot === exam.slot
                              ? "ring-2 ring-blue-400 shadow-md"
                              : getFiliereColor(exam.filiere)
                          )}
                          onMouseEnter={() => setHoveredExam(exam)}
                          onMouseLeave={() => setHoveredExam(null)}
                        >
                          <div className="font-medium truncate">{exam.name}</div>
                          {!isCompactView && (
                            <div className="text-xs flex justify-between mt-1">
                              <span>{exam.filiere}</span>
                              <span>{getPromotionName(exam.promotion)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                  );
                })
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
