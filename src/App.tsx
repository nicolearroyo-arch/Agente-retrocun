import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EvaluationForm } from './components/EvaluationForm';
import { EvaluationResultsView } from './components/EvaluationResultsView';
import { HistoryAndAnalytics } from './components/HistoryAndAnalytics';
import { RubricGuideModal } from './components/RubricGuideModal';
import { BangGuideModal } from './components/BangGuideModal';
import { CopilotChatDrawer } from './components/CopilotChatDrawer';
import { PrintReportView } from './components/PrintReportView';
import { NetlifyPublishModal } from './components/NetlifyPublishModal';
import { EvaluationResult } from './types';
import { AlertCircle, CheckCircle2, Bot, Sparkles, Award } from 'lucide-react';

const STORAGE_KEY = 'retroaca_evaluations_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'history' | 'rubric' | 'bangGuide'>('evaluate');
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNetlifyModalOpen, setIsNetlifyModalOpen] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          // Set latest as current if none selected
          if (!currentEvaluation) {
            setCurrentEvaluation(parsed[0]);
          }
        }
      }
    } catch (e) {
      console.warn('Error loading history from localStorage:', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistoryToStorage = (updatedHistory: EvaluationResult[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Error saving history to localStorage:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run evaluation
  const handleEvaluate = async (data: {
    submissionText?: string;
    pdfBase64?: string;
    fileName?: string;
    projectTitle?: string;
    studentName?: string;
    classGroup?: string;
    customInstructions?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar la evaluación con RetroACA.');
      }

      const newEval: EvaluationResult = {
        ...result,
        id: 'eval_' + Date.now(),
        evaluatedAt: new Date().toISOString(),
        projectTitle: data.projectTitle || result.projectTitle || (data.fileName ? data.fileName.replace(/\.[^/.]+$/, '') : 'Pasaporte de Ascenso'),
        studentName: data.studentName || result.studentName || 'Equipo Estudiantil',
        classGroup: data.classGroup || 'Ficha General',
        rawSubmissionText: result.extractedText || data.submissionText || '',
        fileName: result.fileName || data.fileName,
        pdfPages: result.pdfPages,
        isPdf: Boolean(data.pdfBase64)
      };

      setCurrentEvaluation(newEval);
      showToast(data.pdfBase64 ? `¡PDF "${data.fileName || 'documento'}" evaluado con éxito!` : '¡Evaluación generada con éxito con la rúbrica oficial!');

      // Auto-save to history
      const updatedHistory = [newEval, ...history.filter((h) => h.id !== newEval.id)];
      saveHistoryToStorage(updatedHistory);

      // Smooth scroll down to results
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado al evaluar la entrega.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update current evaluation (manual score tweak, notes change)
  const handleUpdateEvaluation = (updated: EvaluationResult) => {
    setCurrentEvaluation(updated);
    const updatedHistory = history.map((h) => (h.id === updated.id ? updated : h));
    saveHistoryToStorage(updatedHistory);
  };

  // Explicit save to history
  const handleSaveToHistory = (evalToSave: EvaluationResult) => {
    const exists = history.some((h) => h.id === evalToSave.id);
    let updated: EvaluationResult[];
    if (exists) {
      updated = history.map((h) => (h.id === evalToSave.id ? evalToSave : h));
    } else {
      updated = [evalToSave, ...history];
    }
    saveHistoryToStorage(updated);
    showToast('Evaluación guardada en el historial docente.');
  };

  // Delete evaluation from history
  const handleDeleteEvaluation = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistoryToStorage(updated);
    if (currentEvaluation?.id === id) {
      setCurrentEvaluation(updated[0] || null);
    }
    showToast('Evaluación eliminada del historial.');
  };

  // Clear all history
  const handleClearHistory = () => {
    saveHistoryToStorage([]);
    setCurrentEvaluation(null);
    showToast('Historial vaciado.');
  };

  // Select evaluation from history
  const handleSelectEvaluation = (item: EvaluationResult) => {
    setCurrentEvaluation(item);
    setActiveTab('evaluate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentSaved = Boolean(
    currentEvaluation && history.some((h) => h.id === currentEvaluation.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        onOpenNetlifyModal={() => setIsNetlifyModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error en la evaluación:</span> {error}
            </div>
          </div>
        )}

        {/* TAB 1: EVALUATE WORKSPACE */}
        {activeTab === 'evaluate' && (
          <div className="space-y-8">
            {/* Input Form */}
            <EvaluationForm
              onEvaluate={handleEvaluate}
              isLoading={isLoading}
            />

            {/* Results Section */}
            {currentEvaluation && (
              <div id="evaluation-results" className="pt-2">
                <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200 no-print">
                  <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Award className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Propuesta de Valoración y Retroalimentación Formativa
                  </h2>
                </div>

                <EvaluationResultsView
                  evaluation={currentEvaluation}
                  onUpdateEvaluation={handleUpdateEvaluation}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={isCurrentSaved}
                  onOpenCopilotChat={() => setIsChatOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HISTORY & ANALYTICS */}
        {activeTab === 'history' && (
          <HistoryAndAnalytics
            history={history}
            onSelectEvaluation={handleSelectEvaluation}
            onDeleteEvaluation={handleDeleteEvaluation}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* TAB 3: INSTITUTIONAL RUBRIC GUIDE */}
        {activeTab === 'rubric' && <RubricGuideModal />}

        {/* TAB 4: BANG & CANVAS METHODOLOGY GUIDE */}
        {activeTab === 'bangGuide' && <BangGuideModal />}
      </main>

      {/* Floating Copilot Button */}
      {currentEvaluation && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group no-print"
          title="Abrir RetroACA Copilot"
        >
          <Bot className="w-5 h-5 text-white" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Copiloto Pedagógico</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Copilot Chat Drawer */}
      <CopilotChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        evaluation={currentEvaluation}
      />

      {/* Netlify Deployment & Extraction Modal */}
      <NetlifyPublishModal
        isOpen={isNetlifyModalOpen}
        onClose={() => setIsNetlifyModalOpen(false)}
      />

      {/* Hidden Printable Official Report View */}
      {currentEvaluation && <PrintReportView evaluation={currentEvaluation} />}

      {/* Institutional Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>RetroACA</strong> • Sistema de Evaluación Formativa «Pasaporte de Ascenso» • Corporación Unificada Nacional de Educación Superior (CUN).
          </p>
          <p className="text-slate-400">
            Espíritu Emprendedor e Innovación • Rúbrica Oficial 100 pts (Escala 0.0 - 5.0)
          </p>
        </div>
      </footer>
    </div>
  );
}
