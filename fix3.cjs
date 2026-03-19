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

// Step 1: heatmap cat buttons (unique due to "Coverage (local time)" prefix)
rep(
  '>Coverage (local time)</span><div style={{display:"flex",gap:3}}>{[null,"IT Support","Teleradiology"].map(function(c){var sel=catFilter===c;var cc=c?CAT_C[c]||CAT_C["Other"]:null;return(<button key={c||"all"} onClick={function(){sCF(c);}}',
  '>Coverage (local time)</span><div style={{display:"flex",gap:3}}>{[null,"IT Support","Teleradiology"].map(function(c){var sel=hmCatF===c;var cc=c?CAT_C[c]||CAT_C["Other"]:null;return(<button key={c||"all"} onClick={function(){sHmCF(c);}}',
  'heatmap cat buttons'
);

// Step 2: heatmap level buttons
// After step 1, "sHmCF(c);}}" is unique - use it to anchor the level filter block
const LVL_SUFFIX = ` style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(c?"1.5px solid "+cc.bd:"1.5px solid #555"):"1px solid #ddd",background:sel?(c?cc.bg:"#f0f0ee"):"#fafafa",color:sel?(c?cc.tx:"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{c||"All"}</button>);})}</div><span style={{width:1,height:14,background:"#ddd",margin:"0 2px"}}/>`;

// The level filter block appears 3 times (Who's on, UTC overview, heatmap).
// We find the LAST occurrence which is the heatmap.
const LVL_BLOCK_OLD = `<div style={{display:"flex",gap:3}}>{[null].concat(LEVELS).map(function(lv){var sel=lv===null?levelFilter.length===0:levelFilter.includes(lv);var lc=lv?LEVEL_C[lv]||{}:{};var cnt=lv?act.filter(function(a){return gSk(a).some(function(sk){return sk.level===lv&&(!catFilter||sk.cat===catFilter);});}).length:null;return(<button key={lv||"alllv"} onClick={function(){lv===null?sLF([]):sLF(function(p){return p.includes(lv)?p.filter(function(x){return x!==lv;}):p.concat([lv]);});}} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(lv?"1.5px solid "+(lc.bd||"#555"):"1.5px solid #555"):"1px solid #ddd",background:sel?(lv?(lc.bg||"#f0f0ee"):"#f0f0ee"):"#fafafa",color:sel?(lv?(lc.tx||"#333"):"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{lv?lv+(cnt!==null?" ("+cnt+")":""):"All"}</button>);})}</div>`;
const LVL_BLOCK_NEW = `<div style={{display:"flex",gap:3}}>{[null].concat(LEVELS).map(function(lv){var sel=lv===null?hmLvlF.length===0:hmLvlF.includes(lv);var lc=lv?LEVEL_C[lv]||{}:{};var cnt=lv?act.filter(function(a){return gSk(a).some(function(sk){return sk.level===lv&&(!hmCatF||sk.cat===hmCatF);});}).length:null;return(<button key={lv||"alllv"} onClick={function(){lv===null?sHmLF([]):sHmLF(function(p){return p.includes(lv)?p.filter(function(x){return x!==lv;}):p.concat([lv]);});}} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(lv?"1.5px solid "+(lc.bd||"#555"):"1.5px solid #555"):"1px solid #ddd",background:sel?(lv?(lc.bg||"#f0f0ee"):"#f0f0ee"):"#fafafa",color:sel?(lv?(lc.tx||"#333"):"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{lv?lv+(cnt!==null?" ("+cnt+")":""):"All"}</button>);})}</div>`;

// Find the last occurrence (heatmap) and replace only that
const lastIdx = code.lastIndexOf(LVL_BLOCK_OLD);
if (lastIdx === -1) { console.log('MISS heatmap level buttons'); }
else {
  // Verify it's after "Coverage (local time)" by checking context
  const ctxBefore = code.slice(Math.max(0, lastIdx - 200), lastIdx);
  if (ctxBefore.includes('sHmCF')) {
    code = code.slice(0, lastIdx) + LVL_BLOCK_NEW + code.slice(lastIdx + LVL_BLOCK_OLD.length);
    console.log('OK   heatmap level buttons (last occurrence after sHmCF)');
  } else {
    console.log('WARN heatmap level buttons - context check failed, trying anyway');
    code = code.slice(0, lastIdx) + LVL_BLOCK_NEW + code.slice(lastIdx + LVL_BLOCK_OLD.length);
  }
}

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);