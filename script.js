// ===== CHARACTER GENDER CONFIG =====
// Change 'girl' or 'boy' here to update each character's gender.
// This controls which clothing categories appear in the scroll bar for each character.
const CHARACTER_GENDERS = {
  1: 'girl',  // char1 → girl
  2: 'boy',   // char2 → boy
};

// Categories shown ONLY for girl characters (hidden for boy characters)
const GIRL_ONLY_CATS = ['skirt', 'dress', 'stocking', 'onepiece', 'bow'];

// Categories shown ONLY for boy characters (hidden for girl characters)
const BOY_ONLY_CATS = ['boxers'];

// ===== CONFIG =====
const jsonFiles = [
  // Character 1 (girl)
  'bottomunderwear1.json', 'topunderwear1.json', 'stocking1.json',
  'onepiece1.json', 'socks1.json', 'boxers1.json', 'sweatshirt1.json',
  'shoes1.json', 'pants1.json', 'skirt1.json', 'skirt1w.json',
  'top1.json', 'dress1.json', 'dress1w.json', 'jacket1.json',
  'bunnysuitbow1.json', 'accessories1.json', 'hat1.json', 'mask1.json',
  'bow1.json', 'expression1.json',
  // Character 2 (boy)
  'bottomunderwear2.json', 'socks2.json', 'boxers2.json', 'sweatshirt2.json',
  'shoes2.json', 'pants2.json', 'top2.json', 'jacket2.json',
  'accessories2.json', 'hat2.json', 'mask2.json', 'expression2.json',
];

const COLORS = {
  Original: null,
  Red: '#ff3b30', Orange: '#ff9500', Yellow: '#ffcc00',
  Green: '#34c759', Cyan: '#32ade6', Blue: '#007aff',
  Purple: '#af52de', Pink: '#ff2d55',
};

const Z = {
  stocking:20, bottomunderwear:30, topunderwear:40, onepiece:50,
  socks:55, boxers:60, sweatshirt:70, shoes:80, pants:90, skirt:100,
  top:110, dress:130, jacket:140, bunnysuitbow:145,
  accessories:150, hat:160, mask:170, bow:180, expression:190,
};

// ===== HELPERS =====
function getZIndex(cat) {
  return Z[cat.replace(/\d+w?$/, '')] || 0;
}

function charWrap(num) {
  return document.querySelector(`.char-wrap[data-char="${num}"]`);
}

function charNum(categoryName) {
  return (categoryName.match(/(\d+)/) || [])[1] || null;
}

async function loadJSON(file) {
  try {
    const r = await fetch(file);
    if (!r.ok) throw new Error(file);
    return r.json();
  } catch {
    console.warn('Could not load:', file);
    return [];
  }
}

function hideCategory(cat) {
  document.querySelectorAll(`.${cat}`).forEach(el => {
    el.style.visibility = 'hidden';
  });
}

function hideCategories(cats) {
  cats.forEach(hideCategory);
}

// ===== BASE IMAGE STATE =====
const bellyActive   = {};
const genitalActive = {};

function updateBase(num) {
  const img = document.getElementById(`base${num}`);
  if (img) img.src = (bellyActive[num] || genitalActive[num]) ? `base${num}_1.png` : `base${num}.png`;
}

// ===== BELLY TOGGLE =====
function setBelly(num, on) {
  bellyActive[num] = on;
  updateBase(num);
}

// ===== CHEST & GENITAL TOGGLES =====
// Image files needed per character:
//   Girls: base{n}_chest.png, base{n}_genital.png
//   Boys:  base{n}_genital.png
const chestOn = {};

function toggleChest(num) {
  chestOn[num] = !chestOn[num];
  const overlay = document.getElementById(`chest-overlay${num}`);
  if (overlay) overlay.style.visibility = chestOn[num] ? 'visible' : 'hidden';
}

function setGenital(num, on) {
  genitalActive[num] = on;
  updateBase(num);
}


function _addOverlayBtn(wrap, className, clickFn) {
  const btn = document.createElement('button');
  btn.className = className;
  let lastTouch = 0;
  btn.addEventListener('mousedown', e => e.stopPropagation());
  btn.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
  btn.addEventListener('touchend', e => {
    e.stopPropagation();
    e.preventDefault();
    lastTouch = Date.now();
    clickFn();
  }, { passive: false });
  // Only fire on mouse click — skip if touch already handled it
  btn.addEventListener('click', () => { if (Date.now() - lastTouch > 500) clickFn(); });
  wrap.appendChild(btn);
}

function _addHoldBtn(wrap, className, onFn, offFn) {
  const btn = document.createElement('button');
  btn.className = className;
  btn.addEventListener('mousedown', e => { e.stopPropagation(); onFn(); });
  btn.addEventListener('mouseup', () => offFn());
  btn.addEventListener('mouseleave', () => offFn());
  btn.addEventListener('touchstart', e => { e.stopPropagation(); onFn(); }, { passive: true });
  btn.addEventListener('touchend', e => { e.stopPropagation(); offFn(); });
  wrap.appendChild(btn);
}

function _addOverlayImg(wrap, id, src) {
  const img = document.createElement('img');
  img.id  = id;
  img.src = src;
  img.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:auto;visibility:hidden;pointer-events:none;z-index:15;';
  wrap.appendChild(img);
}

// ===== DRAG & DROP (characters carry clothing with them) =====
let topZ = 10; // character layer counter

function makeDraggable(wrap) {
  let sx, sy, ox, oy, dragged = false;

  function pointerDown(e) {
    // Don't start drag from overlay buttons
    if (e.target.classList.contains('belly-btn') ||
        e.target.classList.contains('chest-btn') ||
        e.target.classList.contains('genital-btn')) return;
    const pt = e.touches ? e.touches[0] : e;
    sx = pt.clientX; sy = pt.clientY;
    ox = wrap.offsetLeft; oy = wrap.offsetTop;
    dragged = false;
    wrap.style.zIndex = ++topZ;
    wrap.classList.add('dragging');
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);
    window.addEventListener('touchmove', pointerMove, { passive: false });
    window.addEventListener('touchend', pointerUp);
  }

  function pointerMove(e) {
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - sx, dy = pt.clientY - sy;
    if (!dragged && Math.abs(dx) + Math.abs(dy) > 5) dragged = true;
    if (dragged) {
      wrap.style.left = (ox + dx) + 'px';
      wrap.style.top  = (oy + dy) + 'px';
    }
  }

  function pointerUp() {
    wrap.classList.remove('dragging');
    window.removeEventListener('mousemove', pointerMove);
    window.removeEventListener('mouseup', pointerUp);
    window.removeEventListener('touchmove', pointerMove);
    window.removeEventListener('touchend', pointerUp);
  }

  wrap.addEventListener('mousedown', pointerDown);
  wrap.addEventListener('touchstart', pointerDown, { passive: false });
}

// ===== VISIBILITY TOGGLE =====
const CONFLICTS = {
  onepiece1: ['topunderwear1','bottomunderwear1'],
  topunderwear1: ['onepiece1'], bottomunderwear1: ['onepiece1'],
  dress1: ['top1','pants1','skirt1','sweatshirt1','bunnysuitbow1'],
  bunnysuitbow1: ['dress1','jacket1'],
  jacket1: ['bunnysuitbow1'],
  stocking1: ['socks1'], socks1: ['stocking1'],
  pants1: ['skirt1'], skirt1: ['pants1'],
  // Character 2 (boy)
  pants2: ['skirt2'], skirt2: ['pants2'],
  socks2: ['stocking2'], stocking2: ['socks2'],
};

function toggleVisibility(itemId, categoryName) {
  document.querySelectorAll(`.${categoryName}`).forEach(el => {
    if (el.id !== itemId) el.style.visibility = 'hidden';
  });

  const el = document.getElementById(itemId);
  if (!el) return;

  const making_visible = el.style.visibility !== 'visible';
  el.style.visibility = making_visible ? 'visible' : 'hidden';

  if (making_visible) {
    const conflicts = CONFLICTS[categoryName];
    if (conflicts) {
      hideCategories(conflicts);
    } else {
      const n = charNum(categoryName);
      if (n && /^(top|pants|skirt|sweatshirt)/.test(categoryName)) {
        hideCategory(`dress${n}`);
      }
    }
  }
}

// ===== COLOR SYSTEM =====
const _colorCache = new Map();

function _rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = 0, l = (max + min) / 2;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function _hslToRgb(h, s, l) {
  h /= 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => {
    t = ((t % 1) + 1) % 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return [Math.round(f(h + 1/3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1/3) * 255)];
}

async function setItemColor(itemId, hex) {
  const el = document.getElementById(itemId);
  if (!el) return;
  if (!el.dataset.originalSrc) el.dataset.originalSrc = el.src;

  if (!hex) {
    el.src = el.dataset.originalSrc;
    el.style.filter = '';
    return;
  }

  const cacheKey = `${el.dataset.originalSrc}|${hex}`;
  if (_colorCache.has(cacheKey)) { el.src = _colorCache.get(cacheKey); return; }

  if (!el.complete || !el.naturalWidth) {
    await new Promise(res => { el.onload = res; el.onerror = res; });
  }

  const pr = parseInt(hex.slice(1, 3), 16), pg = parseInt(hex.slice(3, 5), 16), pb = parseInt(hex.slice(5, 7), 16);
  const [targetH] = _rgbToHsl(pr, pg, pb);
  const w = el.naturalWidth, h = el.naturalHeight;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });

  try { ctx.drawImage(el, 0, 0); } catch {
    el.style.filter = `hue-rotate(${Math.round(targetH)}deg)`;
    return;
  }

  const imgData = ctx.getImageData(0, 0, w, h), d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const [, sat, light] = _rgbToHsl(d[i], d[i + 1], d[i + 2]);
    if (light < 0.03 || light > 0.97) continue;
    [d[i], d[i + 1], d[i + 2]] = _hslToRgb(targetH, sat, light);
  }
  ctx.putImageData(imgData, 0, 0);
  const url = cv.toDataURL('image/png');
  _colorCache.set(cacheKey, url);
  el.src = url;
  el.style.filter = '';
}

async function setItemNamedColor(itemId, colorName) {
  const hex = COLORS[colorName] ?? null;
  await setItemColor(itemId, hex);
  // Sync wind variant
  const m = /^((?:skirt|dress)[123]_\d+)(w?)\.png$/.exec(String(itemId));
  if (m) {
    const sibling = m[2] ? `${m[1]}.png` : `${m[1]}w.png`;
    if (document.getElementById(sibling)) await setItemColor(sibling, hex);
  }
}

window.setItemNamedColor = setItemNamedColor;

// ===== COLOR PICKER =====
let currentlySelectedItem = null;

function createColorPicker() {
  if (document.querySelector('.color-picker-container')) return;

  const container = document.createElement('div');
  container.className = 'color-picker-container';
  container.style.display = 'none';

  // Named swatches
  const swatchTitle = document.createElement('h4');
  swatchTitle.textContent = 'Color';
  container.appendChild(swatchTitle);

  const grid = document.createElement('div');
  grid.className = 'color-grid';
  Object.entries(COLORS).forEach(([name, hex]) => {
    const btn = document.createElement('button');
    btn.className = 'color-button' + (name === 'Original' ? ' original' : '');
    btn.setAttribute('aria-label', name);
    btn.title = name;
    if (hex) btn.style.background = hex;
    btn.onclick = () => {
      if (!currentlySelectedItem) return;
      setItemNamedColor(currentlySelectedItem, name);
      hideColorPicker();
    };
    grid.appendChild(btn);
  });
  container.appendChild(grid);

  // Custom color via native picker
  const customTitle = document.createElement('h4');
  customTitle.textContent = 'Custom';
  container.appendChild(customTitle);

  const customRow = document.createElement('div');
  customRow.className = 'custom-color-row';

  const nativeInput = document.createElement('input');
  nativeInput.type = 'color';
  nativeInput.value = '#ff3b30';
  nativeInput.className = 'native-color-input';

  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Apply';
  applyBtn.onclick = () => {
    if (currentlySelectedItem) {
      setItemColor(currentlySelectedItem, nativeInput.value);
      hideColorPicker();
    }
  };

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => {
    if (currentlySelectedItem) {
      setItemColor(currentlySelectedItem, null);
      hideColorPicker();
    }
  };

  customRow.appendChild(nativeInput);
  customRow.appendChild(applyBtn);
  customRow.appendChild(resetBtn);
  container.appendChild(customRow);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-color-picker';
  closeBtn.textContent = 'Close';
  closeBtn.onclick = hideColorPicker;
  container.appendChild(closeBtn);

  document.body.appendChild(container);
}

function showColorPicker(itemId) {
  currentlySelectedItem = itemId;
  if (!document.querySelector('.color-picker-container')) createColorPicker();
  document.querySelector('.color-picker-container').style.display = 'block';
}

function hideColorPicker() {
  const el = document.querySelector('.color-picker-container');
  if (el) el.style.display = 'none';
  currentlySelectedItem = null;
}

// ===== ITEM LOADING =====
async function loadItems(batchSize = 5, delay = 50) {
  for (let i = 0; i < jsonFiles.length; i += batchSize) {
    await Promise.all(jsonFiles.slice(i, i + batchSize).map(async file => {
      const data = await loadJSON(file);
      const cat = file.replace('.json', '');
      const n = charNum(cat);
      const host = n ? charWrap(n) : document.querySelector('.stage');
      if (!host) return;

      data.forEach(item => {
        const id = item.id.endsWith('.png') ? item.id : `${item.id}.png`;
        if (document.getElementById(id)) return; // already hardcoded in HTML
        const img = new Image();
        img.id = id;
        img.src = item.src;
        img.alt = item.alt || id;
        img.className = cat;
        img.dataset.origSrc = item.src;
        img.onerror = () => { img.dataset.missing = '1'; };
        img.style.cssText = [
          `visibility:${item.visibility === 'visible' ? 'visible' : 'hidden'}`,
          'position:absolute',
          'top:0', 'left:0',
          'width:100%',
          'height:auto',
          'pointer-events:none',
          `z-index:${getZIndex(cat)}`,
        ].join(';');
        host.appendChild(img);
      });
    }));
    if (delay) await new Promise(res => setTimeout(res, delay));
  }

  // Hide loading screen
  const ls = document.getElementById('loading-screen');
  if (ls) { ls.classList.add('hidden'); setTimeout(() => ls.remove(), 1600); }
}

// ===== WIND EFFECT =====
function setWindState(on) {
  ['skirt', 'dress'].forEach(k => {
    [1, 2].forEach(n => {
      for (let i = 1; i <= 10; i++) {
        const normalId = `${k}${n}_${i}.png`;
        const windId   = `${k}${n}_${i}w.png`;
        const normal   = document.getElementById(normalId);
        if (!normal) continue;

        let wind = document.getElementById(windId);
        // Create wind element on demand if missing but normal exists and is visible
        if (!wind && on && normal.style.visibility === 'visible') {
          wind = new Image();
          wind.id = windId;
          wind.src = windId;
          wind.className = `${k}${n}w`;
          wind.dataset.origSrc = windId;
          wind.onerror = () => { wind.dataset.missing = '1'; };
          wind.style.cssText = normal.style.cssText.replace('visibility:visible', 'visibility:hidden');
          normal.parentNode.appendChild(wind);
        }

        if (!wind) continue;
        if (on && normal.style.visibility === 'visible') {
          normal.style.visibility = 'hidden';
          wind.style.visibility = 'visible';
        } else if (!on && wind.style.visibility === 'visible') {
          wind.style.visibility = 'hidden';
          normal.style.visibility = 'visible';
        }
      }
    });
  });
}

// ===== GAME INIT =====
function enterGame() {
  document.querySelector('.main-menu').style.display = 'none';
  document.querySelector('.game-container').style.display = 'flex';
  if (typeof applyDefaults === 'function') applyDefaults();
}

document.addEventListener('DOMContentLoaded', () => {
  // Belly buttons — hold to show alternate base, release to restore
  document.querySelectorAll('.belly-btn').forEach(btn => {
    const n = btn.dataset.char;
    btn.addEventListener('mousedown', e => { e.stopPropagation(); setBelly(n, true); });
    btn.addEventListener('mouseup', () => setBelly(n, false));
    btn.addEventListener('mouseleave', () => setBelly(n, false));
    btn.addEventListener('touchstart', e => { e.stopPropagation(); setBelly(n, true); }, { passive: true });
    btn.addEventListener('touchend', () => setBelly(n, false));
  });

  // Chest & Genital overlays + buttons (created based on CHARACTER_GENDERS)
  document.querySelectorAll('.char-wrap').forEach(wrap => {
    const n      = wrap.dataset.char;
    const gender = CHARACTER_GENDERS[n];

    if (gender === 'girl') {
      _addOverlayImg(wrap, `chest-overlay${n}`, `base${n}_chest.png`);
      _addOverlayBtn(wrap, 'chest-btn', () => toggleChest(n));
      _addOverlayImg(wrap, `genital-overlay${n}`, `base${n}_genital.png`);
      _addHoldBtn(wrap, 'genital-btn', () => setGenital(n, true), () => setGenital(n, false));
    } else if (gender === 'boy') {
      _addOverlayImg(wrap, `genital-overlay${n}`, `base${n}_genital.png`);
      _addHoldBtn(wrap, 'genital-btn', () => setGenital(n, true), () => setGenital(n, false));
    }
  });

  // Drag characters
  document.querySelectorAll('.char-wrap').forEach(makeDraggable);

  // Wind button — toggle on/off with each click
  const windBtn = document.getElementById('wind-button');
  if (windBtn) {
    let windOn = false;
    windBtn.addEventListener('click', () => {
      windOn = !windOn;
      setWindState(windOn);
      windBtn.classList.toggle('active', windOn);
    });
  }
});

window.addEventListener('load', loadItems);
