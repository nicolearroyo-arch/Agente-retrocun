import React from 'react';
import { EvaluationResult } from '../types';

interface PrintReportViewProps {
  evaluation: EvaluationResult;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ evaluation }) => {
  return (
    <div className="hidden print-only p-8 bg-white text-black font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">
            Corporación Unificada Nacional de Educación Superior (CUN)
          </h1>
          <h2 className="text-base font-semibold text-gray-800">
            Programa de Espíritu Emprendedor e Innovación • Pasaporte de Ascenso
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Acta Oficial de Valoración Formativa y Rúbrica de Desempeño
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-gray-600 uppercase">Nota Oficial</div>
          <div className="text-3xl font-black text-black">
            {evaluation.cunGrade.toFixed(1)} / 5.0
          </div>
          <div className="text-xs text-gray-600 font-semibold">
            {Math.round(evaluation.totalPoints)} / 100 Puntos
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-xs border border-gray-300 p-3 rounded mb-6 bg-gray-50">
        <div>
          <span className="font-bold text-gray-700">Proyecto:</span> {evaluation.projectTitle}
        </div>
        <div>
          <span className="font-bold text-gray-700">Ficha / Grupo:</span> {evaluation.classGroup || 'N/A'}
        </div>
        <div>
          <span className="font-bold text-gray-700">Estudiante(s):</span> {evaluation.studentName}
        </div>
        <div>
          <span className="font-bold text-gray-700">Fecha de Evaluación:</span>{' '}
          {new Date(evaluation.evaluatedAt).toLocaleDateString('es-CO')}
        </div>
        <div className="col-span-2">
          <span className="font-bold text-gray-700">Nivel de Desempeño:</span>{' '}
          <strong>{evaluation.performanceLevel}</strong>
        </div>
      </div>

      {/* Executive Summary with Lo que estuvo bien vs Lo que debe mejorar */}
      <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1.5 mb-3">
          Síntesis Pedagógica Formativa (Aciertos y Oportunidades de Mejora)
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
          <div className="p-3 bg-white border border-gray-300 rounded">
            <h4 className="font-bold text-gray-900 mb-1.5 text-[11px] uppercase text-emerald-800">
              ✅ Lo que estuvo bien (Aciertos y Fortalezas)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-800 text-[11px]">
              {(evaluation.summaryHighlights?.whatWentWell && evaluation.summaryHighlights.whatWentWell.length > 0
                ? evaluation.summaryHighlights.whatWentWell
                : evaluation.criteriaScores.flatMap((c) => c.strengths).slice(0, 3)
              ).map((item, idx) => (
                <li key={idx} className="leading-tight">{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-white border border-gray-300 rounded">
            <h4 className="font-bold text-gray-900 mb-1.5 text-[11px] uppercase text-amber-800">
              ⚠️ Lo que debe mejorar (Acciones Prioritarias)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-800 text-[11px]">
              {(evaluation.summaryHighlights?.whatToImprove && evaluation.summaryHighlights.whatToImprove.length > 0
                ? evaluation.summaryHighlights.whatToImprove
                : evaluation.criteriaScores.flatMap((c) => c.improvements).slice(0, 3)
              ).map((item, idx) => (
                <li key={idx} className="leading-tight">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {evaluation.summaryHighlights?.encouragement && (
          <p className="text-[11px] text-gray-700 italic border-t border-gray-200 pt-2">
            <strong>Orientación para la sustentación:</strong> {evaluation.summaryHighlights.encouragement}
          </p>
        )}
      </div>

      {/* 6 Criteria Breakdown Table */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
          Desglose de Calificación por los 6 Criterios Institucionales
        </h3>
        <table className="w-full text-left text-xs border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 font-bold">
              <th className="p-2 border-r border-gray-300">Criterio</th>
              <th className="p-2 border-r border-gray-300 text-center w-16">Peso</th>
              <th className="p-2 border-r border-gray-300 text-center w-20">Puntaje</th>
              <th className="p-2 border-r border-gray-300 text-center w-24">Nivel</th>
              <th className="p-2">Observaciones Principales</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.criteriaScores.map((c) => (
              <tr key={c.id} className="border-b border-gray-300">
                <td className="p-2 font-bold border-r border-gray-300">{c.name}</td>
                <td className="p-2 text-center border-r border-gray-300">{c.weight}%</td>
                <td className="p-2 text-center font-bold border-r border-gray-300">
                  {c.score} / {c.weight}
                </td>
                <td className="p-2 text-center border-r border-gray-300 text-[10px] font-semibold">
                  {c.level}
                </td>
                <td className="p-2 text-[11px] leading-tight">
                  <div className="font-semibold text-gray-900">
                    Fortalezas: {c.strengths.slice(0, 1).join('. ')}
                  </div>
                  <div className="text-gray-700 mt-0.5">
                    Mejoras: {c.improvements.slice(0, 1).join('. ')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Special Audits */}
      <div className="grid grid-cols-2 gap-4 text-xs mb-6">
        <div className="border border-gray-300 p-3 rounded">
          <h4 className="font-bold text-gray-800 mb-1">Auditoría BANG (Regla de 20 pts)</h4>
          <p className="text-[11px] text-gray-700">
            {evaluation.bangAnalysis.matrixSumCheck.comment}
          </p>
          <p className="text-[11px] font-semibold mt-1">
            Total Matriz: {evaluation.bangAnalysis.matrixSumCheck.totalSum}/60 pts.
          </p>
        </div>

        <div className="border border-gray-300 p-3 rounded">
          <h4 className="font-bold text-gray-800 mb-1">Lean Canvas & Ventaja Diferencial</h4>
          <p className="text-[11px] text-gray-700">
            {evaluation.leanCanvasAnalysis.completedBlocksCount} de 9 bloques diligenciados.
          </p>
          <p className="text-[11px] text-gray-700 mt-1">
            {evaluation.leanCanvasAnalysis.differentialAdvantageQuality}
          </p>
        </div>
      </div>

      {/* Action Plan */}
      <div className="mb-8 border border-gray-300 p-3 rounded bg-gray-50 text-xs">
        <h4 className="font-bold text-gray-800 mb-1">
          Recomendaciones de Acción para la Sustentación Oral:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-gray-800 text-[11px]">
          {evaluation.actionPlan.map((act, i) => (
            <li key={i}>{act}</li>
          ))}
        </ul>
      </div>

      {/* Signatures block */}
      <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gray-400 text-xs text-center">
        <div>
          <div className="h-12 border-b border-gray-400 mx-auto w-48 mb-2"></div>
          <span className="font-bold block">Firma del Docente Evaluador</span>
          <span className="text-gray-500">Espíritu Emprendedor e Innovación CUN</span>
        </div>
        <div>
          <div className="h-12 border-b border-gray-400 mx-auto w-48 mb-2"></div>
          <span className="font-bold block">Firma del Estudiante / Representante</span>
          <span className="text-gray-500">Constancia de Retroalimentación Formativa</span>
        </div>
      </div>
    </div>
  );
};
