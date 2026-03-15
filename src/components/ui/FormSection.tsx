import React from 'react';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, icon, children, className = '' }: FormSectionProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-5 py-3 flex items-center gap-2">
        {icon && <span className="text-amber-400">{icon}</span>}
        <h2 className="text-white font-semibold text-base tracking-wide">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldRow({ label, children, className = '' }: FieldRowProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

interface SelectFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

export function SelectField({ value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[44px]"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

interface TextFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function TextField({ value, onChange, placeholder, type = 'text', className = '' }: TextFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[44px] ${className}`}
    />
  );
}

interface NumberFieldProps {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberField({ value, onChange, placeholder, min, max, className = '' }: NumberFieldProps) {
  return (
    <input
      type="number"
      value={value || ''}
      onChange={e => onChange(Number(e.target.value))}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[44px] ${className}`}
    />
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

interface RadioGroupProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  name: string;
}

export function RadioGroup({ value, onChange, options, name }: RadioGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <label key={o.value} className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-amber-50 hover:border-amber-300 transition-colors">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="text-amber-500 focus:ring-amber-400"
          />
          <span className="text-sm text-gray-700">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
    />
  );
}

interface TwoColProps {
  children: React.ReactNode;
}

export function TwoCol({ children }: TwoColProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  );
}
