const scrollPositions = new Map();

export function saveScrollPosition(key) {
  scrollPositions.set(key, window.scrollY);
}

export function restoreScrollPosition(key) {
  const pos = scrollPositions.get(key);
  if (pos !== undefined) {
    window.scrollTo({ top: pos, behavior: 'instant' }); // or 'smooth'
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
