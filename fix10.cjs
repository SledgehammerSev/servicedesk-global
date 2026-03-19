const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(file, 'utf8');

function rep(old, nw, label, all) {
  if (!code.includes(old)) { console.log('MISS', label); return false; }
  code = all ? code.split(old).join(nw) : code.replace(old, nw);
  console.log('OK  ', label);
  return true;
}

// ─── 1. Move PERSPECTIVES block above HEATMAP ────────────────────────────────
const PERSP_START = '      {/* PERSPECTIVES */}';
const ROSTER_START = '      {/* ROSTER */}';
const HEAT_START  = '      {/* HEATMAP */}';

const perspIdx  = code.indexOf(PERSP_START);
const rosterIdx = code.indexOf(ROSTER_START);
const heatIdx   = code.indexOf(HEAT_START);

if (perspIdx === -1 || rosterIdx === -1 || heatIdx === -1) {
  console.log('MISS section markers', { perspIdx, rosterIdx, heatIdx });
} else if (heatIdx > perspIdx) {
  console.log('SKIP perspectives already above heatmap');
} else {
  // Block = newline before PERSP_START up to (not including) the newline before ROSTER_START
  const blockStart = code.lastIndexOf('\n', perspIdx);
  const blockEnd   = code.lastIndexOf('\n', rosterIdx - 1);
  const perspBlock = code.slice(blockStart, blockEnd);

  // Remove from current position
  code = code.slice(0, blockStart) + code.slice(blockEnd);

  // Insert just before HEATMAP
  const newHeatIdx = code.indexOf(HEAT_START);
  const insertAt   = code.lastIndexOf('\n', newHeatIdx);
  code = code.slice(0, insertAt) + perspBlock + code.slice(insertAt);
  console.log('OK   moved PERSPECTIVES above HEATMAP');
}

// ─── 2. Add flashOn state ────────────────────────────────────────────────────
rep(
  'var _dm=useState(false),darkMode=_dm[0],sDM=_dm[1];',
  'var _dm=useState(false),darkMode=_dm[0],sDM=_dm[1];var _fOn=useState(false),flashOn=_fOn[0],sFOn=_fOn[1];',
  'flashOn state'
);

// ─── 3. Trigger flash in handleSug only when agents were added ───────────────
rep(
  'sSM(met);},[st.ba,en,coObj,fL,sDt,sugCity,sugSkills,catFilter,levelFilter]);',
  'sSM(met);if(sg.length>0){sFOn(true);setTimeout(function(){sFOn(false);},1500);};},[st.ba,en,coObj,fL,sDt,sugCity,sugSkills,catFilter,levelFilter]);',
  'flash trigger in handleSug'
);

// ─── 4. Flash background on newly proposed roster rows ───────────────────────
rep(
  'background:onR2?_bgOn:_bgW,opacity:isEn2?1:0.45',
  'background:flashOn&&ai>=st.ba.length?"#b8f0c0":onR2?_bgOn:_bgW,opacity:isEn2?1:0.45',
  'flash bg on proposed rows'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
