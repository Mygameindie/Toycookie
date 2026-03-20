// ===== DEFAULT VISIBLE ITEMS =====
const GENDER_DEFAULTS = {
  girl: (n) => [`bottomunderwear${n}_1.png`, `topunderwear${n}_1.png`],
  boy:  (n) => [`boxers${n}_1.png`],
};

function applyDefaults() {
  document.querySelectorAll('.char-wrap').forEach(wrap => {
    const n      = wrap.dataset.char;
    const gender = CHARACTER_GENDERS[n];
    const getIds = GENDER_DEFAULTS[gender];
    if (!getIds) return;

    [`bottomunderwear${n}_1.png`, `topunderwear${n}_1.png`, `boxers${n}_1.png`].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.visibility = 'hidden';
    });

    getIds(n).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.visibility = 'visible';
    });
  });
}
