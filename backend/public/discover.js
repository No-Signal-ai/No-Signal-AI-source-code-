// discover.js — Page découverte personnages publics
// Module ESM — chargé avec type="module" depuis discover.html

const BACKEND_URL = (window.NO_SIGNAL_BACKEND_URL || '').replace(/\/$/, '');

let allCharacters = [];
let activeCategory = '';
let searchQuery = '';

// Refs DOM
const grid     = document.getElementById('discover-grid');
const chipsEl  = document.getElementById('category-chips');
const searchEl = document.getElementById('search-input');

// ── HTML escape (XSS protection — identique à characters.js l.20) ────────────
function escHtml(str) {
  return (str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Filtre combiné (catégorie ET nom) ─────────────────────────────────────────
function getFiltered() {
  return allCharacters.filter(char => {
    const matchCat  = !activeCategory || char.category === activeCategory;
    const matchName = !searchQuery || char.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchName;
  });
}

// ── Construire une carte personnage ──────────────────────────────────────────
function buildDiscoverCard(char) {
  const card = document.createElement('div');
  card.className = 'discover-card';

  // Fallback avatar textuel (bucket privé — pas de signed URL)
  const avatar = document.createElement('div');
  avatar.className = 'discover-avatar';
  avatar.textContent = '◈';

  // Nom — textContent (pas d'HTML requis, plus sûr que innerHTML)
  // escHtml() conservé comme garde-fou si usage innerHTML ailleurs
  const nameEl = document.createElement('div');
  nameEl.className = 'discover-name';
  nameEl.textContent = escHtml(char.name);

  // Méta : catégorie + compteur de chats
  const meta = document.createElement('div');
  meta.className = 'discover-meta';

  const catEl = document.createElement('span');
  catEl.className = 'discover-category';
  catEl.textContent = escHtml(char.category || 'autre');

  const countEl = document.createElement('span');
  countEl.className = 'discover-count';
  countEl.textContent = Number(char.chat_count ?? 0) + ' chats';

  meta.appendChild(catEl);
  meta.appendChild(countEl);

  // Bouton démarrer un chat
  const btn = document.createElement('button');
  btn.className = 'btn-discover-chat';
  btn.textContent = 'Démarrer un chat';
  btn.addEventListener('click', () => {
    window.location.href = '/?character_id=' + encodeURIComponent(char.id);
  });

  card.appendChild(avatar);
  card.appendChild(nameEl);
  card.appendChild(meta);
  card.appendChild(btn);

  return card;
}

// ── Rendre la grille ──────────────────────────────────────────────────────────
function renderGrid() {
  grid.innerHTML = '';
  const filtered = getFiltered();

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'discover-empty';
    empty.textContent = 'Aucun personnage trouvé.';
    grid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const char of filtered) {
    fragment.appendChild(buildDiscoverCard(char));
  }
  grid.appendChild(fragment);
}

// ── Charger les personnages publics ──────────────────────────────────────────
async function loadCharacters() {
  try {
    const res = await fetch(BACKEND_URL + '/api/characters/public');
    if (!res.ok) throw new Error('Erreur réseau : ' + res.status);
    allCharacters = await res.json();
    renderGrid();
  } catch (err) {
    grid.innerHTML = '';
    const errEl = document.createElement('p');
    errEl.className = 'discover-empty';
    errEl.textContent = 'Impossible de charger les personnages. Réessaie plus tard.';
    grid.appendChild(errEl);
    console.error('[discover] loadCharacters error:', err);
  }
}

// ── Événements filtres catégorie ─────────────────────────────────────────────
chipsEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.category-chip');
  if (!chip) return;

  // Retirer .active de tous les chips
  chipsEl.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  activeCategory = chip.dataset.category ?? '';
  renderGrid();
});

// ── Événement recherche ───────────────────────────────────────────────────────
searchEl.addEventListener('input', () => {
  searchQuery = searchEl.value.trim();
  renderGrid();
});

// ── Boot ──────────────────────────────────────────────────────────────────────
await loadCharacters();
