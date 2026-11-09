import React, { useState } from 'react';
import {
  Award,
  Search,
  Download,
  Trash2,
  ExternalLink,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-react';
import { EvaluationResult, PerformanceLevel } from '../types';

interface HistoryAndAnalyticsProps {
  history: EvaluationResult[];
  onSelectEvaluation: (item: EvaluationResult) => void;
  onDeleteEvaluation: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryAndAnalytics: React.FC<HistoryAndAnalyticsProps> = ({
  history,
  onSelectEvaluation,
  onDeleteEvaluation,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filtered list
  const filtered = history.filter((item) => {
    const matchesSearch =
      item.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.classGroup.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || item.performanceLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  // Calculate cohort statistics
  const count = history.length;
  const avgGrade =
    count > 0 ? (history.reduce((acc, curr) => acc + curr.cunGrade, 0) / count).toFixed(1) : '0.0';
  const avgPoints =
    count > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.totalPoints, 0) / count) : 0;

  // Criterion averages
  const criteriaStats = [
    { id: 'c1', name: 'Exploración del contexto', weight: 20 },
    { id: 'c2', name: 'Comprensión del usuario', weight: 20 },
    { id: 'c3', name: 'Ideación BANG', weight: 30 },
    { id: 'c4', name: 'Lean Canvas', weight: 15 },
    { id: 'c5', name: 'Prototipo digital', weight: 10 },
    { id: 'c6', name: 'Uso de IA y comunicación', weight: 5 }
  ].map((c) => {
    const scores = history.map(
      (h) => h.criteriaScores.find((sc) => sc.id === c.id)?.score ?? 0
    );
    const avgScore = count > 0 ? scores.reduce((a, b) => a + b, 0) / count : 0;
    const pct = c.weight > 0 ? (avgScore / c.weight) * 100 : 0;
    return {
      ...c,
      avgScore: avgScore.toFixed(1),
      pct: Math.round(pct)
    };
  });

  // Find lowest performing criterion
  const weakestCriterion = [...criteriaStats].sort((a, b) => a.pct - b.pct)[0];

  // Export to CSV
  const exportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Fecha',
      'Ficha CUN',
      'Estudiante(s)',
      'Proyecto',
      'Nota CUN (0-5)',
      'Puntos Totales (0-100)',
      'Nivel de Desempeño',
      'Contexto (20)',
      'Usuario (20)',
      'BANG (30)',
      'Canvas (15)',
      'Prototipo (10)',
      'IA (5)',
      'Notas Docente'
    ];

    const rows = history.map((h) => {
      const getScore = (id: string) => h.criteriaScores.find((sc) => sc.id === id)?.score ?? 0;
      return [
        `"${new Date(h.evaluatedAt).toLocaleDateString('es-CO')}"`,
        `"${h.classGroup.replace(/"/g, '""')}"`,
        `"${h.studentName.replace(/"/g, '""')}"`,
        `"${h.projectTitle.replace(/"/g, '""')}"`,
        h.cunGrade.toFixed(1),
        Math.round(h.totalPoints),
        `"${h.performanceLevel}"`,
        getScore('c1'),
        getScore('c2'),
        getScore('c3'),
        getScore('c4'),
        getScore('c5'),
        getScore('c6'),
        `"${(h.teacherNotes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RetroACA_Consolidado_Calificaciones_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Evaluated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Entregas Evaluadas
            </span>
            <span className="text-2xl font-black text-slate-900">{count}</span>
            <span className="text-[11px] text-slate-500 block">en el historial docente</span>
          </div>
        </div>

        {/* Average CUN Grade */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Promedio del Curso
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-emerald-600">{avgGrade}</span>
              <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              {avgPoints} / 100 puntos promedio
            </span>
          </div>
        </div>

        {/* Weakest Criterion Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Criterio a Reforzar
            </span>
            <span className="text-sm font-bold text-slate-900 line-clamp-1">
              {weakestCriterion?.name || 'N/A'}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 block">
              {weakestCriterion?.pct || 0}% de cumplimiento
            </span>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Reporte Consolidado
          </span>
          <button
            onClick={exportCSV}
            disabled={count === 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              count === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Descargar CSV para Excel</span>
          </button>
        </div>
      </div>

      {/* Criteria Cohort Heatmap */}
      {count > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Rendimiento Global de los Estudiantes por Criterio</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifica qué fases de la metodología «Pasaporte de Ascenso» requieren mayor refuerzo en clase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {criteriaStats.map((stat) => (
              <div key={stat.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 line-clamp-1">{stat.name}</span>
                  <span className="font-extrabold text-slate-900 shrink-0">
                    {stat.avgScore}/{stat.weight} pts
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      stat.pct >= 85
                        ? 'bg-emerald-500'
                        : stat.pct >= 70
                        ? 'bg-blue-500'
                        : stat.pct >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, stat.pct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Peso: {stat.weight}%</span>
                  <span className={`${stat.pct >= 70 ? 'text-slate-600' : 'text-amber-700'}`}>
                    {stat.pct}% de logro
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por estudiante, proyecto o ficha CUN..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Todos los niveles</option>
              <option value="Estratégico">Estratégico (4.3 - 5.0)</option>
              <option value="Autónomo">Autónomo (3.5 - 4.2)</option>
              <option value="Básico">Básico (2.5 - 3.4)</option>
              <option value="En desarrollo">En desarrollo (&lt; 2.5)</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('¿Seguro que deseas vaciar el historial de evaluaciones?')) {
                    onClearHistory();
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Vaciar historial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Records Table */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Award className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No hay evaluaciones que coincidan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {history.length === 0
                ? 'Las evaluaciones que guardes en RetroACA aparecerán aquí para seguimiento y reportes de aula.'
                : 'Intenta cambiar los términos de búsqueda o los filtros de nivel.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Proyecto & Estudiante</th>
                  <th className="py-3 px-4">Ficha / Grupo</th>
                  <th className="py-3 px-4 text-center">Nota CUN</th>
                  <th className="py-3 px-4 text-center">Puntaje</th>
                  <th className="py-3 px-4">Nivel</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onSelectEvaluation(item)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {item.projectTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {item.studentName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {item.classGroup || 'Sin ficha'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-black text-sm px-2 py-0.5 rounded-md ${
                        item.cunGrade >= 4.3 ? 'text-emerald-700 bg-emerald-50' :
                        item.cunGrade >= 3.5 ? 'text-blue-700 bg-blue-50' :
                        item.cunGrade >= 2.5 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'
                      }`}>
                        {item.cunGrade.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {Math.round(item.totalPoints)}/100
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.performanceLevel === 'Estratégico' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        item.performanceLevel === 'Autónomo' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        item.performanceLevel === 'Básico' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {item.performanceLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.evaluatedAt).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectEvaluation(item)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Cargar evaluación"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEvaluation(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar de historial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
