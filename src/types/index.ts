export type PerformanceLevel = 'Estratégico' | 'Autónomo' | 'Básico' | 'En desarrollo';

export type SubcriterionStatus = 'cumple' | 'parcial' | 'no_cumple';

export interface SubcriterionCheck {
  label: string;
  status: SubcriterionStatus;
  observation: string;
}

export interface CriterionScore {
  id: string; // 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6'
  name: string;
  weight: number;
  score: number;
  level: PerformanceLevel;
  strengths: string[];
  improvements: string[];
  socraticQuestions: string[];
  subcriteriaCheck: SubcriterionCheck[];
}

export interface BangCharacterCheck {
  name: string;
  identified: boolean;
  ideasCount: number;
  comment: string;
}

export interface BangMatrixCheck {
  viabilitySum: number;
  feasibilitySum: number;
  desirabilitySum: number;
  totalSum: number;
  isValidRule20: boolean;
  comment: string;
}

export interface BangAnalysis {
  charactersDetected: BangCharacterCheck[];
  matrixSumCheck: BangMatrixCheck;
  winningIdea: {
    name: string;
    valueProposition: string;
    innovationType: string;
  };
}

export interface LeanCanvasBlockStatus {
  blockNumber: number;
  name: string;
  status: 'solido' | 'debil' | 'incompleto';
  notes: string;
}

export interface LeanCanvasAnalysis {
  completedBlocksCount: number;
  blocksStatus: LeanCanvasBlockStatus[];
  differentialAdvantageQuality: string;
}

export interface PrototypeAnalysis {
  hasDigitalLink: boolean;
  toolDetected: string;
  fidelityAndInteraction: string;
}

export interface AiEthicsAnalysis {
  documentedPrompts: boolean;
  aiRoleObserved: string;
}

export interface SummaryHighlights {
  whatWentWell: string[];
  whatToImprove: string[];
  encouragement: string;
}

export interface EvaluationResult {
  id: string;
  evaluatedAt: string;
  projectTitle: string;
  studentName: string;
  classGroup: string;
  rawSubmissionText: string;
  totalPoints: number; // 0 - 100
  cunGrade: number; // 0.0 - 5.0
  performanceLevel: PerformanceLevel;
  executiveSummary: string;
  summaryHighlights?: SummaryHighlights;
  criteriaScores: CriterionScore[];
  bangAnalysis: BangAnalysis;
  leanCanvasAnalysis: LeanCanvasAnalysis;
  prototypeAnalysis: PrototypeAnalysis;
  aiEthicsAnalysis: AiEthicsAnalysis;
  actionPlan: string[];
  lmsFeedbackComment: string;
  engine?: string;
  teacherNotes?: string;
  fileName?: string;
  pdfPages?: number;
  isPdf?: boolean;
}

export interface SampleSubmission {
  id: string;
  title: string;
  studentName: string;
  classGroup: string;
  expectedScore: string;
  badgeType: 'success' | 'warning' | 'danger';
  description: string;
  fullText: string;
}
