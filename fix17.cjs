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

// ─── 1. Add utcOvRef + utcOvW state ───────────────────────────────────────
rep(
  'var fRef=useRef(null);var dragRef=useRef(null);',
  'var fRef=useRef(null);var dragRef=useRef(null);var utcOvRef=useRef(null);var _utcW=useState(1100),utcOvW=_utcW[0],sUtcW=_utcW[1];',
  'utcOvRef + utcOvW state'
);

// ─── 2. Add ResizeObserver useEffect for UTC overview width ───────────────
rep(
  'useEffect(function(){sGet("sd-default").then(function(r){if(r&&r.value)sSv(r.value);});},[]);',
  'useEffect(function(){sGet("sd-default").then(function(r){if(r&&r.value)sSv(r.value);});},[]);useEffect(function(){if(!utcOvRef.current)return;var ro=new ResizeObserver(function(entries){if(entries[0])sUtcW(Math.round(entries[0].contentRect.width));});ro.observe(utcOvRef.current);return function(){ro.disconnect();};},[]);',
  'ResizeObserver for utcOvW'
);

// ─── 3. Attach ref to UTC overview outer div ──────────────────────────────
rep(
  '<div style={{background:_bgUTC,border:"1px solid "+_bdB,borderRadius:8,padding:"8px 10px"}}>',
  '<div ref={utcOvRef} style={{background:_bgUTC,border:"1px solid "+_bdB,borderRadius:8,padding:"8px 10px"}}>',
  'utcOvRef on div'
);

// ─── 4. Use dynamic W in UTC overview IIFE ────────────────────────────────
rep(
  'var W=1100,HR=32,PL=190,PR=110,BW=W-PL-PR;',
  'var W=Math.max(utcOvW-20,400),HR=32,PL=190,PR=110,BW=W-PL-PR;',
  'dynamic W from utcOvW'
);

// ─── 5. Add VIEWING/Return to live banner above TZStrip ───────────────────
rep(
  '<div style={{fontSize:10,color:_txFt,marginBottom:3}} data-np="1">Grab to scrub',
  '{!isNow&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}><div style={{background:"#fff0d8",borderRadius:6,padding:"3px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#c8952a"}}>VIEWING</span><span style={{fontSize:13,fontWeight:700,color:"#B87A10",fontVariantNumeric:"tabular-nums"}}>{fH(pvH+pvM/60,false)+" UTC"}</span><span style={{fontSize:10,color:_txMt}}>{fDP(sDt)}</span></div><div style={{background:_bgSel,borderRadius:6,padding:"3px 8px",display:"flex",alignItems:"center",gap:5,opacity:0.7}}><span style={{width:5,height:5,borderRadius:"50%",background:"#4A7A28",display:"inline-block"}}/><span style={{fontSize:9,fontWeight:600,textTransform:"uppercase",color:_txMt}}>NOW</span><span style={{fontSize:11,fontWeight:600,color:_txS}}>{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:u12})}</span><span style={{fontSize:10,color:_txFt2}}>{" "+hTZ}</span></div><button onClick={goNow} style={{fontSize:11,padding:"3px 12px",borderRadius:4,border:"1.5px solid #4A7A28",background:"#edf5e4",color:"#3A6A14",cursor:"pointer",fontWeight:700}}>{"\\u21A9 Return to live"}</button></div>}<div style={{fontSize:10,color:_txFt,marginBottom:3}} data-np="1">Grab to scrub',
  'VIEWING banner above scrubber'
);

// ─── 6. Who's on now: always show all on-shift agents, dim non-matching ───
rep(
  '(function(){var fOn=onAt.filter(agFilt);return fOn.length===0?(<div style={{fontSize:13,color:"#9B3333",fontWeight:500,marginBottom:8}}>{catFilter?"No "+catFilter+" agents on shift":"No agents on shift"}</div>):(<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{fOn.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt),dstDay=isDstTD(hDate,a.loc);return(<div key={i} style={{background:_bgW,border:"1px solid #c8e0a0",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={function(){sAV(all.indexOf(a));}}',
  '(function(){var fOn=onAt;return fOn.length===0?(<div style={{fontSize:13,color:"#9B3333",fontWeight:500,marginBottom:8}}>{"No agents on shift"}</div>):(<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{fOn.map(function(a,i){var matched=agFilt(a);var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt),dstDay=isDstTD(hDate,a.loc);return(<div key={i} style={{background:_bgW,border:"1px solid #c8e0a0",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",opacity:matched?1:0.35}} onClick={function(){sAV(all.indexOf(a));}}',
  'who\'s on now show all with opacity'
);

// ─── 7. + Category → green + Add ─────────────────────────────────────────
rep(
  'style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:"1px dashed "+_bdL,background:_bgW,color:_txS,cursor:"pointer"}}>{"+ Category"}</button>',
  'style={{fontSize:10,padding:"6px 10px",borderRadius:6,border:"1px solid #4A7A28",background:_bgGr,color:"#3A6A14",cursor:"pointer",fontWeight:600}}>{"+ Add"}</button>',
  '+ Category → green + Add'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
