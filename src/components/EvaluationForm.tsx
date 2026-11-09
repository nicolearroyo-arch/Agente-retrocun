import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Check,
  AlertCircle,
  RefreshCw,
  FileCheck,
  FileType,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Trash2
} from 'lucide-react';
import { SAMPLE_SUBMISSIONS } from '../data/sampleSubmissions';
import { SampleSubmission } from '../types';

export interface EvaluatePayload {
  submissionText?: string;
  pdfBase64?: string;
  fileName?: string;
  projectTitle?: string;
  studentName?: string;
  classGroup?: string;
  customInstructions?: string;
}

interface EvaluationFormProps {
  onEvaluate: (data: EvaluatePayload) => Promise<void>;
  isLoading: boolean;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({
  onEvaluate,
  isLoading
}) => {
  const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf');
  const [submissionText, setSubmissionText] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [classGroup, setClassGroup] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);

  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfInfo, setPdfInfo] = useState<{ pages: number; words: number } | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    'Conectando con el copiloto pedagógico...',
    'Procesando documento PDF y extrayendo evidencia...',
    'Analizando contexto, 2 ODS y observación de campo...',
    'Evaluando árbol de problemas y radar del usuario (quién paga vs quién usa)...',
    'Auditando ideación BANG y regla de suma de 20 pts por fila...',
    'Diagnosticando los 9 bloques del Lean Canvas y ventaja diferencial...',
    'Comprobando prototipo interactivo y uso responsable de IA...',
    'Consolidando matriz de calificación institucional (escala 0.0 - 5.0)...'
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Process a selected PDF file
  const processPdfFile = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo con extensión .pdf válido.');
      return;
    }

    setPdfFile(file);
    setIsExtractingPdf(true);
    setActiveSampleId(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      setPdfBase64(base64);

      try {
        const resp = await fetch('/api/extract-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfBase64: base64, fileName: file.name })
        });
        const data = await resp.json();
        if (resp.ok) {
          setSubmissionText(data.text || '');
          setPdfInfo({ pages: data.pages || 1, words: data.wordCount || 0 });

          // Auto-infer metadata if blank
          if (!projectTitle && data.inferredTitle) {
            setProjectTitle(data.inferredTitle);
          } else if (!projectTitle) {
            setProjectTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }

          if (!studentName && data.inferredStudent) {
            setStudentName(data.inferredStudent);
          }
        }
      } catch (err) {
        console.warn('Error al extraer texto en cliente:', err);
      } finally {
        setIsExtractingPdf(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      processPdfFile(file);
    }
  };

  const handleLoadSamplePdf = async () => {
    try {
      setIsExtractingPdf(true);
      const resp = await fetch('/muestra_pasaporte_ascenso_agroconecta.pdf');
      const blob = await resp.blob();
      const file = new File([blob], 'Pasaporte_Ascenso_AgroConecta_CUN.pdf', { type: 'application/pdf' });
      await processPdfFile(file);
    } catch (err) {
      console.error('Error cargando PDF de muestra:', err);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleLoadSample = (sample: SampleSubmission) => {
    setInputMode('text');
    setActiveSampleId(sample.id);
    setSubmissionText(sample.fullText);
    setProjectTitle(sample.title);
    setStudentName(sample.studentName);
    setClassGroup(sample.classGroup);
    setPdfFile(null);
    setPdfBase64(null);
    setPdfInfo(null);
  };

  const handleClear = () => {
    setSubmissionText('');
    setProjectTitle('');
    setStudentName('');
    setClassGroup('');
    setCustomInstructions('');
    setActiveSampleId(null);
    setPdfFile(null);
    setPdfBase64(null);
    setPdfInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !pdfBase64) return;

    onEvaluate({
      submissionText: submissionText.trim(),
      pdfBase64: pdfBase64 || undefined,
      fileName: pdfFile?.name,
      projectTitle,
      studentName,
      classGroup,
      customInstructions
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const wordCount = submissionText.trim() ? submissionText.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recepción y Evaluación de Entrega (ACA)
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Sube el informe en <strong>PDF</strong> o pega el texto para aplicar la matriz de 6 criterios y generar la retroalimentación formativa.
          </p>
        </div>

        {/* Clear Button */}
        {(submissionText || pdfFile) && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpiar / Nueva Entrega</span>
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center space-x-2 mt-5 p-1 bg-slate-100 rounded-xl max-w-md">
        <button
          type="button"
          onClick={() => setInputMode('pdf')}
          className={`flex-1 py-2 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            inputMode === 'pdf'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileType className="w-4 h-4 text-rose-500" />
          <span>Subir Archivo PDF</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
            Recomendado
          </span>
        </button>

        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`flex-1 py-2 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            inputMode === 'text'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Pegar Texto / Muestras</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* MODE 1: PDF UPLOAD AREA */}
        {inputMode === 'pdf' && (
          <div className="space-y-4">
            {!pdfFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50/60 bg-slate-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processPdfFile(file);
                  }}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <FileType className="w-8 h-8" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  Arrastra y suelta aquí el archivo PDF del estudiante
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Haz clic para examinar desde tu equipo. Se procesarán automáticamente los ODS, el árbol de problemas, la matriz BANG de 20 pts y el Lean Canvas.
                </p>

                <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>Seleccionar archivo PDF</span>
                </div>

                <div className="mt-4 flex items-center justify-center space-x-3 text-[11px] text-slate-400">
                  <span>• Archivo PDF hasta 50 MB</span>
                  <span>• Detección automática de páginas</span>
                  <span>• Compatible con tablas y gráficos</span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-center space-x-2 text-xs">
                  <span className="text-slate-500">¿Deseas probar ahora mismo?</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSamplePdf();
                    }}
                    className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Cargar PDF muestra de «AgroConecta CUN»</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              /* Selected PDF Card */
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-emerald-50/30 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
                      <FileType className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 line-clamp-1">
                          {pdfFile.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          PDF
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5 font-medium">
                        <span>{formatFileSize(pdfFile.size)}</span>
                        {pdfInfo && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">
                              {pdfInfo.pages} página(s) detectada(s)
                            </span>
                            <span>•</span>
                            <span>{pdfInfo.words.toLocaleString()} palabras</span>
                          </>
                        )}
                        {isExtractingPdf && (
                          <span className="inline-flex items-center space-x-1 text-emerald-600">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Extrayendo contenido...</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {showExtractedPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showExtractedPreview ? 'Ocultar texto' : 'Ver texto extraído'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        setPdfBase64(null);
                        setPdfInfo(null);
                        setSubmissionText('');
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Cambiar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Extracted text accordion */}
                {showExtractedPreview && (
                  <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold">Texto extraído del documento PDF:</span>
                      <span className="font-mono text-[11px]">{wordCount.toLocaleString()} palabras</span>
                    </div>
                    <textarea
                      rows={8}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 bg-white leading-relaxed text-slate-800"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: TEXT PASTE & SAMPLES */}
        {inputMode === 'text' && (
          <div className="space-y-4">
            {/* Presets */}
            <div className="bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/30 p-4 rounded-xl border border-emerald-100/70">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cargar casos de muestra pedagógicos listos para evaluar:</span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">1 clic para probar</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {SAMPLE_SUBMISSIONS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                      activeSampleId === sample.id
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200/80 bg-white/80 hover:bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sample.badgeType === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sample.badgeType === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sample.expectedScore}
                      </span>
                      {activeSampleId === sample.id && (
                        <Check className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="font-semibold text-xs text-slate-900 mt-1.5 line-clamp-1">
                      {sample.title.split(':')[0]}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {sample.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Contenido de la entrega (ODS, Árbol, Radar, BANG, Canvas, Prototipo, IA)
                </label>
                <div className="text-[11px] text-slate-400 font-mono">
                  {wordCount.toLocaleString()} palabras
                </div>
              </div>

              <textarea
                rows={12}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Pega aquí el contenido del documento del estudiante o equipo..."
                className="w-full p-4 text-sm font-sans rounded-xl border border-slate-300 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed text-slate-800 transition-all font-normal shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título del Proyecto / Propuesta
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Ej: AgroConecta Cundinamarca"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estudiante(s) / Equipo
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ej: Laura Gómez, Carlos Méndez..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ficha CUN / Grupo
            </label>
            <input
              type="text"
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              placeholder="Ej: Ficha 51189 - Grupo 2"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Custom Teacher Note / Focus */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Foco pedagógico adicional para esta revisión (opcional)
          </label>
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Ej: Poner atención especial a la regla de 20 pts de BANG y la coherencia del prototipo digital..."
            className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          />
        </div>

        {/* Submit & Progress */}
        <div className="pt-2">
          {isLoading ? (
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl space-y-3.5 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center space-x-2 text-emerald-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {pdfFile ? 'Evaluando archivo PDF con RetroACA...' : 'Evaluando entrega con RetroACA...'}
                  </span>
                </span>
                <span className="text-slate-400 font-mono">
                  Paso {loadingStage + 1} de {stages.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((loadingStage + 1) / stages.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium italic">
                  {stages[loadingStage]}
                </span>
                {pdfFile && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Documento: {pdfFile.name}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Evaluación basada en la <strong>Rúbrica Institucional Oficial CUN</strong> (100 pts / 5.0).
                </span>
              </div>

              <button
                type="submit"
                disabled={(!submissionText.trim() && !pdfBase64) || isLoading || isExtractingPdf}
                className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center space-x-2.5 ${
                  (!submissionText.trim() && !pdfBase64) || isLoading || isExtractingPdf
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-700/25 active:scale-98'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>
                  {pdfFile ? 'Evaluar PDF y Generar Calificación' : 'Ejecutar Evaluación Formativa'}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
