document.addEventListener('DOMContentLoaded', () => {
  const fontBtn = document.querySelector('.letraAcess');
  const colorBtn = document.querySelector('.satAcess');

  if (!fontBtn && !colorBtn) return;

  // Configuração
  const fontLevels = [1, 1.15, 1.3];
  const fontTitles = ['Tamanho: Normal', 'Tamanho: Médio', 'Tamanho: Alto'];
  const colorTitles = ['Cores: Normal', 'Preto e Branco'];

  let fontIndex = parseInt(localStorage.getItem('access-font-level') || '0', 10);
  let colorIndex = parseInt(localStorage.getItem('access-color-level') || '0', 10);

  // Aplica tamanho de fonte
  function applyFont(i) {
    const v = fontLevels[i] || 1;
    document.documentElement.style.fontSize = (v * 100) + '%';
    if (fontBtn) {
      fontBtn.title = fontTitles[i] || fontTitles[0];
      fontBtn.setAttribute('aria-pressed', String(i > 0));
    }
  }

  // Aplica/remove dessaturação
  function applyDesaturate(active) {
    if (active) {
      document.body.classList.add('a11y-desaturate');
    } else {
      document.body.classList.remove('a11y-desaturate');
    }
    if (colorBtn) {
      colorBtn.title = active ? colorTitles[1] : colorTitles[0];
      colorBtn.setAttribute('aria-pressed', String(active));
    }
  }

  // Alternadores
  function cycleFont() {
    fontIndex = (fontIndex + 1) % fontLevels.length;
    applyFont(fontIndex);
    localStorage.setItem('access-font-level', String(fontIndex));
  }

  function toggleDesaturate() {
    const active = !!(document.body.classList.contains('a11y-desaturate'));
    colorIndex = active ? 0 : 1;
    applyDesaturate(colorIndex === 1);
    localStorage.setItem('access-color-level', String(colorIndex));
  }

  // Inicializa
  applyFont(fontIndex);
  applyDesaturate(colorIndex === 1);

  // Listeners
  if (fontBtn) {
    fontBtn.addEventListener('click', (ev) => { ev.preventDefault(); cycleFont(); });
  }

  if (colorBtn) {
    colorBtn.addEventListener('click', (ev) => { ev.preventDefault(); toggleDesaturate(); });
  }

  // Funções globais
  window.aplicarPretoEBranco = function () {
    colorIndex = 1; applyDesaturate(true);
    localStorage.setItem('access-color-level',
      String(colorIndex));
  };
  window.removerPretoEBranco = function () {
    colorIndex = 0; applyDesaturate(false);
    localStorage.setItem('access-color-level',
      String(colorIndex));
  };
  window.togglePretoEBranco = toggleDesaturate;
});