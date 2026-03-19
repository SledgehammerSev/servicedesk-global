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

// 1. UTC HR: 36→24
rep('var W=860,HR=36,PL=190,PR=110,BW=W-PL-PR;',
    'var W=860,HR=24,PL=190,PR=110,BW=W-PL-PR;', 'UTC HR');

// 2. UTC SVG maxWidth
rep('style={{width:"100%"}}>{Array.from({length:24},function(_,i){var x=PL',
    'style={{width:"100%",maxWidth:900}}>{Array.from({length:24},function(_,i){var x=PL', 'UTC maxWidth');

// 3. Better dim color for UTC bars when cat filtered
rep('var dimCol=catCC?catCC.bg:',
    'var dimCol=catCC?(catFilter==="IT Support"?"rgba(24,95,165,0.5)":catFilter==="Teleradiology"?"rgba(124,77,184,0.5)":"rgba(74,122,40,0.5)"):',
    'UTC dim color');

// 4. Remove Category from tabs
rep('var TABS=[["agent","Agent"],["company","Company"],["category","Category"]];',
    'var TABS=[["agent","Agent"],["company","Company"]];', 'Remove Category tab');

// 5. Add pvCoSub state after pvVCat
rep('var _pvVCat=useState("IT Support"),pvVCat=_pvVCat[0],sPvVCat=_pvVCat[1];',
    'var _pvVCat=useState("IT Support"),pvVCat=_pvVCat[0],sPvVCat=_pvVCat[1];var _pvCoSub=useState("overview"),pvCoSub=_pvCoSub[0],sPvCoSub=_pvCoSub[1];',
    'pvCoSub state');

// 6. Add hmCatF/hmLvlF state
rep('var _cf=useState(null),catFilter=_cf[0],sCF=_cf[1];var _lf=useState([]),levelFilter=_lf[0],sLF=_lf[1];',
    'var _cf=useState(null),catFilter=_cf[0],sCF=_cf[1];var _lf=useState([]),levelFilter=_lf[0],sLF=_lf[1];var _hmCF=useState(null),hmCatF=_hmCF[0],sHmCF=_hmCF[1];var _hmLF=useState([]),hmLvlF=_hmLF[0],sHmLF=_hmLF[1];',
    'hmCatF/hmLvlF state');

// 7. Add hmAgFilt function + change heatData to use it
rep('var cityRecsData=useMemo(function(){return sugCityRecs(act.filter(agFilt)',
    'function hmAgFilt(a){var s=gSk(a);if(hmCatF&&hmLvlF.length>0)return s.some(function(sk){return sk.cat===hmCatF&&hmLvlF.includes(sk.level);});if(hmCatF)return s.some(function(sk){return sk.cat===hmCatF;});if(hmLvlF.length>0)return s.some(function(sk){return hmLvlF.includes(sk.level);});return true;}var cityRecsData=useMemo(function(){return sugCityRecs(act.filter(agFilt)',
    'hmAgFilt function');

rep('var heatData=useMemo(function(){var hmAct=act.filter(agFilt);',
    'var heatData=useMemo(function(){var hmAct=act.filter(hmAgFilt);', 'heatData use hmAgFilt');

rep('},[act,fL,sDt,catFilter,levelFilter]);',
    '},[act,fL,sDt,hmCatF,hmLvlF]);', 'heatData dep array');

// 8. Heatmap filter buttons → visual only (hmCatF/hmLvlF)
// This block is unique due to ">Coverage (local time)</span>"
rep(
'>Coverage (local time)</span><div style={{display:"flex",gap:3}}>{[null,"IT Support","Teleradiology"].map(function(c){var sel=catFilter===c;var cc=c?CAT_C[c]||CAT_C["Other"]:null;return(<button key={c||"all"} onClick={function(){sCF(c);}} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(c?"1.5px solid "+cc.bd:"1.5px solid #555"):"1px solid #ddd",background:sel?(c?cc.bg:"#f0f0ee"):"#fafafa",color:sel?(c?cc.tx:"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{c||"All"}</button>);})}</div><span style={{width:1,height:14,background:"#ddd",margin:"0 2px"}}/><div style={{display:"flex",gap:3}}>{[null].concat(LEVELS).map(function(lv){var sel=lv===null?levelFilter.length===0:levelFilter.includes(lv);var lc=lv?LEVEL_C[lv]||{}:{};var cnt=lv?act.filter(function(a){return gSk(a).some(function(sk){return sk.level===lv&&(!catFilter||sk.cat===catFilter);});}).length:null;return(<button key={lv||"alllv"} onClick={function(){lv===null?sLF([]):sLF(function(p){return p.includes(lv)?p.filter(function(x){return x!==lv;}):p.concat([lv]);});}} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(lv?"1.5px solid "+(lc.bd||"#555"):"1.5px solid #555"):"1px solid #ddd",background:sel?(lv?(lc.bg||"#f0f0ee"):"#f0f0ee"):"#fafafa",color:sel?(lv?(lc.tx||"#333"):"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{lv?lv+(cnt!==null?" ("+cnt+")":""):"All"}</button>);})}</div><span style={{width:1,height:16,background:"#ccd8e4",margin:"0 4px"}}/>',
'>Coverage (local time)</span><div style={{display:"flex",gap:3}}>{[null,"IT Support","Teleradiology"].map(function(c){var sel=hmCatF===c;var cc=c?CAT_C[c]||CAT_C["Other"]:null;return(<button key={c||"all"} onClick={function(){sHmCF(c);}} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(c?"1.5px solid "+cc.bd:"1.5px solid #555"):"1px solid #ddd",background:sel?(c?cc.bg:"#f0f0ee"):"#fafafa",color:sel?(c?cc.tx:"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{c||"All"}</button>);})}</div><span style={{width:1,height:14,background:"#ddd",margin:"0 2px"}}/><div style={{display:"flex",gap:3}}>{[null].concat(LEVELS).map(function(lv){var sel=lv===null?hmLvlF.length===0:hmLvlF.includes(lv);var lc=lv?LEVEL_C[lv]||{}:{};var cnt=lv?act.filter(function(a){return gSk(a).some(function(sk){return sk.level===lv&&(!hmCatF||sk.cat===hmCatF);});}).length:null;return(<button key={lv||"alllv"} onClick={function(){lv===null?sHmLF([]):sHmLF(function(p){return p.includes(lv)?p.filter(function(x){return x!==lv;}):p.concat([lv]);});}} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:sel?(lv?"1.5px solid "+(lc.bd||"#555"):"1.5px solid #555"):"1px solid #ddd",background:sel?(lv?(lc.bg||"#f0f0ee"):"#f0f0ee"):"#fafafa",color:sel?(lv?(lc.tx||"#333"):"#333"):"#999",cursor:"pointer",fontWeight:sel?600:400}}>{lv?lv+(cnt!==null?" ("+cnt+")":""):"All"}</button>);})}</div><span style={{width:1,height:16,background:"#ccd8e4",margin:"0 4px"}}/>',
'heatmap filters visual-only');

// 9. Agent tab placeholder text
rep('content=(<div style={{color:"#aaa",fontSize:12,padding:"16px 0"}}>Click an agent name above to view their details.</div>);',
    'content=(<div style={{color:"#aaa",fontSize:12,padding:"16px 0"}}>Select an agent from the schedule table or roster to view their details.</div>);',
    'Agent placeholder text');

// 10. Company + Category tabs restructure
// Replace the entire company+category else-if block
const OLD_TABS = `        } else if(pvTab==="company"){
          var pvCoObj2=comps.find(function(c){return c.id===pvVCo;})||comps[0];
          var coStats2=cLS(act,fL,pvCoObj2,sDt);
          var avgCov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.pct;},0)/fL.length):0;
          var uncov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.zero;},0)/fL.length):0;
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{comps.map(function(c){var sel=pvVCo===c.id;return(<button key={c.id} onClick={function(){sPvVCo(c.id);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:sel?"1.5px solid #185FA5":"1px solid #ddd",background:sel?"#dae8f8":"#fafafa",color:sel?"#185FA5":"#888",cursor:"pointer",fontWeight:sel?600:400}}>{c.label}</button>);})}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Avg coverage: </span><b style={{color:avgCov2>=100?"#4A7A28":"#9B3333"}}>{avgCov2+"%"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Uncovered: </span><b style={{color:uncov2>0?"#9B3333":"#4A7A28"}}>{uncov2+"h avg"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Schedule: </span><b>{pvCoObj2.desc}</b></div></div>
            {fL.length>0&&(<div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:400}}><thead><tr style={{background:"#f0f5ff"}}><th style={{textAlign:"left",padding:"7px 12px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Coverage</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Uncovered h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Solo h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Peak agents</th></tr></thead><tbody>{coStats2.map(function(ls2,i){var pc=ls2.pct,barCol=pc>=100?"#4A7A28":pc>=80?"#8abe5a":"#C07070";return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:ls2.zero>0?"#fff8f8":"#fff"}}><td style={{padding:"8px 12px",fontWeight:600}}>{ls2.name}</td><td style={{padding:"8px 10px",textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><div style={{width:80,height:7,background:"#eee",borderRadius:4,overflow:"hidden"}}><div style={{width:pc+"%",height:"100%",background:barCol,borderRadius:4}}/></div><span style={{fontWeight:700,color:barCol,minWidth:36,textAlign:"right"}}>{pc+"%"}</span></div></td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.zero>0?"#9B3333":"#4A7A28",fontWeight:ls2.zero>0?700:400}}>{ls2.zero>0?ls2.zero+"h":"\u2714"}</td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.single>0?"#8A6A20":"#aaa"}}>{ls2.single>0?ls2.single+"h":"\u2014"}</td><td style={{padding:"8px 10px",textAlign:"center",fontWeight:600}}>{ls2.peak}</td></tr>);})}</tbody></table></div>)}
          </div>);
        } else if(pvTab==="category"){
          var pvCC=CAT_C[pvVCat]||CAT_C["Other"];
          var catAgs2=act.filter(function(a){return gSk(a).some(function(sk){return sk.cat===pvVCat;});});
          var lvlGroups={};catAgs2.forEach(function(a){gSk(a).filter(function(sk){return sk.cat===pvVCat;}).forEach(function(sk){if(!lvlGroups[sk.level])lvlGroups[sk.level]=[];lvlGroups[sk.level].push(a.name);});});
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{["IT Support","Teleradiology"].map(function(c){var sel=pvVCat===c;var cc3=CAT_C[c]||CAT_C["Other"];return(<button key={c} onClick={function(){sPvVCat(c);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:sel?"1.5px solid "+cc3.bd:"1px solid #ddd",background:sel?cc3.bg:"#fafafa",color:sel?cc3.tx:"#888",cursor:"pointer",fontWeight:sel?600:400}}>{c}</button>);})}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:pvCC.bg,borderRadius:6,padding:"6px 12px",border:"1px solid "+pvCC.bd}}><span style={{color:pvCC.tx,fontWeight:600}}>{catAgs2.length+" agent"+(catAgs2.length!==1?"s":"")}</span></div>{LEVELS.filter(function(lv){return lvlGroups[lv]&&lvlGroups[lv].length>0;}).map(function(lv){var lc=LEVEL_C[lv]||{};return(<div key={lv} style={{background:lc.bg||"#f0f0ee",borderRadius:6,padding:"6px 12px",border:"1px solid "+(lc.bd||"#ccc")}}><span style={{color:lc.tx||"#555",fontWeight:600}}>{lv+": "+lvlGroups[lv].length+" \u00B7 "+lvlGroups[lv].slice(0,2).join(", ")+(lvlGroups[lv].length>2?" +more":"")}</span></div>);})}</div>
            <div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:360}}><thead><tr style={{background:pvCC.bg}}><th style={{textAlign:"left",padding:"7px 12px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Agent</th><th style={{textAlign:"left",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Level</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Shift</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Now</th></tr></thead><tbody>{catAgs2.map(function(a,i){var sk2=gSk(a).filter(function(sk){return sk.cat===pvVCat;});var lv2=sk2.length>0?sk2[0].level:"";var lc2=LEVEL_C[lv2]||{};var onR3=isOn(a,pvH,pvDay,sDt);return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:onR3?pvCC.bg+"66":"#fff",cursor:"pointer"}} onClick={function(){sPvTab("agent");sAV(all.indexOf(a));}}><td style={{padding:"8px 12px",fontWeight:600,color:onR3?"#1a1a1a":"#555"}}>{a.name}</td><td style={{padding:"8px 10px",color:"#666",fontSize:11}}>{a.loc}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{lv2?<span style={{fontSize:10,background:lc2.bg||"#f0f0ee",color:lc2.tx||"#555",borderRadius:4,padding:"2px 8px",border:"1px solid "+(lc2.bd||"#ccc"),fontWeight:700}}>{lv2}</span>:<span style={{color:"#ccc"}}>{"\u2014"}</span>}</td><td style={{padding:"8px 10px",textAlign:"center",fontSize:11,color:"#666"}}>{fR(a.s,a.e,u12)}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{onR3?<span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#4A7A28"}}/>:<span style={{color:"#ccc",fontSize:11}}>{"\u2014"}</span>}</td></tr>);})}</tbody></table></div>
          </div>);
        }`;

const NEW_TABS = `        } else if(pvTab==="company"){
          var pvCoObj2=comps.find(function(c){return c.id===pvVCo;})||comps[0];
          var coStats2=cLS(act,fL,pvCoObj2,sDt);
          var avgCov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.pct;},0)/fL.length):0;
          var uncov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.zero;},0)/fL.length):0;
          var pvCC=CAT_C[pvVCat]||CAT_C["Other"];
          var catAgs2=act.filter(function(a){return gSk(a).some(function(sk){return sk.cat===pvVCat;});});
          var lvlGroups={};catAgs2.forEach(function(a){gSk(a).filter(function(sk){return sk.cat===pvVCat;}).forEach(function(sk){if(!lvlGroups[sk.level])lvlGroups[sk.level]=[];lvlGroups[sk.level].push(a.name);});});
          var subContent;
          if(pvCoSub==="category"){
            subContent=(<div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{["IT Support","Teleradiology"].map(function(c){var selC=pvVCat===c;var cc3=CAT_C[c]||CAT_C["Other"];return(<button key={c} onClick={function(){sPvVCat(c);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:selC?"1.5px solid "+cc3.bd:"1px solid #ddd",background:selC?cc3.bg:"#fafafa",color:selC?cc3.tx:"#888",cursor:"pointer",fontWeight:selC?600:400}}>{c}</button>);})}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:pvCC.bg,borderRadius:6,padding:"6px 12px",border:"1px solid "+pvCC.bd}}><span style={{color:pvCC.tx,fontWeight:600}}>{catAgs2.length+" agent"+(catAgs2.length!==1?"s":"")}</span></div>{LEVELS.filter(function(lv){return lvlGroups[lv]&&lvlGroups[lv].length>0;}).map(function(lv){var lc=LEVEL_C[lv]||{};return(<div key={lv} style={{background:lc.bg||"#f0f0ee",borderRadius:6,padding:"6px 12px",border:"1px solid "+(lc.bd||"#ccc")}}><span style={{color:lc.tx||"#555",fontWeight:600}}>{lv+": "+lvlGroups[lv].length+" \u00B7 "+lvlGroups[lv].slice(0,2).join(", ")+(lvlGroups[lv].length>2?" +more":"")}</span></div>);})}</div>
              <div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:360}}><thead><tr style={{background:pvCC.bg}}><th style={{textAlign:"left",padding:"7px 12px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Agent</th><th style={{textAlign:"left",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Level</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Shift</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Now</th></tr></thead><tbody>{catAgs2.map(function(a,i){var sk2=gSk(a).filter(function(sk){return sk.cat===pvVCat;});var lv2=sk2.length>0?sk2[0].level:"";var lc2=LEVEL_C[lv2]||{};var onR3=isOn(a,pvH,pvDay,sDt);return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:onR3?pvCC.bg+"66":"#fff",cursor:"pointer"}} onClick={function(){sPvTab("agent");sAV(all.indexOf(a));}}><td style={{padding:"8px 12px",fontWeight:600,color:onR3?"#1a1a1a":"#555"}}>{a.name}</td><td style={{padding:"8px 10px",color:"#666",fontSize:11}}>{a.loc}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{lv2?<span style={{fontSize:10,background:lc2.bg||"#f0f0ee",color:lc2.tx||"#555",borderRadius:4,padding:"2px 8px",border:"1px solid "+(lc2.bd||"#ccc"),fontWeight:700}}>{lv2}</span>:<span style={{color:"#ccc"}}>{"\u2014"}</span>}</td><td style={{padding:"8px 10px",textAlign:"center",fontSize:11,color:"#666"}}>{fR(a.s,a.e,u12)}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{onR3?<span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#4A7A28"}}/>:<span style={{color:"#ccc",fontSize:11}}>{"\u2014"}</span>}</td></tr>);})}</tbody></table></div>
            </div>);
          } else {
            subContent=(<div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{comps.map(function(c){var selC=pvVCo===c.id;return(<button key={c.id} onClick={function(){sPvVCo(c.id);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:selC?"1.5px solid #185FA5":"1px solid #ddd",background:selC?"#dae8f8":"#fafafa",color:selC?"#185FA5":"#888",cursor:"pointer",fontWeight:selC?600:400}}>{c.label}</button>);})}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Avg coverage: </span><b style={{color:avgCov2>=100?"#4A7A28":"#9B3333"}}>{avgCov2+"%"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Uncovered: </span><b style={{color:uncov2>0?"#9B3333":"#4A7A28"}}>{uncov2+"h avg"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Schedule: </span><b>{pvCoObj2.desc}</b></div></div>
              {fL.length>0&&(<div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:400}}><thead><tr style={{background:"#f0f5ff"}}><th style={{textAlign:"left",padding:"7px 12px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Coverage</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Uncovered h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Solo h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Peak agents</th></tr></thead><tbody>{coStats2.map(function(ls2,i){var pc=ls2.pct,barCol=pc>=100?"#4A7A28":pc>=80?"#8abe5a":"#C07070";return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:ls2.zero>0?"#fff8f8":"#fff"}}><td style={{padding:"8px 12px",fontWeight:600}}>{ls2.name}</td><td style={{padding:"8px 10px",textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><div style={{width:80,height:7,background:"#eee",borderRadius:4,overflow:"hidden"}}><div style={{width:pc+"%",height:"100%",background:barCol,borderRadius:4}}/></div><span style={{fontWeight:700,color:barCol,minWidth:36,textAlign:"right"}}>{pc+"%"}</span></div></td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.zero>0?"#9B3333":"#4A7A28",fontWeight:ls2.zero>0?700:400}}>{ls2.zero>0?ls2.zero+"h":"\u2714"}</td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.single>0?"#8A6A20":"#aaa"}}>{ls2.single>0?ls2.single+"h":"\u2014"}</td><td style={{padding:"8px 10px",textAlign:"center",fontWeight:600}}>{ls2.peak}</td></tr>);})}</tbody></table></div>)}
            </div>);
          }
          content=(<div>
            <div style={{display:"inline-flex",gap:1,marginBottom:14,background:"#e8f0fa",borderRadius:7,padding:3}}>
              <button onClick={function(){sPvCoSub("overview");}} style={{fontSize:11,padding:"4px 16px",borderRadius:5,border:"none",background:pvCoSub==="overview"?"#fff":"transparent",color:pvCoSub==="overview"?"#185FA5":"#999",cursor:"pointer",fontWeight:pvCoSub==="overview"?600:400,boxShadow:pvCoSub==="overview"?"0 1px 3px rgba(24,95,165,0.15)":"none"}}>Overview</button>
              <button onClick={function(){sPvCoSub("category");}} style={{fontSize:11,padding:"4px 16px",borderRadius:5,border:"none",background:pvCoSub==="category"?"#fff":"transparent",color:pvCoSub==="category"?"#185FA5":"#999",cursor:"pointer",fontWeight:pvCoSub==="category"?600:400,boxShadow:pvCoSub==="category"?"0 1px 3px rgba(24,95,165,0.15)":"none"}}>Category</button>
            </div>
            {subContent}
          </div>);
        }`;

rep(OLD_TABS, NEW_TABS, 'Company+Category tab restructure');

fs.writeFileSync(file, code);
console.log('\nDone. Lines:', code.split('\n').length);
