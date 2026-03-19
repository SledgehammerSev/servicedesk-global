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

// 1. UTC HR: 24 -> 28
rep('var W=860,HR=24,PL=190,PR=110,BW=W-PL-PR;',
    'var W=860,HR=28,PL=190,PR=110,BW=W-PL-PR;', 'UTC HR 24->28');

// 2. Replace the company tab block with new design (no sub-tabs, inline category branching)
const START = '        } else if(pvTab==="company"){';
const END_MARKER = '        }\n        return(<div style={{background:"#f8f6ff"';

const NEW_CO = `        } else if(pvTab==="company"){
          var pvCoObj2=comps.find(function(c){return c.id===pvVCo;})||comps[0];
          var coStats2=cLS(act,fL,pvCoObj2,sDt);
          var avgCov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.pct;},0)/fL.length):0;
          var uncov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.zero;},0)/fL.length):0;
          var showTelerad=pvVCo==="frontier"||pvVCo==="all";
          var catSections=["IT Support"].concat(showTelerad?["Teleradiology"]:[]);
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{comps.map(function(c){var selC=pvVCo===c.id;return(<button key={c.id} onClick={function(){sPvVCo(c.id);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:selC?"1.5px solid #185FA5":"1px solid #ddd",background:selC?"#dae8f8":"#fafafa",color:selC?"#185FA5":"#888",cursor:"pointer",fontWeight:selC?600:400}}>{c.label}</button>);})}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Avg coverage: </span><b style={{color:avgCov2>=100?"#4A7A28":"#9B3333"}}>{avgCov2+"%"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Uncovered: </span><b style={{color:uncov2>0?"#9B3333":"#4A7A28"}}>{uncov2+"h avg"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Schedule: </span><b>{pvCoObj2.desc}</b></div></div>
            {fL.length>0&&(<div style={{overflowX:"auto",marginBottom:16}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:400}}><thead><tr style={{background:"#f0f5ff"}}><th style={{textAlign:"left",padding:"7px 12px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Coverage</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Uncovered h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Solo h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Peak agents</th></tr></thead><tbody>{coStats2.map(function(ls2,i){var pc=ls2.pct,barCol=pc>=100?"#4A7A28":pc>=80?"#8abe5a":"#C07070";return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:ls2.zero>0?"#fff8f8":"#fff"}}><td style={{padding:"8px 12px",fontWeight:600}}>{ls2.name}</td><td style={{padding:"8px 10px",textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><div style={{width:80,height:7,background:"#eee",borderRadius:4,overflow:"hidden"}}><div style={{width:pc+"%",height:"100%",background:barCol,borderRadius:4}}/></div><span style={{fontWeight:700,color:barCol,minWidth:36,textAlign:"right"}}>{pc+"%"}</span></div></td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.zero>0?"#9B3333":"#4A7A28",fontWeight:ls2.zero>0?700:400}}>{ls2.zero>0?ls2.zero+"h":"\u2714"}</td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.single>0?"#8A6A20":"#aaa"}}>{ls2.single>0?ls2.single+"h":"\u2014"}</td><td style={{padding:"8px 10px",textAlign:"center",fontWeight:600}}>{ls2.peak}</td></tr>);})}</tbody></table></div>)}
            <div style={{borderTop:"1px solid #dde6f0",paddingTop:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Category coverage</div>
              {catSections.map(function(cat){var cc4=CAT_C[cat]||CAT_C["Other"];var cAgs=act.filter(function(a){return gSk(a).some(function(sk){return sk.cat===cat;});});var onCt=cAgs.filter(function(a){return isOn(a,pvH,pvDay,sDt);}).length;return(<div key={cat} style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:11,fontWeight:700,color:cc4.tx,background:cc4.bg,border:"1px solid "+cc4.bd,borderRadius:5,padding:"3px 10px"}}>{cat}</span><span style={{fontSize:11,color:"#888"}}>{cAgs.length+" agents"}</span><span style={{fontSize:10,fontWeight:600,color:onCt>0?"#4A7A28":"#999",background:onCt>0?"#edf5e4":"#f5f5f5",borderRadius:4,padding:"2px 8px",border:"1px solid "+(onCt>0?"#c8e0a0":"#e0e0dc")}}>{onCt+" on shift"}</span></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cAgs.map(function(a,ai){var sk4=gSk(a).find(function(sk){return sk.cat===cat;});var lv4=sk4?sk4.level:"";var lc4=LEVEL_C[lv4]||{};var onR4=isOn(a,pvH,pvDay,sDt);var hasBoth=gSk(a).some(function(sk){return sk.cat==="IT Support";})&&gSk(a).some(function(sk){return sk.cat==="Teleradiology";});return(<div key={ai} style={{display:"flex",alignItems:"center",gap:5,background:onR4?cc4.bg:"#fafafa",border:"1px solid "+(onR4?cc4.bd:"#e0e0dc"),borderRadius:6,padding:"5px 9px",cursor:"pointer"}} onClick={function(){sPvTab("agent");sAV(all.indexOf(a));}}>{onR4&&<span style={{width:7,height:7,borderRadius:"50%",background:"#4A7A28",flexShrink:0,display:"inline-block"}}/>}<span style={{fontSize:11,fontWeight:onR4?600:400,color:onR4?"#1a1a1a":"#666"}}>{a.name}</span>{lv4&&<span style={{fontSize:9,background:lc4.bg||"#f0f0ee",color:lc4.tx||"#555",borderRadius:3,padding:"0 5px",border:"1px solid "+(lc4.bd||"#ccc"),fontWeight:700}}>{lv4}</span>}{hasBoth&&<span style={{fontSize:8,background:"#f0ebfa",color:"#7C4DB8",borderRadius:3,padding:"0 4px",border:"1px solid #c8a8e8",fontWeight:600}}>IT+TR</span>}<span style={{fontSize:9,color:"#aaa"}}>{a.loc}</span></div>);})}</div></div>);})}
            </div>
          </div>);
        }`;

const startIdx = code.indexOf(START);
const endIdx = code.indexOf(END_MARKER);

if (startIdx === -1) { console.log('MISS company block start'); }
else if (endIdx === -1) { console.log('MISS company block end'); }
else {
  const oldBlock = code.slice(startIdx, endIdx + 9);
  code = code.slice(0, startIdx) + NEW_CO + code.slice(startIdx + oldBlock.length);
  console.log('OK   company tab restructure');
}

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
