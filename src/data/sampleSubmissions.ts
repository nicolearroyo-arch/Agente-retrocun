import { SampleSubmission } from '../types';

export const SAMPLE_SUBMISSIONS: SampleSubmission[] = [
  {
    id: 'sample-1',
    title: 'AgroConecta Cundinamarca: Plataforma Logística y Comercial Directa para Campesinos',
    studentName: 'Equipo AgroInnovadores CUN (Laura Gómez, Carlos Méndez, Julián Rojas)',
    classGroup: 'Ficha 51189 - Emprendimiento e Innovación',
    expectedScore: '4.8 / 5.0 (Nivel Estratégico)',
    badgeType: 'success',
    description: 'Entrega sobresaliente con excelente observación de campo, diferenciación estricta usuario/cliente, 10 ideas BANG con matriz que suma 20 pts por criterio y prototipo navegable en Figma.',
    fullText: `UNIVERSIDAD CORPORACIÓN UNIFICADA NACIONAL DE EDUCACIÓN SUPERIOR (CUN)
PROGRAMA DE ADMINISTRACIÓN DE EMPRESAS / INGENIERÍA INDUSTRIAL
PASAPORTE DE ASCENSO - ENTREGA ACA ESPÍRITU EMPRENDEDOR E INNOVACIÓN
Proyecto: AgroConecta Cundinamarca
Integrantes: Laura Gómez, Carlos Méndez, Julián Rojas
Ficha: 51189 - Docente: Lic. María Alejandra Peña
Fecha: Noviembre 2026

============================================================
FASE 1: EXPLORACIÓN DEL CONTEXTO Y EL PROBLEMA
============================================================
1.1 ODS Seleccionados y Articulación con el Sector Agroalimentario:
- ODS 2: Hambre Cero (Meta 2.3: Duplicar la productividad agrícola y los ingresos de los productores de alimentos en pequeña escala).
- ODS 8: Trabajo Decente y Crecimiento Económico (Meta 8.3: Promover políticas orientadas al desarrollo que apoyen las actividades productivas y el empleo decente).
Articulación: El sector agrícola de la provincia de Oriente de Cundinamarca (municipios de Choachí, Ubaque y Fómeque) genera más del 35% de hortalizas para Bogotá, pero los productores perciben menos del 18% del precio final de venta al consumidor debido a 4 niveles de intermediación especulativa.

1.2 Señales y Noticias del Entorno:
- Señal 1 (Portafolio, Octubre 2026): "Los márgenes de intermediación en plazas mayoristas de Corabastos encarecieron los alimentos un 28% mientras los fletes rurales aumentaron un 15% por costos de combustible".
- Señal 2 (DANE - Boletín Técnico de Abastecimiento): "El 62% de los pequeños campesinos de Cundinamarca comercializa a crédito informal con pagos a 45 días sin garantías contractuales".

1.3 Observación de Campo Real:
El equipo realizó una jornada de observación presencial de 14 horas el 24 de octubre en la vereda El Hato (Choachí) y la plaza de mercado satélite. Registramos bitácora fotográfica y entrevistas semiestructuradas con 6 campesinos paperos y horticultores.
Hallazgo vivencial: Los campesinos se levantan a las 3:00 am a cargar bultos. Llega el transportador intermediario ("el patrón del camión") a las 5:30 am y fija unilateralmente el precio de la canastilla de tomate a $14.000 COP, aun cuando en el supermercado de barrio en Bogotá esa misma canastilla se comercializa a $65.000 COP. Si el campesino no acepta, el producto perece en 48 horas.

============================================================
FASE 2: COMPRENSIÓN DEL USUARIO, CLIENTE Y FORMULACIÓN DEL PROBLEMA
============================================================
2.1 Árbol de Problemas:
- Efectos (Ramas): Deserción del campo por jóvenes rurales, pérdidas poscosecha de hasta el 30%, endeudamiento con prestamistas informales ("gota a gota"), empobrecimiento sistemático familiar.
- Problema Central (Tronco): Inequidad crítica en la captura de valor y asimetría de información en la comercialización de cosechas perecederas de pequeños productores agrícolas en Cundinamarca.
- Causas Raíces (Raíces): Dependencia obligatoria de fletes no consolidados, ausencia de canal directo de venta digital adaptado a baja conectividad, falta de agregación de oferta entre veredas vecinas y liquidación tardía de pagos.

2.2 Radar del Usuario (Evidencias Reales):
- ¿Qué dicen?: Don Rigoberto (58 años, Choachí): "A uno le toca entregar la cebolla al precio que diga don Jaime el del camión, porque si no, se me pudre en el galpón y pierdo el abono".
- ¿Qué dificulta?: La imposibilidad de coordinar entregas directas con restaurantes y la desconfianza hacia transferencias digitales bancarias complejas.
- ¿Cuándo y dónde ocurre?: Todos los martes y jueves en la madrugada, en los puntos de acopio veredales sin señal telefónica estable.

2.3 Diferenciación Rigurosa: Usuario vs. Cliente:
- Usuario: Don Rigoberto y los 120 pequeños agricultores de la asociación AsoproHato. Ellos viven el dolor físico y la frustración diaria, interactúan con la interfaz sencilla por WhatsApp/SMS o punto de acopio.
- Cliente: Doña Patricia Salazar, propietaria de una red de 4 restaurantes campestres en Chía y Bogotá. Es quien toma la decisión financiera de compra, paga la factura institucional, exige trazabilidad y factura electrónica.

2.4 Reto de Innovación ("¿Cómo podríamos...?"):
"¿Cómo podríamos conectar de forma directa y consolidada la oferta de cosechas perecederas de pequeños agricultores de Cundinamarca con restaurantes gastronómicos de Bogotá, garantizando un precio justo pagado en 24 horas y logística compartida de última milla?"

============================================================
FASE 3: PROPUESTA DE VALOR E IDEACIÓN CON PERSONAJES BANG
============================================================
3.1 Generación de 10 Ideas con los 5 Personajes BANG:
- CRISPI (Disruptivo / ¿Qué pasaría si hacemos lo opuesto?):
  * Idea 1: Modelo "Cosecha Futura por Suscripción Inversa" donde el restaurante financia la siembra antes de cosechar a cambio de precio congelado.
  * Idea 2: Subasta silenciosa invertida en tiempo real desde el camión en movimiento.
- CORI (Corazón y Sostenibilidad / ¿Cómo cuidamos a las personas y al planeta?):
  * Idea 3: Cooperativa digital de canastas con sello social "Cero Intermediarios" y fondo de retiro para campesinos mayores.
  * Idea 4: Reducción de desperdicio con venta de producto "feo pero delicioso" para salsas y sopas en hoteles.
- CRISTAL (Lógica y Datos / ¿Qué dice la ciencia y la viabilidad técnica?):
  * Idea 5: Algoritmo de ruteo y consolidación de fletes vacíos de regreso Bogotá-Choachí para abaratar logística en un 40%.
  * Idea 6: Bot transaccional de WhatsApp conectado a base de datos PostgreSQL con alertas SMS sin requerir internet 4G.
- CESIA (Experiencia UX y Diseño / ¿Cómo lo hacemos intuitivo, bello y memorable?):
  * Idea 7: Interfaz visual guiada por iconos de voz e imágenes reales para agricultores no alfabetizados digitalmente.
  * Idea 8: Pasaporte de trazabilidad física con código QR en cada caja para que el comensal del restaurante conozca la historia del campesino.
- CARMEL (Modelo de Negocio / ¿Cómo generamos ingresos sostenibles y alianzas?):
  * Idea 9: Modelo de suscripción B2B con cobro de comisión del 7% por transacción exitosa a restaurantes (los campesinos pagan 0%).
  * Idea 10: Alianza estratégica con gasolineras Terpel rurales como micro-centros de acopio y pesaje certificado.

3.2 Matriz de Evaluación BANG (Distribución Estricta de 20 Puntos por Fila):
Fila 1 - Viabilidad Comercial (Suma = 20 pts):
  Idea 1: 2 | Idea 2: 1 | Idea 3: 2 | Idea 4: 2 | Idea 5: 3 | Idea 6: 2 | Idea 7: 1 | Idea 8: 1 | Idea 9: 4 | Idea 10: 2  [Total fila: 20 pts]
Fila 2 - Factibilidad Técnica (Suma = 20 pts):
  Idea 1: 1 | Idea 2: 1 | Idea 3: 2 | Idea 4: 2 | Idea 5: 4 | Idea 6: 4 | Idea 7: 2 | Idea 8: 1 | Idea 9: 2 | Idea 10: 1  [Total fila: 20 pts]
Fila 3 - Deseabilidad del Usuario (Suma = 20 pts):
  Idea 1: 2 | Idea 2: 1 | Idea 3: 3 | Idea 4: 2 | Idea 5: 3 | Idea 6: 3 | Idea 7: 3 | Idea 8: 1 | Idea 9: 1 | Idea 10: 1  [Total fila: 20 pts]
SUMATORIA TOTAL DE LA MATRIZ: 60 PUNTOS (Regla de 20 puntos por fila cumplida estrictamente).

3.3 Idea Ganadora, Propuesta de Valor y Tipo de Innovación:
- Nombre Comercial: AgroConecta Cundinamarca
- Síntesis Integrada: Integración de Ideas 5, 6 y 9 (Ruteo de fletes compartidos + Bot WhatsApp accesible + Monetización B2B con restaurantes).
- Propuesta de Valor: "Abastecimiento agrícola directo de campo a mesa en menos de 12 horas, con 30% mayor rentabilidad para el campesino mediante pago en 24 horas y 18% de ahorro en insumos frescos certificados para restaurantes".
- Tipo de Innovación: Innovación en Modelo de Negocio y Cadena de Valor (Disrupción logística y desintermediación con impacto social medible).

============================================================
FASE 4: LEAN CANVAS (LOS 9 BLOQUES)
============================================================
1. Problema: Precios de liquidación injustos a campesinos, fletes costosos, mermas poscosecha del 30%. Alternativas: Corabastos, intermediarios tradicionales.
2. Segmento de Clientes: Restaurantes gourmet y campestres de Bogotá/Sabana (Clientes B2B) y 120 pequeños agricultores de hortalizas en Cundinamarca (Usuarios). Early adopters: Asociación AsoproHato.
3. Propuesta de Valor Única: "Cosechas frescas del campo a tu cocina en 12 horas, a precio justo y sin intermediarios abusivos".
4. Solución: Plataforma de consolidación de pedidos, logística colaborativa de retorno y billetera digital comunitaria con desembolso en 24h.
5. Canales: WhatsApp Business API para campesinos, Web App B2B para pedidos de restaurantes, puntos de acopio en veredas aliadas.
6. Fuentes de Ingresos: Comisión del 8% a restaurantes sobre el valor facturado, suscripción premium a restaurantes para reportes de trazabilidad ($120.000 COP/mes).
7. Estructura de Costes: Servidores en la nube, personal de control de calidad en acopio, póliza de transporte, pasarela de pago Wompi.
8. Métricas Clave: Toneladas métricas comercializadas por mes, tiempo promedio de pago al campesino (<24 horas), tasa de retención de restaurantes (>85%).
9. Ventaja Diferencial: Red consolidada de confianza con la asociación veredal AsoproHato con acuerdos de exclusividad de cosecha temprana y optimización algorítmica de fletes rurales de retorno.

============================================================
FASE 5: PROTOTIPO DIGITAL
============================================================
- Herramienta: Figma Interactive Prototype (Media y Alta Fidelidad).
- Enlace al Prototipo: https://www.figma.com/proto/agroconecta-cun-sample/prototype-flow?node-id=101-445&scaling=scale-down&starting-point-node-id=101%3A445
- Descripción del Flujo:
  1. Pantalla Campesino (Modo Bot de WhatsApp): Registro de cosecha mediante foto y notas de audio, confirmación de pesaje y notificación de pago bancario en línea.
  2. Pantalla Restaurante (Dashboard Web B2B): Catálogo de productos disponibles con fotos reales de la finca, selección de horario de entrega matutina y pago contra entrega o crédito a 15 días.
  3. Prueba de Usabilidad: Realizada con Don Rigoberto y Doña Patricia. Tasa de éxito de tarea del 100% en 3 minutos.

============================================================
FASE 6: COHERENCIA, COMUNICACIÓN Y USO RESPONSABLE DE IA
============================================================
- Bitácora de Prompts IA:
  * Prompt 1 (Gemini): "Actúa como un experto en logística agrícola de Colombia. Analiza las principales ineficiencias de los fletes de retorno entre Choachí y Corabastos".
  * Evaluación Crítica del Equipo: La IA sugirió almacenamiento en frío con nitrógeno, lo cual descartamos por inviable para pequeños campesinos. En su lugar, adoptamos la consolidación de fletes vacíos en camionetas existentes.
  * Declaración Ética: La IA fue usada exclusivamente como copiloto de lluvia de ideas y simulación matemática de fletes; todo el trabajo de campo, entrevistas y prototipado fue ejecutado presencialmente por los integrantes del equipo CUN.`
  },
  {
    id: 'sample-2',
    title: 'EcoModa Circular CUN: Ropa Universitaria con Fibras de PET Reciclado',
    studentName: 'Equipo ModaVerde (Valentina Silva, Andrés Pardo)',
    classGroup: 'Ficha 51204 - Emprendimiento e Innovación',
    expectedScore: '3.4 / 5.0 (Nivel Básico con Oportunidades Claras)',
    badgeType: 'warning',
    description: 'Trabajo interesante pero con debilidades comunes: la matriz BANG no suma 20 puntos por fila (repite 20 en todas las columnas), radar con pocos testimonios y ventaja diferencial genérica.',
    fullText: `PROYECTO: EcoModa Circular CUN
INTEGRANTES: Valentina Silva, Andrés Pardo
Ficha: 51204

1. CONTEXTO Y PROBLEMA
- ODS: Elegimos el ODS 12 (Producción y consumo responsables).
- Señal del entorno: Vimos en redes sociales que la industria textil contamina mucho y que el fast fashion genera toneladas de ropa que terminan en el desierto de Atacama.
- Observación de campo: Hicimos una encuesta de Google Forms a 25 compañeros de la universidad CUN en la sede centro. El 80% dijo que le gustaría comprar ropa sostenible si fuera económica.

2. COMPRENSIÓN DEL USUARIO Y ÁRBOL DE PROBLEMAS
- Problema central: La ropa sostenible es muy cara para los estudiantes universitarios.
- Causas: Materias primas caras, pocas marcas locales.
- Efectos: Los estudiantes siguen comprando en tiendas de ropa barata desechable.
- Usuario y Cliente: Son los mismos, los estudiantes universitarios de la CUN que compran y usan las camisetas.
- Reto de innovación: "¿Cómo podríamos hacer una tienda de ropa para estudiantes con telas recicladas baratas?" (Nota: Plantea la solución en la pregunta).

3. PROPUESTA DE VALOR E IDEACIÓN BANG
Ideas generadas con los personajes:
- Crispi: Ropa que se pueda canjear por horas de fotocopias o créditos en la universidad.
- Cori: Camisetas hechas con reciclaje de botellas plásticas recogidas en los contenedores de la CUN.
- Cristal: Usar hilo con 60% algodón orgánico y 40% poliéster reciclado de PET.
- Cesia: Diseños con estampados creativos alusivos a las carreras de la CUN.
- Carmel: Poner un estand en la semana universitaria para vender al detal a $35.000 COP.
(El equipo presentó solo 5 ideas en lugar de 10).

Matriz de Evaluación:
- Viabilidad: Idea 1 (15 pts), Idea 2 (18 pts), Idea 3 (12 pts), Idea 4 (10 pts), Idea 5 (16 pts). [Suma: 71 puntos - ERROR: No cumple la regla de sumar 20 puntos en la fila].
- Factibilidad: Idea 1 (10 pts), Idea 2 (15 pts), Idea 3 (10 pts), Idea 4 (15 pts), Idea 5 (12 pts). [Suma: 62 puntos].
- Deseabilidad: Idea 1 (18 pts), Idea 2 (20 pts), Idea 3 (14 pts), Idea 4 (16 pts), Idea 5 (18 pts). [Suma: 86 puntos].
Propuesta de valor: "Camisetas ecológicas juveniles para que vistas bien y cuides el planeta".
Tipo de innovación: Innovación de producto.

4. LEAN CANVAS
- Problema: Ropa contaminante y cara.
- Segmentos: Estudiantes universitarios de Bogotá de 18 a 26 años.
- Propuesta de valor: Camisetas de PET reciclado baratas y a la moda.
- Solución: Venta de prendas de vestir ecológicas.
- Canales: Instagram y TikTok.
- Estructura de costes: Compra de tela reciclada, confección y estampados.
- Fuentes de ingresos: Venta de cada camiseta a $35.000 COP en efectivo o Nequi.
- Métricas clave: Número de camisetas vendidas al mes.
- Ventaja diferencial: "Nuestra excelente atención al cliente y la pasión que le ponemos a cada prenda". (Debilidad metodológica: no es una ventaja diferencial inalcanzable).

5. PROTOTIPO
- Enlace Canva: https://www.canva.com/design/DAFexample/mockup-camisetas (Presenta 3 imágenes estáticas de camisetas con logos, sin navegación interactiva ni flujo de compra).

6. USO DE IA
- Usamos ChatGPT para redactar la justificación del problema. Nos ayudó a mejorar el texto.`
  },
  {
    id: 'sample-3',
    title: 'FastDelivery Campus: Envíos Rápidos de Fotocopias y Almuerzos',
    studentName: 'Juan Pablo Martínez',
    classGroup: 'Ficha 51210',
    expectedScore: '2.2 / 5.0 (Nivel En Desarrollo - Requiere Reestructuración)',
    badgeType: 'danger',
    description: 'Entrega muy incompleta: sin ODS seleccionados, sin trabajo de campo, personajes BANG omitidos, matriz sin criterio metodológico y prototipo inexistente.',
    fullText: `ENTREGA ACA 1 Y 2
Estudiante: Juan Pablo Martínez
Proyecto: FastDelivery Campus

1. Problema:
En los descansos hay mucha fila en la cafetería y en las fotocopiadoras de la sede CUN. Los estudiantes pierden hasta 20 minutos esperando que les atiendan y a veces llegan tarde a la siguiente clase.

2. Solución y propuesta:
Vamos a crear una aplicación móvil donde el estudiante pide su sándwich o sus copias antes de salir de clase, y otros estudiantes que estén libres se lo llevan al salón cobrando un recargo de $1.500 pesos por domicilio.

3. Ideación:
Se nos ocurrieron varias ideas:
- Una app móvil.
- Un grupo de WhatsApp comunitario.
- Poner casilleros con clave.
La idea ganadora es la app porque todo el mundo tiene celular hoy en día.

4. Modelo de negocio:
Le cobramos $500 pesos al de la cafetería por cada pedido y $1.000 pesos al estudiante que recibe el domicilio. Los costos son la publicidad y pagarle a un programador para que haga la app.

5. Prototipo:
No alcanzamos a terminar el prototipo en Figma por problemas de tiempo, pero en el informe adjuntamos dos dibujos a lápiz en un cuaderno mostrando cómo se vería la pantalla de inicio.`
  }
];
