import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Award, ShieldAlert, Sparkles, Scale } from 'lucide-react';
import { OFFICIAL_RUBRIC } from '../data/rubricData';

export const RubricGuideModal: React.FC = () => {
  const [selectedId, setSelectedId] = useState(OFFICIAL_RUBRIC[0].id);
  const selectedItem = OFFICIAL_RUBRIC.find((r) => r.id === selectedId) || OFFICIAL_RUBRIC[0];

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Corporación Unificada Nacional de Educación Superior (CUN)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Rúbrica Institucional Oficial: Pasaporte de Ascenso
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Instrumento de evaluación formativa del programa de Espíritu Emprendedor e Innovación. Consta de 6 criterios pedagógicos con un total acumulado de 100 puntos, convertidos a la escala colombiana de 0.0 a 5.0 (cálculo directo: Puntos / 20).
        </p>

        {/* Quick summary badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            Total: 100 Puntos
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Escala CUN: 0.0 - 5.0
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            6 Criterios Ponderados
          </span>
        </div>
      </div>

      {/* Main 2-column explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left selector */}
        <div className="lg:col-span-5 space-y-2">
          {OFFICIAL_RUBRIC.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                selectedId === item.id
                  ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                  selectedId === item.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                  <span className="text-[11px] text-slate-400">
                    Ponderación: {item.weight}% ({item.maxPoints} pts)
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                selectedId === item.id ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
              }`} />
            </button>
          ))}
        </div>

        {/* Right detailed criteria view */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ponderación: {selectedItem.weight}% • {selectedItem.maxPoints} Puntos Máximos
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {selectedItem.id.toUpperCase()}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {selectedItem.name}
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
              {selectedItem.description}
            </p>
          </div>

          {/* Key Indicators */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Indicadores Clave de Verificación
            </h4>
            <div className="space-y-1.5">
              {selectedItem.keyIndicators.map((ind, iIdx) => (
                <div key={iIdx} className="flex items-start space-x-2 text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Descriptors */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Escala de Niveles de Desempeño
            </h4>

            {/* Estratégico */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span>Nivel Estratégico (Sobresaliente)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-950 font-mono text-[10px]">
                  85% - 100%
                </span>
              </div>
              <p className="text-emerald-950 leading-relaxed font-normal">
                {selectedItem.levels.estrategico}
              </p>
            </div>

            {/* Autónomo */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>Nivel Autónomo (Alto)</span>
                <span className="px-2 py-0.5 rounded bg-blue-200/70 text-blue-950 font-mono text-[10px]">
                  70% - 84%
                </span>
              </div>
              <p className="text-blue-950 leading-relaxed font-normal">
                {selectedItem.levels.autonomo}
              </p>
            </div>

            {/* Básico */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Nivel Básico (Aprobatorio Mínimo)</span>
                <span className="px-2 py-0.5 rounded bg-amber-200/70 text-amber-950 font-mono text-[10px]">
                  50% - 69%
                </span>
              </div>
              <p className="text-amber-950 leading-relaxed font-normal">
                {selectedItem.levels.basico}
              </p>
            </div>

            {/* En Desarrollo */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span>En Desarrollo (No Aprobatorio / Reestructuración)</span>
                <span className="px-2 py-0.5 rounded bg-rose-200/70 text-rose-950 font-mono text-[10px]">
                  &lt; 50%
                </span>
              </div>
              <p className="text-rose-950 leading-relaxed font-normal">
                {selectedItem.levels.enDesarrollo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
