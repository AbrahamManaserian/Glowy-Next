export function saveScrollPosition(obj, index) {
  if (index) {
    // console.log(obj);
    // console.log(index);
    window.scrollTo({ top: obj[index].pos, behavior: 'auto' });
  }
  sessionStorage.setItem('app-scroll:', JSON.stringify(obj));
  sessionStorage.setItem('index', JSON.stringify(index));
}
