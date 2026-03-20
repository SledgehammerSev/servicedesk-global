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

// ─── 1. Who's on now: always show permanent (base) agents regardless of filter ──
rep(
  'var fOn=onAt.filter(agFilt);return fOn.length===0?(<div style={{fontSize:13,color:"#9B3333",fontWeight:500,marginBottom:8}}>{catFilter?"No "+catFilter+" agents on shift":"No agents on shift"}',
  'var fOn=onAt.filter(function(a){return a.base||agFilt(a);});return fOn.length===0?(<div style={{fontSize:13,color:"#9B3333",fontWeight:500,marginBottom:8}}>{catFilter?"No "+catFilter+" agents on shift":"No agents on shift"}',
  'who\'s on now always show base agents'
);

// ─── 2. Fill gaps: add on-shift agent cards below the threshold buttons ────────
rep(
  '{sugLvl&&<span style={{fontSize:10,color:sugMet?"#3A6A14":"#9B3333",fontWeight:500}}>{sugCt===0?"Met":"+"+sugCt+(sugMet?" \u2014 met":"")}</span>}</div></div>{st.pr.length>0&&<button onClick={function(){dp({type:"RST"});sSC2(false);sSL(null);sSM(false);sSC(0);}} style={{fontSize:12,fontWeight:600,padding:"8px 16px",borderRadius:8,border:"1.5px solid #C07070",background:"#f7e8e8",color:"#9B3333",cursor:"pointer"}}>Reset proposed</button>}',
  '{sugLvl&&<span style={{fontSize:10,color:sugMet?"#3A6A14":"#9B3333",fontWeight:500}}>{sugCt===0?"Met":"+"+sugCt+(sugMet?" \u2014 met":"")}</span>}</div></div>{(function(){var onNow=act.filter(function(a){return isOn(a,pvH,pvDay,sDt);});if(onNow.length===0)return null;return(<div style={{flexBasis:"100%",padding:"8px 10px",background:_bgW,border:"1px solid "+_bdM,borderRadius:8,marginTop:4}}><div style={{fontSize:10,fontWeight:600,color:_txS2,marginBottom:6}}>{"On shift now ("+onNow.length+")"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{onNow.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt);return(<div key={i} style={{background:a.base?_bgW:"#f0eefa",border:"1px solid "+(a.base?"#c8e0a0":"#b09fe0"),borderRadius:6,padding:"5px 8px",fontSize:11,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:a.base?"#4A7A28":"#534AB7",flexShrink:0}}/><div><div style={{fontWeight:600,color:a.base?"#1a1a1a":"#534AB7"}}>{a.name}</div><div style={{fontSize:9,color:_txMt}}>{a.loc+" ("+tz+")"}</div></div></div>);})}</div></div>);})()}{st.pr.length>0&&<button onClick={function(){dp({type:"RST"});sSC2(false);sSL(null);sSM(false);sSC(0);}} style={{fontSize:12,fontWeight:600,padding:"8px 16px",borderRadius:8,border:"1.5px solid #C07070",background:"#f7e8e8",color:"#9B3333",cursor:"pointer"}}>Reset proposed</button>}',
  'fill gaps on-shift agent cards'
);

// ─── 3. TZStrip click handler: fix pvS units (was day*24+h, should be day*48+h*2) ─
rep(
  'function onClick(e){if(!sRef.current)return;var r=sRef.current.getBoundingClientRect();var c=cbRef.current;c.fn(c.uD*24+c.uH+(Math.floor((e.clientX-r.left)/(r.width/V))-12));}',
  'function onClick(e){if(!sRef.current)return;var r=sRef.current.getBoundingClientRect();var c=cbRef.current;c.fn(c.uD*48+Math.round(c.uH*2)+(Math.floor((e.clientX-r.left)/(r.width/V))-12));}',
  'tzstrip click handler fix'
);

// ─── 4. Roster rows: add verticalAlign:middle ──────────────────────────────────
rep(
  'return(<tr key={ai} style={{borderBottom:"1px solid #eef2f8",background:flashOn&&ai>=st.ba.length?"#b8f0c0":onR2?_bgOn:_bgW,opacity:isEn2?1:0.45}}>',
  'return(<tr key={ai} style={{borderBottom:"1px solid #eef2f8",background:flashOn&&ai>=st.ba.length?"#b8f0c0":onR2?_bgOn:_bgW,opacity:isEn2?1:0.45,verticalAlign:"middle"}}>',
  'roster row verticalAlign middle'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
