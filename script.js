const config = window.ENGAGEMENT;
const intro = document.querySelector('#intro');
const openButton = document.querySelector('#openButton');
const content = document.querySelector('#content');

function createRoseBurst() {
  const burst = document.createElement('div');
  const envelopeBounds = openButton.getBoundingClientRect();
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const roseCount = isMobile ? 9 : 16;

  burst.className = 'rose-burst';
  burst.setAttribute('aria-hidden', 'true');
  burst.style.left = `${envelopeBounds.left + envelopeBounds.width / 2}px`;
  burst.style.top = `${envelopeBounds.top + envelopeBounds.height / 2}px`;

  for (let index = 0; index < roseCount; index += 1) {
    const rose = document.createElement('span');
    const angle = (index / roseCount) * Math.PI * 2 + (Math.random() - .5) * .7;
    const maxDistance = isMobile
      ? Math.min(envelopeBounds.width * .42, 130)
      : Math.min(envelopeBounds.width * .7, 180);
    const distance = maxDistance * (.72 + Math.random() * .4);
    const size = isMobile ? 27 + Math.random() * 24 : 32 + Math.random() * 31;

    rose.className = 'burst-rose';
    rose.textContent = '🌹';
    rose.style.setProperty('--rose-x', `${Math.cos(angle) * distance}px`);
    rose.style.setProperty('--rose-y', `${Math.sin(angle) * distance - 35}px`);
    rose.style.setProperty('--rose-mid-x', `${Math.cos(angle) * distance * .55}px`);
    rose.style.setProperty('--rose-mid-y', `${(Math.sin(angle) * distance - 35) * .55}px`);
    rose.style.setProperty('--rose-end-x', `${Math.cos(angle) * distance * 1.3}px`);
    rose.style.setProperty('--rose-end-y', `${(Math.sin(angle) * distance - 35) * 1.3 - 24}px`);
    rose.style.setProperty('--rose-size', `${size}px`);
    rose.style.setProperty('--rose-rotation', `${Math.round(Math.random() * 70 - 35)}deg`);
    rose.style.setProperty('--rose-delay', `${Math.random() * 100}ms`);
    burst.appendChild(rose);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 2400);
}

function text(id, value) {
  const element = document.querySelector(`#${id}`);
  if (element) element.textContent = value;
}

text('dayOfWeek', config.dayOfWeek);
text('dateDay', config.day);
text('dateMonth', config.month);
text('dateYear', config.year);
text('eventTime', config.time);
text('venueName', config.venue);
text('venueLocation', config.location);
text('footerDate', `${config.day} · ${config.month} · ${config.year}`);

const mapButton = document.querySelector('#mapButton');
if (config.mapUrl) mapButton.href = config.mapUrl;

openButton.addEventListener('click', () => {
  if (intro.classList.contains('open')) return;
  createRoseBurst();
  intro.classList.add('open');
  content.classList.add('visible');
  content.setAttribute('aria-hidden', 'false');

  window.setTimeout(() => {
    document.body.classList.remove('intro-active');
    document.querySelectorAll('.hero .reveal').forEach((element, index) => {
      window.setTimeout(() => element.classList.add('in-view'), index * 110);
    });
  }, 1100);
});

if (new URLSearchParams(window.location.search).get('preview') === '1') {
  intro.style.display = 'none';
  content.classList.add('visible');
  content.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('intro-active');
  document.querySelectorAll('.hero .reveal').forEach(element => element.classList.add('in-view'));
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = [...entry.target.parentElement.querySelectorAll(':scope > .reveal')];
        const position = Math.max(0, group.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(position * 90, 270)}ms`;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('in-view'));
}

const engagementTime = new Date(config.dateISO).getTime();

function updateCountdown() {
  const remaining = Math.max(0, engagementTime - Date.now());
  const day = 86400000;
  text('days', String(Math.floor(remaining / day)).padStart(2, '0'));
  text('hours', String(Math.floor((remaining % day) / 3600000)).padStart(2, '0'));
  text('minutes', String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0'));
  text('seconds', String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0'));
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
