// Navigation remains usable without JavaScript; enhance the active section only.
const links = [...document.querySelectorAll('.topnav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
function updateActiveSection() {
  const threshold = document.querySelector('.topnav').getBoundingClientRect().height + 45;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) active = section;
  }
  for (const link of links) {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let pending = false;
window.addEventListener('scroll', () => {
  if (!pending) {
    pending = true;
    requestAnimationFrame(() => { updateActiveSection(); pending = false; });
  }
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
// Include all detailed instructions when printing, and restore disclosure choices.
let previouslyOpen = [];
window.addEventListener('beforeprint', () => {
  previouslyOpen = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
  previouslyOpen.forEach(([detail]) => { detail.open = true; });
});
window.addEventListener('afterprint', () => {
  previouslyOpen.forEach(([detail, open]) => { detail.open = open; });
});
// Keep useful source links if an external image becomes unavailable.
document.querySelectorAll('.trip-photo img').forEach(img => {
  const failed = () => img.closest('.trip-photo').classList.add('image-unavailable');
  img.addEventListener('error', failed, { once: true });
  if (img.complete && img.naturalWidth === 0) failed();
});
