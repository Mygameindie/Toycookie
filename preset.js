// All categories to hide before applying a preset
const ALL_CATEGORIES = [
  'bottomunderwear1',
  'topunderwear1',
  'stocking1',
  'onepiece1',
  'socks1',
  'boxers1',
  'sweatshirt1',
  'shoes1',
  'pants1',
  'skirt1',
  'skirt1w',
  'top1',
  'dress1',
  'dress1w',
  'jacket1',
  'bunnysuitbow1',
  'accessories1',
  'hat1',
  'mask1',
  'bow1',
  'expression1',
];

function showItem(itemId, categoryName) {
  let el = document.getElementById(itemId);
  if (!el) {
    const n = categoryName.match(/\d+/)?.[0];
    const host = n ? document.querySelector(`.char-wrap[data-char="${n}"]`) : null;
    if (!host) { console.warn('Host not found for:', categoryName); return; }
    el = new Image();
    el.id = itemId;
    el.src = itemId;
    el.className = categoryName;
    el.dataset.origSrc = itemId;
    el.style.cssText = `visibility:hidden;position:absolute;top:0;left:0;width:100%;height:auto;pointer-events:none;z-index:${getZIndex(categoryName)}`;
    host.appendChild(el);
  }
  el.style.visibility = 'visible';
  el.style.zIndex = getZIndex(categoryName);
}

function applyDefaultPreset() {
  hideCategories(ALL_CATEGORIES);
  showItem('jacket1_1.png', 'jacket1');
  showItem('pants1_1.png', 'pants1');
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
  showItem('shoes1_1.png', 'shoes1');
  showItem('socks1_1.png', 'socks1');
}

function applyUnderwear() {
  hideCategories(ALL_CATEGORIES);
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
}

function applyBunnyPreset() {
  hideCategories(ALL_CATEGORIES);
  showItem('bunnysuitbow1_1.png', 'bunnysuitbow1');
  showItem('hat1_1.png', 'hat1');
  showItem('onepiece1_1.png', 'onepiece1');
  showItem('shoes1_1.png', 'shoes1');
  showItem('stocking1_1.png', 'stocking1');
}