/**
 * ==============================================================================
 * CyberAI Decision - Lógica de Simulación, Tutoriales y Control de Interfaz
 * Proyecto Académico: "Inteligencia Artificial aplicada a la toma de decisiones en ciberseguridad"
 * Carrera: Ingeniería Informática
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. REFERENCIAS AL DOM ---
  const securityForm = document.getElementById('securityEventForm');
  const failedAttemptsInput = document.getElementById('failedAttempts');
  const btnDecrement = document.getElementById('btnDecrement');
  const btnIncrement = document.getElementById('btnIncrement');
  const eventTypeSelect = document.getElementById('eventType');
  const btnReset = document.getElementById('btnReset');

  // Elementos de visualización del resultado
  const resultCard = document.getElementById('resultCard');
  const scoreNumber = document.getElementById('scoreNumber');
  const gaugeCircle = document.getElementById('gaugeCircle');
  const riskLevelTag = document.getElementById('riskLevelTag');
  const progressBarFill = document.getElementById('progressBarFill');
  const recommendationBox = document.getElementById('recommendationBox');
  const recIconWrap = document.getElementById('recIconWrap');
  const recTitle = document.getElementById('recTitle');
  const recommendationText = document.getElementById('recommendationText');
  const recActionBadge = document.getElementById('recActionBadge');
  const factorsList = document.getElementById('factorsList');
  const totalPointsBadge = document.getElementById('totalPointsBadge');

  // Navegación y Menú Móvil
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Botones de Escenarios Preconfigurados (Presets)
  const presetButtons = document.querySelectorAll('.btn-preset');

  // Modal Tutorial (?)
  const tutorialModalBackdrop = document.getElementById('tutorialModalBackdrop');
  const btnModalClose = document.getElementById('btnModalClose');
  const btnModalGotIt = document.getElementById('btnModalGotIt');
  const modalSectionBadge = document.getElementById('modalSectionBadge');
  const modalTutorialTitle = document.getElementById('modalTutorialTitle');
  const modalSectionPurpose = document.getElementById('modalSectionPurpose');
  const modalStepsList = document.getElementById('modalStepsList');
  const modalTipText = document.getElementById('modalTipText');
  const helpButtons = document.querySelectorAll('.help-btn');

  // Constante para el perímetro del círculo SVG (Radio = 74 -> 2 * PI * 74 = 464.95)
  const CIRCLE_CIRCUMFERENCE = 465;

  // Estado previo del puntaje para animación de conteo
  let currentAnimatedScore = 0;
  let lastActiveElement = null;

  // --- 2. BASE DE CONOCIMIENTO DE TUTORIALES POR SECCIÓN (?) ---
  const TUTORIALS_DATA = {
    hero: {
      badge: 'SECCIÓN 1: HERO / PORTADA',
      title: 'Tutorial: Portada y Telemetría SOC',
      purpose: 'Presenta el marco académico de Ingeniería Informática y simula la vista en tiempo real de un Centro de Operaciones de Seguridad (SOC).',
      steps: [
        'Observa el <strong>radar de telemetría</strong> a la derecha: simula el escaneo continuo de tráfico de red y detección de anomalías.',
        'Haz clic en <strong>“Probar simulación”</strong> para saltar directamente al formulario interactivo de análisis.',
        'O haz clic en <strong>“Conocer el proyecto”</strong> para revisar el planteamiento del problema operativo.'
      ],
      tip: 'Menciona a tu evaluador que el sistema simula un entorno SOC empresarial donde se reciben miles de eventos heterogéneos cada minuto.'
    },

    problema: {
      badge: 'SECCIÓN 2: EL PROBLEMA',
      title: 'Tutorial: El Desafío de la Ciberseguridad',
      purpose: 'Justifica por qué es necesario incorporar modelos analíticos e Inteligencia Artificial en entornos informáticos modernos.',
      steps: [
        'Revisa las 3 tarjetas de análisis: <strong>Demasiados eventos</strong> (volumen masivo), <strong>Riesgos difíciles de detectar</strong> (correlación compleja) y <strong>Decisiones rápidas</strong> (priorización).',
        'Pasa el cursor sobre cada tarjeta para apreciar el efecto de elevación y luminosidad glassmorphism.'
      ],
      tip: 'Explica el concepto de “fatiga de alertas”: los analistas humanos no pueden revisar manualmente miles de logs sin cometer errores o retrasarse.'
    },

    'como-ayuda': {
      badge: 'SECCIÓN 3: ¿CÓMO AYUDA LA IA?',
      title: 'Tutorial: Pipeline de Procesamiento Inteligente',
      purpose: 'Ilustra conceptualmente las 5 fases en las que la IA transforma datos brutos en recomendaciones para la toma de decisiones.',
      steps: [
        'Sigue la secuencia de pasos: <strong>01 DATOS ➔ 02 ANÁLISIS ➔ 03 NIVEL DE RIESGO ➔ 04 RECOMENDACIÓN ➔ 05 DECISIÓN</strong>.',
        'Fíjate en el paso 05 con borde verde esmeralda: resalta la participación indispensable de la persona responsable.',
        'Lee el recuadro inferior sobre el principio <strong>Human-in-the-Loop</strong>.'
      ],
      tip: 'Enfatiza fuertemente en tu evaluación que la IA NO toma la decisión de forma autónoma, sino que actúa como copiloto analítico del profesional de seguridad.'
    },

    simulador: {
      badge: 'SECCIÓN 4: SIMULADOR INTERACTIVO',
      title: 'Tutorial: Uso del Simulador de Eventos',
      purpose: 'Permite experimentar de forma práctica cómo los diferentes parámetros de seguridad alteran la puntuación ponderada de riesgo.',
      steps: [
        '<strong>Atajo rápido:</strong> Prueba los botones superiores (⚡ Ataque Fuerza Bruta, 🌙 Intrusión Nocturna, 🛡️ Acceso Normal) para rellenar datos automáticamente.',
        '<strong>Entrada manual:</strong> Usa los botones <strong>+</strong> y <strong>-</strong> para fijar los intentos fallidos (inicial: 3).',
        'Elige si proviene de dispositivo desconocido (Sí/No), ubicación inusual (Sí/No) o fuera de horario (Sí/No).',
        'Selecciona el tipo de evento en el desplegable (ej. Acceso a información sensible aporta +15 pts).',
        'Presiona <strong>“Analizar evento”</strong> para calcular el resultado en tiempo real.'
      ],
      tip: 'Para impresionar en tu defensa, activa todos los factores de riesgo a la vez (>10 intentos, dispositivo desconocido, ubicación inusual, fuera de horario y acceso sensible) y muestra cómo el score se limita matemáticamente a 100 puntos (Riesgo Crítico).'
    },

    resultado: {
      badge: 'SECCIONES 5 Y 6: RESULTADO & EXPLICACIÓN',
      title: 'Tutorial: Medidor de Riesgo y Explicabilidad (XAI)',
      purpose: 'Muestra visualmente la severidad del evento y desglosa de manera transparente cómo se calculó cada punto.',
      steps: [
        'Observa el <strong>medidor circular SVG</strong> con el número animado de 0 a 100.',
        'Comprueba la escala de 4 niveles: <strong>Bajo (0-29)</strong>, <strong>Medio (30-59)</strong>, <strong>Alto (60-79)</strong> y <strong>Crítico (80-100)</strong>.',
        'Lee la <strong>Recomendación Asistida</strong> y la acción táctica sugerida (ej. solicitud de 2FA o aislamiento).',
        'Revisa la lista inferior <strong>“¿Cómo llegó a esta recomendación?”</strong> para auditar cada factor detectado.',
        'Usa el botón <strong>“Nuevo análisis”</strong> para resetear el simulador al estado inicial.'
      ],
      tip: 'Destaca ante tu docente que esta pantalla aplica los principios de IA Explicable (XAI), evitando ser una “caja negra” y permitiendo auditar el por qué de la sugerencia.'
    },

    comparativa: {
      badge: 'SECCIÓN 7: COMPARATIVA',
      title: 'Tutorial: Métodos Tradicionales vs Soporte con IA',
      purpose: 'Compara de manera estructurada las debilidades del análisis manual frente a las ventajas del procesamiento inteligente.',
      steps: [
        'Examina la columna izquierda roja (Método Tradicional: demoras, fatiga de alertas, omisión de ataques distribuidos).',
        'Contrasta con la columna derecha azul (Enfoque Moderno: correlación masiva, priorización objetiva y trazabilidad).',
        'Lee la aclaración sobre no asumir infalibilidad ciega en modelos computacionales.'
      ],
      tip: 'Comenta que la ventaja competitiva de la IA en Ingeniería Informática radica en la velocidad de correlación multivariable, liberando tiempo humano para tareas estratégicas.'
    },

    conclusion: {
      badge: 'SECCIÓN 8: CONCLUSIÓN',
      title: 'Tutorial: Síntesis Académica del Proyecto',
      purpose: 'Resume la visión integral del papel de la Inteligencia Artificial en la carrera de Ingeniería Informática.',
      steps: [
        'Lee la cita formal que sintetiza la colaboración socio-técnica entre el profesional y los sistemas inteligentes.',
        'Observa los dos distintivos inferiores relativos a la colaboración Humano + IA y la optimización de tiempos en el SOC.'
      ],
      tip: 'Esta conclusión te servirá como guion perfecto para el cierre o conclusión de tu exposición oral ante el tribunal docente.'
    },

    proyecto: {
      badge: 'SECCIÓN 9: SOBRE EL PROYECTO',
      title: 'Tutorial: Ficha Técnica y Curricular',
      purpose: 'Expone la información institucional de la evaluación, objetivos curriculares y características de arquitectura del software.',
      steps: [
        'Verifica los campos de Carrera (Ingeniería Informática), Área y Objetivo formativo.',
        'Comprueba los distintivos tecnológicos: HTML5 Semántico, CSS3 Vanilla, JavaScript ES6+ sin librerías externas y compatibilidad total con GitHub Pages/Netlify.'
      ],
      tip: 'Resalta que todo el desarrollo se hizo con estándares nativos del navegador, garantizando rendimiento ligero, portabilidad inmediata y código accesible.'
    }
  };

  // --- 3. CONFIGURACIÓN DE ESCENARIOS PREDEFINIDOS ---
  const PRESET_SCENARIOS = {
    bruteForce: {
      attempts: 12,
      unknownDevice: 'si',
      unusualLocation: 'si',
      offHours: 'no',
      eventType: 'login_sospechoso'
    },
    nightAccess: {
      attempts: 4,
      unknownDevice: 'si',
      unusualLocation: 'no',
      offHours: 'si',
      eventType: 'acceso_sensible'
    },
    routine: {
      attempts: 1,
      unknownDevice: 'no',
      unusualLocation: 'no',
      offHours: 'no',
      eventType: 'login_sospechoso'
    }
  };

  // --- 4. MOTOR DE REGLAS DE CIBERSEGURIDAD (SIMULACIÓN DE IA) ---
  function calculateRiskScore(data) {
    let totalScore = 0;
    const factors = [];

    // A. Puntuación por intentos fallidos
    const attempts = parseInt(data.failedAttempts, 10) || 0;
    let attemptsPoints = 0;
    let attemptsLabel = '';

    if (attempts <= 2) {
      attemptsPoints = 5;
      attemptsLabel = `${attempts} intento(s) fallido(s) (Nivel bajo: 0-2)`;
    } else if (attempts <= 5) {
      attemptsPoints = 15;
      attemptsLabel = `${attempts} intentos fallidos (Rango moderado: 3-5)`;
    } else if (attempts <= 10) {
      attemptsPoints = 25;
      attemptsLabel = `${attempts} intentos fallidos (Rango anómalo: 6-10)`;
    } else {
      attemptsPoints = 35;
      attemptsLabel = `${attempts} intentos fallidos (Posible fuerza bruta: >10)`;
    }

    totalScore += attemptsPoints;
    factors.push({
      name: attemptsLabel,
      points: attemptsPoints
    });

    // B. Dispositivo desconocido
    if (data.unknownDevice === 'si') {
      const pts = 20;
      totalScore += pts;
      factors.push({
        name: 'Dispositivo desconocido no registrado en inventario',
        points: pts
      });
    }

    // C. Ubicación inusual
    if (data.unusualLocation === 'si') {
      const pts = 20;
      totalScore += pts;
      factors.push({
        name: 'Acceso desde ubicación geográfica inusual',
        points: pts
      });
    }

    // D. Fuera de horario
    if (data.offHours === 'si') {
      const pts = 15;
      totalScore += pts;
      factors.push({
        name: 'Acceso ocurrido fuera del horario habitual',
        points: pts
      });
    }

    // E. Tipo de evento con impacto en datos sensibles
    if (data.eventType === 'acceso_sensible') {
      const pts = 15;
      totalScore += pts;
      factors.push({
        name: 'Acceso a información sensible',
        points: pts
      });
    }

    // Límite máximo en 100 puntos
    const finalScore = Math.min(totalScore, 100);

    return {
      score: finalScore,
      rawScore: totalScore,
      factors: factors
    };
  }

  // --- 5. CLASIFICACIÓN DE RIESGO Y RECOMENDACIÓN DINÁMICA ---
  function getRiskClassification(score) {
    if (score <= 29) {
      return {
        level: 'RIESGO BAJO',
        tagClass: 'risk-tag-low',
        color: '#10b981',
        title: 'Nivel Operativo Aceptable',
        recommendation: 'Continuar monitoreando el evento. No se identifican suficientes señales para una intervención inmediata.',
        action: 'Acción sugerida: Registrar telemetría habitual y mantener monitoreo pasivo.',
        iconSvg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"></polyline>`
      };
    } else if (score <= 59) {
      return {
        level: 'RIESGO MEDIO',
        tagClass: 'risk-tag-med',
        color: '#f59e0b',
        title: 'Atención Requerida - Verificación Preventiva',
        recommendation: 'Se recomienda revisar el evento y verificar la identidad del usuario.',
        action: 'Acción sugerida: Solicitar desafío de autenticación en dos factores (2FA) o confirmación por canal alterno.',
        iconSvg: `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>`
      };
    } else if (score <= 79) {
      return {
        level: 'RIESGO ALTO',
        tagClass: 'risk-tag-high',
        color: '#f97316',
        title: 'Alerta Prioritaria de Seguridad',
        recommendation: 'Se recomienda realizar una verificación adicional y revisar los registros de acceso.',
        action: 'Acción sugerida: Auditoría inmediata de logs en el SIEM y revocación preventiva de sesiones activas.',
        iconSvg: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`
      };
    } else {
      return {
        level: 'RIESGO CRÍTICO',
        tagClass: 'risk-tag-crit',
        color: '#ef4444',
        title: 'Incidente Crítico - Respuesta Inmediata',
        recommendation: 'Se recomienda priorizar la investigación del evento, verificar el acceso y considerar medidas de contención según las políticas de seguridad.',
        action: 'Acción sugerida: Bloqueo inmediato de cuenta, aislamiento preventivo del endpoint y apertura de ticket SOC.',
        iconSvg: `<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`
      };
    }
  }

  // --- 6. ANIMACIÓN Y ACTUALIZACIÓN VISUAL ---
  function animateScoreCounter(targetScore) {
    const duration = 650;
    const startScore = currentAnimatedScore;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startScore + (targetScore - startScore) * easeOut);

      scoreNumber.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        scoreNumber.textContent = targetScore;
        currentAnimatedScore = targetScore;
      }
    }

    requestAnimationFrame(update);
  }

  function renderAnalysis(analysisResult) {
    const { score, factors } = analysisResult;
    const classification = getRiskClassification(score);

    animateScoreCounter(score);

    const offset = CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * score) / 100;
    gaugeCircle.style.strokeDashoffset = offset;
    gaugeCircle.style.stroke = classification.color;

    progressBarFill.style.width = `${score}%`;
    progressBarFill.style.backgroundColor = classification.color;

    riskLevelTag.className = `gauge-status-tag ${classification.tagClass}`;
    riskLevelTag.textContent = classification.level;

    resultCard.style.borderTopColor = classification.color;

    recTitle.textContent = classification.title;
    recommendationText.textContent = classification.recommendation;
    recActionBadge.querySelector('span').textContent = classification.action;

    recIconWrap.style.backgroundColor = `${classification.color}20`;
    recIconWrap.style.borderColor = `${classification.color}50`;
    recIconWrap.style.color = classification.color;
    recIconWrap.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${classification.iconSvg}
      </svg>
    `;

    factorsList.innerHTML = '';
    factors.forEach(f => {
      const li = document.createElement('li');
      li.className = 'factor-item';
      li.innerHTML = `
        <span class="factor-name">
          <span class="factor-check">✓</span>
          ${escapeHtml(f.name)}
        </span>
        <span class="factor-points">+${f.points} pts</span>
      `;
      factorsList.appendChild(li);
    });

    totalPointsBadge.textContent = `${score} / 100`;
  }

  // --- 7. FORMULARIO & SANITIZACIÓN ---
  function getFormData() {
    const failedAttempts = Math.max(0, parseInt(failedAttemptsInput.value, 10) || 0);
    const unknownDevice = document.querySelector('input[name="unknownDevice"]:checked')?.value || 'no';
    const unusualLocation = document.querySelector('input[name="unusualLocation"]:checked')?.value || 'no';
    const offHours = document.querySelector('input[name="offHours"]:checked')?.value || 'no';
    const eventType = eventTypeSelect.value;

    return {
      failedAttempts,
      unknownDevice,
      unusualLocation,
      offHours,
      eventType
    };
  }

  function setFormData(data) {
    failedAttemptsInput.value = data.attempts;

    const deviceRadio = document.querySelector(`input[name="unknownDevice"][value="${data.unknownDevice}"]`);
    if (deviceRadio) deviceRadio.checked = true;

    const locationRadio = document.querySelector(`input[name="unusualLocation"][value="${data.unusualLocation}"]`);
    if (locationRadio) locationRadio.checked = true;

    const hoursRadio = document.querySelector(`input[name="offHours"][value="${data.offHours}"]`);
    if (hoursRadio) hoursRadio.checked = true;

    eventTypeSelect.value = data.eventType;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 8. GESTIÓN DEL MODAL TUTORIAL (?) ---
  function openTutorial(sectionKey) {
    const data = TUTORIALS_DATA[sectionKey];
    if (!data) return;

    lastActiveElement = document.activeElement;

    modalSectionBadge.textContent = data.badge;
    modalTutorialTitle.textContent = data.title;
    modalSectionPurpose.textContent = data.purpose;
    modalTipText.textContent = data.tip;

    modalStepsList.innerHTML = '';
    data.steps.forEach(stepText => {
      const li = document.createElement('li');
      li.innerHTML = stepText;
      modalStepsList.appendChild(li);
    });

    tutorialModalBackdrop.classList.add('active');
    tutorialModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    btnModalClose.focus();
  }

  function closeTutorial() {
    tutorialModalBackdrop.classList.remove('active');
    tutorialModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Eventos de los botones de ayuda (?)
  helpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sectionKey = btn.getAttribute('data-help');
      openTutorial(sectionKey);
    });
  });

  btnModalClose.addEventListener('click', closeTutorial);
  btnModalGotIt.addEventListener('click', closeTutorial);

  // Cerrar al hacer clic en el backdrop
  tutorialModalBackdrop.addEventListener('click', (e) => {
    if (e.target === tutorialModalBackdrop) {
      closeTutorial();
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tutorialModalBackdrop.classList.contains('active')) {
      closeTutorial();
    }
  });

  // --- 9. EVENT LISTENERS GENERALES ---

  // Envío del Formulario
  securityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData();
    const result = calculateRiskScore(data);
    renderAnalysis(result);

    if (window.innerWidth < 1024) {
      document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Incremento y decremento
  btnDecrement.addEventListener('click', () => {
    let val = parseInt(failedAttemptsInput.value, 10) || 0;
    if (val > 0) {
      failedAttemptsInput.value = val - 1;
    }
  });

  btnIncrement.addEventListener('click', () => {
    let val = parseInt(failedAttemptsInput.value, 10) || 0;
    if (val < 50) {
      failedAttemptsInput.value = val + 1;
    }
  });

  failedAttemptsInput.addEventListener('input', () => {
    let val = parseInt(failedAttemptsInput.value, 10);
    if (isNaN(val) || val < 0) {
      failedAttemptsInput.value = 0;
    } else if (val > 50) {
      failedAttemptsInput.value = 50;
    }
  });

  // Botón "Nuevo análisis" (Reset)
  btnReset.addEventListener('click', () => {
    setFormData({
      attempts: 3,
      unknownDevice: 'no',
      unusualLocation: 'no',
      offHours: 'no',
      eventType: 'login_sospechoso'
    });

    const data = getFormData();
    const result = calculateRiskScore(data);
    renderAnalysis(result);

    securityForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    failedAttemptsInput.focus();
  });

  // Presets rápidos
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      if (PRESET_SCENARIOS[presetKey]) {
        setFormData(PRESET_SCENARIOS[presetKey]);
        const data = getFormData();
        const result = calculateRiskScore(data);
        renderAnalysis(result);
      }
    });
  });

  // Navegación móvil
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    }
  });

  // ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // --- 10. EJECUCIÓN INICIAL AL CARGAR ---
  const initialData = getFormData();
  const initialResult = calculateRiskScore(initialData);
  renderAnalysis(initialResult);
});
