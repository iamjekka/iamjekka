const toggle=document.querySelector('.menu-toggle');const menu=document.querySelector('.mobile-menu');if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.hidden=open;toggle.textContent=open?'Menu':'Close';});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu';}));}

// Project gallery slideshows
for (const slideshow of document.querySelectorAll('[data-slideshow]')) {
  let slides = [...slideshow.querySelectorAll('.slide')];
  const prev = slideshow.querySelector('.slide-prev');
  const next = slideshow.querySelector('.slide-next');
  const section = slideshow.closest('.gallery-panel, .year-live, .media-section') || slideshow.parentElement;
  const current = section?.querySelector('.gallery-current');
  const total = section?.querySelector('.gallery-total');
  let index = 0;

  const refresh = () => {
    slides = [...slideshow.querySelectorAll('.slide')];
    if (!slides.length) return;
    if (!slides.some(s => s.classList.contains('is-active'))) slides[0].classList.add('is-active');
    if (total) total.textContent = slides.length;
    index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    if (current) current.textContent = index + 1;
  };

  const show = (i) => {
    slides = [...slideshow.querySelectorAll('.slide')];
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => slide.classList.toggle('is-active', n === index));
    if (current) current.textContent = index + 1;
    if (total) total.textContent = slides.length;
  };

  refresh();
  prev?.addEventListener('click', () => show(index - 1));
  next?.addEventListener('click', () => show(index + 1));

  window.addEventListener('load', refresh);
}

// Desktop-only release audio previews. Add a file path to data-preview on a .release-card to enable.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const previewCards = [...document.querySelectorAll('.release-card[data-preview]')];
  let activeAudio = null;
  previewCards.forEach((card) => {
    const src = (card.dataset.preview || '').trim();
    if (!src) return;
    card.classList.add('has-preview');
    const audio = new Audio(src);
    audio.preload = 'metadata';
    audio.volume = 0.8;
    const target = card.querySelector('.release-cover-link');
    target?.addEventListener('mouseenter', () => {
      if (activeAudio && activeAudio !== audio) { activeAudio.pause(); activeAudio.currentTime = 0; }
      activeAudio = audio;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });
    target?.addEventListener('mouseleave', () => {
      audio.pause();
      audio.currentTime = 0;
      if (activeAudio === audio) activeAudio = null;
    });
  });
}
