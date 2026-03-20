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

// ─── 1. EditModal: add × Remove button for proposed (non-base) agents ─────────
rep(
  'Cancel</button><button onClick={function(){p.onSave({name:nm,s:ss,e:ee,d:dd,loc:ct.name,bo:ct.bo,skills:eSkills.slice()});}} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"1px solid #4A7A28",background:_bgGr,color:"#3A6A14",cursor:"pointer",fontWeight:600}}>Save</button>',
  '{!ag.base&&p.onRemove&&<button onClick={p.onRemove} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"1px solid #C07070",background:"#f7e8e8",color:"#9B3333",cursor:"pointer",fontWeight:700}} title="Remove proposed agent">{"\u00D7 Remove"}</button>}Cancel</button><button onClick={function(){p.onSave({name:nm,s:ss,e:ee,d:dd,loc:ct.name,bo:ct.bo,skills:eSkills.slice()});}} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"1px solid #4A7A28",background:_bgGr,color:"#3A6A14",cursor:"pointer",fontWeight:600}}>Save</button>',
  'remove button in EditModal for proposed agents'
);

// ─── 2. Pass onRemove to EditModal in parent ───────────────────────────────────
rep(
  'onSave={function(d){dp({type:"UPD",i:editAg,data:d});sEA(null);}}',
  'onSave={function(d){dp({type:"UPD",i:editAg,data:d});sEA(null);}} onRemove={function(){dp({type:"RM",i:editAg});sEA(null);}}',
  'pass onRemove prop to EditModal'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
