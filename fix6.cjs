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

// ─── 1. Add lvlM helper + update agFilt + hmAgFilt ───────────────────────────
rep(
  'function agFilt(a){var s=gSk(a);if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.includes(sk.level);});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.includes(sk.level);});return true;}',
  'function lvlM(agLv,fLv){var adj={"L1/2":["L1","L1/2","L2"],"L2/3":["L2","L2/3","L3"]};return adj[agLv]?adj[agLv].includes(fLv):agLv===fLv;}function agFilt(a){var s=gSk(a);if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.some(function(fl){return lvlM(sk.level,fl);});});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.some(function(fl){return lvlM(sk.level,fl);});});return true;}',
  'agFilt with lvlM'
);

rep(
  'function hmAgFilt(a){var s=gSk(a);if(hmCatF&&hmLvlF.length>0)return s.some(function(sk){return sk.cat===hmCatF&&hmLvlF.includes(sk.level);});if(hmCatF)return s.some(function(sk){return sk.cat===hmCatF;});if(hmLvlF.length>0)return s.some(function(sk){return hmLvlF.includes(sk.level);});return true;}',
  'function hmAgFilt(a){var s=gSk(a);if(hmCatF&&hmLvlF.length>0)return s.some(function(sk){return sk.cat===hmCatF&&hmLvlF.some(function(fl){return lvlM(sk.level,fl);});});if(hmCatF)return s.some(function(sk){return sk.cat===hmCatF;});if(hmLvlF.length>0)return s.some(function(sk){return hmLvlF.some(function(fl){return lvlM(sk.level,fl);});});return true;}',
  'hmAgFilt with lvlM'
);

// ─── 2. UTC overview rows filter — also use lvlM ─────────────────────────────
rep(
  'var rows=allRows.filter(function(r){var s=r.sks;if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.includes(sk.level);});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.includes(sk.level);});return true;});',
  'var rows=allRows.filter(function(r){var s=r.sks;if(catFilter&&levelFilter.length>0)return s.some(function(sk){return sk.cat===catFilter&&levelFilter.some(function(fl){return lvlM(sk.level,fl);});});if(catFilter)return s.some(function(sk){return sk.cat===catFilter;});if(levelFilter.length>0)return s.some(function(sk){return levelFilter.some(function(fl){return lvlM(sk.level,fl);});});return true;});',
  'UTC rows filter with lvlM'
);

// ─── 3. Remove compact stats bar ─────────────────────────────────────────────
// Find it by unique start, ends at its own closing </div> on same line
const STATS_BAR_START = '\n        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8,padding:"8px 12px",background:"#fff",borderRadius:8,border:"1px solid #dce6f0",fontSize:12}}>';
const sbIdx = code.indexOf(STATS_BAR_START);
if (sbIdx === -1) { console.log('MISS compact stats bar'); }
else {
  // Find the closing </div> on the same line
  const lineEnd = code.indexOf('\n', sbIdx + 1);
  code = code.slice(0, sbIdx) + code.slice(lineEnd);
  console.log('OK   removed compact stats bar');
}

// ─── 4. UTC overview SVG: wrap in scrollable div ─────────────────────────────
rep(
  'return(<svg viewBox={"0 0 "+W+" "+tH} style={{width:"100%",maxWidth:1100}}>',
  'return(<div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><svg viewBox={"0 0 "+W+" "+tH} style={{width:W}}>',
  'SVG wrap start'
);
rep(
  '</svg>);})()}',
  '</svg></div>);})()}',
  'SVG wrap end'
);

// ─── 5. Copy-to-clipboard button in Justification ────────────────────────────
rep(
  '<button data-np="1" onClick={function(){window.print();}} style={{fontSize:11,padding:"5px 12px",borderRadius:5,border:"1px solid #ccc",background:"#fff",cursor:"pointer"}}>Print / PDF</button>',
  '<button data-np="1" onClick={function(){var secs=genNarrative(eb,act,st.pr,fL,coObj,jBC,jCC,jBZ,jCZ,stats);var txt=secs.map(function(sec){var t=sec.h+"\\n"+(sec.t||"");if(sec.bullets&&sec.bullets.length>0)t+="\\n"+sec.bullets.map(function(b){return"\\u2022 "+b;}).join("\\n");return t;}).join("\\n\\n");navigator.clipboard&&navigator.clipboard.writeText(txt);}} style={{fontSize:11,padding:"5px 12px",borderRadius:5,border:"1px solid #185FA5",background:"#E6F1FB",color:"#185FA5",cursor:"pointer"}}>Copy</button><button data-np="1" onClick={function(){window.print();}} style={{fontSize:11,padding:"5px 12px",borderRadius:5,border:"1px solid #ccc",background:"#fff",cursor:"pointer"}}>Print / PDF</button>',
  'copy to clipboard button'
);

// ─── 6. Expand all / Collapse all above Roster ───────────────────────────────
rep(
  '\n      {/* ROSTER */}',
  '\n      <div style={{display:"flex",gap:6,justifyContent:"flex-end",marginBottom:6}}><button onClick={function(){sCfg(true);sShRst(true);}} style={{fontSize:10,padding:"3px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fafafa",cursor:"pointer",color:"#666"}}>Expand all</button><button onClick={function(){sCfg(false);sShRst(false);}} style={{fontSize:10,padding:"3px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fafafa",cursor:"pointer",color:"#666"}}>Collapse all</button></div>\n      {/* ROSTER */}',
  'expand/collapse all buttons'
);

// ─── 7. Heatmap visual-only note after level filter buttons ──────────────────
// height:16 separator is unique to heatmap (UTC uses height:14)
rep(
  '})}</div><span style={{width:1,height:16,background:"#ddd",margin:"0 2px"}}/>',
  '})}</div><span style={{fontSize:10,color:"#888",fontStyle:"italic",marginLeft:4,marginRight:2,whiteSpace:"nowrap"}}>{"↑ visual only"}</span><span style={{width:1,height:16,background:"#ddd",margin:"0 2px"}}/>',
  'heatmap visual-only note'
);

// ─── 8. Day selector row above TZStrip ───────────────────────────────────────
rep(
  '\n        <div style={{marginBottom:8}}>{fL.map(function(loc,i){var off=lO(loc,sDt),tz=eT(loc.name,loc.tz,sDt);var tzAgs=act.filter(agFilt);return(<TZStrip',
  '\n        <div style={{display:"flex",gap:4,marginBottom:6,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:10,color:"#888",fontWeight:600,marginRight:2}}>Day:</span>{DY.map(function(day,dy){var sel=dy===pvDay;return(<button key={dy} onClick={function(){chgPv(dy*48+(pvS%48));}} style={{fontSize:11,padding:"3px 9px",borderRadius:4,border:sel?"1.5px solid #534AB7":"1px solid #ddd",background:sel?"#eeeaf8":"#fafafa",color:sel?"#534AB7":"#888",cursor:"pointer",fontWeight:sel?600:400}}>{day}</button>);})}</div>\n        <div style={{marginBottom:8}}>{fL.map(function(loc,i){var off=lO(loc,sDt),tz=eT(loc.name,loc.tz,sDt);var tzAgs=act.filter(agFilt);return(<TZStrip',
  'day selector row'
);

// ─── 9a. Roster thead: add Enable col + Actions col ──────────────────────────
rep(
  '<th style={{textAlign:"left",padding:"6px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #e0e0dc",background:"#f7f7f5"}}>Agent</th>',
  '<th style={{textAlign:"center",padding:"6px 6px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #e0e0dc",background:"#f7f7f5",width:28}}>{"✓"}</th><th style={{textAlign:"left",padding:"6px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #e0e0dc",background:"#f7f7f5"}}>Agent</th>',
  'roster thead enable col'
);
rep(
  '{comps.map(function(c){return(<th key={c.id} style={{textAlign:"center",padding:"6px 8px",color:"#555",fontWeight:600,fontSize:10,borderBottom:"2px solid #e0e0dc",background:"#f7f7f5",minWidth:90,whiteSpace:"nowrap"}}>{c.label}</th>);})}',
  '{comps.map(function(c){return(<th key={c.id} style={{textAlign:"center",padding:"6px 8px",color:"#555",fontWeight:600,fontSize:10,borderBottom:"2px solid #e0e0dc",background:"#f7f7f5",minWidth:90,whiteSpace:"nowrap"}}>{c.label}</th>);})}<th style={{textAlign:"center",padding:"6px 8px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #e0e0dc",background:"#f7f7f5"}}>Actions</th>',
  'roster thead actions col'
);

// ─── 9b. Roster tbody: add enable checkbox cell before agent name cell ────────
rep(
  '<td style={{padding:"6px 10px",whiteSpace:"nowrap"}}><span style={{cursor:"pointer",fontWeight:600,color:onR2?"#1a1a1a":"#555"}} onClick={function(){sAV(ai);}}>',
  '<td style={{textAlign:"center",padding:"6px 6px",verticalAlign:"middle"}}><input type="checkbox" checked={!!isEn2} onChange={function(){dp({type:"TOG",i:ai});}} style={{cursor:"pointer",width:14,height:14}}/></td><td style={{padding:"6px 10px",whiteSpace:"nowrap"}}><span style={{cursor:"pointer",fontWeight:600,color:onR2?"#1a1a1a":"#555"}} onClick={function(){sAV(ai);}}>',
  'roster tbody enable checkbox'
);

// ─── 9c. Roster tbody: add actions cell at end of each row ───────────────────
rep(
  '{comps.map(function(c){var cov;if(c.allDay){cov=true;}else{var cDs=c.days||[0,1,2,3,4],cSH=c.sH||9,cEH=c.eH||17;var dOk=a.d.some(function(d){return cDs.includes(d);});if(!dOk){cov=false;}else if(a.s<a.e){cov=a.s<cEH&&a.e>cSH;}else{cov=true;}}return(<td key={c.id} style={{textAlign:"center",padding:"6px 8px"}}>{cov?(<span style={{color:"#4A7A28",fontWeight:700,fontSize:14}}>{"✓"}</span>):(<span style={{color:"#ccc",fontSize:12}}>{"—"}</span>)}</td>);})}',
  '{comps.map(function(c){var cov;if(c.allDay){cov=true;}else{var cDs=c.days||[0,1,2,3,4],cSH=c.sH||9,cEH=c.eH||17;var dOk=a.d.some(function(d){return cDs.includes(d);});if(!dOk){cov=false;}else if(a.s<a.e){cov=a.s<cEH&&a.e>cSH;}else{cov=true;}}return(<td key={c.id} style={{textAlign:"center",padding:"6px 8px"}}>{cov?(<span style={{color:"#4A7A28",fontWeight:700,fontSize:14}}>{"✓"}</span>):(<span style={{color:"#ccc",fontSize:12}}>{"—"}</span>)}</td>);})}<td style={{padding:"4px 6px",textAlign:"center",whiteSpace:"nowrap"}}><button onClick={function(){sEA(ai);}} style={{background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:13,padding:"2px 3px"}} title="Edit">{"\u270E"}</button><button title="Duplicate" onClick={function(e){e.stopPropagation();dp({type:"AP",ag:Object.assign({},a,{name:a.name+" (copy)",base:false})});}} style={{background:"none",border:"none",cursor:"pointer",color:"#185FA5",fontSize:13,padding:"2px 3px"}}>{"\u2398"}</button><button onClick={function(e){e.stopPropagation();if(ai<st.ba.length)sRm(function(p2){return p2.concat([st.ba[ai]]);});dp({type:"RM",i:ai});}} style={{background:"none",border:"none",cursor:"pointer",color:"#9B3333",fontWeight:700,fontSize:14,padding:"2px 3px"}}>{"x"}</button></td>',
  'roster tbody actions cell'
);

// ─── 9d. Remove agent chips from Config (keep header + Add button) ───────────
const CHIPS_START = '</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{all.map(function(a,i){';
const CHIPS_AFTER = '\n          {aOpen&&';
const csIdx = code.indexOf(CHIPS_START);
const aoIdx = code.indexOf(CHIPS_AFTER, csIdx);
if (csIdx === -1) { console.log('MISS chips start'); }
else if (aoIdx === -1) { console.log('MISS chips end (aOpen)'); }
else {
  // Remove from CHIPS_START to just before CHIPS_AFTER, leaving one closing </div> for the outer div
  code = code.slice(0, csIdx) + '</div>' + code.slice(aoIdx);
  console.log('OK   removed agent chips from Config');
}

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
