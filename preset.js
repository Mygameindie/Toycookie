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
  // char3 (girl)
  'bottomunderwear3',
  'topunderwear3',
  'stocking3',
  'onepiece3',
  'socks3',
  'sweatshirt3',
  'shoes3',
  'pants3',
  'skirt3',
  'skirt3w',
  'top3',
  'dress3',
  'dress3w',
  'jacket3',
  'bunnysuitbow3',
  'accessories3',
  'hat3',
  'mask3',
  'bow3',
  'expression3',
];

function showItem(itemId, categoryName) {
  const el = document.getElementById(itemId);
  if (!el) { console.warn('Item not found:', itemId); return; }
  el.style.visibility = 'visible';
  el.style.zIndex = getZIndex(categoryName);
}

function applyDefaultPreset() {
  hideCategories(ALL_CATEGORIES);
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
  showItem('dress1_1.png', 'dress1');
  showItem('bow1_1.png', 'bow1');
  showItem('hat1_1.png', 'hat1');
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
