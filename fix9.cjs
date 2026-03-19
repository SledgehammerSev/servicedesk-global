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

// ─── 1. Fix white edges — set body background via useEffect ──────────────────
rep(
  'useEffect(function(){var t=setInterval(function(){sNow(new Date());},10000);',
  'useEffect(function(){document.documentElement.style.background=darkMode?"#0f1117":"";document.body.style.background=darkMode?"#0f1117":"";document.body.style.color=darkMode?_txM:"";},[darkMode]);useEffect(function(){var t=setInterval(function(){sNow(new Date());},10000);',
  'body bg useEffect'
);

// ─── 2. Add more theme variables for category + misc light backgrounds ────────
// Add to the theme var block
rep(
  '_txFt2=dk?"#404366":"#bbb";',
  '_txFt2=dk?"#404366":"#bbb";_bgUTC=dk?"#13162a":"#f8fafd";_bgCS=dk?"#171b2e":"#f4f8ff";_bdUTC=dk?"#1e2a45":"#dce6f0";_bgItS=dk?"#1a2e4a":"#E6F1FB";_bgItSel=dk?"#162545":"#dae8f8";_bgTR=dk?"#25163a":"#F0EBFA";_bgGr=dk?"#162a16":"#edf5e4";_bgGrSel=dk?"#122212":"#d4e8c0";_bgHol=dk?"#2a1e08":"#fff8ee";_bgYw=dk?"#2a2008":"#fff8e1";_bgPT=dk?"#2a1e08":"#FEF3C7";',
  'extra theme vars'
);

// Also declare them at module level
rep(
  'var dk,_bgW,_bgP,_bgP2,_bgBtn,_bgSel,_bgTh,_bgRow,_bgOn,_bgWarn,_bdM,_bdB,_bdL,_bdI,_txM,_txS,_txS2,_txMt,_txFt,_txFt2;',
  'var dk,_bgW,_bgP,_bgP2,_bgBtn,_bgSel,_bgTh,_bgRow,_bgOn,_bgWarn,_bdM,_bdB,_bdL,_bdI,_txM,_txS,_txS2,_txMt,_txFt,_txFt2,_bgUTC,_bgCS,_bdUTC,_bgItS,_bgItSel,_bgTR,_bgGr,_bgGrSel,_bgHol,_bgYw,_bgPT;',
  'module-level extra vars'
);

// ─── 3. Replace remaining light backgrounds ───────────────────────────────────
rep('background:"#f8fafd"',  'background:_bgUTC',  'bg f8fafd',  true);
rep('background:"#f4f8ff"',  'background:_bgCS',   'bg f4f8ff',  true);
rep('border:"1px solid #dce6f0"', 'border:"1px solid "+_bdUTC', 'bd dce6f0b', true);

// IT Support blue backgrounds (selected states, badges, info panels)
rep('background:"#E6F1FB"',  'background:_bgItS',  'bg E6F1FB',  true);
rep('background:"#dae8f8"',  'background:_bgItSel','bg dae8f8',  true);
rep('background:"#c0d8f0"',  'background:_bgItSel','bg c0d8f0',  true);

// Teleradiology purple backgrounds
rep('background:"#F0EBFA"',  'background:_bgTR',   'bg F0EBFA',  true);
rep('background:"#f3ebff"',  'background:_bgTR',   'bg f3ebff',  true);
rep('background:"#EEEDFE"',  'background:_bgTR',   'bg EEEDFE',  true);
rep('background:"#d4cef0"',  'background:_bgTR',   'bg d4cef0',  true);

// Green backgrounds
rep('background:"#edf5e4"',  'background:_bgGr',   'bg edf5e4',  true);
rep('background:"#d4e8c0"',  'background:_bgGrSel','bg d4e8c0',  true);
rep('background:"#e8f5e0"',  'background:_bgGr',   'bg e8f5e0',  true); // L1 badge bg

// Holiday / warning badge bg
rep('background:"#fff8ee"',  'background:_bgHol',  'bg fff8ee',  true);
rep('background:"#fff8e1"',  'background:_bgYw',   'bg fff8e1',  true);
rep('background:"#FEF3C7"',  'background:_bgPT',   'bg FEF3C7',  true);

// ─── 4. Improve dark mode palette — richer, less flat ────────────────────────
// These replacements update the actual dark values in the theme assignment block
// Brighter card bg for better contrast
rep(
  '_bgW=dk?"#1e2130":"#fff"',
  '_bgW=dk?"#1c2035":"#fff"',
  'palette _bgW'
);
rep(
  '_bgP=dk?"#181b2a":"#f7f7f5"',
  '_bgP=dk?"#161929":"#f7f7f5"',
  'palette _bgP'
);
rep(
  '_bgP2=dk?"#141727":"#f9f9f7"',
  '_bgP2=dk?"#121524":"#f9f9f7"',
  'palette _bgP2'
);
// Better text contrast
rep(
  '_txM=dk?"#dde1f5":"#333"',
  '_txM=dk?"#e8ecff":"#333"',
  'palette _txM'
);
rep(
  '_txS=dk?"#b5bcd8":"#555"',
  '_txS=dk?"#c0c8e8":"#555"',
  'palette _txS'
);
rep(
  '_txS2=dk?"#9099be":"#666"',
  '_txS2=dk?"#9aa0c8":"#666"',
  'palette _txS2'
);
// Page bg — slightly blue-tinted dark
rep(
  'background:dk?"#0f1117":"#f0f4ff"',
  'background:dk?"#0d1021":"#f0f4ff"',
  'palette page bg',
  true
);
rep(
  'document.documentElement.style.background=darkMode?"#0f1117":""',
  'document.documentElement.style.background=darkMode?"#0d1021":""',
  'palette body bg useEffect'
);
rep(
  'document.body.style.background=darkMode?"#0f1117":""',
  'document.body.style.background=darkMode?"#0d1021":""',
  'palette body bg'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
