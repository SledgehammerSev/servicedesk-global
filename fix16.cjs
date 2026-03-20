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

// ─── 1. Add flashLive state ────────────────────────────────────────────────
rep(
  'var _hmhp=useState({}),hmHL_per=_hmhp[0],sHmHLP=_hmhp[1];',
  'var _hmhp=useState({}),hmHL_per=_hmhp[0],sHmHLP=_hmhp[1];var _fl=useState(false),flashLive=_fl[0],sFL=_fl[1];',
  'flashLive state'
);

// ─── 2. goNow: add flash trigger ──────────────────────────────────────────
rep(
  'function goNow(){sPD(gMon(new Date()));var n=new Date();sPS(((n.getUTCDay()+6)%7)*48+n.getUTCHours()*2+(n.getUTCMinutes()>=30?1:0));}',
  'function goNow(){sPD(gMon(new Date()));var n=new Date();sPS(((n.getUTCDay()+6)%7)*48+n.getUTCHours()*2+(n.getUTCMinutes()>=30?1:0));sFL(true);setTimeout(function(){sFL(false);},1400);}',
  'goNow flash trigger'
);

// ─── 3. LIVE box: apply flash glow + show correct home time ───────────────
rep(
  '<div style={{background:"#e8f0fa",borderRadius:6,padding:"3px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"#4A7A28",display:"inline-block"}}/><span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#4a8ac4"}}>LIVE</span><span style={{fontSize:13,fontWeight:700,color:"#185FA5",fontVariantNumeric:"tabular-nums"}}>{fH(hLi.hf-pvM/60+nowM/60,u12)}</span>',
  '<div style={{background:"#e8f0fa",borderRadius:6,padding:"3px 10px",display:"flex",alignItems:"center",gap:6,boxShadow:flashLive?"0 0 0 3px rgba(74,122,40,0.5)":"none",transition:"box-shadow 0.6s"}}><span style={{width:6,height:6,borderRadius:"50%",background:"#4A7A28",display:"inline-block"}}/><span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#4a8ac4"}}>LIVE</span><span style={{fontSize:13,fontWeight:700,color:"#185FA5",fontVariantNumeric:"tabular-nums"}}>{fH(hLi.hf-pvM/60+nowM/60,u12)}</span>',
  'LIVE box flash'
);

// ─── 4. Fix "Fri Fri" – remove redundant day prefix from VIEWING box ──────
rep(
  '<span style={{fontSize:10,color:_txMt}}>{DY[pvDay]+" "+fDP(sDt)}</span>',
  '<span style={{fontSize:10,color:_txMt}}>{fDP(sDt)}</span>',
  'fix Fri Fri'
);

// ─── 5. Add hTZ to NOW pill in VIEWING state ──────────────────────────────
rep(
  '{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:u12})}</span></div><button onClick={goNow} style={{fontSize:11,padding:"3px 12px"',
  '{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:u12})}</span><span style={{fontSize:10,color:_txFt2}}>{" "+hTZ}</span></div><button onClick={goNow} style={{fontSize:11,padding:"3px 12px"',
  'hTZ in NOW pill'
);

// ─── 6. Add "Return to live" button to Who's on now/at header ─────────────
rep(
  '{isNow?"Who\'s on now":"Who\'s on at"}</div><div style={{display:"flex",gap:3}}>{[null].concat(allCats)',
  '{isNow?"Who\'s on now":"Who\'s on at"}</div>{!isNow&&<button onClick={goNow} style={{fontSize:11,padding:"2px 9px",borderRadius:4,border:"1.5px solid #4A7A28",background:"#edf5e4",color:"#3A6A14",cursor:"pointer",fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>{"\\u21A9 Live"}</button>}<div style={{display:"flex",gap:3}}>{[null].concat(allCats)',
  'Return to live in Who\'s on header'
);

// ─── 7. Scrubber hour labels: larger font ─────────────────────────────────
rep(
  'show&&<span style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:8,color:_txFt,whiteSpace:"nowrap",lineHeight:1}}>{String(cLH).padStart(2,"00")}</span>',
  'show&&<span style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:9,color:_txFt,whiteSpace:"nowrap",lineHeight:1,fontWeight:500}}>{String(cLH).padStart(2,"00")}</span>',
  'hour label font'
);

// ─── 7b. Fallback: hour labels use padStart(2,"0") not "00" ───────────────
rep(
  'show&&<span style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:8,color:_txFt,whiteSpace:"nowrap",lineHeight:1}}>{String(cLH).padStart(2,"0")}</span>',
  'show&&<span style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:9,color:_txFt,whiteSpace:"nowrap",lineHeight:1,fontWeight:500}}>{String(cLH).padStart(2,"0")}</span>',
  'hour label font (b)'
);

// ─── 8. Scrubber day-of-week labels inside cells: larger font ─────────────
rep(
  '{isMN&&<div style={{position:"absolute",top:0,fontSize:7,color:"#b87a10",fontWeight:600}}>{DY[cDI]}</div>}',
  '{isMN&&<div style={{position:"absolute",top:0,fontSize:8,color:"#b87a10",fontWeight:700}}>{DY[cDI]}</div>}',
  'day label font'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
