const config = window.ENGAGEMENT;
const intro = document.querySelector('#intro');
const openButton = document.querySelector('#openButton');
const content = document.querySelector('#content');

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
