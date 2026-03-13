// ===== TOYS =====
// Draggable toy items loaded from toys.json.
// When a toy is dragged over a character's belly button the base image
// toggles (changing the character's face).
//
// toys.json format:
//   [ { "id": "toy_1", "src": "toy_1.png", "alt": "My Toy" }, ... ]

let _toyIdCounter = 0;
let _toyTopZ = 250;
// Tracks which toy+character pairs are currently overlapping (entry-only trigger)
const _toyColliding = new Set();

// ===== SPAWN TOY =====
function spawnToy(src, alt) {
  const stage = document.querySelector('.stage');
  if (!stage) return;

  const toy = document.createElement('img');
  toy.className = 'toy-item';
  toy.src = src;
  toy.alt = alt || 'toy';
  toy.draggable = false;
  toy.dataset.toyId = ++_toyIdCounter;

  // Random starting position inside the stage
  toy.style.left = (15 + Math.random() * 55) + '%';
  toy.style.top  = (5  + Math.random() * 45) + '%';

  stage.appendChild(toy);
  _makeToyDraggable(toy);
}

// ===== COLLISION CHECK =====
// Activates genital state while toy overlaps; deactivates when toy leaves.
function _checkToyCollision(toy) {
  const toyRect = toy.getBoundingClientRect();
  const tid = toy.dataset.toyId;

  document.querySelectorAll('.genital-btn').forEach(btn => {
    const n   = btn.closest('.char-wrap')?.dataset.char;
    const key = `${tid}-${n}`;
    const r   = btn.getBoundingClientRect();

    const overlapping = !(
      toyRect.right  < r.left  ||
      toyRect.left   > r.right ||
      toyRect.bottom < r.top   ||
      toyRect.top    > r.bottom
    );

    if (overlapping && !_toyColliding.has(key)) {
      _toyColliding.add(key);
      setGenital(n, true);
      toy.classList.add('toy-touched');
      setTimeout(() => toy.classList.remove('toy-touched'), 400);
    } else if (!overlapping && _toyColliding.has(key)) {
      _toyColliding.delete(key);
      setGenital(n, false);
    }
  });
}

// Clears all active collisions for a toy (call on removal or drag end if needed).
function _clearToyCollisions(toy) {
  const tid = toy.dataset.toyId;
  document.querySelectorAll('.genital-btn').forEach(btn => {
    const n   = btn.closest('.char-wrap')?.dataset.char;
    const key = `${tid}-${n}`;
    if (_toyColliding.has(key)) {
      _toyColliding.delete(key);
      setGenital(n, false);
    }
  });
}

// ===== TOY DRAG =====
function _makeToyDraggable(toy) {
  let sx, sy, ox, oy;

  function pointerDown(e) {
    e.preventDefault();   // stop native browser image-drag from stealing events
    e.stopPropagation();
    const pt = e.touches ? e.touches[0] : e;
    sx = pt.clientX;
    sy = pt.clientY;
    ox = toy.offsetLeft;
    oy = toy.offsetTop;
    toy.style.zIndex = ++_toyTopZ;
    toy.classList.add('toy-dragging');
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);
    window.addEventListener('touchmove', pointerMove, { passive: false });
    window.addEventListener('touchend', pointerUp);
  }

  function pointerMove(e) {
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    toy.style.left = (ox + pt.clientX - sx) + 'px';
    toy.style.top  = (oy + pt.clientY - sy) + 'px';
    _checkToyCollision(toy);
  }

  function pointerUp() {
    toy.classList.remove('toy-dragging');
    window.removeEventListener('mousemove', pointerMove);
    window.removeEventListener('mouseup', pointerUp);
    window.removeEventListener('touchmove', pointerMove);
    window.removeEventListener('touchend', pointerUp);
  }

  toy.addEventListener('mousedown', pointerDown);
  toy.addEventListener('touchstart', pointerDown, { passive: false });
  toy.addEventListener('dragstart', e => e.preventDefault());

  // Double-click / double-tap to remove
  let lastTap = 0;
  toy.addEventListener('dblclick', () => { _clearToyCollisions(toy); toy.remove(); });
  toy.addEventListener('touchend', () => {
    const now = Date.now();
    if (now - lastTap < 350) { _clearToyCollisions(toy); toy.remove(); }
    lastTap = now;
  });
}

// ===== LOAD JSON & BUILD PANEL =====
async function _initToys() {
  const toolbar = document.querySelector('.toolbar');
  if (!toolbar) return;

  // Fetch toys.json
  let toyData = [];
  try {
    const res = await fetch('toys.json');
    if (res.ok) toyData = await res.json();
  } catch {
    console.warn('toys.json could not be loaded');
  }

  // Build toy-picker panel
  const panel = document.createElement('div');
  panel.id = 'toy-panel';
  panel.className = 'toy-panel';

  toyData.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'toy-spawn-btn';
    btn.title = item.alt || item.id;

    const thumb = document.createElement('img');
    thumb.src = item.src;
    thumb.alt = item.alt || item.id;
    thumb.draggable = false;
    btn.appendChild(thumb);

    btn.addEventListener('click', () => {
      spawnToy(item.src, item.alt || item.id);
      panel.style.display = 'none';
      toggleBtn.classList.remove('active');
    });
    panel.appendChild(btn);
  });

  // Insert panel just before toolbar so it appears above it
  toolbar.parentElement.insertBefore(panel, toolbar);

  // Toolbar toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toy-button';
  toggleBtn.textContent = '🧸 Toys';
  toggleBtn.addEventListener('click', () => {
    const visible = panel.style.display === 'flex';
    panel.style.display = visible ? 'none' : 'flex';
    toggleBtn.classList.toggle('active', !visible);
  });
  toolbar.appendChild(toggleBtn);

  // Close panel when clicking outside
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== toggleBtn) {
      panel.style.display = 'none';
      toggleBtn.classList.remove('active');
    }
  }, true);
}

document.addEventListener('DOMContentLoaded', _initToys);
