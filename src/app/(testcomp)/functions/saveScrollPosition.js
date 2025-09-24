export function saveScrollPosition(position) {
  sessionStorage.setItem('app-scroll:' + position, String(window.scrollY));
}
