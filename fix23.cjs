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

// Reusable inline button group (edit ✎ + copy ⎘ + × remove)
// Note: file stores pencil as literal \u270E (6 chars), so use \\u270E in this script

// ─── 1. Who's on: permanent agent cards — add duplicate + × ─────────────────
rep(
  'title={"Edit "+a.name}>{" \\u270E"}</button></div>);})}</div>);})()}',
  'title={"Edit "+a.name}>{" \\u270E"}</button><button onClick={function(e){e.stopPropagation();dp({type:"AP",ag:Object.assign({},a,{name:a.name+" (copy)",base:false})});}} style={{background:"none",border:"none",cursor:"pointer",color:"#185FA5",fontSize:11,padding:"0 2px",flexShrink:0}} title="Duplicate">{"\u2398"}</button><button onClick={function(e){e.stopPropagation();var ri=all.indexOf(a);if(ri<st.ba.length)sRm(function(p){return p.concat([st.ba[ri]]);});dp({type:"RM",i:ri});}} style={{background:"none",border:"none",cursor:"pointer",color:"#9B3333",fontWeight:700,fontSize:12,padding:"0 2px",flexShrink:0}} title="Remove">{"\u00D7"}</button></div>);})}</div>);})()}',
  'who\'s on permanent cards: add copy + remove'
);

// ─── 2. Who's on: proposed cards — add duplicate (× already present) ─────────
rep(
  'title={"Edit "+a.name}>{"\\u270E"}</button><button onClick={function(e){e.stopPropagation();dp({type:"RM",i:st.ba.length+i});}}',
  'title={"Edit "+a.name}>{"\\u270E"}</button><button onClick={function(e){e.stopPropagation();dp({type:"AP",ag:Object.assign({},a,{name:a.name+" (copy)",base:false})});}} style={{background:"none",border:"none",cursor:"pointer",color:"#185FA5",fontSize:11,padding:"0 2px",flexShrink:0}} title="Duplicate">{"\u2398"}</button><button onClick={function(e){e.stopPropagation();dp({type:"RM",i:st.ba.length+i});}}',
  'who\'s on proposed cards: add duplicate'
);

// ─── 3. Weekly schedule table — add duplicate + × ─────────────────────────────
rep(
  'onClick={function(){sEA(ai);}} style={{background:"none",border:"none",cursor:"pointer",color:_txFt,fontSize:9,padding:"0 0 0 4px"}}>{"\\u270E"}</button></td>{DY.map',
  'onClick={function(){sEA(ai);}} style={{background:"none",border:"none",cursor:"pointer",color:_txFt,fontSize:9,padding:"0 0 0 4px"}}>{"\\u270E"}</button><button data-np="1" onClick={function(e){e.stopPropagation();dp({type:"AP",ag:Object.assign({},a,{name:a.name+" (copy)",base:false})});}} style={{background:"none",border:"none",cursor:"pointer",color:"#185FA5",fontSize:9,padding:"0 0 0 3px"}} title="Duplicate">{"\u2398"}</button><button data-np="1" onClick={function(e){e.stopPropagation();var ri=all.indexOf(a);if(ri<st.ba.length)sRm(function(p){return p.concat([st.ba[ri]]);});dp({type:"RM",i:ri});}} style={{background:"none",border:"none",cursor:"pointer",color:"#9B3333",fontWeight:700,fontSize:10,padding:"0 0 0 2px"}} title="Remove">{"\u00D7"}</button></td>{DY.map',
  'weekly schedule: add copy + remove'
);

// ─── 4. Company view agent rows — add duplicate + × ────────────────────────────
rep(
  'fontSize:11,padding:"0 2px",marginLeft:3}} title={"Edit "+a.name}>{" \\u270E"}</button></td><td style={{textAlign:"center"',
  'fontSize:11,padding:"0 2px",marginLeft:3}} title={"Edit "+a.name}>{" \\u270E"}</button><button onClick={function(e){e.stopPropagation();dp({type:"AP",ag:Object.assign({},a,{name:a.name+" (copy)",base:false})});}} style={{background:"none",border:"none",cursor:"pointer",color:"#185FA5",fontSize:11,padding:"0 2px"}} title="Duplicate">{"\u2398"}</button><button onClick={function(e){e.stopPropagation();var ri=all.indexOf(a);if(ri<st.ba.length)sRm(function(p){return p.concat([st.ba[ri]]);});dp({type:"RM",i:ri});}} style={{background:"none",border:"none",cursor:"pointer",color:"#9B3333",fontWeight:700,fontSize:12,padding:"0 2px"}} title="Remove">{"\u00D7"}</button></td><td style={{textAlign:"center"',
  'company view: add copy + remove'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
