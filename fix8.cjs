const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(file, 'utf8');

function rep(old, nw, label) {
  if (!code.includes(old)) { console.log('MISS', label); return false; }
  code = code.replace(old, nw);
  console.log('OK  ', label);
  return true;
}

// 1. Add module-level var declarations before LEVELS (line 68)
// so sub-components can reference them (they're set inside App before render)
rep(
  'var LEVELS=["L1","L1/2","L2","L2/3","L3"];',
  'var dk,_bgW,_bgP,_bgP2,_bgBtn,_bgSel,_bgTh,_bgRow,_bgOn,_bgWarn,_bdM,_bdB,_bdL,_bdI,_txM,_txS,_txS2,_txMt,_txFt,_txFt2;\nvar LEVELS=["L1","L1/2","L2","L2/3","L3"];',
  'module-level theme var declarations'
);

// 2. Remove the var keywords from the assignments inside App
// Current: var dk=darkMode;var _bgW=dk?...;var _bgP=...;...
rep(
  'var dk=darkMode;var _bgW=dk?"#1e2130":"#fff";var _bgP=dk?"#181b2a":"#f7f7f5";var _bgP2=dk?"#141727":"#f9f9f7";var _bgBtn=dk?"#252838":"#fafafa";var _bgSel=dk?"#2a2d3e":"#f0f0ee";var _bgTh=dk?"#1a1e2f":"#f0f8ff";var _bgRow=dk?"#1a1e2d":"#eef2f8";var _bgOn=dk?"#0f2218":"#f0fff4";var _bgWarn=dk?"#2a1010":"#fff8f8";var _bdM=dk?"#2a2e45":"#e0e0dc";var _bdB=dk?"#1e2f5e":"#dce6f0";var _bdL=dk?"#333654":"#ddd";var _bdI=dk?"#353860":"#ccc";var _txM=dk?"#dde1f5":"#333";var _txS=dk?"#b5bcd8":"#555";var _txS2=dk?"#9099be":"#666";var _txMt=dk?"#606888":"#888";var _txFt=dk?"#505680":"#aaa";var _txFt2=dk?"#404366":"#bbb";',
  'dk=darkMode;_bgW=dk?"#1e2130":"#fff";_bgP=dk?"#181b2a":"#f7f7f5";_bgP2=dk?"#141727":"#f9f9f7";_bgBtn=dk?"#252838":"#fafafa";_bgSel=dk?"#2a2d3e":"#f0f0ee";_bgTh=dk?"#1a1e2f":"#f0f8ff";_bgRow=dk?"#1a1e2d":"#eef2f8";_bgOn=dk?"#0f2218":"#f0fff4";_bgWarn=dk?"#2a1010":"#fff8f8";_bdM=dk?"#2a2e45":"#e0e0dc";_bdB=dk?"#1e2f5e":"#dce6f0";_bdL=dk?"#333654":"#ddd";_bdI=dk?"#353860":"#ccc";_txM=dk?"#dde1f5":"#333";_txS=dk?"#b5bcd8":"#555";_txS2=dk?"#9099be":"#666";_txMt=dk?"#606888":"#888";_txFt=dk?"#505680":"#aaa";_txFt2=dk?"#404366":"#bbb";',
  'remove var keywords from theme assignments'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
