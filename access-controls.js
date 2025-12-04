document.addEventListener('DOMContentLoaded', () => {
  // Configuração centralizada
  const CONFIG = {
    fontLevels: [1, 1.15, 1.3],
    fontTitles: ['Tamanho: Normal', 'Tamanho: Médio', 'Tamanho: Alto'],
    colorTitles: ['Cores: Normal', 'Preto e Branco'],
    storageKeys: {
      font: 'access-font-level',
      color: 'access-color-level'
    },
    selectors: {
      fontBtn: '.letraAcess',
      colorBtn: '.satAcess'
    },
    desaturateClass: 'a11y-desaturate'
  };

  // Elementos
  const fontBtn = document.querySelector(CONFIG.selectors.fontBtn);
  const colorBtn = document.querySelector(CONFIG.selectors.colorBtn);

  if (!fontBtn && !colorBtn) return;

  // Estado
  let fontIndex = parseInt(localStorage.getItem(CONFIG.storageKeys.font) || '0', 10);
  let colorIndex = parseInt(localStorage.getItem(CONFIG.storageKeys.color) || '0', 10);

  // Funções auxiliares
  const updateStorage = (key, value) => localStorage.setItem(key, String(value));
  
  const applyFont = (index) => {
    const scale = CONFIG.fontLevels[index] || 1;
    document.documentElement.style.fontSize = (scale * 100) + '%';
    if (fontBtn) {
      fontBtn.title = CONFIG.fontTitles[index] || CONFIG.fontTitles[0];
      fontBtn.setAttribute('aria-pressed', String(index > 0));
    }
  };

  const applyDesaturate = (active) => {
    document.body.classList.toggle(CONFIG.desaturateClass, active);
    if (colorBtn) {
      colorBtn.title = CONFIG.colorTitles[active ? 1 : 0];
      colorBtn.setAttribute('aria-pressed', String(active));
    }
  };

  const cycleFont = () => {
    fontIndex = (fontIndex + 1) % CONFIG.fontLevels.length;
    applyFont(fontIndex);
    updateStorage(CONFIG.storageKeys.font, fontIndex);
  };

  const toggleDesaturate = () => {
    const active = !document.body.classList.contains(CONFIG.desaturateClass);
    colorIndex = active ? 1 : 0;
    applyDesaturate(active);
    updateStorage(CONFIG.storageKeys.color, colorIndex);
  };

  // Inicializar
  applyFont(fontIndex);
  applyDesaturate(colorIndex === 1);

  // Event listeners
  fontBtn?.addEventListener('click', (ev) => { ev.preventDefault(); cycleFont(); });
  colorBtn?.addEventListener('click', (ev) => { ev.preventDefault(); toggleDesaturate(); });

  // Teclado: Enter e Espaço ativam os botões
  [fontBtn, colorBtn].forEach(btn => {
    btn?.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn === fontBtn ? cycleFont() : toggleDesaturate();
      }
    });
  });

  // Funções globais (mantidas para compatibilidade)
  window.aplicarPretoEBranco = () => {
    colorIndex = 1;
    applyDesaturate(true);
    updateStorage(CONFIG.storageKeys.color, colorIndex);
  };

  window.removerPretoEBranco = () => {
    colorIndex = 0;
    applyDesaturate(false);
    updateStorage(CONFIG.storageKeys.color, colorIndex);
  };

  window.togglePretoEBranco = toggleDesaturate;
});