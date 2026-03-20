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

// ─── 1. Add edit button to proposed agent cards in Who's on ───────────────────
// Anchor on the closing tags that follow the info div, avoiding unicode issues
rep(
  '</div></div></div>);})}</div></div>}{(function(){var fOff=offAt.filter(agFilt)',
  '</div></div><button onClick={function(e){e.stopPropagation();sEA(all.indexOf(a));}} style={{background:"none",border:"none",cursor:"pointer",color:"#b09fe0",fontSize:12,padding:"0 2px",marginLeft:"auto",flexShrink:0}} title={"Edit "+a.name}>{"\u270E"}</button></div>);})}</div></div>}{(function(){var fOff=offAt.filter(agFilt)',
  'edit button on proposed cards in whos on'
);

// ─── 2. Fill gaps: replace "On shift now" with full team roster (perm grey + proposed purple) ─
rep(
  '{(function(){var onNow=act.filter(function(a){return isOn(a,pvH,pvDay,sDt);});if(onNow.length===0)return null;return(<div style={{flexBasis:"100%",padding:"8px 10px",background:_bgW,border:"1px solid "+_bdM,borderRadius:8,marginTop:4}}><div style={{fontSize:10,fontWeight:600,color:_txS2,marginBottom:6}}>{"On shift now ("+onNow.length+")"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{onNow.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt);return(<div key={i} style={{background:a.base?_bgW:"#f0eefa",border:"1px solid "+(a.base?"#c8e0a0":"#b09fe0"),borderRadius:6,padding:"5px 8px",fontSize:11,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:a.base?"#4A7A28":"#534AB7",flexShrink:0}}/><div><div style={{fontWeight:600,color:a.base?"#1a1a1a":"#534AB7"}}>{a.name}</div><div style={{fontSize:9,color:_txMt}}>{a.loc+" ("+tz+")"}</div></div></div>);})}</div></div>);})()}',
  '{(function(){var permAgs=act.filter(function(a){return a.base;});var propAgs=st.pr;if(permAgs.length===0&&propAgs.length===0)return null;return(<div style={{flexBasis:"100%",padding:"8px 10px",background:_bgW,border:"1px solid "+_bdM,borderRadius:8,marginTop:4}}>{permAgs.length>0&&<div style={{marginBottom:propAgs.length>0?6:0}}><div style={{fontSize:10,fontWeight:600,color:_txS2,marginBottom:4}}>{"Permanent ("+permAgs.length+")"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{permAgs.map(function(a,i){var tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt);return(<div key={i} style={{background:"#f7f7f5",border:"1px solid #ddd",borderRadius:6,padding:"5px 8px",fontSize:11,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:"#bbb",flexShrink:0}}/><div><div style={{fontWeight:600,color:"#555"}}>{a.name}</div><div style={{fontSize:9,color:_txFt}}>{a.loc+" ("+tz+")"}</div></div></div>);})}</div></div>}{propAgs.length>0&&<div><div style={{fontSize:10,fontWeight:600,color:"#534AB7",marginBottom:4}}>{"Proposed ("+propAgs.length+")"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{propAgs.map(function(a,i){var tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt),onR=isOn(a,pvH,pvDay,sDt);return(<div key={i} style={{background:"#f0eefa",border:"1px dashed #b09fe0",borderRadius:6,padding:"5px 8px",fontSize:11,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:onR?"#534AB7":"#b09fe0",flexShrink:0}}/><div><div style={{fontWeight:600,color:"#534AB7"}}>{a.name}</div><div style={{fontSize:9,color:"#7c6a9a"}}>{a.loc+" ("+tz+")"}</div></div></div>);})}</div></div>}</div>);})()}',
  'fill gaps full team roster cards'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
