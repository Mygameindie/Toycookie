// All categories to hide before applying a preset
const CHAR1_CATEGORIES = [
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

const CHAR2_CATEGORIES = [
  'bottomunderwear2',
  'topunderwear2',
  'socks2',
  'boxers2',
  'sweatshirt2',
  'shoes2',
  'pants2',
  'top2',
  'jacket2',
  'bunnysuitbow2',
  'accessories2',
  'hat2',
  'mask2',
  'expression2',
];

const ALL_CATEGORIES = [...CHAR1_CATEGORIES, ...CHAR2_CATEGORIES];

function showItem(itemId, categoryName) {
  const el = document.getElementById(itemId);
  if (!el) { console.warn('Item not found:', itemId); return; }
  el.style.visibility = 'visible';
  el.style.zIndex = getZIndex(categoryName);
}

function applyDefaultPreset() {
  hideCategories(ALL_CATEGORIES);
  // char1 (girl): underwear + dress + bow + hat
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
  showItem('dress1_1.png', 'dress1');
  showItem('bow1_1.png', 'bow1');
  showItem('hat1_1.png', 'hat1');
  // char2 (boy): underwear
  showItem('topunderwear2_1.png', 'topunderwear2');
  showItem('boxers2_1.png', 'boxers2');
}

function applyUnderwear() {
  hideCategories(ALL_CATEGORIES);
  // char1 (girl): underwear only
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
  // char2 (boy): boxers only
  showItem('boxers2_1.png', 'boxers2');
}

function applyBunnyPreset() {
  hideCategories(ALL_CATEGORIES);
  // char1 (girl): bunny suit
  showItem('bunnysuitbow1_1.png', 'bunnysuitbow1');
  showItem('hat1_1.png', 'hat1');
  showItem('onepiece1_1.png', 'onepiece1');
  showItem('shoes1_1.png', 'shoes1');
  showItem('stocking1_1.png', 'stocking1');
  // char2 (boy): bunny suit
  showItem('bunnysuitbow2_1.png', 'bunnysuitbow2');
  showItem('hat2_1.png', 'hat2');
  showItem('shoes2_1.png', 'shoes2');
}
