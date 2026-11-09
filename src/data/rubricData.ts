export interface OfficialRubricItem {
  id: string;
  name: string;
  weight: number;
  description: string;
  maxPoints: number;
  keyIndicators: string[];
  levels: {
    estrategico: string; // 85-100%
    autonomo: string;    // 70-84%
    basico: string;      // 50-69%
    enDesarrollo: string;// <50%
  };
}

export const OFFICIAL_RUBRIC: OfficialRubricItem[] = [
  {
    id: 'c1',
    name: 'Exploración del contexto y problema',
    weight: 20,
    maxPoints: 20,
    description: 'Articulación coherente de los ODS con el sector, pertinencia de las señales del entorno y profundidad en la observación de campo.',
    keyIndicators: [
      'Selección justificada de 2 ODS articulados al sector económico/social',
      'Documentación de 2 señales/noticias recientes y verificables del entorno',
      'Observación de campo vivencial y real con evidencias cualitativas/cuantitativas',
      'Delimitación precisa de la situación a investigar'
    ],
    levels: {
      estrategico: '17 - 20 pts: Coherencia total entre ODS, sector y problemática. Señales del entorno actualizadas y observación de campo rigurosa con evidencias directas.',
      autonomo: '14 - 16 pts: ODS pertinentes, señales claras y observación de campo documentada, con leves oportunidades de profundización empírica.',
      basico: '10 - 13 pts: Identifica ODS y señales de manera general; observación de campo superficial o basada en supuestos sin suficiente trabajo vivencial.',
      enDesarrollo: '0 - 9 pts: Desconexión entre ODS y contexto; señales ausentes o no pertinentes; nula o deficiente observación de campo.'
    }
  },
  {
    id: 'c2',
    name: 'Comprensión del usuario, cliente y formulación del problema',
    weight: 20,
    maxPoints: 20,
    description: 'Estructuración del árbol de problemas, aplicación del radar del usuario con evidencias reales, diferenciación estricta entre usuario y cliente, y formulación del reto con "¿Cómo podríamos...?"',
    keyIndicators: [
      'Árbol de problemas con relaciones causa-efecto claras y causas raíces identificadas',
      'Radar del usuario con testimonios reales: qué dicen, qué dificulta, cuándo y dónde ocurre',
      'Diferenciación conceptual y operativa entre Usuario (dolor/uso) y Cliente (decisión de compra/pago)',
      'Formulación estructurada del problema y reto inspirador con técnica HMW ("¿Cómo podríamos...?")'
    ],
    levels: {
      estrategico: '17 - 20 pts: Árbol impecable; radar con testimonios reales profundos; distinción nítida entre usuario y cliente; reto HMW inspirador, ambicioso y factible.',
      autonomo: '14 - 16 pts: Buena lógica en el árbol; radar con evidencias; diferencia usuario de cliente; reto HMW bien formulado.',
      basico: '10 - 13 pts: Árbol con causas superficiales; radar incompleto; confusión parcial entre usuario y cliente; reto HMW que sesga o adelanta la solución.',
      enDesarrollo: '0 - 9 pts: Sin estructura causal; radar ausente o inventado; no distingue usuario de cliente; reto mal redactado o ausente.'
    }
  },
  {
    id: 'c3',
    name: 'Propuesta de valor e ideación con BANG',
    weight: 30,
    maxPoints: 30,
    description: 'Generación de 10 ideas creativas usando los 5 personajes BANG, aplicación estricta de la regla de los 20 puntos por fila en la matriz de evaluación y sustentación del tipo de innovación.',
    keyIndicators: [
      '10 ideas divergentes usando los 5 personajes BANG (Crispi, Cori, Cristal, Cesia, Carmel)',
      'Matriz de evaluación con distribución estricta de 20 puntos por fila (Viabilidad 20, Factibilidad 20, Deseabilidad 20 = 60 pts totales)',
      'Justificación sólida de la idea seleccionada y nombre comercial atractivo',
      'Propuesta de valor clara y argumentación técnica del tipo de innovación'
    ],
    levels: {
      estrategico: '25 - 30 pts: 10 ideas ricas y diferenciadas con los 5 personajes; matriz cumple estrictamente la suma de 20 por fila; propuesta de valor contundente y tipo de innovación fundamentado.',
      autonomo: '20 - 24 pts: Ideas creativas con la mayoría de personajes; matriz con sumas correctas o ligeros desajustes; propuesta de valor clara.',
      basico: '15 - 19 pts: Menos de 10 ideas o personajes poco aprovechados; matriz no respeta la regla de los 20 puntos por fila; propuesta de valor genérica.',
      enDesarrollo: '0 - 14 pts: Ideación deficiente sin metodología BANG; matriz ausente o errónea; propuesta de valor inexistente o confusa.'
    }
  },
  {
    id: 'c4',
    name: 'Lean Canvas articulado',
    weight: 15,
    maxPoints: 15,
    description: 'Diligenciamiento de los 9 bloques del Lean Canvas con coherencia sistémica interna y formulación de una ventaja diferencial genuina y defendible.',
    keyIndicators: [
      'Diligenciamiento completo y articulado de los 9 bloques del modelo',
      'Alineación entre problema, propuesta de valor, canales, métricas e ingresos',
      'Ventaja diferencial real (no fácilmente copiable o comprable)'
    ],
    levels: {
      estrategico: '13 - 15 pts: Los 9 bloques se articulan con total coherencia sistémica; ventaja diferencial sólida y difícil de replicar; métricas clave accionables.',
      autonomo: '10 - 12 pts: 9 bloques completos con buena consistencia; ventaja diferencial aceptable aunque perfectible.',
      basico: '7 - 9 pts: Varios bloques con información genérica; desalineación entre costos/ingresos o ventaja diferencial débil ("buen servicio").',
      enDesarrollo: '0 - 6 pts: Bloques incompletos, inconsistencias graves en el modelo de negocio o ventaja diferencial ausente.'
    }
  },
  {
    id: 'c5',
    name: 'Prototipo funcional / digital',
    weight: 10,
    maxPoints: 10,
    description: 'Construcción de un prototipo digital navegable en Canva, Figma u otra herramienta, coherente con la propuesta de valor y accesible mediante enlace público.',
    keyIndicators: [
      'Uso de herramienta digital adecuada (Canva, Figma, Marvel, etc.)',
      'Enlace funcional, con permisos públicos de acceso',
      'Navegabilidad e interactividad que permita validar la experiencia de usuario'
    ],
    levels: {
      estrategico: '9 - 10 pts: Prototipo digital interactivo de alta/media fidelidad, enlace funcional sin restricciones, flujo de usuario claro y coherente con BANG.',
      autonomo: '7 - 8 pts: Prototipo digital con pantallas completas y enlace activo, interactividad básica funcional.',
      basico: '5 - 6 pts: Prototipo estático (capturas simples), enlace con problemas de acceso o baja correspondencia con la propuesta de valor.',
      enDesarrollo: '0 - 4 pts: Sin prototipo digital, enlace roto o inaccesible, boceto no comprensible.'
    }
  },
  {
    id: 'c6',
    name: 'Coherencia, comunicación y uso responsable de IA',
    weight: 5,
    maxPoints: 5,
    description: 'Calidad formal de la entrega, claridad comunicativa y transparencia ética en el uso de herramientas de Inteligencia Artificial Generativa.',
    keyIndicators: [
      'Redacción impecable, ortografía, formato institucional Pasaporte de Ascenso',
      'Uso transparente y ético de la IA como copiloto analítico (bitácora de prompts/consultas)',
      'Evidencia de pensamiento crítico del estudiante sin delegar la autoría a la IA'
    ],
    levels: {
      estrategico: '5 pts: Presentación excelente; bitácora transparente de prompts de IA con evidencia clara de pensamiento crítico y análisis humano complementario.',
      autonomo: '4 pts: Buena redacción y estructura; reporta uso de IA con aportes propios evidentes.',
      basico: '3 pts: Entrega legible con errores menores de forma; mención vaga o superficial sobre el uso de IA.',
      enDesarrollo: '0 - 2 pts: Redacción descuidada o plagio/copia evidente y no mediada de respuestas de IA sin análisis.'
    }
  }
];

export const BANG_CHARACTERS = [
  {
    id: 'crispi',
    name: 'Crispi',
    role: 'Pensamiento Divergente & Ruptura',
    color: 'from-amber-500 to-orange-600',
    avatarBg: 'bg-orange-100 text-orange-800 border-orange-200',
    triggerPhrase: '¿Qué pasaría si hacemos lo opuesto?',
    description: 'Desafía las reglas convencionales, elimina restricciones, explora enfoques extremos y rompe paradigmas de la industria.',
    badge: 'Disruptivo'
  },
  {
    id: 'cori',
    name: 'Cori',
    role: 'Corazón, Empatía & Sostenibilidad',
    color: 'from-rose-500 to-pink-600',
    avatarBg: 'bg-pink-100 text-pink-800 border-pink-200',
    triggerPhrase: '¿Cómo cuidamos a las personas y al planeta?',
    description: 'Pone en el centro el dolor humano, la inclusión social, la regeneración ecológica y el propósito ético del emprendimiento.',
    badge: 'Empatía Social'
  },
  {
    id: 'cristal',
    name: 'Cristal',
    role: 'Lógica, Tecnología & Datos',
    color: 'from-sky-500 to-blue-600',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-200',
    triggerPhrase: '¿Qué dice la ciencia, la data y la viabilidad técnica?',
    description: 'Analiza la factibilidad técnica, automatización, algoritmos, sensores, infraestructura y precisión de procesos.',
    badge: 'Ciencia & Datos'
  },
  {
    id: 'cesia',
    name: 'Cesia',
    role: 'Experiencia de Usuario (UX) & Diseño',
    color: 'from-purple-500 to-indigo-600',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-200',
    triggerPhrase: '¿Cómo hacemos que sea intuitivo, bello y memorable?',
    description: 'Se enfoca en la estética, la simpleza, la reducción de fricción en la interacción y la satisfacción sensorial del usuario.',
    badge: 'UX / Diseño'
  },
  {
    id: 'carmel',
    name: 'Carmel',
    role: 'Modelo Comercial & Negocio',
    color: 'from-emerald-500 to-teal-600',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    triggerPhrase: '¿Cómo generamos ingresos sostenibles y alianzas clave?',
    description: 'Busca la viabilidad financiera, canales de monetización, escalabilidad comercial y modelos de alianzas estratégicas.',
    badge: 'Negocios'
  }
];

export const LEAN_CANVAS_BLOCKS = [
  { num: 1, name: '1. Problema', desc: 'Top 3 problemas y alternativas actuales' },
  { num: 2, name: '2. Segmentos de Clientes', desc: 'Usuarios objetivos y Early Adopters' },
  { num: 3, name: '3. Propuesta de Valor Única', desc: 'Mensaje claro y contundente de beneficio' },
  { num: 4, name: '4. Solución', desc: 'Top 3 características de la solución' },
  { num: 5, name: '5. Canales', desc: 'Rutas de comunicación y distribución' },
  { num: 6, name: '6. Fuentes de Ingresos', desc: 'Flujos de monetización y precio' },
  { num: 7, name: '7. Estructura de Costes', desc: 'Costos fijos, variables y de adquisición' },
  { num: 8, name: '8. Métricas Clave', desc: 'Indicadores clave de tracción' },
  { num: 9, name: '9. Ventaja Diferencial', desc: 'Ventaja competitiva difícil de copiar o comprar' }
];
