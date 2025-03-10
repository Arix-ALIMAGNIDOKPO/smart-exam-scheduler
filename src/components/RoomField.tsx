
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomFieldProps {
  room: {
    name: string;
    capacity: number;
  };
  index: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
}

const RoomField: React.FC<RoomFieldProps> = ({ room, index, onUpdate, onRemove }) => {
  const handleChange = (field: string, value: string) => {
    if (field === 'capacity') {
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
        aria-label="Remove room"
      >
        <X size={18} />
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor={`room-name-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Nom de la salle
          </label>
          <input
            id={`room-name-${index}`}
            type="text"
            value={room.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: Salle A"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor={`room-capacity-${index}`} 
            className="block text-sm font-medium text-gray-700"
          >
            Capacité
          </label>
          <input
            id={`room-capacity-${index}`}
            type="number"
            min="1"
            value={room.capacity || ''}
            onChange={(e) => handleChange('capacity', e.target.value)}
            className="w-full rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Ex: 35"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default RoomField;
