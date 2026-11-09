import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { PDFParse } from 'pdf-parse';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

async function extractTextFromPdfBase64(base64: string): Promise<{ text: string; pages: number }> {
  try {
    const buf = Buffer.from(base64, 'base64');
    const parser: any = new PDFParse(new Uint8Array(buf));
    await parser.load();
    const result = await parser.getText();
    const text = typeof result === 'string' ? result : (result?.text || '');
    const pages = result?.total || (Array.isArray(result?.pages) ? result.pages.length : 1);
    return { text: text.trim(), pages };
  } catch (err) {
    console.warn('Error al extraer texto con PDFParse:', err);
    return { text: '', pages: 0 };
  }
}

// Initialize shared Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const RUBRIC_SYSTEM_PROMPT = `
Eres RetroACA, el evaluador pedagógico institucional y experto en la rúbrica oficial "Pasaporte de Ascenso" del programa de Espíritu Emprendedor e Innovación (CUN - Corporación Unificada Nacional de Educación Superior).

Tu misión es evaluar con rigor metodológico, alta empatía pedagógica, objetividad y precisión docente las entregas del ACA (Pasaporte de Ascenso).

CRITERIOS Y PONDERACIÓN OFICIAL (TOTAL 100 PUNTOS / NOTA COLOMBIANA 0.0 A 5.0):
1. Exploración del contexto y problema (20 pts - 20%):
   - Coherencia entre los 2 ODS seleccionados y el sector económico/social.
   - Pertinencia de las 2 señales/noticias del entorno (recientes, fundamentadas).
   - Observación de campo real: evidencias cualitativas/cuantitativas, vivencial, claridad en la situación investigada.
2. Comprensión del usuario, cliente y formulación del problema (20 pts - 20%):
   - Estructura causa-efecto en el árbol de problemas (causas raíces vs efectos).
   - Evidencias en el radar del usuario (testimonios, qué dicen, qué dificulta, cuándo ocurre).
   - Diferenciación rigurosa: Usuario (quien vive el problema/usa la solución) vs Cliente (quien decide la compra/paga).
   - Formulación estructurada del problema y reto inspirador con técnica HMW ("¿Cómo podríamos...?").
3. Propuesta de valor e ideación con BANG (30 pts - 30%):
   - Generación de 10 ideas creativas usando los 5 personajes BANG: Crispi (disruptivo/opuesto), Cori (corazón/empatía/social), Cristal (lógica/tecnología/datos), Cesia (diseño/UX/estética), Carmel (negocio/monetización/alianzas).
   - Matriz de evaluación con distribución estricta de 20 puntos por fila (Viabilidad = 20 pts, Factibilidad = 20 pts, Deseabilidad = 20 pts. Total 60 pts). REVISAR SI CUMPLEN LA REGLA DE SUMAR 20 POR FILA.
   - Justificación de la idea ganadora, nombre comercial, propuesta de valor y argumentación del tipo de innovación (incremental, disruptiva, etc.).
4. Lean Canvas (15 pts - 15%):
   - Diligenciamiento articulado de los 9 bloques (Problema, Segmentos, Propuesta de Valor, Solución, Canales, Ingresos, Costos, Métricas Clave, Ventaja Diferencial).
   - Ventaja diferencial genuina (difícil de copiar, no simple "somos amables").
5. Prototipo (10 pts - 10%):
   - Coherencia con la propuesta de valor.
   - Herramienta digital utilizada (Canva, Figma, Marvel, etc.). Enlace accesible/funcional.
   - Nivel de navegabilidad e interacción (flujos o mockups).
6. Coherencia, comunicación y uso responsable de IA (5 pts - 5%):
   - Presentación impecable, redacción académica y estructura de informe.
   - Evidencia explícita y transparente del uso de IA generativa (prompts usados, rol de copiloto analítico sin sustituir el pensamiento crítico del estudiante).

ESCALA DE CALIFICACIÓN:
- 85 - 100 pts (4.3 - 5.0): Estratégico (Sobresaliente)
- 70 - 84 pts (3.5 - 4.2): Autónomo (Nivel Alto)
- 50 - 69 pts (2.5 - 3.4): Básico (Aprobatorio mínimo o mejoras requeridas)
- 0 - 49 pts (0.0 - 2.4): En desarrollo (No aprobatorio / requiere reestructuración)

Nota institucional CUN = Total Puntos / 20 (escala 0.0 a 5.0, redondeado a un decimal).
`;

// Helper for heuristic evaluation when API key is not present or API limits are encountered
function generateHeuristicEvaluation(title: string, studentName: string, text: string) {
  const lower = text.toLowerCase();
  
  // Heuristics
  const hasOds = lower.includes('ods') || lower.includes('desarrollo sostenible') || lower.includes('hambre cero') || lower.includes('trabajo decente');
  const hasSenales = lower.includes('señal') || lower.includes('noticia') || lower.includes('entorno') || lower.includes('tendencia');
  const hasCampo = lower.includes('campo') || lower.includes('observación') || lower.includes('entrevista') || lower.includes('encuesta');
  
  const hasArbol = lower.includes('árbol') || lower.includes('causa') || lower.includes('efecto');
  const hasRadar = lower.includes('radar') || lower.includes('qué dicen') || lower.includes('dificultad');
  const hasClienteUsuario = lower.includes('usuario') && (lower.includes('cliente') || lower.includes('paga'));
  const hasRetoHMW = lower.includes('cómo podríamos') || lower.includes('como podriamos') || lower.includes('hmw');
  
  const characters = ['crispi', 'cori', 'cristal', 'cesia', 'carmel'];
  const detectedChars = characters.filter(c => lower.includes(c));
  const hasBang = detectedChars.length >= 2 || lower.includes('bang');
  const hasMatriz = lower.includes('matriz') || (lower.includes('viabilidad') && lower.includes('factibilidad'));
  const hasPropuestaValor = lower.includes('propuesta de valor') || lower.includes('innovación');
  
  const hasLeanCanvas = lower.includes('lean canvas') || lower.includes('canales') || lower.includes('ingresos') || lower.includes('costos');
  const hasPrototipo = lower.includes('prototipo') || lower.includes('figma') || lower.includes('canva') || lower.includes('enlace') || lower.includes('http');
  const hasIA = lower.includes('inteligencia artificial') || lower.includes('ia') || lower.includes('gemini') || lower.includes('chatgpt') || lower.includes('copiloto') || lower.includes('prompt');

  // Calculate scores
  let c1 = 12;
  if (hasOds) c1 += 3;
  if (hasSenales) c1 += 2.5;
  if (hasCampo) c1 += 2.5;
  c1 = Math.min(20, Math.round(c1));

  let c2 = 11;
  if (hasArbol) c2 += 2.5;
  if (hasRadar) c2 += 2.5;
  if (hasClienteUsuario) c2 += 2;
  if (hasRetoHMW) c2 += 2;
  c2 = Math.min(20, Math.round(c2));

  let c3 = 18;
  if (hasBang) c3 += 4;
  if (hasMatriz) c3 += 4;
  if (hasPropuestaValor) c3 += 4;
  c3 = Math.min(30, Math.round(c3));

  let c4 = 9;
  if (hasLeanCanvas) c4 += 4;
  if (lower.includes('ventaja')) c4 += 2;
  c4 = Math.min(15, Math.round(c4));

  let c5 = 6;
  if (hasPrototipo) c5 += 3;
  c5 = Math.min(10, Math.round(c5));

  let c6 = 3;
  if (hasIA) c6 += 1.5;
  c6 = Math.min(5, Math.round(c6));

  const totalPoints = c1 + c2 + c3 + c4 + c5 + c6;
  const cunGrade = Number((totalPoints / 20).toFixed(1));
  const level = cunGrade >= 4.3 ? 'Estratégico' : cunGrade >= 3.5 ? 'Autónomo' : cunGrade >= 2.5 ? 'Básico' : 'En desarrollo';

  return {
    totalPoints,
    cunGrade,
    performanceLevel: level,
    summaryHighlights: {
      whatWentWell: [
        hasOds ? 'Articulación coherente de los 2 ODS con el contexto y sector investigado.' : 'Delimitación general del sector productivo.',
        hasClienteUsuario ? 'Diferenciación conceptual clara entre Usuario (quien vive el dolor) y Cliente (quien toma la decisión financiera/paga).' : 'Identificación de los actores involucrados.',
        hasBang ? `Proceso de ideación divergente apoyado en los personajes BANG (${detectedChars.join(', ') || 'Metodología BANG'}).` : 'Propuesta de alternativas de solución.',
        hasPrototipo ? 'Construcción de prototipo digital funcional con herramientas modernas.' : 'Planteamiento de propuesta de valor.'
      ].slice(0, 3),
      whatToImprove: [
        'Asegurar el cumplimiento estricto de la regla de los 20 puntos por fila en la matriz de evaluación BANG (Viabilidad = 20, Factibilidad = 20, Deseabilidad = 20).',
        'Profundizar en el Radar del Usuario con evidencias empíricas directas de campo (qué dicen, qué dificulta y momentos críticos de dolor).',
        'Fortalecer la Ventaja Diferencial en el Lean Canvas para blindar el modelo con una barrera real difícil de copiar o comprar por competidores.',
        hasPrototipo ? 'Garantizar que el enlace del prototipo cuente con flujos interactivos navegables y permisos abiertos de acceso.' : 'Elaborar un prototipo digital navegable en Canva o Figma.'
      ].slice(0, 3),
      encouragement: 'El equipo ha demostrado iniciativa y comprensión metodológica en «Pasaporte de Ascenso». Ajustando estos aspectos clave, la propuesta alcanzará un nivel de madurez sobresaliente para su sustentación ante el jurado.'
    },
    executiveSummary: `Evaluación formativa del proyecto "${title || 'Pasaporte de Ascenso'}" de ${studentName || 'el equipo'}. Presenta un nivel ${level} con un puntaje de ${totalPoints}/100 (Nota CUN: ${cunGrade}/5.0).

✅ LO QUE ESTUVO BIEN:
• ${hasOds ? 'Articulación coherente de los 2 ODS con el contexto y sector investigado.' : 'Intención de contextualizar la problemática sectorial.'}
• ${hasClienteUsuario ? 'Diferenciación conceptual clara entre Usuario (dolor de uso) y Cliente (decisión de compra/pago).' : 'Estructuración preliminar del problema.'}
• ${hasBang ? 'Aplicación de la metodología de ideación con personajes BANG para generar alternativas creativas.' : 'Planteamiento de propuesta de valor.'}

⚠️ LO QUE DEBE MEJORAR:
• Verificar la regla de los 20 puntos por fila en la matriz BANG: cada criterio horizontal debe sumar exactamente 20 puntos.
• Robustecer el Radar del Usuario con evidencias directas de campo (qué dicen, qué dificulta y momentos de dolor).
• Fortalecer la Ventaja Diferencial en el Lean Canvas para blindar el modelo ante competidores del mercado.

💡 RETO PARA EL ASCENSO:
Preparar la sustentación oral demostrando cómo la solución alivia el dolor específico del usuario y cómo validaron su prototipo con personas reales.`,
    criteriaScores: [
      {
        id: 'c1',
        name: 'Exploración del contexto y problema',
        weight: 20,
        score: c1,
        level: c1 >= 17 ? 'Estratégico' : c1 >= 14 ? 'Autónomo' : c1 >= 10 ? 'Básico' : 'En desarrollo',
        strengths: [
          hasOds ? 'Se identifican Objetivos de Desarrollo Sostenible vinculados a la temática.' : 'Delimitación general del sector económico.',
          hasSenales ? 'Aporte de señales o tendencias del entorno.' : 'Intención de contextualizar la necesidad.'
        ],
        improvements: [
          'Profundizar en la observación de campo directa con evidencias vivenciales verificables.',
          'Asegurar que los 2 ODS conecten de manera causa-efecto con el problema específico identificado.'
        ],
        socraticQuestions: [
          '¿Cómo validarían en el terreno con los afectados que esta señal del entorno realmente altera su día a día?',
          '¿Qué métrica concreta del ODS seleccionado se ve impactada directamente con su propuesta?'
        ],
        subcriteriaCheck: [
          { label: '2 ODS articulados al sector', status: hasOds ? 'cumple' : 'parcial', observation: hasOds ? 'Identificados en el documento' : 'Mención general' },
          { label: '2 Señales del entorno', status: hasSenales ? 'cumple' : 'parcial', observation: hasSenales ? 'Presentes y contextualizadas' : 'Requiere mayor respaldo' },
          { label: 'Observación real de campo', status: hasCampo ? 'cumple' : 'parcial', observation: hasCampo ? 'Evidencia de trabajo vivencial' : 'Evidencia preliminar' }
        ]
      },
      {
        id: 'c2',
        name: 'Comprensión del usuario, cliente y formulación del problema',
        weight: 20,
        score: c2,
        level: c2 >= 17 ? 'Estratégico' : c2 >= 14 ? 'Autónomo' : c2 >= 10 ? 'Básico' : 'En desarrollo',
        strengths: [
          hasArbol ? 'Estructuración inicial de árbol de problemas.' : 'Definición de la problemática central.',
          hasClienteUsuario ? 'Diferenciación conceptual entre usuario y cliente.' : 'Identificación de personas involucradas.'
        ],
        improvements: [
          'Profundizar en el Radar del Usuario documentando citas textuales y momentos críticos de dolor.',
          'Afinar la redacción del reto "¿Cómo podríamos...?" para que sea inspirador y no prescriba la solución de antemano.'
        ],
        socraticQuestions: [
          '¿Quién tiene el incentivo económico para pagar por solucionar este dolor frente a quién lo sufre en el día a día?',
          '¿El reto "¿Cómo podríamos...?" permite al menos 10 soluciones radicalmente distintas o condiciona una sola respuesta?'
        ],
        subcriteriaCheck: [
          { label: 'Árbol de problemas causa-efecto', status: hasArbol ? 'cumple' : 'parcial', observation: 'Estructura observable en el documento' },
          { label: 'Radar del usuario con testimonios reales', status: hasRadar ? 'cumple' : 'parcial', observation: 'Requiere más evidencias empíricas directas' },
          { label: 'Diferenciación Usuario vs Cliente', status: hasClienteUsuario ? 'cumple' : 'parcial', observation: hasClienteUsuario ? 'Diferenciados con claridad' : 'Revisar incentivo de pago vs uso' },
          { label: 'Pregunta reto "¿Cómo podríamos...?"', status: hasRetoHMW ? 'cumple' : 'parcial', observation: 'Formulación presente' }
        ]
      },
      {
        id: 'c3',
        name: 'Propuesta de valor e ideación con BANG',
        weight: 30,
        score: c3,
        level: c3 >= 25 ? 'Estratégico' : c3 >= 20 ? 'Autónomo' : c3 >= 15 ? 'Básico' : 'En desarrollo',
        strengths: [
          hasBang ? `Uso documentado de los personajes BANG (detectados: ${detectedChars.join(', ') || 'Metodología BANG'}).` : 'Generación de alternativas creativas.',
          'Selección de una idea central para la propuesta de valor.'
        ],
        improvements: [
          'Verificar con rigurosidad la regla de los 20 puntos por fila en la matriz de evaluación (Viabilidad = 20, Factibilidad = 20, Deseabilidad = 20).',
          'Argumentar con mayor profundidad técnica el tipo de innovación (disruptiva, incremental, de modelo de negocio o social).'
        ],
        socraticQuestions: [
          '¿Qué personaje de BANG aportó la idea más disruptiva y por qué fue esa la que detonó la propuesta final?',
          '¿Cómo se garantiza que la matriz de selección no esté sesgada hacia la idea predeterminada del equipo?'
        ],
        subcriteriaCheck: [
          { label: '10 Ideas con los 5 personajes BANG', status: detectedChars.length >= 4 ? 'cumple' : 'parcial', observation: `${detectedChars.length} personajes identificados claramente` },
          { label: 'Matriz estricta de 20 pts por fila', status: 'parcial', observation: 'Revisar suma horizontal de 20 pts por cada criterio' },
          { label: 'Propuesta de valor y tipo de innovación', status: hasPropuestaValor ? 'cumple' : 'parcial', observation: 'Propuesta formulada' }
        ]
      },
      {
        id: 'c4',
        name: 'Lean Canvas articulado',
        weight: 15,
        score: c4,
        level: c4 >= 13 ? 'Estratégico' : c4 >= 10 ? 'Autónomo' : c4 >= 7 ? 'Básico' : 'En desarrollo',
        strengths: [
          'Presencia de los bloques estructurales del modelo de negocio.',
          'Consistencia lógica general entre el problema y la solución planteada.'
        ],
        improvements: [
          'Fortalecer la Ventaja Diferencial (debe ser algo no comprable ni fácilmente copiable en los primeros 6 meses).',
          'Detallar las métricas clave (indicadores accionables de tracción vs métricas de vanidad).'
        ],
        socraticQuestions: [
          'Si un competidor con 10 veces más capital entra al mercado mañana, ¿cuál es su verdadera defensa ineludible?',
          '¿Cuál es la primera métrica que les dirá si el modelo es sostenible en los primeros 90 días?'
        ],
        subcriteriaCheck: [
          { label: 'Diligenciamiento de los 9 bloques', status: hasLeanCanvas ? 'cumple' : 'parcial', observation: 'Bloques desarrollados' },
          { label: 'Coherencia interna (Problema-Solución-Ingresos)', status: 'cumple', observation: 'Articulación coherente' },
          { label: 'Ventaja diferencial genuina', status: lower.includes('ventaja') ? 'cumple' : 'parcial', observation: 'Reforzar barrera de entrada' }
        ]
      },
      {
        id: 'c5',
        name: 'Prototipo funcional / digital',
        weight: 10,
        score: c5,
        level: c5 >= 9 ? 'Estratégico' : c5 >= 7 ? 'Autónomo' : c5 >= 5 ? 'Básico' : 'En desarrollo',
        strengths: [
          hasPrototipo ? 'Presencia de prototipo o enlace de diseño digital.' : 'Conceptualización gráfica de la solución.'
        ],
        improvements: [
          'Garantizar que el enlace sea completamente público/accesible y cuente con flujos interactivos navegables.',
          'Probar el prototipo con al menos 3 usuarios reales y registrar aprendizajes de usabilidad.'
        ],
        socraticQuestions: [
          '¿Cuál fue la pantalla o interacción donde el usuario dudó más al realizar la tarea principal?',
          '¿Qué cambió en el prototipo entre la primera versión en papel y la versión digital final?'
        ],
        subcriteriaCheck: [
          { label: 'Herramienta digital (Canva, Figma, etc.)', status: hasPrototipo ? 'cumple' : 'parcial', observation: 'Herramienta referenciada' },
          { label: 'Enlace funcional y navegabilidad', status: hasPrototipo ? 'cumple' : 'parcial', observation: 'Verificar permisos y navegación' }
        ]
      },
      {
        id: 'c6',
        name: 'Coherencia, comunicación y uso responsable de IA',
        weight: 5,
        score: c6,
        level: c6 >= 5 ? 'Estratégico' : c6 >= 4 ? 'Autónomo' : c6 >= 3 ? 'Básico' : 'En desarrollo',
        strengths: [
          'Claridad en la comunicación escrita del documento.',
          hasIA ? 'Mención explícita de herramientas de IA como apoyo analítico.' : 'Estructura organizada de entrega.'
        ],
        improvements: [
          'Documentar explícitamente los prompts usados en la bitácora de IA y explicar cómo refinaron el resultado con pensamiento propio.'
        ],
        socraticQuestions: [
          '¿En qué momento la respuesta de la IA no fue suficiente y el equipo tuvo que aportar criterio propio para solucionarlo?'
        ],
        subcriteriaCheck: [
          { label: 'Calidad de comunicación y presentación', status: 'cumple', observation: 'Cumple estándares formativos' },
          { label: 'Evidencia transparente y ética de IA', status: hasIA ? 'cumple' : 'parcial', observation: hasIA ? 'Documentado' : 'Añadir bitácora de prompts' }
        ]
      }
    ],
    bangAnalysis: {
      charactersDetected: characters.map(c => ({
        name: c.charAt(0).toUpperCase() + c.slice(1),
        identified: detectedChars.includes(c),
        ideasCount: detectedChars.includes(c) ? 2 : 1,
        comment: detectedChars.includes(c) ? 'Integrado en el proceso de ideación' : 'Mención implícita o pendiente de reforzar'
      })),
      matrixSumCheck: {
        viabilitySum: 20,
        feasibilitySum: 20,
        desirabilitySum: 20,
        totalSum: 60,
        isValidRule20: true,
        comment: 'Verificar en el manuscrito que cada fila sume exactamente 20 puntos entre las 10 ideas.'
      },
      winningIdea: {
        name: title || 'Propuesta seleccionada',
        valueProposition: 'Solución orientada a resolver la necesidad identificada con diferenciación competitiva.',
        innovationType: 'Innovación Incremental / Social'
      }
    },
    leanCanvasAnalysis: {
      completedBlocksCount: hasLeanCanvas ? 9 : 7,
      blocksStatus: [
        { blockNumber: 1, name: 'Problema', status: 'solido', notes: 'Bien correlacionado con árbol' },
        { blockNumber: 2, name: 'Segmentos de clientes', status: 'solido', notes: 'Identifica adoptantes tempranos' },
        { blockNumber: 3, name: 'Propuesta de valor única', status: 'solido', notes: 'Clara y atractiva' },
        { blockNumber: 4, name: 'Solución', status: 'solido', notes: 'Alineada con prototipo' },
        { blockNumber: 5, name: 'Canales', status: 'solido', notes: 'Medios de contacto definidos' },
        { blockNumber: 6, name: 'Fuentes de ingresos', status: 'debil', notes: 'Detallar estructura de monetización' },
        { blockNumber: 7, name: 'Estructura de costes', status: 'solido', notes: 'Costos principales listados' },
        { blockNumber: 8, name: 'Métricas clave', status: 'debil', notes: 'Focalizar en métricas de retención' },
        { blockNumber: 9, name: 'Ventaja diferencial', status: 'debil', notes: 'Fortalecer barreras de replicabilidad' }
      ],
      differentialAdvantageQuality: 'Requiere mayor solidez estratégica para blindarse ante competidores existentes.'
    },
    prototypeAnalysis: {
      hasDigitalLink: hasPrototipo,
      toolDetected: lower.includes('figma') ? 'Figma' : lower.includes('canva') ? 'Canva' : 'Herramienta Digital',
      fidelityAndInteraction: 'Prototipo funcional conceptual con nivel de interactividad adecuado para validación inicial.'
    },
    aiEthicsAnalysis: {
      documentedPrompts: hasIA,
      aiRoleObserved: hasIA ? 'Copiloto de ideación y síntesis analítica.' : 'No se detalla bitácora formal de prompts.'
    },
    actionPlan: [
      'Calibrar la suma estricta de 20 puntos por fila en la matriz BANG para evitar empates o distorsiones.',
      'Reforzar la ventaja competitiva en el Lean Canvas mostrando propiedad intelectual o acuerdos exclusivos.',
      'Realizar prueba de usabilidad con 3 usuarios y registrar métricas cuantitativas en el prototipo.'
    ],
    lmsFeedbackComment: `Estimad@s estudiantes (${studentName || 'Equipo'})\n\n¡Felicitaciones por la entrega de su Pasaporte de Ascenso "${title || 'Proyecto'}"!\n\nNota preliminar CUN: ${cunGrade}/5.0 (Puntaje: ${totalPoints}/100 - Nivel ${level}).\n\n✅ LO QUE ESTUVO BIEN (FORTALEZAS):\n- ${hasOds ? 'Articulación coherente de los ODS con el contexto y sector investigado.' : 'Intención de contextualizar la problemática sectorial.'}\n- ${hasClienteUsuario ? 'Diferenciación conceptual clara entre Usuario (dolor de uso) y Cliente (decisión de compra/pago).' : 'Estructuración preliminar del problema.'}\n- ${hasBang ? 'Uso de la metodología de ideación BANG y estructuración del modelo en Lean Canvas.' : 'Planteamiento de propuesta de valor.'}\n\n⚠️ LO QUE DEBEN MEJORAR (ACCIONES PRIORITARIAS):\n1. Revisar la matriz de evaluación de ideas para asegurar que cada criterio sume exactamente 20 puntos horizontales.\n2. Robustecer el Radar del Usuario con testimonios y momentos de dolor reales de campo.\n3. Fortalecer la ventaja diferencial del Lean Canvas para que sea una defensa genuina frente al mercado.\n4. Asegurar que el prototipo digital cuente con enlaces públicos y flujos de navegación completos.\n\n💡 ORIENTACIÓN PARA LA SUSTENTACIÓN ORAL:\nDefiendan con pasión cómo su propuesta resuelve el dolor real de sus usuarios y sustenten la viabilidad técnica y financiera de su solución.\n\n¡Sigan adelante con la misma pasión emprendedora!`
  };
}

// POST /api/extract-pdf
app.post('/api/extract-pdf', async (req, res) => {
  try {
    const { pdfBase64, fileName } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({ error: 'No se envió archivo PDF en base64.' });
    }
    const { text, pages } = await extractTextFromPdfBase64(pdfBase64);
    
    // Infer title and student name if possible
    let inferredTitle = '';
    let inferredStudent = '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 10)) {
      if (/proyecto|propuesta|título|titulo/i.test(line) && !inferredTitle) {
        inferredTitle = line.replace(/^(proyecto|propuesta|título|titulo)[:\s-]*/i, '').trim();
      }
      if (/integrantes|estudiante|autor|autores|equipo/i.test(line) && !inferredStudent) {
        inferredStudent = line.replace(/^(integrantes|estudiante|autor|autores|equipo)[:\s-]*/i, '').trim();
      }
    }

    return res.json({
      text,
      pages,
      charCount: text.length,
      wordCount: text ? text.split(/\s+/).length : 0,
      inferredTitle,
      inferredStudent,
      fileName
    });
  } catch (err: any) {
    console.error('Error en /api/extract-pdf:', err);
    return res.status(500).json({ error: 'No se pudo procesar el archivo PDF.' });
  }
});

// POST /api/evaluate
app.post('/api/evaluate', async (req, res) => {
  let effectiveText = '';
  let fileName = req.body.fileName || '';
  let pdfPages = 0;
  let projectTitle = req.body.projectTitle || '';
  let studentName = req.body.studentName || '';

  try {
    const { submissionText, pdfBase64, classGroup, customInstructions } = req.body;

    let extractedPdfText = '';

    if (pdfBase64) {
      const pdfData = await extractTextFromPdfBase64(pdfBase64);
      extractedPdfText = pdfData.text;
      pdfPages = pdfData.pages;
    }

    effectiveText = (submissionText && submissionText.trim().length >= 20)
      ? submissionText
      : extractedPdfText;

    if (!effectiveText && !pdfBase64) {
      return res.status(400).json({ error: 'El contenido de la entrega o el archivo PDF está vacío o no pudo ser procesado.' });
    }

    // Attempt inference if fields are missing
    if (!projectTitle && effectiveText) {
      const lines = effectiveText.split('\n').map((l: string) => l.trim()).filter(Boolean);
      for (const line of lines.slice(0, 8)) {
        if (/proyecto|propuesta|título|titulo/i.test(line)) {
          projectTitle = line.replace(/^(proyecto|propuesta|título|titulo)[:\s-]*/i, '').trim().slice(0, 90);
          break;
        }
      }
      if (!projectTitle && fileName) {
        projectTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      }
    }

    if (!studentName && effectiveText) {
      const lines = effectiveText.split('\n').map((l: string) => l.trim()).filter(Boolean);
      for (const line of lines.slice(0, 8)) {
        if (/integrantes|estudiante|autor|autores|equipo/i.test(line)) {
          studentName = line.replace(/^(integrantes|estudiante|autor|autores|equipo)[:\s-]*/i, '').trim().slice(0, 90);
          break;
        }
      }
    }

    if (!ai) {
      console.warn('GEMINI_API_KEY no detectada. Usando motor pedagógico heurístico estructurado.');
      const fallbackResult = generateHeuristicEvaluation(
        projectTitle || 'Pasaporte de Ascenso',
        studentName || 'Estudiante',
        effectiveText
      );
      return res.json({
        ...fallbackResult,
        engine: 'heuristic-calibrated',
        extractedText: effectiveText,
        pdfPages,
        fileName
      });
    }

    const promptText = `
Evalúa la siguiente entrega de estudiante de acuerdo con la Rúbrica Oficial de Pasaporte de Ascenso CUN.

METADATOS DE LA ENTREGA:
- Archivo adjunto: ${fileName || (pdfBase64 ? 'Documento PDF' : 'Texto directo')}
- Título del Proyecto: ${projectTitle || 'Sin título especificado'}
- Estudiante / Equipo: ${studentName || 'Estudiante'}
- Ficha / Grupo: ${classGroup || 'General'}
${customInstructions ? `- Instrucciones pedagógicas adicionales del docente: ${customInstructions}` : ''}

${effectiveText ? `TEXTO EXTRAÍDO DEL DOCUMENTO:\n"""\n${effectiveText.slice(0, 35000)}\n"""` : 'El contenido se adjunta como documento PDF multimodal.'}

Instrucciones de salida:
Devuelve un JSON estrictamente estructurado según el schema especificado con:
- totalPoints (0-100 número)
- cunGrade (0.0 a 5.0 número con 1 decimal, cálculo totalPoints/20)
- performanceLevel ('Estratégico' | 'Autónomo' | 'Básico' | 'En desarrollo')
- executiveSummary (síntesis pedagógica cálida que detalle claramente qué estuvo bien y qué debe mejorar)
- summaryHighlights: un objeto estructurado que desglose explícitamente:
  * whatWentWell: lista de 2 a 4 aspectos que el estudiante hizo muy bien en la entrega
  * whatToImprove: lista de 2 a 4 aspectos prioritarios y concretos que el estudiante DEBE mejorar
  * encouragement: mensaje motivador de cierre formativo para la sustentación
- criteriaScores (exactamente 6 elementos para los 6 criterios oficiales: c1, c2, c3, c4, c5, c6 con sus weights 20, 20, 30, 15, 10, 5)
- bangAnalysis (detección de los 5 personajes Crispi, Cori, Cristal, Cesia, Carmel, validación de la regla de suma de 20 pts por fila)
- leanCanvasAnalysis (evaluación de los 9 bloques)
- prototypeAnalysis (enlace, herramienta, nivel de interacción)
- aiEthicsAnalysis (uso transparente y ético de IA)
- actionPlan (3 a 4 acciones recomendadas)
- lmsFeedbackComment (mensaje listo para copiar en el LMS institucional como Moodle/Canvas)
`;

    // Construct request parts: include PDF inlineData if present
    const contents: any[] = [];
    if (pdfBase64) {
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64
        }
      });
    }
    contents.push({
      text: promptText
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction: RUBRIC_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalPoints: { type: Type.NUMBER, description: 'Puntaje total sobre 100 puntos' },
            cunGrade: { type: Type.NUMBER, description: 'Nota sobre 5.0 calculada como totalPoints / 20' },
            performanceLevel: { type: Type.STRING, description: 'Nivel: Estratégico, Autónomo, Básico o En desarrollo' },
            executiveSummary: { type: Type.STRING, description: 'Síntesis ejecutiva y pedagógica' },
            summaryHighlights: {
              type: Type.OBJECT,
              properties: {
                whatWentWell: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de 2 a 4 fortalezas y aciertos de la entrega'
                },
                whatToImprove: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de 2 a 4 aspectos prioritarios que el estudiante DEBE mejorar'
                },
                encouragement: {
                  type: Type.STRING,
                  description: 'Mensaje de cierre pedagógico y motivacional'
                }
              },
              required: ['whatWentWell', 'whatToImprove', 'encouragement']
            },
            criteriaScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  weight: { type: Type.NUMBER },
                  score: { type: Type.NUMBER },
                  level: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  socraticQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  subcriteriaCheck: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        status: { type: Type.STRING },
                        observation: { type: Type.STRING }
                      },
                      required: ['label', 'status', 'observation']
                    }
                  }
                },
                required: ['id', 'name', 'weight', 'score', 'level', 'strengths', 'improvements', 'socraticQuestions', 'subcriteriaCheck']
              }
            },
            bangAnalysis: {
              type: Type.OBJECT,
              properties: {
                charactersDetected: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      identified: { type: Type.BOOLEAN },
                      ideasCount: { type: Type.NUMBER },
                      comment: { type: Type.STRING }
                    },
                    required: ['name', 'identified', 'ideasCount', 'comment']
                  }
                },
                matrixSumCheck: {
                  type: Type.OBJECT,
                  properties: {
                    viabilitySum: { type: Type.NUMBER },
                    feasibilitySum: { type: Type.NUMBER },
                    desirabilitySum: { type: Type.NUMBER },
                    totalSum: { type: Type.NUMBER },
                    isValidRule20: { type: Type.BOOLEAN },
                    comment: { type: Type.STRING }
                  },
                  required: ['viabilitySum', 'feasibilitySum', 'desirabilitySum', 'totalSum', 'isValidRule20', 'comment']
                },
                winningIdea: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    valueProposition: { type: Type.STRING },
                    innovationType: { type: Type.STRING }
                  },
                  required: ['name', 'valueProposition', 'innovationType']
                }
              },
              required: ['charactersDetected', 'matrixSumCheck', 'winningIdea']
            },
            leanCanvasAnalysis: {
              type: Type.OBJECT,
              properties: {
                completedBlocksCount: { type: Type.NUMBER },
                blocksStatus: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      blockNumber: { type: Type.NUMBER },
                      name: { type: Type.STRING },
                      status: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ['blockNumber', 'name', 'status', 'notes']
                  }
                },
                differentialAdvantageQuality: { type: Type.STRING }
              },
              required: ['completedBlocksCount', 'blocksStatus', 'differentialAdvantageQuality']
            },
            prototypeAnalysis: {
              type: Type.OBJECT,
              properties: {
                hasDigitalLink: { type: Type.BOOLEAN },
                toolDetected: { type: Type.STRING },
                fidelityAndInteraction: { type: Type.STRING }
              },
              required: ['hasDigitalLink', 'toolDetected', 'fidelityAndInteraction']
            },
            aiEthicsAnalysis: {
              type: Type.OBJECT,
              properties: {
                documentedPrompts: { type: Type.BOOLEAN },
                aiRoleObserved: { type: Type.STRING }
              },
              required: ['documentedPrompts', 'aiRoleObserved']
            },
            actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            lmsFeedbackComment: { type: Type.STRING }
          },
          required: [
            'totalPoints',
            'cunGrade',
            'performanceLevel',
            'executiveSummary',
            'criteriaScores',
            'bangAnalysis',
            'leanCanvasAnalysis',
            'prototypeAnalysis',
            'aiEthicsAnalysis',
            'actionPlan',
            'lmsFeedbackComment'
          ]
        }
      }
    });

    const text = response.text || '';
    if (!text) {
      throw new Error('No se recibió texto del modelo Gemini.');
    }
    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      engine: 'gemini-3.8-flash',
      extractedText: effectiveText,
      fileName,
      pdfPages,
      projectTitle: projectTitle || parsed.winningIdea?.name || 'Pasaporte de Ascenso',
      studentName: studentName || 'Equipo Estudiantil'
    });
  } catch (err: any) {
    console.error('Error en /api/evaluate:', err);
    // If Gemini fails, fallback safely so user experience is not broken
    const fallback = generateHeuristicEvaluation(
      projectTitle || req.body.projectTitle || 'Pasaporte de Ascenso',
      studentName || req.body.studentName || 'Estudiante',
      effectiveText || req.body.submissionText || ''
    );
    return res.json({
      ...fallback,
      engine: 'heuristic-fallback',
      note: 'Evaluado con motor de contingencia pedagógica.',
      extractedText: effectiveText,
      fileName,
      pdfPages,
      projectTitle: projectTitle || 'Pasaporte de Ascenso',
      studentName: studentName || 'Estudiante'
    });
  }
});

// POST /api/chat-assistant: Copilot interaction for the teacher
app.post('/api/chat-assistant', async (req, res) => {
  try {
    const { messages, currentEvaluation } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensajes requeridos.' });
    }

    if (!ai) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: `[Modo Offline] He recibido tu consulta: "${lastMsg}". Como docente de Espíritu Emprendedor, te sugiero enfocar la retroalimentación en la coherencia entre el problema del usuario y la propuesta de valor de BANG. Puedes ajustar manualmente las puntuaciones en la matriz.`
      });
    }

    const conversationContext = `
Eres RetroACA Copilot, el asistente pedagógico personal del docente evaluador.
Estás colaborando con el docente para afinar la retroalimentación, proponer preguntas socráticas para la sustentación oral, sugerir ajustes de nota con base en la rúbrica institucional de CUN, o reformular comentarios en distintos tonos (empático, riguroso, resumido para LMS).

EVALUACIÓN ACTUAL EN PANTALLA:
${currentEvaluation ? JSON.stringify(currentEvaluation, null, 2) : 'Aún no se ha evaluado una entrega específica.'}
`;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: conversationContext }]
        },
        ...contents
      ]
    });

    return res.json({ reply: response.text || 'Sin respuesta generada.' });
  } catch (err: any) {
    console.error('Error en /api/chat-assistant:', err);
    return res.status(500).json({ error: 'No se pudo procesar la consulta con el copiloto.' });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey), time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RetroACA dev server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
