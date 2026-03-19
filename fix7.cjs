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

// ─── 1. Remove day selector row ──────────────────────────────────────────────
rep(
  '\n        <div style={{display:"flex",gap:4,marginBottom:6,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:10,color:"#888",fontWeight:600,marginRight:2}}>Day:</span>{DY.map(function(day,dy){var sel=dy===pvDay;return(<button key={dy} onClick={function(){chgPv(dy*48+(pvS%48));}} style={{fontSize:11,padding:"3px 9px",borderRadius:4,border:sel?"1.5px solid #534AB7":"1px solid #ddd",background:sel?"#eeeaf8":"#fafafa",color:sel?"#534AB7":"#888",cursor:"pointer",fontWeight:sel?600:400}}>{day}</button>);})}</div>',
  '',
  'remove day selector'
);

// ─── 2. Remove expand/collapse all buttons ───────────────────────────────────
rep(
  '\n      <div style={{display:"flex",gap:6,justifyContent:"flex-end",marginBottom:6}}><button onClick={function(){sCfg(true);sShRst(true);}} style={{fontSize:10,padding:"3px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fafafa",cursor:"pointer",color:"#666"}}>Expand all</button><button onClick={function(){sCfg(false);sShRst(false);}} style={{fontSize:10,padding:"3px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fafafa",cursor:"pointer",color:"#666"}}>Collapse all</button></div>',
  '',
  'remove expand/collapse'
);

// ─── 3. Undo L2/3 matching — revert agFilt, hmAgFilt, UTC rows filter ────────
rep(
  'function lvlM(agLv,fLv){var adj={"L1/2":["L1","L1/2","L2"],"L2/3":["L2","L2/3","L3"]};return adj[agLv]?adj[agLv].includes(fLv):agLv===fLv;}function agFilt(a){var s=gSk(a);if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.some(function(fl){return lvlM(sk.level,fl);});});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.some(function(fl){return lvlM(sk.level,fl);});});return true;}',
  'function agFilt(a){var s=gSk(a);if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.includes(sk.level);});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.includes(sk.level);});return true;}',
  'revert agFilt'
);
rep(
  'function hmAgFilt(a){var s=gSk(a);if(hmCatF&&hmLvlF.length>0)return s.some(function(sk){return sk.cat===hmCatF&&hmLvlF.some(function(fl){return lvlM(sk.level,fl);});});if(hmCatF)return s.some(function(sk){return sk.cat===hmCatF;});if(hmLvlF.length>0)return s.some(function(sk){return hmLvlF.some(function(fl){return lvlM(sk.level,fl);});});return true;}',
  'function hmAgFilt(a){var s=gSk(a);if(hmCatF&&hmLvlF.length>0)return s.some(function(sk){return sk.cat===hmCatF&&hmLvlF.includes(sk.level);});if(hmCatF)return s.some(function(sk){return sk.cat===hmCatF;});if(hmLvlF.length>0)return s.some(function(sk){return hmLvlF.includes(sk.level);});return true;}',
  'revert hmAgFilt'
);
rep(
  'var rows=allRows.filter(function(r){var s=r.sks;if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.some(function(fl){return lvlM(sk.level,fl);});});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.some(function(fl){return lvlM(sk.level,fl);});});return true;});',
  'var rows=allRows.filter(function(r){var s=r.sks;if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.includes(sk.level);});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.includes(sk.level);});return true;});',
  'revert UTC rows filter'
);

// ─── 4. UTC overview: resize instead of scroll ───────────────────────────────
rep(
  'return(<div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><svg viewBox={"0 0 "+W+" "+tH} style={{width:W}}>',
  'return(<svg viewBox={"0 0 "+W+" "+tH} style={{width:"100%",maxWidth:W}}>',
  'SVG back to resize'
);
rep(
  '</svg></div>);})()}',
  '</svg>);})()}',
  'remove SVG scroll wrapper'
);

// ─── 5. Add darkMode state ────────────────────────────────────────────────────
rep(
  'var _pvTab=useState("agent"),pvTab=_pvTab[0],sPvTab=_pvTab[1];',
  'var _dm=useState(false),darkMode=_dm[0],sDM=_dm[1];var _pvTab=useState("agent"),pvTab=_pvTab[0],sPvTab=_pvTab[1];',
  'darkMode state'
);

// ─── 6. Add theme variables before S object ───────────────────────────────────
rep(
  '\n  var S={card:{background:"#f7f7f5"',
  '\n  var dk=darkMode;var _bgW=dk?"#1e2130":"#fff";var _bgP=dk?"#181b2a":"#f7f7f5";var _bgP2=dk?"#141727":"#f9f9f7";var _bgBtn=dk?"#252838":"#fafafa";var _bgSel=dk?"#2a2d3e":"#f0f0ee";var _bgTh=dk?"#1a1e2f":"#f0f8ff";var _bgRow=dk?"#1a1e2d":"#eef2f8";var _bgOn=dk?"#0f2218":"#f0fff4";var _bgWarn=dk?"#2a1010":"#fff8f8";var _bdM=dk?"#2a2e45":"#e0e0dc";var _bdB=dk?"#1e2f5e":"#dce6f0";var _bdL=dk?"#333654":"#ddd";var _bdI=dk?"#353860":"#ccc";var _txM=dk?"#dde1f5":"#333";var _txS=dk?"#b5bcd8":"#555";var _txS2=dk?"#9099be":"#666";var _txMt=dk?"#606888":"#888";var _txFt=dk?"#505680":"#aaa";var _txFt2=dk?"#404366":"#bbb";\n  var S={card:{background:_bgP',
  'theme vars + S.card bg'
);
rep(
  'flex:"1 1 130px",minWidth:130},lb:{fontSize:12,color:"#666",margin:0},vl:{fontSize:20,fontWeight:600,margin:0},th:{padding:"5px 2px",textAlign:"center",fontSize:11,fontWeight:600,color:"#666",background:"#f7f7f5",border:"1px solid #e0e0dc",whiteSpace:"nowrap"}}',
  'flex:"1 1 130px",minWidth:130},lb:{fontSize:12,color:_txS2,margin:0},vl:{fontSize:20,fontWeight:600,margin:0},th:{padding:"5px 2px",textAlign:"center",fontSize:11,fontWeight:600,color:_txS2,background:_bgP,border:"1px solid "+_bdM,whiteSpace:"nowrap"}}',
  'S object theme'
);

// ─── 7. Dark mode toggle + outer wrapper background ───────────────────────────
rep(
  '<div style={{fontFamily:"-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif",padding:"12px 16px",width:"100%",boxSizing:"border-box",zoom:1.15}}>',
  '<div style={{fontFamily:"-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif",padding:"12px 16px",width:"100%",boxSizing:"border-box",zoom:1.15,background:dk?"#0f1117":"#f0f4ff",minHeight:"100vh",color:_txM}}>',
  'outer wrapper dark bg'
);
rep(
  '{editAg!==null&&<EditModal',
  '<div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><button onClick={function(){sDM(function(p){return !p;});}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:"1px solid "+_bdM,background:dk?"#252838":_bgP,color:_txS,cursor:"pointer",fontWeight:600}}>{dk?"Light mode":"Dark mode"}</button></div>{editAg!==null&&<EditModal',
  'dark mode button'
);

// ─── 8. Global inline-style color replacements ───────────────────────────────

// Backgrounds
rep('background:"#fff"',    'background:_bgW',    'bg #fff',    true);
rep('background:"#ffffff"', 'background:_bgW',    'bg #ffffff', true);
rep('background:"#f9f9f7"', 'background:_bgP2',   'bg f9f9f7',  true);
rep('background:"#f7f7f5"', 'background:_bgP',    'bg f7f7f5',  true);
rep('background:"#fafafa"', 'background:_bgBtn',  'bg fafafa',  true);
rep('background:"#f0f0ee"', 'background:_bgSel',  'bg f0f0ee',  true);
rep('background:"#f0f8ff"', 'background:_bgTh',   'bg f0f8ff',  true);
rep('background:"#eef2f8"', 'background:_bgRow',  'bg eef2f8',  true);
rep('background:"#f0fff4"', 'background:_bgOn',   'bg f0fff4',  true);
rep('background:"#fff8f8"', 'background:_bgWarn', 'bg fff8f8',  true);

// Text
rep('color:"#333"',    'color:_txM',   'tx 333',    true);
rep('color:"#444"',    'color:_txM',   'tx 444',    true);
rep('color:"#1a1a1a"', 'color:_txM',   'tx 1a1a1a', true);
rep('color:"#555"',    'color:_txS',   'tx 555',    true);
rep('color:"#666"',    'color:_txS2',  'tx 666',    true);
rep('color:"#888"',    'color:_txMt',  'tx 888',    true);
rep('color:"#999"',    'color:_txFt',  'tx 999',    true);
rep('color:"#aaa"',    'color:_txFt',  'tx aaa',    true);
rep('color:"#bbb"',    'color:_txFt2', 'tx bbb',    true);

// SVG fills
rep('fill={r.on?"#1a1a1a":"#aaa"}',    'fill={r.on?_txM:_txFt}',   'SVG agent fill');
rep('fill={r.on?r.barColor:"#bbb"}',   'fill={r.on?r.barColor:_txFt2}', 'SVG bar label');

// Borders
rep('border:"1px solid #e0e0dc"',      'border:"1px solid "+_bdM',      'bd e0e0dc',    true);
rep('border:"2px solid #e0e0dc"',      'border:"2px solid "+_bdM',      'bd 2px e0e0dc',true);
rep('borderBottom:"1px solid #e0e0dc"','borderBottom:"1px solid "+_bdM','bdBot 1px',     true);
rep('borderBottom:"2px solid #e0e0dc"','borderBottom:"2px solid "+_bdM','bdBot 2px',     true);
rep('borderTop:"1px solid #e0e0dc"',   'borderTop:"1px solid "+_bdM',   'bdTop 1px',    true);
rep('borderTop:"2px solid #e0e0dc"',   'borderTop:"2px solid "+_bdM',   'bdTop 2px',    true);
rep('borderRight:"1px solid #e0e0dc"', 'borderRight:"1px solid "+_bdM', 'bdRight',      true);
rep('borderLeft:"3px solid #e0e0dc"',  'borderLeft:"3px solid "+_bdM',  'bdLeft 3px',   true);
rep('border:"1px solid #dce6f0"',      'border:"1px solid "+_bdB',      'bd dce6f0',    true);
rep('border:"1px solid #ddd"',         'border:"1px solid "+_bdL',      'bd ddd',       true);
rep('border:"1px solid #ccc"',         'border:"1px solid "+_bdI',      'bd ccc',       true);

// Roster row background
rep('background:onR2?"#f0fff4":"#fff"','background:onR2?_bgOn:_bgW',    'roster row bg');

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
