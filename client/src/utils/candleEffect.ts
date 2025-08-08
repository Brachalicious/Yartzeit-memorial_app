export function setupCandleToggle() {
  document.addEventListener('DOMContentLoaded', () => {
    const candleImage = document.getElementById('candle') as HTMLImageElement | null;
    if (!candleImage) return;

    let isLit = false;

    candleImage.addEventListener('click', () => {
      if (!isLit) {
        candleImage.src = '/candle_lit.png';
        candleImage.alt = 'Lit Candle';
        candleImage.classList.add('flickering');
      } else {
        candleImage.src = '/candle_unlit.png';
        candleImage.alt = 'Unlit Candle';
        candleImage.classList.remove('flickering');
      }

      isLit = !isLit;
    });
  });
}




