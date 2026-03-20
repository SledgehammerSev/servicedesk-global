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

// ─── 1. Undo fix17 point 3: restore agFilt on who's on now cards ──────────
rep(
  'var fOn=onAt;return fOn.length===0?(<div style={{fontSize:13,color:"#9B3333",fontWeight:500,marginBottom:8}}>{"No agents on shift"}</div>):(<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{fOn.map(function(a,i){var matched=agFilt(a);var inf2=',
  'var fOn=onAt.filter(agFilt);return fOn.length===0?(<div style={{fontSize:13,color:"#9B3333",fontWeight:500,marginBottom:8}}>{catFilter?"No "+catFilter+" agents on shift":"No agents on shift"}</div>):(<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{fOn.map(function(a,i){var inf2=',
  'undo fix17 who\'s on filter'
);

// ─── 2. Undo fix17 point 3: remove opacity from card style ───────────────
rep(
  'return(<div key={i} style={{background:_bgW,border:"1px solid #c8e0a0",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",opacity:matched?1:0.35}} onClick={function(){sAV(all.indexOf(a));',
  'return(<div key={i} style={{background:_bgW,border:"1px solid #c8e0a0",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={function(){sAV(all.indexOf(a));',
  'undo opacity on card'
);

// ─── 3. Add proposed agent cards after who's on now, before off-shift ─────
rep(
  '{(function(){var fOff=offAt.filter(agFilt);return fOff.length>0?',
  '{st.pr.length>0&&<div style={{marginBottom:6}}><div style={{fontSize:11,fontWeight:600,color:"#534AB7",marginBottom:4,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:"#534AB7",display:"inline-block"}}/>{"Proposed ("+st.pr.length+")"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{st.pr.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt),onR=isOn(a,pvH,pvDay,sDt);return(<div key={i} style={{background:"#f0eefa",border:"1px dashed #b09fe0",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:onR?"#534AB7":"#b09fe0",flexShrink:0}}/><div><div style={{fontWeight:600,color:"#534AB7",display:"flex",alignItems:"center",gap:4}}>{a.name}{gSk(a).map(function(sk,si){var cc=CAT_C[sk.cat]||CAT_C["Other"];var lc=LEVEL_C[sk.level]||{};return(<span key={si} style={{fontSize:8,background:cc.bg,color:cc.tx,borderRadius:3,padding:"0 4px",fontWeight:600,border:"1px solid "+cc.bd,whiteSpace:"nowrap"}}>{(sk.cat==="Other"&&sk.otherLabel?sk.otherLabel:sk.cat)+" "}<span style={{color:lc.tx||cc.tx}}>{sk.level}</span></span>);})}</div><div style={{fontSize:10,color:"#7c6a9a"}}>{a.loc+" ("+tz+") \\u00B7 "+DY[ld]+" "+fH(inf2.hf,u12)+" \\u00B7 "+fR(a.s,a.e,u12)}</div></div></div>);})}</div></div>}{(function(){var fOff=offAt.filter(agFilt);return fOff.length>0?',
  'proposed agent cards after who\'s on'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
