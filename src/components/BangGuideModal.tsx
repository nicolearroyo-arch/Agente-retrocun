import React from 'react';
import { Sparkles, AlertTriangle, Layers, CheckCircle2, Lightbulb, Compass, Zap } from 'lucide-react';
import { BANG_CHARACTERS, LEAN_CANVAS_BLOCKS } from '../data/rubricData';

export const BangGuideModal: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 md:p-8 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Metodología de Innovación CUN</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Guía Metodológica: Ideación BANG y Lean Canvas
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Los dos pilares de ideación y modelado de negocio en «Pasaporte de Ascenso». Conoce a fondo cómo dinamizar el pensamiento con los 5 personajes BANG, la regla estricta de los 20 puntos por fila y la coherencia sistémica de los 9 bloques del Canvas.
        </p>
      </div>

      {/* SECTION 1: THE 5 BANG CHARACTERS */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Los 5 Personajes de Ideación BANG (10 Ideas Requeridas)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Cada estudiante o equipo debe generar al menos 2 ideas creativas por cada personaje, completando mínimo 10 ideas divergentes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {BANG_CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${char.avatarBg}`}>
                    {char.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{char.name}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{char.role}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                  <span className="font-bold text-slate-400 not-italic block text-[10px] uppercase mb-1">
                    Frase Disparadora:
                  </span>
                  "{char.triggerPhrase}"
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {char.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
                Aporte: Mínimo 2 ideas divergentes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: THE 20-POINT HORIZONTAL SUM RULE */}
      <div className="bg-amber-50/60 rounded-2xl p-6 md:p-8 border border-amber-200 space-y-4">
        <div className="flex items-center space-x-2.5 text-amber-900 font-extrabold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>La Regla Estricta de los 20 Puntos por Fila en la Matriz de Selección</span>
        </div>

        <p className="text-xs md:text-sm text-amber-950 leading-relaxed">
          Uno de los errores más comunes cometidos por los estudiantes es calificar cada idea de 1 a 20 o calificar con puntajes independientes. En la rúbrica oficial de CUN, <strong>los 20 puntos de cada criterio se deben distribuir HORIZONTALMENTE entre las 10 ideas</strong>:
        </p>

        <div className="bg-white rounded-xl p-4 border border-amber-300 shadow-xs space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Fila 1: Viabilidad Comercial</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Suma de Idea 1 a Idea 10 = <strong>Exactamente 20 puntos</strong>.
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Fila 2: Factibilidad Técnica</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Suma de Idea 1 a Idea 10 = <strong>Exactamente 20 puntos</strong>.
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Fila 3: Deseabilidad del Usuario</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Suma de Idea 1 a Idea 10 = <strong>Exactamente 20 puntos</strong>.
              </span>
            </div>
          </div>

          <div className="text-center pt-2 font-bold text-xs text-slate-700">
            Total General de la Matriz = <strong>60 puntos sumados</strong>. La idea con mayor puntaje acumulado es la que avanza a la Propuesta de Valor y al Prototipo.
          </div>
        </div>
      </div>

      {/* SECTION 3: THE 9 LEAN CANVAS BLOCKS */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span>Los 9 Bloques del Lean Canvas (15% de la Calificación)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Articulación integral del modelo de negocio en una sola página.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {LEAN_CANVAS_BLOCKS.map((block) => (
            <div key={block.num} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{block.name}</span>
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  {block.num}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{block.desc}</p>
              {block.num === 9 && (
                <div className="pt-2 text-[11px] font-bold text-emerald-700">
                  ⚠️ Atención: No confundir con "buen servicio". Debe ser una barrera real de entrada.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
