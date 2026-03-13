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
  // char4 (girl)
  'bottomunderwear4',
  'topunderwear4',
  'stocking4',
  'onepiece4',
  'socks4',
  'sweatshirt4',
  'shoes4',
  'pants4',
  'skirt4',
  'skirt4w',
  'top4',
  'dress4',
  'dress4w',
  'jacket4',
  'bunnysuitbow4',
  'accessories4',
  'hat4',
  'mask4',
  'bow4',
  'expression4',
];

function showItem(itemId, categoryName) {
  const el = document.getElementById(itemId);
  if (!el) { console.warn('Item not found:', itemId); return; }
  el.style.visibility = 'visible';
  el.style.zIndex = getZIndex(categoryName);
}

function applyDefaultPreset() {
  hideCategories(ALL_CATEGORIES);
  // char1
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
  showItem('dress1_1.png', 'dress1');
  showItem('bow1_1.png', 'bow1');
  showItem('hat1_1.png', 'hat1');
  // char4
  showItem('topunderwear4_1.png', 'topunderwear4');
  showItem('bottomunderwear4_1.png', 'bottomunderwear4');
  showItem('dress4_1.png', 'dress4');
  showItem('bow4_1.png', 'bow4');
  showItem('hat4_1.png', 'hat4');
}

function applyUnderwear() {
  hideCategories(ALL_CATEGORIES);
  // char1
  showItem('topunderwear1_1.png', 'topunderwear1');
  showItem('bottomunderwear1_1.png', 'bottomunderwear1');
  // char4
  showItem('topunderwear4_1.png', 'topunderwear4');
  showItem('bottomunderwear4_1.png', 'bottomunderwear4');
}

function applyBunnyPreset() {
  hideCategories(ALL_CATEGORIES);
  // char1
  showItem('bunnysuitbow1_1.png', 'bunnysuitbow1');
  showItem('hat1_1.png', 'hat1');
  showItem('onepiece1_1.png', 'onepiece1');
  showItem('shoes1_1.png', 'shoes1');
  showItem('stocking1_1.png', 'stocking1');
  // char4
  showItem('bunnysuitbow4_1.png', 'bunnysuitbow4');
  showItem('hat4_1.png', 'hat4');
  showItem('onepiece4_1.png', 'onepiece4');
  showItem('shoes4_1.png', 'shoes4');
  showItem('stocking4_1.png', 'stocking4');
}
