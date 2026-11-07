import { messagesRef, push, onValue } from "./firebase.js";

'use strict';

// =============================================================
// CONFIGURAÇÕES DO EVENTO — EDITE SOMENTE ESTE OBJETO
// =============================================================
// Data: YYYY-MM-DD; horário: HH:mm, fuso horário LOCAL do visitante.
// WhatsApp: DDI + DDD + número, APENAS DÍGITOS. Ex.: 5561999999999.
// O WhatsApp abrirá com mensagem pronta; o convidado deve tocar em ENVIAR.
// Fotos: coloque os arquivos nos caminhos indicados em assets/images/.
// Os SVGs fornecidos são placeholders visuais e podem ser substituídos.
const CONFIG = {
  nomeAniversariante: 'Leonardo Lima',
  idadeCelebrada: '28',
  dataEvento: '2026-12-12',
  horarioEvento: '12:30',
  localEvento: 'Residencial Alvorada - SH Ponte Alta Norte',
  enderecoCompleto: 'Ponte Alta Norte (Gama), Brasília - DF, 72427-010',
  linkMapa: 'https://maps.app.goo.gl/wFK2VhjbUEWYyLRm7', // URL completa do Google Maps; vazio = busca pelo endereço.
  whatsappNumero: '5561996712861', // SUBSTITUA pelo número real, sem +, espaços ou pontuação.
  instagram: 'https://www.instagram.com/_leonardools?vrfl=MTF4MjlyMHlwcHllZw%3D%3D&utm_source=qr', // URL completa do perfil, se desejar.
  facebook: '',
  spotifyPlaylist: 'https://open.spotify.com/track/4mZu6NuOntvYZqCZPrxTqT?si=u6E0wkNsTee_jhZVqTDBfQ&utm_source=copy-link', // URL completa da playlist; exibida no rodapé.
  mensagemEspecial: 'Dezembro marca o encerramento de uma etapa muito importante, minha formação na faculdade, foram semestres de aprendizado, desafios, projetos, noites estudando e muita persistência e como dezembro também é mês do meu aniversário, decidi juntar os dois motivos em uma só comemoração! Quero celebrar a vida, a conquista do diploma e tudo o que ainda vem pela frente ao lado das pessoas que fizeram parte da minha caminhada. Sua presença vai deixar esse dia ainda mais especial.',
  fraseHero: 'O deploy mais esperado do ano: uma nova versão da minha história, com aniversário e formatura no mesmo evento.',
  fotos: [
    { src: 'img/WhatsApp Image 2026-11-07 at 16.10.19.jpeg', legenda: 'Memórias inesquecíveis' },
    { src: 'img/WhatsApp Image 2026-11-07 at 16.52.04 (3).jpeg', legenda: 'A beleza de cada momento' },
    { src: 'img/WhatsApp Image 2026-11-07 at 17.00.34.jpeg', legenda: 'Histórias para contar' },
    { src: 'img/WhatsApp Image 2026-11-07 at 16.52.04 (1).jpeg', legenda: 'Um brinde à vida' },
    { src: 'img/WhatsApp Image 2026-11-07 at 16.06.23.jpeg', legenda: 'momentos especiais' },
    { src: 'img/WhatsApp Image 2026-11-07 at 16.52.04 (2).jpeg', legenda: 'O melhor ainda está por vir' }
  ],
  historia: [
    { titulo: 'O primeiro commit', periodo: 'Tudo começa com uma ideia', texto: 'Toda jornada começa com curiosidade, vontade de aprender e coragem para dar o primeiro passo.', foto: 'img/WhatsApp Image 2026-11-07 at 16.17.59.jpeg' },
    { titulo: 'Graduação', periodo: 'Análise e Desenvolvimento de Sistemas', texto: 'Novos conceitos, lógica, algoritmos e a descoberta de que tecnologia também é criar possibilidades.', foto: 'img/WhatsApp Image 2026-11-07 at 16.52.04 (3).jpeg' },
    { titulo: 'Entre bugs e entregas', periodo: 'Projetos, desafios e evolução', texto: 'Trabalhos em equipe, códigos que deram certo (e os que precisaram de muitos ajustes), apresentações e aprendizados.', foto: 'img/WhatsApp Image 2026-11-07 at 17.07.35.jpeg' },
    { titulo: 'Formatura + aniversário', periodo: '12 de dezembro de 2026 · 12h30', texto: 'O ciclo da graduação chega à entrega final. Agora é hora de celebrar a conquista, a vida e os próximos desafios.', foto: 'assets/images/foto-4.svg' }
  ]
};

// =============================================================
// UTILITÁRIOS — elementos, datas e segurança de texto
// =============================================================
const $ = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const eventDate = new Date(`${CONFIG.dataEvento}T${CONFIG.horarioEvento}:00`);
const dateValid = !Number.isNaN(eventDate.getTime());
const dateLong = dateValid ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(eventDate) : 'Data a definir';
const dateShort = dateValid ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(eventDate) : 'Data a definir';
const eventAddress = `${CONFIG.localEvento}, ${CONFIG.enderecoCompleto}`;
const mapQuery = encodeURIComponent(eventAddress);
const routeURL = CONFIG.linkMapa.trim() || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const safeURL = (value) => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };

// =============================================================
// PREENCHIMENTO CENTRALIZADO DE CONTEÚDO
// =============================================================
function populateContent() {
  document.title = `${CONFIG.nomeAniversariante} • Formatura ADS + Aniversário | Convite`; 
  $('meta[name="description"]').content = `Convite para celebrar o aniversário e a formatura em Análise e Desenvolvimento de Sistemas de ${CONFIG.nomeAniversariante}. ${dateLong}, às ${CONFIG.horarioEvento}.` ;
  $('meta[property="og:title"]').content = `${CONFIG.nomeAniversariante} • Convite de formatura e aniversário` ;
  $('meta[property="og:description"]').content = `Uma conquista em ADS e mais um ano de vida para celebrar. ${dateLong}, às ${CONFIG.horarioEvento}.` ;
  $('#gateName').textContent = CONFIG.nomeAniversariante;
  $('#brandName').textContent = CONFIG.nomeAniversariante;
  $('#footerName').textContent = CONFIG.nomeAniversariante;
  $('#heroTitle').textContent = CONFIG.nomeAniversariante;
  $('.hero-subtitle').textContent = CONFIG.fraseHero;
  $('#heroDate').textContent = dateLong;
  $('#heroPlace').textContent = CONFIG.localEvento;
  $('#eventStamp').textContent = `${dateShort.toUpperCase()} · ${CONFIG.horarioEvento}`;
  $('#specialMessage').textContent = CONFIG.mensagemEspecial;
  $('#messageSignature').textContent = `Com carinho, ${CONFIG.nomeAniversariante} ✦`;
  $('#locationName').textContent = CONFIG.localEvento;
  $('#locationAddress').textContent = CONFIG.enderecoCompleto;
  $('#locationDate').textContent = `${dateLong} • ${CONFIG.horarioEvento}`;
  $('#routeBtn').href = safeURL(routeURL) || '#local';
  // Google Maps Embed sem chave: consulta pública via maps.google.com.
  $('#mapFrame').src = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
  const links = [ ['Instagram', CONFIG.instagram], ['Facebook', CONFIG.facebook], ['Spotify', CONFIG.spotifyPlaylist] ];
  links.forEach(([label, url]) => { if (!safeURL(url)) return; const a = document.createElement('a'); a.href = safeURL(url); a.textContent = label + ' ↗'; a.target = '_blank'; a.rel = 'noopener noreferrer'; $('#socialLinks').append(a); });
}

// =============================================================
// ABERTURA — evita que o visitante navegue por trás do overlay
// =============================================================
function initGate() {
  document.body.classList.add('locked');
  $('#enterBtn').addEventListener('click', () => {
    $('#gate').classList.add('is-leaving');
    document.body.classList.remove('locked');
    setTimeout(() => { $('#gate').hidden = true; $('#gate').setAttribute('aria-hidden', 'true'); }, reducedMotion ? 0 : 750);
    // Áudio não inicia automaticamente: o visitante controla pelo player.
  });
}

// =============================================================
// CONTADOR — diferença entre data do evento e relógio local
// =============================================================
function updateCountdown() {
  const delta = dateValid ? Math.max(0, eventDate.getTime() - Date.now()) : 0;
  const parts = [Math.floor(delta / 86400000), Math.floor(delta / 3600000) % 24, Math.floor(delta / 60000) % 60, Math.floor(delta / 1000) % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => { const el = $('#' + id); const next = String(parts[i]).padStart(2, '0'); if (el.textContent !== next) { el.textContent = next; if (!reducedMotion) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); } } });
  if (delta === 0) $('#eventStamp').textContent = dateValid ? 'O GRANDE DIA CHEGOU ✦' : 'DATA A DEFINIR';
}

// =============================================================
// GALERIA E TIMELINE — criadas com DOM APIs, sem HTML inseguro
// =============================================================
function createImage(src, alt, className = '') { const img = document.createElement('img'); img.src = src; img.alt = alt; img.loading = 'lazy'; img.decoding = 'async'; img.className = className; return img; }
function buildGallery() {
  CONFIG.fotos.forEach((photo, i) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = `gallery-item reveal ${i === 0 ? 'featured' : ''}`; button.setAttribute('aria-label', `Ampliar foto: ${photo.legenda}`);
    button.append(createImage(photo.src, photo.legenda)); const caption = document.createElement('span'); caption.className = 'gallery-caption'; caption.textContent = `${String(i + 1).padStart(2, '0')} / ${photo.legenda}`; button.append(caption);
    button.addEventListener('click', () => openLightbox(photo)); $('#gallery').append(button);
  });
  CONFIG.historia.forEach((item, i) => {
    const card = document.createElement('article'); card.className = `timeline-item reveal ${i % 2 ? 'alternate' : ''}`;
    const image = createImage(item.foto, item.titulo); const content = document.createElement('div'); content.className = 'timeline-content';
    const period = document.createElement('span'); period.className = 'eyebrow'; period.textContent = item.periodo;
    const title = document.createElement('h3'); title.textContent = item.titulo;
    const body = document.createElement('p'); body.textContent = item.texto;
    content.append(period, title, body); card.append(image, content); $('#timeline').append(card);
  });
}
let lightboxTrigger = null;
function openLightbox(photo) { lightboxTrigger = document.activeElement; $('#lightboxImage').src = photo.src; $('#lightboxImage').alt = photo.legenda; $('#lightboxCaption').textContent = photo.legenda; $('#lightbox').classList.add('open'); $('#lightbox').setAttribute('aria-hidden', 'false'); $('#closeLightbox').focus(); }
function closeLightbox() { $('#lightbox').classList.remove('open'); $('#lightbox').setAttribute('aria-hidden', 'true'); $('#lightboxImage').removeAttribute('src'); lightboxTrigger?.focus(); }
function initLightbox() { $('#closeLightbox').addEventListener('click', closeLightbox); $('#lightbox').addEventListener('click', e => { if (e.target === $('#lightbox')) closeLightbox(); }); document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#lightbox').classList.contains('open')) closeLightbox(); if (e.key === 'Tab' && $('#lightbox').classList.contains('open')) { e.preventDefault(); $('#closeLightbox').focus(); } }); }

// =============================================================
// ANIMAÇÕES DE ENTRADA — IntersectionObserver eficiente
// =============================================================
function initScrollAnimations() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reducedMotion || !('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08, rootMargin: '0px 0px -25px 0px' });
  items.forEach(el => observer.observe(el));
}

// =============================================================
// PARTÍCULAS — canvas adaptável, pausado em aba inativa
// =============================================================
function initParticles() {
  if (reducedMotion) return;
  const canvas = $('#particles'); const ctx = canvas.getContext('2d'); if (!ctx) return;
  let dots = [], frameId = null, width = 0, height = 0;
  const resize = () => { width = canvas.width = canvas.clientWidth; height = canvas.height = canvas.clientHeight; const count = Math.min(65, Math.floor(width / 18)); dots = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5 + .35, speed: Math.random() * .4 + .1, opacity: Math.random() * .5 + .2 })); };
  const draw = () => { ctx.clearRect(0, 0, width, height); dots.forEach(dot => { dot.y -= dot.speed; if (dot.y < -4) { dot.y = height + 4; dot.x = Math.random() * width; } ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(186,166,255,${dot.opacity})`; ctx.fill(); }); frameId = requestAnimationFrame(draw); };
  window.addEventListener('resize', resize, { passive: true }); document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(frameId); else draw(); }); resize(); draw();
  // Parallax discreto somente em dispositivos com mouse.
  if (window.matchMedia('(pointer:fine)').matches) window.addEventListener('pointermove', e => { const x = (e.clientX / innerWidth - .5) * 16; const y = (e.clientY / innerHeight - .5) * 16; $('.orb-one').style.transform = `translate(${x}px, ${y}px)`; }, { passive: true });
}

// =============================================================
// ÁUDIO — precisa de assets/audio/music.mp3 real
// =============================================================
function initMusic() {
  const audio = $('#backgroundMusic'), toggle = $('#musicToggle'), label = $('#musicLabel'); audio.volume = .35;
  toggle.addEventListener('click', async () => { if (!audio.paused) { audio.pause(); return; } try { await audio.play(); } catch { label.textContent = 'Adicione music.mp3'; } });
  audio.addEventListener('play', () => { label.textContent = 'Pausar'; toggle.setAttribute('aria-pressed', 'true'); toggle.setAttribute('aria-label', 'Pausar música'); });
  audio.addEventListener('pause', () => { label.textContent = 'Música'; toggle.setAttribute('aria-pressed', 'false'); toggle.setAttribute('aria-label', 'Reproduzir música'); });
  audio.addEventListener('error', () => { label.textContent = 'Sem áudio'; });
  $('#musicVolume').addEventListener('input', e => { audio.volume = Number(e.target.value) / 100; });
}

// =============================================================
// RSVP — validação, armazenamento local e link wa.me
// =============================================================
// IMPORTANTE: wa.me NÃO envia sozinho. Abre uma conversa com texto
// preenchido; o convidado precisa confirmar o envio no WhatsApp.
// LocalStorage salva somente neste navegador, NÃO é banco de dados.
// Para receber RSVPs de todos em painel central, será preciso backend.
// FUTURO: integrar WhatsApp Business API / Meta Cloud API, Twilio,
// Evolution API ou Z-API em um servidor seguro, com autenticação,
// consentimento, proteção de credenciais e tratamento LGPD.
// NUNCA coloque tokens ou chaves de APIs no JavaScript público.
function initRSVP() {
  $('#rsvpForm').addEventListener('submit', event => {
    event.preventDefault(); const name = $('#guestName').value.trim(); const phone = $('#guestPhone').value.replace(/\D/g, ''); const companions = Number($('#companions').value); const status = $('#rsvpStatus');
    if (name.length < 3) { status.textContent = 'Informe seu nome completo (mínimo 3 caracteres).'; $('#guestName').focus(); return; }
    if (phone.length < 10 || phone.length > 13) { status.textContent = 'Informe um telefone válido com DDD.'; $('#guestPhone').focus(); return; }
    if (!Number.isInteger(companions) || companions < 0 || companions > 5) { status.textContent = 'Selecione a quantidade de acompanhantes.'; return; }
    const destination = CONFIG.whatsappNumero.replace(/\D/g, '');
    if (destination.length < 10 || destination.length > 15) { status.textContent = 'O WhatsApp do organizador precisa ser configurado no script.js.'; return; }
    const confirmation = { name, phone, companions, createdAt: new Date().toISOString() };
    try { localStorage.setItem('aniversario_rsvp', JSON.stringify(confirmation)); } catch { /* Navegadores privados podem bloquear armazenamento; WhatsApp continua disponível. */ }
    const message = `Olá! 🎓🎉\n\n✅ Estou confirmando minha presença na comemoração de formatura em ADS e aniversário de ${CONFIG.nomeAniversariante}.\n\nNome: ${name}\nTelefone: ${phone}\nQuantidade de acompanhantes: ${companions}\n\nNos vemos na festa! 🎉`;
    const url = `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
    status.textContent = '✓ Confirmação preparada! Envie a mensagem na janela do WhatsApp.';
    status.classList.add('success'); $('#rsvpForm').classList.add('confirmed');
    // Abertura direta no gesto do clique reduz bloqueio de pop-up.
    const tab = window.open(url, '_blank', 'noopener,noreferrer');
    if (!tab) { status.textContent = '✓ Dados salvos. Toque no link para abrir o WhatsApp.'; const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Abrir WhatsApp ↗'; status.append(' ', link); }
  });
  try { const saved = JSON.parse(localStorage.getItem('aniversario_rsvp') || 'null'); if (saved) { $('#guestName').value = saved.name || ''; $('#guestPhone').value = saved.phone || ''; $('#companions').value = String(saved.companions ?? 0); } } catch { /* Dados antigos inválidos são ignorados. */ }
}

// =============================================================
// MURAL COMPARTILHADO — Firebase Realtime Database
// =============================================================
// Os recados são públicos e sincronizados entre navegadores.
// O Firebase aplica as regras de criação, leitura e exclusão.
function initWishes() {
  const grid = $('#wishesGrid');
  const form = $('#wishForm');
  const status = $('#wishStatus');
  const submit = form.querySelector('[type="submit"]');

  // onValue recebe uma atualização sempre que o banco mudar.
  onValue(messagesRef, snapshot => {
    grid.replaceChildren();
    const raw = snapshot.val() || {};
    const wishes = Object.entries(raw).map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 100);
    if (!wishes.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-wishes';
      empty.textContent = 'O primeiro recado pode ser o seu ✦';
      grid.append(empty);
      return;
    }
    wishes.forEach(wish => {
      const card = document.createElement('article'); card.className = 'wish-card glass';
      const quote = document.createElement('span'); quote.className = 'quote-mark'; quote.textContent = '“';
      const message = document.createElement('p'); message.textContent = wish.text || '';
      const author = document.createElement('strong'); author.textContent = `— ${wish.name || 'Convidado'}`;
      const date = document.createElement('small');
      date.textContent = Number.isFinite(wish.createdAt) ? new Date(wish.createdAt).toLocaleString('pt-BR') : '';
      card.append(quote, message, author, date); grid.append(card);
    });
  }, error => {
    status.textContent = 'Não foi possível carregar os recados. Verifique sua conexão e as regras do Firebase.';
    console.error('Firebase mural:', error);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = $('#wishName').value.trim();
    const text = $('#wishText').value.trim();
    if (name.length < 2 || name.length > 60 || text.length < 3 || text.length > 500) {
      status.textContent = 'Informe um nome (2–60 caracteres) e um recado (3–500 caracteres).';
      return;
    }
    if (submit) submit.disabled = true;
    status.textContent = 'Publicando seu recado...';
    try {
      await push(messagesRef, { name, text, createdAt: Date.now() });
      form.reset();
      status.textContent = '✓ Recado publicado para todos os convidados!';
    } catch (error) {
      console.error('Erro ao publicar recado:', error);
      status.textContent = 'Não foi possível publicar. Confira as regras do Firebase e tente novamente.';
    } finally { if (submit) submit.disabled = false; }
  });
}

// =============================================================
// INICIALIZAÇÃO — roda após o HTML estar disponível (script defer)
// =============================================================
populateContent(); initGate(); buildGallery(); initLightbox(); initScrollAnimations(); initParticles(); initMusic(); initRSVP(); initWishes(); updateCountdown(); setInterval(updateCountdown, 1000);
