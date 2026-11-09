import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Printer,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
  Bot,
  Lightbulb,
  FileCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { EvaluationResult, CriterionScore, PerformanceLevel } from '../types';
import { BANG_CHARACTERS } from '../data/rubricData';

interface EvaluationResultsViewProps {
  evaluation: EvaluationResult;
  onUpdateEvaluation: (updated: EvaluationResult) => void;
  onSaveToHistory: (evaluation: EvaluationResult) => void;
  isSaved: boolean;
  onOpenCopilotChat: () => void;
}

export const EvaluationResultsView: React.FC<EvaluationResultsViewProps> = ({
  evaluation,
  onUpdateEvaluation,
  onSaveToHistory,
  isSaved,
  onOpenCopilotChat
}) => {
  const [copiedLms, setCopiedLms] = useState(false);
  const [expandedCriteria, setExpandedCriteria] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: false,
    c5: false,
    c6: false
  });
  const [activeTab, setActiveTab] = useState<'criteria' | 'bang' | 'canvas' | 'lms'>('criteria');
  const [teacherNotes, setTeacherNotes] = useState(evaluation.teacherNotes || '');

  // Toggle criteria accordion
  const toggleCriterion = (id: string) => {
    setExpandedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Score override handler
  const handleScoreChange = (criterionId: string, newScore: number) => {
    const updatedCriteria = evaluation.criteriaScores.map((c) => {
      if (c.id === criterionId) {
        const clampedScore = Math.max(0, Math.min(c.weight, newScore));
        const pct = clampedScore / c.weight;
        const newLevel: PerformanceLevel =
          pct >= 0.85 ? 'Estratégico' : pct >= 0.7 ? 'Autónomo' : pct >= 0.5 ? 'Básico' : 'En desarrollo';
        return {
          ...c,
          score: clampedScore,
          level: newLevel
        };
      }
      return c;
    });

    const newTotal = updatedCriteria.reduce((acc, curr) => acc + curr.score, 0);
    const newGrade = Number((newTotal / 20).toFixed(1));
    const newOverallLevel: PerformanceLevel =
      newGrade >= 4.3 ? 'Estratégico' : newGrade >= 3.5 ? 'Autónomo' : newGrade >= 2.5 ? 'Básico' : 'En desarrollo';

    onUpdateEvaluation({
      ...evaluation,
      criteriaScores: updatedCriteria,
      totalPoints: newTotal,
      cunGrade: newGrade,
      performanceLevel: newOverallLevel
    });
  };

  // Copy LMS feedback
  const handleCopyLMS = () => {
    navigator.clipboard.writeText(evaluation.lmsFeedbackComment);
    setCopiedLms(true);
    setTimeout(() => setCopiedLms(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Level color mapping
  const getLevelBadge = (level: PerformanceLevel) => {
    switch (level) {
      case 'Estratégico':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          title: 'Nivel Estratégico (Sobresaliente)'
        };
      case 'Autónomo':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          title: 'Nivel Autónomo (Alto)'
        };
      case 'Básico':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          title: 'Nivel Básico (Aprobatorio / Oportunidades)'
        };
      case 'En desarrollo':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          title: 'En Desarrollo (No aprobatorio / Reestructuración)'
        };
    }
  };

  const currentLevelBadge = getLevelBadge(evaluation.performanceLevel);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Color bar indicator */}
        <div
          className={`h-2.5 w-full ${
            evaluation.cunGrade >= 4.3
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : evaluation.cunGrade >= 3.5
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
              : evaluation.cunGrade >= 2.5
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
              : 'bg-gradient-to-r from-rose-500 to-red-500'
          }`}
        />

        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            {/* Project metadata */}
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {evaluation.classGroup || 'Ficha CUN'}
                </span>
                <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-0.5 rounded-full border ${currentLevelBadge.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${currentLevelBadge.dot}`} />
                  <span>{currentLevelBadge.title}</span>
                </span>
                {evaluation.fileName && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center space-x-1">
                    <span>📄 {evaluation.fileName}</span>
                    {evaluation.pdfPages ? <span>({evaluation.pdfPages} págs)</span> : null}
                  </span>
                )}
                {evaluation.engine && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    Motor: {evaluation.engine}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {evaluation.projectTitle || 'Pasaporte de Ascenso'}
              </h1>
              <p className="text-sm font-medium text-slate-600">
                <strong>Estudiante(s):</strong> {evaluation.studentName || 'Equipo de proyecto'} • Evaluado: {new Date(evaluation.evaluatedAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Score Badges */}
            <div className="flex items-center space-x-4 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Nota CUN (0-5)
                </span>
                <div className="flex items-baseline justify-center space-x-0.5">
                  <span className={`text-4xl md:text-5xl font-black tracking-tight ${
                    evaluation.cunGrade >= 4.3 ? 'text-emerald-600' :
                    evaluation.cunGrade >= 3.5 ? 'text-blue-600' :
                    evaluation.cunGrade >= 2.5 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {evaluation.cunGrade.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/5.0</span>
                </div>
              </div>

              <div className="h-12 w-px bg-slate-200" />

              <div className="text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Puntaje Total
                </span>
                <div className="flex items-baseline justify-center space-x-0.5">
                  <span className="text-3xl md:text-4xl font-extrabold text-slate-800">
                    {Math.round(evaluation.totalPoints)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLMS}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                {copiedLms ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado para Moodle/Canvas!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Formato LMS (CUN Digital)</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                onClick={() => onSaveToHistory(evaluation)}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Guardado en Historial</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar en Historial</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onOpenCopilotChat}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-sm transition-all"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>Consultar Copiloto Pedagógico</span>
            </button>
          </div>
        </div>

        {/* Executive pedagogical synthesis with dual breakdown */}
        <div className="bg-gradient-to-b from-slate-50/80 to-white p-6 md:p-8 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Lightbulb className="w-5 h-5 text-emerald-700" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                  Síntesis Pedagógica Formativa
                </h3>
                <p className="text-xs text-slate-500">
                  Balance formativo de aciertos metodológicos y oportunidades prioritarias de mejora para el estudiante.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 text-white font-mono hidden sm:inline">
              Nota CUN: {evaluation.cunGrade.toFixed(1)} / 5.0
            </span>
          </div>

          {/* Dual Balance Cards: Lo que estuvo bien vs Lo que debe mejorar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* LO QUE ESTUVO BIEN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✅ Lo que estuvo bien (Aciertos y Fortalezas)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                  Puntos Fuertes
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {(evaluation.summaryHighlights?.whatWentWell && evaluation.summaryHighlights.whatWentWell.length > 0
                  ? evaluation.summaryHighlights.whatWentWell
                  : evaluation.criteriaScores.flatMap((c) => c.strengths).slice(0, 3)
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LO QUE DEBE MEJORAR */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <div className="flex items-center space-x-2 text-amber-950 font-extrabold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>⚠️ Lo que debe mejorar (Acciones Prioritarias)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                  Ajustes Clave
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {(evaluation.summaryHighlights?.whatToImprove && evaluation.summaryHighlights.whatToImprove.length > 0
                  ? evaluation.summaryHighlights.whatToImprove
                  : evaluation.criteriaScores.flatMap((c) => c.improvements).slice(0, 3)
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Motivational Encouragement / Reto para el Ascenso */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-start sm:items-center space-x-2">
              <span className="text-emerald-400 font-bold shrink-0">💡 Reto para el Ascenso:</span>
              <span className="text-slate-300 text-[11px] leading-relaxed">
                {evaluation.summaryHighlights?.encouragement ||
                  'Preparar la sustentación oral demostrando cómo la solución alivia el dolor específico del usuario y cómo validaron su prototipo con personas reales.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-sm no-print">
        <button
          onClick={() => setActiveTab('criteria')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'criteria'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Matriz de los 6 Criterios (100 pts)</span>
        </button>

        <button
          onClick={() => setActiveTab('bang')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'bang'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Auditoría BANG (5 Personajes & Regla 20 pts)</span>
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'canvas'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-4 h-4 text-blue-400" />
          <span>Diagnóstico Lean Canvas (9 Bloques)</span>
        </button>

        <button
          onClick={() => setActiveTab('lms')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'lms'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Copy className="w-4 h-4 text-emerald-400" />
          <span>Comentario para LMS & Acta</span>
        </button>
      </div>

      {/* TAB 1: 6 CRITERIA DETAILED VIEW */}
      {activeTab === 'criteria' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Como docente, puedes calibrar el puntaje de cualquier criterio moviendo el control deslizante.
              </span>
            </span>
            <button
              onClick={() => {
                const allExpanded = Object.values(expandedCriteria).every(Boolean);
                const newState: Record<string, boolean> = {};
                evaluation.criteriaScores.forEach((c) => {
                  newState[c.id] = !allExpanded;
                });
                setExpandedCriteria(newState);
              }}
              className="text-emerald-700 hover:underline font-semibold"
            >
              {Object.values(expandedCriteria).every(Boolean) ? 'Colapsar todo' : 'Expandir todo'}
            </button>
          </div>

          {evaluation.criteriaScores.map((criterion, idx) => {
            const isExpanded = expandedCriteria[criterion.id] ?? false;
            const pct = criterion.score / criterion.weight;
            const badge = getLevelBadge(criterion.level);

            return (
              <div
                key={criterion.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200"
              >
                {/* Header row */}
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleCriterion(criterion.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base">
                          {criterion.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">
                          ({criterion.weight}% / {criterion.weight} pts)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {Math.round(pct * 100)}% de logro
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score stepper and expand icon */}
                  <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Puntaje</span>
                        <div className="flex items-baseline space-x-0.5">
                          <span className="text-xl font-black text-slate-900">{criterion.score}</span>
                          <span className="text-xs text-slate-400 font-semibold">/{criterion.weight}</span>
                        </div>
                      </div>

                      {/* Manual Slider */}
                      <input
                        type="range"
                        min="0"
                        max={criterion.weight}
                        step="1"
                        value={criterion.score}
                        onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                        className="w-20 md:w-28 accent-emerald-600 cursor-pointer"
                        title={`Ajustar puntaje (${criterion.score}/${criterion.weight})`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCriterion(criterion.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 bg-gradient-to-b from-white to-slate-50/30">
                    {/* Subcriteria Checklist */}
                    {criterion.subcriteriaCheck && criterion.subcriteriaCheck.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Verificación de Indicadores Clave de la Rúbrica
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {criterion.subcriteriaCheck.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2 ${
                                sub.status === 'cumple'
                                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                  : sub.status === 'parcial'
                                  ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                                  : 'bg-rose-50/60 border-rose-200 text-rose-900'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {sub.status === 'cumple' ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : sub.status === 'parcial' ? (
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                )}
                              </div>
                              <div>
                                <span className="font-semibold block">{sub.label}</span>
                                <span className="text-[11px] opacity-80 leading-tight block mt-0.5">
                                  {sub.observation}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Improvements 2-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Fortalezas Pedagógicas Identificadas</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {criterion.strengths.map((str, sIdx) => (
                            <li key={sIdx} className="flex items-start space-x-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span className="leading-relaxed">{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-2">
                        <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Oportunidades Críticas de Mejora</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {criterion.improvements.map((imp, iIdx) => (
                            <li key={iIdx} className="flex items-start space-x-2">
                              <span className="text-amber-500 font-bold">•</span>
                              <span className="leading-relaxed">{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Socratic Questions */}
                    {criterion.socraticQuestions && criterion.socraticQuestions.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                        <div className="flex items-center space-x-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                          <HelpCircle className="w-4 h-4 text-indigo-600" />
                          <span>Preguntas Socráticas para Orientar la Reflexión del Estudiante</span>
                        </div>
                        <ul className="space-y-1 text-xs text-indigo-950 italic">
                          {criterion.socraticQuestions.map((q, qIdx) => (
                            <li key={qIdx} className="leading-relaxed pl-3 border-l-2 border-indigo-300">
                              "{q}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: BANG METHODOLOGY AUDIT */}
      {activeTab === 'bang' && (
        <div className="space-y-6">
          {/* Rule of 20 Notice Banner */}
          <div className={`p-5 rounded-2xl border ${
            evaluation.bangAnalysis.matrixSumCheck.isValidRule20
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-slate-200">
                    Regla Estricta CUN
                  </span>
                  <h3 className="font-bold text-sm md:text-base">
                    Verificación de la Suma de 20 Puntos por Fila en la Matriz BANG
                  </h3>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {evaluation.bangAnalysis.matrixSumCheck.comment}
                </p>
              </div>

              <div className="text-right shrink-0 bg-white/90 p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Suma Matriz</span>
                <span className="text-2xl font-black text-slate-900">
                  {evaluation.bangAnalysis.matrixSumCheck.totalSum} / 60
                </span>
                <span className="block text-[10px] font-semibold text-emerald-700">
                  (20 Viab + 20 Fact + 20 Deseab)
                </span>
              </div>
            </div>

            {/* Sub-rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-current/10">
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 block">Viabilidad Comercial</span>
                <span className="text-lg font-bold text-slate-900">
                  {evaluation.bangAnalysis.matrixSumCheck.viabilitySum} pts
                </span>
                <span className="text-[10px] text-slate-400 block">Meta esperada: 20 pts</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 block">Factibilidad Técnica</span>
                <span className="text-lg font-bold text-slate-900">
                  {evaluation.bangAnalysis.matrixSumCheck.feasibilitySum} pts
                </span>
                <span className="text-[10px] text-slate-400 block">Meta esperada: 20 pts</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 block">Deseabilidad del Usuario</span>
                <span className="text-lg font-bold text-slate-900">
                  {evaluation.bangAnalysis.matrixSumCheck.desirabilitySum} pts
                </span>
                <span className="text-[10px] text-slate-400 block">Meta esperada: 20 pts</span>
              </div>
            </div>
          </div>

          {/* Winning Idea & Innovation Type */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Propuesta Seleccionada & Tipo de Innovación</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Nombre Comercial</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {evaluation.bangAnalysis.winningIdea.name}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Propuesta de Valor</span>
                <span className="text-xs text-slate-700 mt-1 block leading-relaxed font-medium">
                  {evaluation.bangAnalysis.winningIdea.valueProposition}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Tipo de Innovación Declarada</span>
                <span className="text-xs font-semibold text-emerald-950">
                  {evaluation.bangAnalysis.winningIdea.innovationType}
                </span>
              </div>
              <span className="text-[11px] bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full">
                Sustentación Requerida
              </span>
            </div>
          </div>

          {/* 5 BANG Characters Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Auditoría de los 5 Personajes de Ideación BANG (10 Ideas Requeridas)
              </h3>
              <span className="text-xs text-slate-500">2 ideas esperadas por cada personaje</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {BANG_CHARACTERS.map((char) => {
                const detected = evaluation.bangAnalysis.charactersDetected.find(
                  (d) => d.name.toLowerCase() === char.name.toLowerCase()
                );
                const isIdentified = detected?.identified ?? false;

                return (
                  <div
                    key={char.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isIdentified
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-slate-50 border-dashed border-slate-300 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${char.avatarBg}`}>
                        {char.badge}
                      </span>
                      {isIdentified ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{char.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{char.role}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 block font-semibold">Frase disparadora:</span>
                      <span className="italic text-slate-700 block mt-0.5 font-medium leading-tight">
                        "{char.triggerPhrase}"
                      </span>
                    </div>

                    <div className="mt-2.5 text-[11px] font-semibold text-slate-600">
                      {detected ? detected.comment : 'Pendiente de evidenciar'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAN CANVAS 9-BLOCK DIAGNOSTIC */}
      {activeTab === 'canvas' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Diagnóstico de los 9 Bloques del Modelo Lean Canvas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Articulación sistémica entre problema, propuesta de valor, segmento, canales, flujos financieros y ventaja diferencial.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-bold text-slate-600">Completitud:</span>
                <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-slate-900 text-white">
                  {evaluation.leanCanvasAnalysis.completedBlocksCount} / 9 Bloques
                </span>
              </div>
            </div>

            {/* 9 Blocks Grid representation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
              {evaluation.leanCanvasAnalysis.blocksStatus.map((block) => (
                <div
                  key={block.blockNumber}
                  className={`p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
                    block.status === 'solido'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : block.status === 'debil'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">
                      {block.blockNumber}. {block.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        block.status === 'solido'
                          ? 'bg-emerald-100 text-emerald-800'
                          : block.status === 'debil'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {block.status === 'solido' ? 'Sólido' : block.status === 'debil' ? 'Ajustar' : 'Incompleto'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">{block.notes}</p>
                </div>
              ))}
            </div>

            {/* Differential Advantage Spotlight */}
            <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Award className="w-4 h-4" />
                <span>Auditoría Crítica de la «Ventaja Diferencial» (Bloque 9)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {evaluation.leanCanvasAnalysis.differentialAdvantageQuality}
              </p>
            </div>
          </div>

          {/* Prototype & AI Ethics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Prototipo Digital Funcional
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Herramienta: {evaluation.prototypeAnalysis.toolDetected}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  evaluation.prototypeAnalysis.hasDigitalLink
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {evaluation.prototypeAnalysis.hasDigitalLink ? 'Enlace Disponible' : 'Sin Enlace'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {evaluation.prototypeAnalysis.fidelityAndInteraction}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Uso Responsable y Ético de Inteligencia Artificial
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  {evaluation.aiEthicsAnalysis.documentedPrompts ? 'Bitácora de Prompts Evidenciada' : 'Sin Registro Explícito de Prompts'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Pensamiento Crítico
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {evaluation.aiEthicsAnalysis.aiRoleObserved}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LMS COMMENT & OFFICIAL REPORT */}
      {activeTab === 'lms' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Comentario de Retroalimentación para Plataforma LMS (Moodle / Canvas)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Texto estructurado con lenguaje formativo, motivador y directo listo para copiar en la retroalimentación del aula virtual.
              </p>
            </div>

            <button
              onClick={handleCopyLMS}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
            >
              {copiedLms ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLms ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          <textarea
            rows={12}
            value={evaluation.lmsFeedbackComment}
            onChange={(e) => onUpdateEvaluation({ ...evaluation, lmsFeedbackComment: e.target.value })}
            className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />

          {/* Teacher private notes */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Notas Privadas del Docente (para seguimiento o sustentación)
            </label>
            <input
              type="text"
              value={teacherNotes}
              onChange={(e) => {
                setTeacherNotes(e.target.value);
                onUpdateEvaluation({ ...evaluation, teacherNotes: e.target.value });
              }}
              placeholder="Ej: Recordar en la sustentación oral pedirles que demuestren cómo calcularon los fletes..."
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Action Plan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Plan de Acción Recomendado para la Siguiente Etapa de Ascenso
            </h4>
            <div className="space-y-1.5">
              {evaluation.actionPlan.map((action, aIdx) => (
                <div key={aIdx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
