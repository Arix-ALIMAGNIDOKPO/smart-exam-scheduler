
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
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ results, days, slotsPerDay }) => {
  const [visibleCells, setVisibleCells] = useState<number>(0);
  
  // Get all unique room names
  const rooms = [...new Set(results.map(exam => exam.room))].sort();
  
  useEffect(() => {
    // Animate cells appearing one by one
    const totalCells = days * slotsPerDay * rooms.length;
    let count = 0;
    
    const interval = setInterval(() => {
      count += 5; // Increment by 5 to make animation faster
      setVisibleCells(prev => Math.min(prev + 5, totalCells));
      
      if (count >= totalCells) {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [days, slotsPerDay, rooms.length]);
  
  // Generate day labels (Jour 1, Jour 2, etc.)
  const dayLabels = Array.from({ length: days }, (_, i) => `Jour ${i + 1}`);
  
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

  return (
    <div className="overflow-x-auto pb-6">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs">
            <th className="p-3 text-left font-medium w-20">Créneau</th>
            {dayLabels.map((day, dayIndex) => (
              <th
                key={dayIndex}
                colSpan={rooms.length}
                className="p-3 text-center font-medium border-l border-slate-200"
              >
                {day}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-50 text-slate-500 text-xs">
            <th className="p-3 text-left font-medium"></th>
            {dayLabels.map((_, dayIndex) => (
              rooms.map((room, roomIndex) => (
                <th 
                  key={`${dayIndex}-${roomIndex}`}
                  className="p-2 text-center font-medium border-l border-slate-200 min-w-40"
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
              className={slotIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="p-3 text-center font-medium text-slate-700 border-t border-slate-200">
                {slotIndex + 1}
              </td>
              
              {Array.from({ length: days }, (_, dayIndex) => (
                rooms.map((room, roomIndex) => {
                  const exams = getExamsForCell(dayIndex, slotIndex, room);
                  const cellIndex = getCellIndex(dayIndex, slotIndex, roomIndex);
                  
                  return (
                    <td 
                      key={`${dayIndex}-${slotIndex}-${roomIndex}`}
                      className={cn(
                        "p-2 border-t border-l border-slate-200 transition-all relative overflow-hidden",
                        visibleCells > cellIndex ? "opacity-100" : "opacity-0"
                      )}
                      style={{ 
                        transitionDelay: `${cellIndex * 0.005}s`,
                        height: "72px" 
                      }}
                    >
                      {exams.map((exam, examIndex) => (
                        <div 
                          key={examIndex}
                          className="rounded-lg bg-blue-50 p-2 text-sm border border-blue-100 text-blue-800 shadow-sm"
                        >
                          <div className="font-medium">{exam.name}</div>
                          <div className="text-xs flex justify-between mt-1">
                            <span>{exam.filiere}</span>
                            <span>P{exam.promotion}</span>
                          </div>
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
