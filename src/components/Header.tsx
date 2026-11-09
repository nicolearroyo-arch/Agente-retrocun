import React from 'react';
import { Award, BookOpen, Sparkles, CheckCircle2, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'evaluate' | 'history' | 'rubric' | 'bangGuide';
  setActiveTab: (tab: 'evaluate' | 'history' | 'rubric' | 'bangGuide') => void;
  historyCount: number;
  onOpenNetlifyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onOpenNetlifyModal
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('evaluate')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  RetroACA
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Pasaporte de Ascenso
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Copiloto de Evaluación Formativa • Espíritu Emprendedor e Innovación CUN
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                activeTab === 'evaluate'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Evaluar Entrega</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 relative ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Historial & Analíticas</span>
              {historyCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                activeTab === 'rubric'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Rúbrica Institucional</span>
              <span className="md:hidden">Rúbrica</span>
            </button>

            <button
              onClick={() => setActiveTab('bangGuide')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                activeTab === 'bangGuide'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Guía BANG & Canvas</span>
              <span className="md:hidden">BANG</span>
            </button>

            <button
              onClick={onOpenNetlifyModal}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 bg-[#00C7B7]/15 text-[#00C7B7] hover:bg-[#00C7B7]/25 border border-[#00C7B7]/30 shadow-xs ml-1"
              title="Guía y código para publicar en Netlify"
            >
              <Globe className="w-3.5 h-3.5 text-[#00C7B7]" />
              <span className="hidden sm:inline">Publicar en Netlify</span>
              <span className="sm:hidden">Netlify</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
