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

// ─── 1. Fill gaps: add on-shift agent cards (use anchor that avoids unicode) ───
rep(
  '}</span>}</div></div>{st.pr.length>0&&<button onClick={function(){dp({type:"RST"});sSC2(false);sSL(null);sSM(false);sSC(0);}} style={{fontSize:12,fontWeight:600,padding:"8px 16px",borderRadius:8,border:"1.5px solid #C07070",background:"#f7e8e8",color:"#9B3333",cursor:"pointer"}}>Reset proposed</button>}</div>',
  '}</span>}</div></div>{(function(){var onNow=act.filter(function(a){return isOn(a,pvH,pvDay,sDt);});if(onNow.length===0)return null;return(<div style={{flexBasis:"100%",padding:"8px 10px",background:_bgW,border:"1px solid "+_bdM,borderRadius:8,marginTop:4}}><div style={{fontSize:10,fontWeight:600,color:_txS2,marginBottom:6}}>{"On shift now ("+onNow.length+")"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{onNow.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt);return(<div key={i} style={{background:a.base?_bgW:"#f0eefa",border:"1px solid "+(a.base?"#c8e0a0":"#b09fe0"),borderRadius:6,padding:"5px 8px",fontSize:11,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:a.base?"#4A7A28":"#534AB7",flexShrink:0}}/><div><div style={{fontWeight:600,color:a.base?"#1a1a1a":"#534AB7"}}>{a.name}</div><div style={{fontSize:9,color:_txMt}}>{a.loc+" ("+tz+")"}</div></div></div>);})}</div></div>);})()}{st.pr.length>0&&<button onClick={function(){dp({type:"RST"});sSC2(false);sSL(null);sSM(false);sSC(0);}} style={{fontSize:12,fontWeight:600,padding:"8px 16px",borderRadius:8,border:"1.5px solid #C07070",background:"#f7e8e8",color:"#9B3333",cursor:"pointer"}}>Reset proposed</button>}</div>',
  'fill gaps on-shift agent cards'
);

// ─── 2. Auto-refresh select: highlight when active ────────────────────────────
rep(
  '<select value={rfI} onChange={function(e){sRI(Number(e.target.value));}} style={{fontSize:11,padding:"4px 8px",borderRadius:5,border:"1px solid "+_bdI,background:_bgW,cursor:"pointer"}}>',
  '<select value={rfI} onChange={function(e){sRI(Number(e.target.value));}} style={{fontSize:11,padding:"4px 8px",borderRadius:5,border:rfI>0?"1.5px solid #4A7A28":"1px solid "+_bdI,background:rfI>0?"#edf5e4":_bgW,cursor:"pointer",fontWeight:rfI>0?600:400,color:rfI>0?"#3A6A14":"inherit"}}>',
  'auto-refresh standout when active'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
