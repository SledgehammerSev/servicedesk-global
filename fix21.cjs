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

// ─── Restyle proposed cards: white bg, solid border, clear on/off dot, remove btn ─
// Note: file stores \u00B7 as literal 6-char escape, so use \\u00B7 in this script
const OLD = `{st.pr.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt),onR=isOn(a,pvH,pvDay,sDt);return(<div key={i} style={{background:"#f0eefa",border:"1px dashed #b09fe0",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:onR?"#534AB7":"#b09fe0",flexShrink:0}}/><div><div style={{fontWeight:600,color:"#534AB7",display:"flex",alignItems:"center",gap:4}}>{a.name}{gSk(a).map(function(sk,si){var cc=CAT_C[sk.cat]||CAT_C["Other"];var lc=LEVEL_C[sk.level]||{};return(<span key={si} style={{fontSize:8,background:cc.bg,color:cc.tx,borderRadius:3,padding:"0 4px",fontWeight:600,border:"1px solid "+cc.bd,whiteSpace:"nowrap"}}>{(sk.cat==="Other"&&sk.otherLabel?sk.otherLabel:sk.cat)+" "}<span style={{color:lc.tx||cc.tx}}>{sk.level}</span></span>);})}</div><div style={{fontSize:10,color:"#7c6a9a"}}>{a.loc+" ("+tz+") \\u00B7 "+DY[ld]+" "+fH(inf2.hf,u12)+" \\u00B7 "+fR(a.s,a.e,u12)}</div></div><button onClick={function(e){e.stopPropagation();sEA(all.indexOf(a));}} style={{background:"none",border:"none",cursor:"pointer",color:"#b09fe0",fontSize:12,padding:"0 2px",marginLeft:"auto",flexShrink:0}} title={"Edit "+a.name}>{"\u270E"}</button></div>`;

const NEW = `{st.pr.map(function(a,i){var inf2=li(pvH,aO(a,sDt)),ld=((pvDay+inf2.ds)%7+7)%7,tz=eT(a.loc,(CD[a.loc]||{}).t||"",sDt),onR=isOn(a,pvH,pvDay,sDt);return(<div key={i} style={{background:_bgW,border:"1px solid #c8b8e8",borderRadius:6,padding:"6px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={function(){sAV(all.indexOf(a));}}>{onR?(<span style={{width:6,height:6,borderRadius:"50%",background:"#534AB7",flexShrink:0}}/>):(<span style={{width:6,height:6,borderRadius:"50%",border:"1.5px solid #c8b8e8",background:"transparent",flexShrink:0,display:"inline-block"}}/>)}<div><div style={{fontWeight:600,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>{a.name}{gSk(a).map(function(sk,si){var cc=CAT_C[sk.cat]||CAT_C["Other"];var lc=LEVEL_C[sk.level]||{};return(<span key={si} style={{fontSize:8,background:cc.bg,color:cc.tx,borderRadius:3,padding:"0 4px",fontWeight:600,border:"1px solid "+cc.bd,whiteSpace:"nowrap"}}>{(sk.cat==="Other"&&sk.otherLabel?sk.otherLabel:sk.cat)+" "}<span style={{color:lc.tx||cc.tx}}>{sk.level}</span></span>);})}</div><div style={{fontSize:10,color:_txS2}}>{a.loc+" ("+tz+") \\u00B7 "+DY[ld]+" "+fH(inf2.hf,u12)+" \\u00B7 "+fR(a.s,a.e,u12)}</div></div><span style={{fontSize:9,background:"#f0eefa",color:"#534AB7",borderRadius:3,padding:"1px 4px",fontWeight:600,border:"1px solid #c8b8e8",marginLeft:"auto",flexShrink:0}}>new</span><button onClick={function(e){e.stopPropagation();sEA(all.indexOf(a));}} style={{background:"none",border:"none",cursor:"pointer",color:_txFt2,fontSize:12,padding:"0 2px",marginLeft:2,flexShrink:0}} title={"Edit "+a.name}>{"\u270E"}</button><button onClick={function(e){e.stopPropagation();dp({type:"RM",i:st.ba.length+i});}} style={{background:"none",border:"none",cursor:"pointer",color:"#C07070",fontWeight:700,fontSize:13,padding:"0 2px",flexShrink:0}} title={"Remove "+a.name}>{"\u00D7"}</button></div>`;

rep(OLD, NEW, 'restyle proposed cards: white bg, solid border, clear on/off dot, remove btn');

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
