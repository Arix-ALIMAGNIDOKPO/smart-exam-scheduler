
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamFieldProps {
  exam: {
    name: string;
    duration: number;
    students: number;
    promotion: number;
    filiere: string;
  };
  index: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
}

const ExamField: React.FC<ExamFieldProps> = ({ exam, index, onUpdate, onRemove }) => {
  const handleChange = (field: string, value: string) => {
    if (field === 'duration' || field === 'students' || field === 'promotion') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) || value === '') {
        onUpdate(index, field, value === '' ? '' : numValue);
      }
    } else {
      onUpdate(index, field, value);
    }
  };

  return (
    <div 
      className={cn(
        "animate-slide-up p-5 rounded-xl border bg-white shadow-soft relative transition-all",
        "hover:shadow-medium hover:border-blue-100 group"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
        aria-label="Remove exam"
      >
        <X size={18} />
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor={`exam-name-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Nom de l'examen
          </label>
          <input
            id={`exam-name-${index}`}
            type="text"
            value={exam.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: Mathématiques"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor={`exam-duration-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Durée (créneaux)
          </label>
          <input
            id={`exam-duration-${index}`}
            type="number"
            min="1"
            value={exam.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: 2"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor={`exam-students-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Nombre d'étudiants
          </label>
          <input
            id={`exam-students-${index}`}
            type="number"
            min="1"
            value={exam.students || ''}
            onChange={(e) => handleChange('students', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: 30"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor={`exam-promotion-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Promotion
          </label>
          <input
            id={`exam-promotion-${index}`}
            type="number"
            min="1"
            value={exam.promotion || ''}
            onChange={(e) => handleChange('promotion', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: 1"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor={`exam-filiere-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Filière
          </label>
          <input
            id={`exam-filiere-${index}`}
            type="text"
            value={exam.filiere}
            onChange={(e) => handleChange('filiere', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: GL"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ExamField;
