// components/common/HealthCard.tsx
'use client';

import { ReactNode } from 'react';

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  color: string;
  level: 1 | 2 | 3 | 4;
  description?: string;
  onClick?: () => void;
  compact?: boolean;
}

export default function HealthCard({
  title,
  value,
  unit,
  icon,
  color,
  level,
  description,
  onClick,
  compact = false
}: HealthCardProps) {
  const getLevelName = (level: number): string => {
    switch(level) {
      case 1: return 'ดีเยี่ยม';
      case 2: return 'ดี';
      case 3: return 'ปานกลาง';
      case 4: return 'ควรดูแล';
      default: return 'ไม่ทราบ';
    }
  };

  const getLevelColor = (level: number): string => {
    switch(level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <div 
        className={`rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
          onClick ? 'hover:scale-[1.02]' : ''
        }`}
        onClick={onClick}
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon && <div className="mr-3" style={{ color }}>{icon}</div>}
            <div>
              <h3 className="font-medium text-gray-700">{title}</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getLevelColor(level)}`}>
                {getLevelName(level)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
            {unit && <div className="text-xs text-gray-500">{unit}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-xl p-6 shadow-lg border cursor-pointer transition-all hover:shadow-xl ${
        onClick ? 'hover:scale-[1.02]' : ''
      }`}
      onClick={onClick}
      style={{ 
        borderTopColor: color, 
        borderTopWidth: '4px',
        background: `linear-gradient(to bottom, ${color}20, white)`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {icon && <div className="mr-3 text-2xl" style={{ color }}>{icon}</div>}
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full ${getLevelColor(level)}`}>
          {getLevelName(level)}
        </div>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-bold" style={{ color }}>{value}</div>
          {unit && <div className="text-gray-600">{unit}</div>}
        </div>
        {description && (
          <p className="text-gray-600 max-w-xs">{description}</p>
        )}
      </div>

      {/* Progress bar for level */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${(5 - level) * 25}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}