import React, { useState, useRef } from 'react';
import { X, Camera, Image, Trash2 } from 'lucide-react';
import type { CosmeticDefect, DefectType } from '../types';
import guitarSvg from '../assets/Guitar_1.svg';

interface Props {
  defects: CosmeticDefect[];
  photos: string[];
  onChange: (defects: CosmeticDefect[]) => void;
  onPhotosChange: (photos: string[]) => void;
}

const DEFECT_TYPES: { type: DefectType; label: string; color: string; bg: string }[] = [
  { type: 'С', label: 'С — скол', color: 'text-red-700', bg: 'bg-red-100 border-red-300 hover:bg-red-200' },
  { type: 'П', label: 'П — потертость', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-300 hover:bg-orange-200' },
  { type: 'Г', label: 'Г — грязь', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' },
  { type: 'Т', label: 'Т — трещина', color: 'text-rose-900', bg: 'bg-rose-100 border-rose-400 hover:bg-rose-200' },
];

const TYPE_COLORS: Record<DefectType, string> = {
  'С': '#dc2626',
  'П': '#ea580c',
  'Г': '#ca8a04',
  'Т': '#881337',
};

export function CosmeticMap({ defects, photos, onChange, onPhotosChange }: Props) {
  const [selectedType, setSelectedType] = useState<DefectType>('С');
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newDefect: CosmeticDefect = {
      id: `d-${Date.now()}`,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      type: selectedType,
    };
    onChange([...defects, newDefect]);
  };

  const removeDefect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(defects.filter(d => d.id !== id));
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          onPhotosChange([...photos, result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-600">Инструмент:</span>
        {DEFECT_TYPES.map(dt => (
          <button
            key={dt.type}
            type="button"
            onClick={() => setSelectedType(dt.type)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-bold transition-all ${dt.bg} ${dt.color} ${selectedType === dt.type ? 'ring-2 ring-offset-1 ring-gray-400 scale-105' : ''}`}
          >
            {dt.label}
          </button>
        ))}
        {defects.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="ml-auto text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X size={12} />
            Очистить все
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
        <p className="text-xs text-gray-400 text-center pt-2 pb-1">Нажмите на гитару, чтобы отметить дефект</p>
        <div
          ref={containerRef}
          className="relative cursor-crosshair select-none"
          style={{ userSelect: 'none' }}
          onClick={handleClick}
        >
          <img
            src={guitarSvg}
            alt="Guitar diagram"
            className="w-full h-auto block"
            draggable={false}
          />
          {defects.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={e => removeDefect(d.id, e)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs transition-transform hover:scale-125"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                color: TYPE_COLORS[d.type],
                background: TYPE_COLORS[d.type] + '22',
                border: `2px solid ${TYPE_COLORS[d.type]}`,
                lineHeight: 1,
              }}
              title="Нажмите, чтобы удалить"
            >
              {d.type}
            </button>
          ))}
        </div>
      </div>

      {defects.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Отмеченные дефекты ({defects.length}):</p>
          <div className="flex flex-wrap gap-2">
            {defects.map((d, i) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border"
                style={{ color: TYPE_COLORS[d.type], borderColor: TYPE_COLORS[d.type] + '40', background: TYPE_COLORS[d.type] + '10' }}
              >
                {i + 1}. {d.type}
                <button
                  type="button"
                  onClick={e => removeDefect(d.id, e)}
                  className="ml-0.5 hover:opacity-70"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Фото дефектов</span>
          <div className="flex gap-2">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={handleFileSelected}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelected}
            />
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Camera size={14} />
              Камера
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-200"
            >
              <Image size={14} />
              Галерея
            </button>
          </div>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <img src={photo} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <Trash2 size={10} />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <Camera size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Нет фотографий</p>
            <p className="text-xs text-gray-300 mt-1">Нажмите «Камера» для съемки или «Галерея» для загрузки</p>
          </div>
        )}
      </div>
    </div>
  );
}
