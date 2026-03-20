document.addEventListener('DOMContentLoaded', () => {
  const presetBar    = document.getElementById('presetScrollBar');
  const categoryBar  = document.getElementById('categoryScrollBar');
  const itemArea     = document.querySelector('.scrollable-buttons');

  const presets = [
    { name: 'Default', action: () => applyDefaultPreset() },
    { name: 'Remove',  action: () => applyUnderwear() },
    { name: 'Bunny',   action: () => applyBunnyPreset() },
  ];

  const categories = [
    // Character 1 (girl)
    'bottomunderwear1', 'topunderwear1', 'stocking1', 'onepiece1',
    'socks1', 'boxers1', 'sweatshirt1', 'shoes1', 'pants1', 'skirt1',
    'top1', 'dress1', 'jacket1', 'bunnysuitbow1',
    'accessories1', 'hat1', 'mask1', 'bow1', 'expression1',
    // Character 2 (boy)
    'bottomunderwear2', 'socks2', 'boxers2', 'sweatshirt2', 'shoes2',
    'pants2', 'top2', 'jacket2', 'accessories2', 'hat2', 'mask2', 'expression2',
    // Character 3 (girl)
    'bottomunderwear3', 'topunderwear3', 'stocking3', 'onepiece3',
    'socks3', 'sweatshirt3', 'shoes3', 'pants3', 'skirt3',
    'top3', 'dress3', 'jacket3', 'bunnysuitbow3',
    'accessories3', 'hat3', 'mask3', 'bow3', 'expression3',
    // Character 4 (girl)
    'bottomunderwear4', 'topunderwear4', 'stocking4', 'onepiece4',
    'socks4', 'sweatshirt4', 'shoes4', 'pants4', 'skirt4',
    'top4', 'dress4', 'jacket4', 'bunnysuitbow4',
    'accessories4', 'hat4', 'mask4', 'bow4', 'expression4',
  ];

  // Build preset buttons
  presets.forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = p.name;
    btn.onclick = p.action;
    presetBar.appendChild(btn);
  });

  // Check if a category is allowed for its character's gender
  function isCatAllowed(cat) {
    const n = parseInt(cat.match(/\d+/)?.[0]);
    if (!n) return true;
    const baseCat = cat.replace(/\d+w?$/, '');
    const gender = CHARACTER_GENDERS[n];
    if (gender === 'boy'  && GIRL_ONLY_CATS.includes(baseCat)) return false;
    if (gender === 'girl' && BOY_ONLY_CATS.includes(baseCat))  return false;
    return true;
  }

  // Build category buttons (filtered by gender)
  categories.forEach(cat => {
    if (!isCatAllowed(cat)) return;
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = () => showCategoryItems(cat);
    categoryBar.appendChild(btn);
  });

  // When a category tab is clicked, load items directly from the JSON file
  async function showCategoryItems(cat) {
    itemArea.innerHTML = '';
    let items;
    try {
      const res = await fetch(`${cat}.json`);
      items = await res.json();
    } catch (e) {
      return; // no JSON for this category
    }

    items.forEach(item => {
      const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;
      const origSrc = item.src;

      const wrap = document.createElement('div');
      wrap.className = 'button-wrap';
      wrap.style.display = 'none'; // hidden until thumbnail confirms it loads

      const thumb = document.createElement('img');
      thumb.src = origSrc.replace(/\.png$/i, 'b.png');
      thumb.onload  = () => { wrap.style.display = ''; };
      thumb.onerror = () => {
        thumb.onerror = () => { wrap.remove(); }; // both b.png and original failed → skip
        thumb.src = origSrc;
      };
      thumb.className = 'item-button';
      thumb.alt = item.alt || itemId;
      thumb.onclick = () => {
        // Ensure the character overlay element exists (fallback if loadItems missed it)
        if (!document.getElementById(itemId)) {
          const n = cat.match(/\d+/)?.[0];
          const host = n ? document.querySelector(`.char-wrap[data-char="${n}"]`) : null;
          if (host) {
            const overlay = new Image();
            overlay.id = itemId;
            overlay.src = origSrc;
            overlay.className = cat;
            overlay.dataset.origSrc = origSrc;
            overlay.style.cssText = `visibility:hidden;position:absolute;top:0;left:0;width:100%;height:auto;pointer-events:none;z-index:${typeof getZIndex === 'function' ? getZIndex(cat) : 100}`;
            host.appendChild(overlay);
          }
        }
        toggleVisibility(itemId, cat);
      };

      const colorBtn = document.createElement('button');
      colorBtn.textContent = '🎨';
      colorBtn.className = 'color-change-button';
      colorBtn.onclick = e => {
        e.stopPropagation();
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'hidden') toggleVisibility(itemId, cat);
        showColorPicker(itemId);
      };

      wrap.appendChild(thumb);
      wrap.appendChild(colorBtn);
      itemArea.appendChild(wrap);
    });
  }

  // Drag-to-scroll on both bars
  [presetBar, categoryBar].forEach(bar => {
    // wheel → horizontal scroll
    bar.addEventListener('wheel', e => {
      if (e.deltaY) { e.preventDefault(); bar.scrollLeft += e.deltaY; }
    }, { passive: false });

    // mouse drag
    let isDown = false, startX, scrollLeft;
    bar.addEventListener('mousedown', e => {
      isDown = true; startX = e.pageX - bar.offsetLeft; scrollLeft = bar.scrollLeft;
      bar.classList.add('dragging');
    });
    bar.addEventListener('mouseleave', () => { isDown = false; bar.classList.remove('dragging'); });
    bar.addEventListener('mouseup',    () => { isDown = false; bar.classList.remove('dragging'); });
    bar.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      bar.scrollLeft = scrollLeft - (e.pageX - bar.offsetLeft - startX) * 1.5;
    });
  });
});
