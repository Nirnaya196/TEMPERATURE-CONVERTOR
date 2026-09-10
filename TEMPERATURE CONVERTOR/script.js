/**
 * TempFlux — Modern Real-Time Temperature Converter Suite
 * Core Application Engine & Scientific Calculations
 */

(() => {
  'use strict';

  // --- Configuration & Constants ---
  const STORAGE_KEY_HISTORY = 'tempflux_history_v1';
  const STORAGE_KEY_THEME = 'tempflux_theme_v1';
  const STORAGE_KEY_SOUND = 'tempflux_sound_enabled';

  // Scale Definitions & Metadata
  const SCALES = {
    celsius: {
      name: 'Celsius',
      symbol: '°C',
      toBase: c => c,
      fromBase: c => c,
      minPhysical: -273.15,
      waterFreeze: 0,
      waterBoil: 100,
    },
    fahrenheit: {
      name: 'Fahrenheit',
      symbol: '°F',
      toBase: f => (f - 32) * (5 / 9),
      fromBase: c => (c * (9 / 5)) + 32,
      minPhysical: -459.67,
      waterFreeze: 32,
      waterBoil: 212,
    },
    kelvin: {
      name: 'Kelvin',
      symbol: 'K',
      toBase: k => k - 273.15,
      fromBase: c => c + 273.15,
      minPhysical: 0,
      waterFreeze: 273.15,
      waterBoil: 373.15,
    },
    rankine: {
      name: 'Rankine',
      symbol: '°R',
      toBase: r => (r - 491.67) * (5 / 9),
      fromBase: c => (c + 273.15) * (9 / 5),
      minPhysical: 0,
      waterFreeze: 491.67,
      waterBoil: 671.67,
    },
    reaumur: {
      name: 'Réaumur',
      symbol: '°Ré',
      toBase: re => re * (5 / 4),
      fromBase: c => c * (4 / 5),
      minPhysical: -218.52,
      waterFreeze: 0,
      waterBoil: 80,
    },
    newton: {
      name: 'Newton',
      symbol: '°N',
      toBase: n => n * (100 / 33),
      fromBase: c => c * (33 / 100),
      minPhysical: -90.14,
      waterFreeze: 0,
      waterBoil: 33,
    },
    delisle: {
      name: 'Delisle',
      symbol: '°De',
      toBase: de => 100 - (de * (2 / 3)),
      fromBase: c => (100 - c) * (3 / 2),
      minPhysical: -409.72,
      waterFreeze: 150,
      waterBoil: 0,
    }
  };

  // --- State ---
  const state = {
    fromValue: 25,
    fromUnit: 'celsius',
    toUnit: 'fahrenheit',
    precision: 2,
    soundEnabled: true,
    theme: 'dark',
    history: []
  };

  // --- DOM Element Selectors ---
  const elements = {
    // Inputs & Selects
    fromValue: document.getElementById('from-value'),
    fromUnit: document.getElementById('from-unit'),
    toUnit: document.getElementById('to-unit'),
    fromUnitSymbol: document.getElementById('from-unit-symbol'),
    toUnitSymbol: document.getElementById('to-unit-symbol'),
    clearInputBtn: document.getElementById('clear-input-btn'),
    swapUnitsBtn: document.getElementById('swap-units-btn'),
    decimalSelect: document.getElementById('decimal-select'),
    tempSlider: document.getElementById('temp-range-slider'),
    sliderBadge: document.getElementById('slider-badge'),
    
    // Output & Actions
    resultValue: document.getElementById('result-value'),
    resultUnitTag: document.getElementById('result-unit-tag'),
    copyResultBtn: document.getElementById('copy-result-btn'),
    
    // Formula Breakdown
    formulaEquation: document.getElementById('formula-equation'),
    formulaSteps: document.getElementById('formula-steps'),
    formulaBadge: document.getElementById('formula-badge'),
    
    // Visual Thermometer & Readout
    thermometerMercury: document.getElementById('thermometer-mercury'),
    thermometerBulb: document.getElementById('thermometer-bulb'),
    thermalStateBadge: document.getElementById('thermal-state-badge'),
    readoutCelsiusVal: document.getElementById('readout-celsius-val'),
    readoutDescription: document.getElementById('readout-description'),
    statFeeling: document.getElementById('stat-feeling'),
    statWaterState: document.getElementById('stat-water-state'),
    statKinetic: document.getElementById('stat-kinetic'),
    
    // Presets & Steps
    presetsGrid: document.getElementById('presets-grid'),
    stepChips: document.querySelectorAll('.step-chip'),
    
    // Matrix
    matrixCelsius: document.getElementById('matrix-celsius'),
    matrixFahrenheit: document.getElementById('matrix-fahrenheit'),
    matrixKelvin: document.getElementById('matrix-kelvin'),
    matrixRankine: document.getElementById('matrix-rankine'),
    matrixReaumur: document.getElementById('matrix-reaumur'),
    matrixNewton: document.getElementById('matrix-newton'),
    matrixDelisle: document.getElementById('matrix-delisle'),
    
    // History & Export
    saveHistoryBtn: document.getElementById('save-history-btn'),
    historyList: document.getElementById('history-list'),
    historyCount: document.getElementById('history-count'),
    clearHistoryBtn: document.getElementById('clear-history-btn'),
    exportJsonBtn: document.getElementById('export-json-btn'),
    exportCsvBtn: document.getElementById('export-csv-btn'),
    
    // Theme & Audio & Toast
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    soundIcon: document.getElementById('sound-icon'),
    themeBtn: document.getElementById('theme-btn'),
    themeMenu: document.getElementById('theme-menu'),
    themeOptions: document.querySelectorAll('.theme-option'),
    currentThemeName: document.getElementById('current-theme-name'),
    toastContainer: document.getElementById('toast-container')
  };

  // --- Web Audio Synthesizer (Zero External Assets Needed) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(frequency = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        gainNode.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy or unsupported fallback
      }
    }

    tick() {
      this.playTone(600, 'triangle', 0.04, 0.03);
    }

    pop() {
      this.playTone(850, 'sine', 0.09, 0.06);
    }

    success() {
      if (!state.soundEnabled) return;
      this.playTone(523.25, 'sine', 0.07, 0.05);
      setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 60);
    }

    swap() {
      this.playTone(480, 'sine', 0.06, 0.05);
      setTimeout(() => this.playTone(720, 'sine', 0.08, 0.05), 50);
    }
  }

  const sound = new SoundFX();

  // --- Math & Conversion Logic ---
  
  /**
   * Convert value from one unit to another
   */
  function convertTemperature(value, fromUnit, toUnit) {
    if (isNaN(value) || value === null) return 0;
    
    // Convert source to base (Celsius)
    const baseCelsius = SCALES[fromUnit].toBase(value);
    // Convert base (Celsius) to target
    const result = SCALES[toUnit].fromBase(baseCelsius);
    
    return {
      result,
      baseCelsius
    };
  }

  /**
   * Format numbers to specified precision
   */
  function formatValue(num, precision = state.precision) {
    if (isNaN(num)) return '0';
    // Format to precision but strip unnecessary trailing zeroes in clean way if desired
    return Number(num.toFixed(precision)).toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    });
  }

  /**
   * Generates step-by-step mathematical explanation
   */
  function generateFormulaExplanation(val, fromUnit, toUnit, result) {
    const fromSymbol = SCALES[fromUnit].symbol;
    const toSymbol = SCALES[toUnit].symbol;
    
    let equation = '';
    let steps = '';

    if (fromUnit === toUnit) {
      equation = `${fromSymbol} = ${toSymbol}`;
      steps = `Identical scale selected: <strong>${formatValue(val)} ${toSymbol}</strong>`;
      return { equation, steps };
    }

    // Direct pairwise formula mappings for clarity
    const key = `${fromUnit}_to_${toUnit}`;
    const vStr = formatValue(val);
    const rStr = formatValue(result);

    switch (key) {
      case 'celsius_to_fahrenheit':
        equation = `(°C × 9/5) + 32 = °F`;
        steps = `(${vStr} × 1.8) + 32 = ${formatValue(val * 1.8)} + 32 = <strong>${rStr} °F</strong>`;
        break;
      case 'fahrenheit_to_celsius':
        equation = `(°F - 32) × 5/9 = °C`;
        steps = `(${vStr} - 32) × 5/9 = ${formatValue(val - 32)} × 0.5556 = <strong>${rStr} °C</strong>`;
        break;
      case 'celsius_to_kelvin':
        equation = `°C + 273.15 = K`;
        steps = `${vStr} + 273.15 = <strong>${rStr} K</strong>`;
        break;
      case 'kelvin_to_celsius':
        equation = `K - 273.15 = °C`;
        steps = `${vStr} - 273.15 = <strong>${rStr} °C</strong>`;
        break;
      case 'fahrenheit_to_kelvin':
        equation = `(°F - 32) × 5/9 + 273.15 = K`;
        steps = `(${vStr} - 32) × 5/9 + 273.15 = <strong>${rStr} K</strong>`;
        break;
      case 'kelvin_to_fahrenheit':
        equation = `(K - 273.15) × 9/5 + 32 = °F`;
        steps = `(${vStr} - 273.15) × 1.8 + 32 = <strong>${rStr} °F</strong>`;
        break;
      case 'celsius_to_rankine':
        equation = `(°C + 273.15) × 9/5 = °R`;
        steps = `(${vStr} + 273.15) × 1.8 = <strong>${rStr} °R</strong>`;
        break;
      case 'celsius_to_reaumur':
        equation = `°C × 4/5 = °Ré`;
        steps = `${vStr} × 0.8 = <strong>${rStr} °Ré</strong>`;
        break;
      default:
        const cVal = SCALES[fromUnit].toBase(val);
        equation = `[${fromSymbol}] ➔ [°C] ➔ [${toSymbol}]`;
        steps = `${vStr} ${fromSymbol} ➔ ${formatValue(cVal)} °C ➔ <strong>${rStr} ${toSymbol}</strong>`;
        break;
    }

    return { equation, steps };
  }

  /**
   * Determine thermal classification metadata from Celsius temperature
   */
  function getThermalMetadata(celsius) {
    if (celsius <= -200) {
      return {
        badge: 'Absolute Cryogenic',
        desc: 'Approaching Absolute Zero (-273.15°C)',
        feeling: 'Matter Near-Frozen',
        waterState: 'Super-dense Ice',
        kinetic: 'Minimal Quantum Energy',
        color: '#38bdf8',
        bulbColor: '#0284c7',
        percent: 4
      };
    } else if (celsius <= -50) {
      return {
        badge: 'Deep Freeze',
        desc: 'Extreme polar temperatures / dry ice',
        feeling: 'Severe Hypothermia Hazard',
        waterState: 'Solid Glacial Ice',
        kinetic: 'Very Low Particle Motion',
        color: '#06b6d4',
        bulbColor: '#0891b2',
        percent: 12
      };
    } else if (celsius <= 0) {
      return {
        badge: 'Freezing Point',
        desc: 'Freezing cold winter conditions',
        feeling: 'Frost & Ice Forming',
        waterState: 'Freezing Solid Phase',
        kinetic: 'Low Kinetic Motion',
        color: '#0ea5e9',
        bulbColor: '#0284c7',
        percent: 22
      };
    } else if (celsius <= 15) {
      return {
        badge: 'Cool / Chilly',
        desc: 'Crisp autumn / spring climate',
        feeling: 'Jacket Recommended',
        waterState: 'Cold Liquid',
        kinetic: 'Moderate Activity',
        color: '#10b981',
        bulbColor: '#059669',
        percent: 40
      };
    } else if (celsius <= 26) {
      return {
        badge: 'Comfort Zone',
        desc: 'Pleasant, optimal room temperature',
        feeling: 'Ideal & Relaxing',
        waterState: 'Ambient Liquid',
        kinetic: 'Standard Equilibrium',
        color: '#10b981',
        bulbColor: '#10b981',
        percent: 54
      };
    } else if (celsius <= 38) {
      return {
        badge: 'Body Warmth',
        desc: 'Human internal core temperature range',
        feeling: 'Warm Summer Weather',
        waterState: 'Warm Liquid',
        kinetic: 'Elevated Molecular Motion',
        color: '#f59e0b',
        bulbColor: '#d97706',
        percent: 68
      };
    } else if (celsius <= 99) {
      return {
        badge: 'Hot & Steamy',
        desc: 'High desert heat to scalding bath',
        feeling: 'Scalding Heat',
        waterState: 'Hot / Vaporizing',
        kinetic: 'High Thermal Excitation',
        color: '#f97316',
        bulbColor: '#ea580c',
        percent: 82
      };
    } else if (celsius <= 300) {
      return {
        badge: 'Boiling / Superheated',
        desc: 'Water boils rapidly at 100°C',
        feeling: 'Scorching Steam Heat',
        waterState: 'Superheated Gas Phase',
        kinetic: 'Vigorous Molecular Collisions',
        color: '#ef4444',
        bulbColor: '#dc2626',
        percent: 94
      };
    } else {
      return {
        badge: 'Extreme Plasma / Melting',
        desc: 'Metallurgical melting to stellar corona',
        feeling: 'Atomic Incandescence',
        waterState: 'Plasma Ionized Gas',
        kinetic: 'Extreme Thermal Ionization',
        color: '#ec4899',
        bulbColor: '#db2777',
        percent: 100
      };
    }
  }

  // --- UI Update Pipeline ---
  function updateUI() {
    const rawInput = parseFloat(elements.fromValue.value);
    const validVal = isNaN(rawInput) ? 0 : rawInput;
    state.fromValue = validVal;

    // 1. Perform Main Conversion
    const { result, baseCelsius } = convertTemperature(validVal, state.fromUnit, state.toUnit);

    // 2. Update Output Card Display
    elements.resultValue.textContent = formatValue(result);
    elements.resultUnitTag.textContent = SCALES[state.toUnit].symbol;
    elements.fromUnitSymbol.textContent = SCALES[state.fromUnit].symbol;
    elements.toUnitSymbol.textContent = SCALES[state.toUnit].symbol;

    // 3. Update Slider Position & Text Badge (Synced to Celsius)
    const clampedSlider = Math.min(200, Math.max(-100, Math.round(baseCelsius)));
    elements.tempSlider.value = clampedSlider;
    elements.sliderBadge.textContent = `${formatValue(validVal, 1)} ${SCALES[state.fromUnit].symbol} (${formatValue(baseCelsius, 1)} °C)`;

    // 4. Update Formula Breakdown
    const { equation, steps } = generateFormulaExplanation(validVal, state.fromUnit, state.toUnit, result);
    elements.formulaEquation.textContent = equation;
    elements.formulaSteps.innerHTML = steps;

    // 5. Update Visual Thermometer & Thermal Readout
    const meta = getThermalMetadata(baseCelsius);
    elements.thermometerMercury.style.height = `${meta.percent}%`;
    elements.thermometerMercury.style.background = `linear-gradient(180deg, ${meta.color}, ${meta.bulbColor})`;
    elements.thermometerBulb.style.background = meta.bulbColor;
    elements.thermometerBulb.style.boxShadow = `0 0 16px ${meta.bulbColor}aa`;

    elements.thermalStateBadge.textContent = meta.badge;
    elements.thermalStateBadge.style.color = meta.color;
    elements.thermalStateBadge.style.borderColor = `${meta.color}66`;
    elements.thermalStateBadge.style.backgroundColor = `${meta.color}1a`;

    elements.readoutCelsiusVal.textContent = `${formatValue(baseCelsius, 1)} °C`;
    elements.readoutDescription.textContent = meta.desc;
    elements.statFeeling.textContent = meta.feeling;
    elements.statWaterState.textContent = meta.waterState;
    elements.statKinetic.textContent = meta.kinetic;

    // 6. Update Universal Matrix Grid for all 7 Scales
    elements.matrixCelsius.textContent = `${formatValue(SCALES.celsius.fromBase(baseCelsius))} °C`;
    elements.matrixFahrenheit.textContent = `${formatValue(SCALES.fahrenheit.fromBase(baseCelsius))} °F`;
    elements.matrixKelvin.textContent = `${formatValue(SCALES.kelvin.fromBase(baseCelsius))} K`;
    elements.matrixRankine.textContent = `${formatValue(SCALES.rankine.fromBase(baseCelsius))} °R`;
    elements.matrixReaumur.textContent = `${formatValue(SCALES.reaumur.fromBase(baseCelsius))} °Ré`;
    elements.matrixNewton.textContent = `${formatValue(SCALES.newton.fromBase(baseCelsius))} °N`;
    elements.matrixDelisle.textContent = `${formatValue(SCALES.delisle.fromBase(baseCelsius))} °De`;

    // 7. Update Presets Active State Highlight
    const presetButtons = elements.presetsGrid.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
      const pVal = parseFloat(btn.dataset.val);
      // If within 0.2 Celsius difference, mark active
      if (Math.abs(baseCelsius - pVal) < 0.2) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Toast Notifications ---
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 260);
    }, 2400);
  }

  // --- History Management & Persistence ---
  function loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        state.history = JSON.parse(stored);
      }
    } catch (e) {
      state.history = [];
    }
    renderHistory();
  }

  function saveHistoryItem() {
    const fromVal = state.fromValue;
    const fromSymbol = SCALES[state.fromUnit].symbol;
    const toSymbol = SCALES[state.toUnit].symbol;
    const { result } = convertTemperature(fromVal, state.fromUnit, state.toUnit);
    
    const record = {
      id: Date.now(),
      fromVal: formatValue(fromVal),
      fromUnit: state.fromUnit,
      fromSymbol,
      toVal: formatValue(result),
      toUnit: state.toUnit,
      toSymbol,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString()
    };

    // Prepend to history, max 50 items
    state.history.unshift(record);
    if (state.history.length > 50) {
      state.history.pop();
    }

    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(state.history));
    } catch (e) {}

    renderHistory();
    sound.success();
    showToast(`Saved to history: ${record.fromVal}${fromSymbol} ➔ ${record.toVal}${toSymbol}`, '💾');
  }

  function deleteHistoryItem(id) {
    state.history = state.history.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(state.history));
    } catch (e) {}
    renderHistory();
    sound.tick();
    showToast('Entry removed', '🗑️');
  }

  function clearAllHistory() {
    if (state.history.length === 0) return;
    state.history = [];
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {}
    renderHistory();
    sound.tick();
    showToast('Conversion history cleared', '🧹');
  }

  function renderHistory() {
    elements.historyCount.textContent = `${state.history.length} items`;

    if (state.history.length === 0) {
      elements.historyList.innerHTML = `<li class="history-empty-msg">No conversions recorded yet. Perform conversions and click "Save To History Log"!</li>`;
      return;
    }

    elements.historyList.innerHTML = '';
    state.history.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `
        <div>
          <span class="history-text">${item.fromVal} ${item.fromSymbol} ➔ ${item.toVal} ${item.toSymbol}</span>
          <div class="history-time">${item.date} • ${item.time}</div>
        </div>
        <button class="history-delete-btn" data-id="${item.id}" title="Remove entry" aria-label="Remove entry">✕</button>
      `;

      li.querySelector('.history-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteHistoryItem(item.id);
      });

      // Clicking an item loads it back into the converter
      li.addEventListener('click', () => {
        elements.fromValue.value = item.fromVal.replace(/,/g, '');
        elements.fromUnit.value = item.fromUnit;
        elements.toUnit.value = item.toUnit;
        state.fromUnit = item.fromUnit;
        state.toUnit = item.toUnit;
        updateUI();
        sound.pop();
        showToast(`Loaded: ${item.fromVal} ${item.fromSymbol}`, '📂');
      });

      elements.historyList.appendChild(li);
    });
  }

  // --- Export Data (CSV & JSON) ---
  function exportHistoryJSON() {
    if (state.history.length === 0) {
      showToast('No history records to export', '⚠️');
      return;
    }
    const jsonStr = JSON.stringify(state.history, null, 2);
    downloadFile(jsonStr, 'tempflux_history.json', 'application/json');
    sound.success();
    showToast('Exported history as JSON', '📥');
  }

  function exportHistoryCSV() {
    if (state.history.length === 0) {
      showToast('No history records to export', '⚠️');
      return;
    }
    const headers = ['ID', 'Date', 'Time', 'From_Value', 'From_Unit', 'To_Value', 'To_Unit'];
    const rows = state.history.map(item => [
      item.id,
      `"${item.date}"`,
      `"${item.time}"`,
      item.fromVal.replace(/,/g, ''),
      item.fromUnit,
      item.toVal.replace(/,/g, ''),
      item.toUnit
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csvContent, 'tempflux_history.csv', 'text/csv');
    sound.success();
    showToast('Exported history as CSV', '📥');
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Theme Management ---
  function setTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Update theme dropdown button labels
    if (themeName === 'dark') {
      elements.themeBtn.querySelector('#theme-icon').textContent = '🌙';
      elements.currentThemeName.textContent = 'Dark';
    } else if (themeName === 'light') {
      elements.themeBtn.querySelector('#theme-icon').textContent = '☀️';
      elements.currentThemeName.textContent = 'Light';
    } else if (themeName === 'neon') {
      elements.themeBtn.querySelector('#theme-icon').textContent = '⚡';
      elements.currentThemeName.textContent = 'Neon';
    }

    elements.themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeName);
    });

    try {
      localStorage.setItem(STORAGE_KEY_THEME, themeName);
    } catch (e) {}
  }

  function loadTheme() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme && ['dark', 'light', 'neon'].includes(savedTheme)) {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    } catch (e) {
      setTheme('dark');
    }
  }

  // --- Event Listeners Initialization ---
  function initEventListeners() {
    // 1. Input field typing
    elements.fromValue.addEventListener('input', () => {
      sound.tick();
      updateUI();
    });

    // 2. Unit dropdown selections
    elements.fromUnit.addEventListener('change', (e) => {
      state.fromUnit = e.target.value;
      sound.pop();
      updateUI();
    });

    elements.toUnit.addEventListener('change', (e) => {
      state.toUnit = e.target.value;
      sound.pop();
      updateUI();
    });

    // 3. Clear Input
    elements.clearInputBtn.addEventListener('click', () => {
      elements.fromValue.value = '0';
      sound.tick();
      updateUI();
      elements.fromValue.focus();
    });

    // 4. Swap Units
    elements.swapUnitsBtn.addEventListener('click', () => {
      const currentFrom = state.fromUnit;
      const currentTo = state.toUnit;

      state.fromUnit = currentTo;
      state.toUnit = currentFrom;

      elements.fromUnit.value = currentTo;
      elements.toUnit.value = currentFrom;

      // Animate button
      elements.swapUnitsBtn.style.transform = 'rotate(180deg)';
      setTimeout(() => elements.swapUnitsBtn.style.transform = '', 300);

      sound.swap();
      updateUI();
      showToast(`Swapped: ${SCALES[state.fromUnit].name} ⇄ ${SCALES[state.toUnit].name}`, '🔄');
    });

    // 5. Precision Selector
    elements.decimalSelect.addEventListener('change', (e) => {
      state.precision = parseInt(e.target.value, 10);
      sound.tick();
      updateUI();
    });

    // 6. Range Slider Fine-Tuning
    elements.tempSlider.addEventListener('input', (e) => {
      // The slider represents Celsius
      const celsiusVal = parseFloat(e.target.value);
      // Convert slider Celsius back to the active fromUnit scale
      const convertedVal = SCALES[state.fromUnit].fromBase(celsiusVal);
      elements.fromValue.value = formatValue(convertedVal, state.precision).replace(/,/g, '');
      sound.tick();
      updateUI();
    });

    // 7. Step Increment / Reset Buttons
    elements.stepChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sound.pop();
        if (chip.dataset.reset !== undefined) {
          elements.fromValue.value = '0';
        } else if (chip.dataset.step) {
          const step = parseFloat(chip.dataset.step);
          const current = parseFloat(elements.fromValue.value) || 0;
          elements.fromValue.value = (current + step).toString();
        }
        updateUI();
      });
    });

    // 8. Preset buttons click
    elements.presetsGrid.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const valInCelsius = parseFloat(btn.dataset.val);
        // Convert to current source unit
        const valInSource = SCALES[state.fromUnit].fromBase(valInCelsius);
        elements.fromValue.value = formatValue(valInSource, state.precision).replace(/,/g, '');
        sound.pop();
        updateUI();
        showToast(`Loaded ${btn.querySelector('strong').textContent}`, btn.querySelector('.preset-icon').textContent);
      });
    });

    // 9. Matrix Scale Click to Switch Target Unit
    document.querySelectorAll('.scale-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetScale = card.dataset.scale;
        if (targetScale && targetScale !== state.fromUnit) {
          state.toUnit = targetScale;
          elements.toUnit.value = targetScale;
          sound.pop();
          updateUI();
          showToast(`Target set to ${SCALES[targetScale].name}`, '🎯');
        }
      });
    });

    // 10. Copy Result Button
    elements.copyResultBtn.addEventListener('click', async () => {
      const outputText = `${elements.resultValue.textContent} ${elements.resultUnitTag.textContent}`;
      try {
        await navigator.clipboard.writeText(outputText);
        sound.success();
        showToast(`Copied ${outputText} to clipboard!`, '📋');
      } catch (err) {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = outputText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        sound.success();
        showToast(`Copied ${outputText} to clipboard!`, '📋');
      }
    });

    // 11. History Events
    elements.saveHistoryBtn.addEventListener('click', saveHistoryItem);
    elements.clearHistoryBtn.addEventListener('click', clearAllHistory);
    elements.exportJsonBtn.addEventListener('click', exportHistoryJSON);
    elements.exportCsvBtn.addEventListener('click', exportHistoryCSV);

    // 12. Sound Toggle
    try {
      const soundStored = localStorage.getItem(STORAGE_KEY_SOUND);
      if (soundStored !== null) {
        state.soundEnabled = soundStored === 'true';
      }
    } catch (e) {}

    const updateSoundUI = () => {
      elements.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
      elements.soundToggleBtn.setAttribute('aria-label', state.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds');
    };
    updateSoundUI();

    elements.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      try {
        localStorage.setItem(STORAGE_KEY_SOUND, state.soundEnabled.toString());
      } catch (e) {}
      updateSoundUI();
      if (state.soundEnabled) sound.pop();
      showToast(state.soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted', state.soundEnabled ? '🔊' : '🔇');
    });

    // 13. Theme Dropdown Menu
    elements.themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      elements.themeMenu.classList.remove('show');
    });

    elements.themeOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        setTheme(opt.dataset.theme);
        elements.themeMenu.classList.remove('show');
        sound.pop();
        showToast(`Theme switched to ${opt.textContent.trim()}`, '🎨');
      });
    });

    // 14. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Avoid firing if user is inside another form control
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      
      // Ctrl+K or Cmd+K: Focus/Clear input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        elements.fromValue.value = '';
        elements.fromValue.focus();
        sound.tick();
        updateUI();
        return;
      }

      // If active typing in input, ignore single-letter global hotkeys
      if (activeTag === 'input' || activeTag === 'select' || activeTag === 'textarea') {
        return;
      }

      // 'S' key: Swap Units
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        elements.swapUnitsBtn.click();
      }

      // 'T' key: Cycle Theme
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        const themes = ['dark', 'light', 'neon'];
        const nextIdx = (themes.indexOf(state.theme) + 1) % themes.length;
        setTheme(themes[nextIdx]);
        sound.pop();
        showToast(`Theme: ${themes[nextIdx].toUpperCase()}`, '🎨');
      }
    });
  }

  // --- App Initialization ---
  function init() {
    loadTheme();
    loadHistory();
    initEventListeners();
    updateUI();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
