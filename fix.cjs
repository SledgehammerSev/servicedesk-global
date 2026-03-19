const fs = require('fs');
let c = fs.readFileSync('c:/Users/JohnManoukian/OneDrive - harrison.ai/Documents/Coding/servicedesk-global/src/App.jsx', 'utf8');

// 1. TZStrip: add catCC2 vars after notAllDay line
c = c.replace(
  'var notAllDay=co&&!co.allDay,cDays=co&&co.days||[],cSH=co&&co.sH||9,cEH=co&&co.eH||17;',
  'var notAllDay=co&&!co.allDay,cDays=co&&co.days||[],cSH=co&&co.sH||9,cEH=co&&co.eH||17;var catCC2=p.catFilt?(CAT_C[p.catFilt]||CAT_C["Other"]):null;var covBd=catCC2?catCC2.bd:"#4A7A28";var covLBg=p.catFilt==="IT Support"?"rgba(24,95,165,0.13)":p.catFilt==="Teleradiology"?"rgba(124,77,184,0.13)":"rgba(74,122,40,0.12)";var covNBg=p.catFilt==="IT Support"?"rgba(24,95,165,0.08)":p.catFilt==="Teleradiology"?"rgba(124,77,184,0.08)":"rgba(74,122,40,0.08)";'
);
console.log('1. TZStrip catCC2:', c.includes('catCC2'));

// 2. TZStrip: change bg colors
c = c.replace(
  'var bg=isC?(cov?"#4A7A28":cnt>0&&!req?"#8A6A20":"#9B3333"):req?(isD2?(cov?"rgba(74,122,40,0.12)":"#f0f5ff"):(cov?"rgba(74,122,40,0.08)":"#e8ecf2")):(isD2?"rgba(0,0,0,0.02)":"rgba(0,0,0,0.04)");',
  'var bg=isC?(cov?covBd:cnt>0&&!req?"#8A6A20":"#9B3333"):req?(isD2?(cov?covLBg:"#f0f5ff"):(cov?covNBg:"#e8ecf2")):(isD2?"rgba(0,0,0,0.02)":"rgba(0,0,0,0.04)");'
);
console.log('2. TZStrip bg:', c.includes('cov?covBd'));

// 3. TZStrip bottom strip color
c = c.replace(
  'background:cov?"#4A7A28":cnt>0&&!req?"#8A6A20":"#9B3333"}}/>',
  'background:cov?covBd:cnt>0&&!req?"#8A6A20":"#9B3333"}}/>',
);
console.log('3. Bottom strip:', c.includes('cov?covBd:cnt>0'));

// 4. App: add catFilt prop to TZStrip call
c = c.replace(
  'return(<TZStrip key={i} loc={loc} off={off} tz={tz} uH={pvH+pvM/60} uD={pvDay} onChange={chgPv} u12={u12} dt={sDt} ags={tzAgs} home={loc.name===hLoc.name} pvD={pvD} co={coObj} live={isNow} nowM={nowM}/>);',
  'return(<TZStrip key={i} loc={loc} off={off} tz={tz} uH={pvH+pvM/60} uD={pvDay} onChange={chgPv} u12={u12} dt={sDt} ags={tzAgs} home={loc.name===hLoc.name} pvD={pvD} co={coObj} live={isNow} nowM={nowM} catFilt={catFilter}/>);'
);
console.log('4. catFilt prop:', c.includes('catFilt={catFilter}'));

// 5. UTC overview header: fix filter positioning (remove space-between)
c = c.replace(
  '<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:4}}><span style={{fontSize:10,color:"#8ab",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>UTC 24hr overview</span>',
  '<div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:6}}><span style={{fontSize:10,color:"#8ab",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",flexShrink:0}}>UTC 24hr overview</span>'
);
console.log('5. UTC header:', c.includes('flexShrink:0}}>UTC 24hr overview'));

// 6. UTC SVG: remove maxWidth
c = c.replace('style={{width:"100%",maxWidth:960}}', 'style={{width:"100%"}}');
console.log('6. maxWidth removed:', !c.includes('maxWidth:960'));

// 7. UTC HR: 28 -> 36
c = c.replace('var W=860,HR=28,PL=190', 'var W=860,HR=36,PL=190');
console.log('7. HR=36:', c.includes('HR=36'));

// 8. Root div: add zoom for better sizing at 100%
c = c.replace(
  '<div style={{fontFamily:"-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif",padding:"12px 16px",width:"100%",boxSizing:"border-box"}}>',
  '<div style={{fontFamily:"-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif",padding:"12px 16px",width:"100%",boxSizing:"border-box",zoom:1.15}}>'
);
console.log('8. zoom added:', c.includes('zoom:1.15'));

// 9. Replace Company tab content (mkGrid -> table)
const oldCoContent = `          var pvCoObj2=comps.find(function(c){return c.id===pvVCo;})||comps[0];
          var coStats2=cLS(act,fL,pvCoObj2,sDt);
          var avgCov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.pct;},0)/fL.length):0;
          var uncov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.zero;},0)/fL.length):0;
          var peak2=coStats2.reduce(function(m,l){return Math.max(m,l.peak);},0);
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{comps.map(function(c){var sel=pvVCo===c.id;return(<button key={c.id} onClick={function(){sPvVCo(c.id);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:sel?"1.5px solid #185FA5":"1px solid #ddd",background:sel?"#dae8f8":"#fafafa",color:sel?"#185FA5":"#888",cursor:"pointer",fontWeight:sel?600:400}}>{c.label}</button>);})}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Coverage: </span><b style={{color:avgCov2>=100?"#4A7A28":"#9B3333"}}>{avgCov2+"%"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Uncovered: </span><b style={{color:uncov2>0?"#9B3333":"#4A7A28"}}>{uncov2+"h avg"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Peak: </span><b>{peak2+" agents"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Schedule: </span><b>{pvCoObj2.desc}</b></div></div>
            {fL.length>0&&<div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:600,color:"#666",marginBottom:6}}>Location breakdown</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{coStats2.map(function(ls2,i){return(<div key={i} style={{background:"#fff",border:"1px solid "+(ls2.zero>0?"#f0c8c8":"#c8e0c8"),borderRadius:6,padding:"8px 12px",fontSize:11,minWidth:130}}><div style={{fontWeight:600,marginBottom:4}}>{ls2.name}</div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><div style={{flex:1,height:6,background:"#eee",borderRadius:3,overflow:"hidden"}}><div style={{width:ls2.pct+"%",height:"100%",background:ls2.pct>=100?"#4A7A28":ls2.pct>=80?"#8abe5a":"#C07070"}}/></div><span style={{fontWeight:700,color:ls2.pct>=100?"#4A7A28":"#C07070",fontSize:10,minWidth:32,textAlign:"right"}}>{ls2.pct+"%"}</span></div>{ls2.zero>0&&<div style={{color:"#9B3333",fontSize:10}}>{ls2.zero+"h uncovered"}</div>}{ls2.single>0&&<div style={{color:"#8A6A20",fontSize:10}}>{ls2.single+"h solo"}</div>}</div>);})}</div></div>}
            <div style={{fontSize:11,fontWeight:600,color:"#666",marginBottom:6}}>Weekly UTC coverage</div>
            {mkGrid(act)}
            <div style={{fontSize:9,color:"#aaa",marginTop:6}}>All active agents \u00B7 coloured by count per UTC hour/day \u00B7 highlighted = current time</div>
          </div>);`;

const newCoContent = `          var pvCoObj2=comps.find(function(c){return c.id===pvVCo;})||comps[0];
          var coStats2=cLS(act,fL,pvCoObj2,sDt);
          var avgCov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.pct;},0)/fL.length):0;
          var uncov2=fL.length>0?Math.round(coStats2.reduce(function(a,l){return a+l.zero;},0)/fL.length):0;
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{comps.map(function(c){var sel=pvVCo===c.id;return(<button key={c.id} onClick={function(){sPvVCo(c.id);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:sel?"1.5px solid #185FA5":"1px solid #ddd",background:sel?"#dae8f8":"#fafafa",color:sel?"#185FA5":"#888",cursor:"pointer",fontWeight:sel?600:400}}>{c.label}</button>);})}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Avg coverage: </span><b style={{color:avgCov2>=100?"#4A7A28":"#9B3333"}}>{avgCov2+"%"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Uncovered: </span><b style={{color:uncov2>0?"#9B3333":"#4A7A28"}}>{uncov2+"h avg"}</b></div><div style={{background:"#fff",borderRadius:6,padding:"6px 12px",border:"1px solid #dde6f0"}}><span style={{color:"#888"}}>Schedule: </span><b>{pvCoObj2.desc}</b></div></div>
            {fL.length>0&&(<div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:400}}><thead><tr style={{background:"#f0f5ff"}}><th style={{textAlign:"left",padding:"7px 12px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Coverage</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Uncovered h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Solo h</th><th style={{textAlign:"center",padding:"7px 10px",color:"#555",fontWeight:600,fontSize:11,borderBottom:"2px solid #dde6f0"}}>Peak agents</th></tr></thead><tbody>{coStats2.map(function(ls2,i){var pc=ls2.pct,barCol=pc>=100?"#4A7A28":pc>=80?"#8abe5a":"#C07070";return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:ls2.zero>0?"#fff8f8":"#fff"}}><td style={{padding:"8px 12px",fontWeight:600}}>{ls2.name}</td><td style={{padding:"8px 10px",textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><div style={{width:80,height:7,background:"#eee",borderRadius:4,overflow:"hidden"}}><div style={{width:pc+"%",height:"100%",background:barCol,borderRadius:4}}/></div><span style={{fontWeight:700,color:barCol,minWidth:36,textAlign:"right"}}>{pc+"%"}</span></div></td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.zero>0?"#9B3333":"#4A7A28",fontWeight:ls2.zero>0?700:400}}>{ls2.zero>0?ls2.zero+"h":"\u2714"}</td><td style={{padding:"8px 10px",textAlign:"center",color:ls2.single>0?"#8A6A20":"#aaa"}}>{ls2.single>0?ls2.single+"h":"\u2014"}</td><td style={{padding:"8px 10px",textAlign:"center",fontWeight:600}}>{ls2.peak}</td></tr>);})}</tbody></table></div>)}
          </div>);`;

if (c.includes(oldCoContent)) {
  c = c.replace(oldCoContent, newCoContent);
  console.log('9. Company tab replaced: true');
} else {
  console.log('9. Company tab NOT FOUND - searching...');
  const idx = c.indexOf('var pvCoObj2=comps.find');
  console.log('Found at:', idx, c.slice(idx, idx+100));
}

// 10. Replace Category tab content (mkGrid -> table)
const oldCatContent = `          var pvCC=CAT_C[pvVCat]||CAT_C["Other"];
          var catAgs2=act.filter(function(a){return gSk(a).some(function(sk){return sk.cat===pvVCat;});});
          var lvlGroups={};catAgs2.forEach(function(a){gSk(a).filter(function(sk){return sk.cat===pvVCat;}).forEach(function(sk){if(!lvlGroups[sk.level])lvlGroups[sk.level]=[];lvlGroups[sk.level].push(a.name);});});
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{["IT Support","Teleradiology"].map(function(c){var sel=pvVCat===c;var cc3=CAT_C[c]||CAT_C["Other"];return(<button key={c} onClick={function(){sPvVCat(c);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:sel?"1.5px solid "+cc3.bd:"1px solid #ddd",background:sel?cc3.bg:"#fafafa",color:sel?cc3.tx:"#888",cursor:"pointer",fontWeight:sel?600:400}}>{c}</button>);})}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:pvCC.bg,borderRadius:6,padding:"6px 12px",border:"1px solid "+pvCC.bd}}><span style={{color:pvCC.tx,fontWeight:600}}>{catAgs2.length+" agent"+(catAgs2.length!==1?"s":"")}</span></div>{LEVELS.filter(function(lv){return lvlGroups[lv]&&lvlGroups[lv].length>0;}).map(function(lv){var lc=LEVEL_C[lv]||{};return(<div key={lv} style={{background:lc.bg||"#f0f0ee",borderRadius:6,padding:"6px 12px",border:"1px solid "+(lc.bd||"#ccc")}}><span style={{color:lc.tx||"#555",fontWeight:600}}>{lv+": "+lvlGroups[lv].length}</span></div>);})}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{catAgs2.map(function(a,i){var sk2=gSk(a).filter(function(sk){return sk.cat===pvVCat;});var lv2=sk2.length>0?sk2[0].level:"";var lc2=LEVEL_C[lv2]||{};var onR3=isOn(a,pvH,pvDay,sDt);return(<div key={i} style={{background:"#fff",border:"1px solid "+(onR3?pvCC.bd:"#ddd"),borderRadius:6,padding:"6px 10px",fontSize:11,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={function(){sPvTab("agent");sAV(all.indexOf(a));}}>{onR3&&<span style={{width:6,height:6,borderRadius:"50%",background:"#4A7A28",flexShrink:0}}/>}<span style={{fontWeight:600,color:onR3?"#1a1a1a":"#555"}}>{a.name}</span><span style={{fontSize:10,color:"#888"}}>{a.loc}</span>{lv2&&<span style={{fontSize:9,background:lc2.bg||"#f0f0ee",color:lc2.tx||"#555",borderRadius:3,padding:"1px 5px",border:"1px solid "+(lc2.bd||"#ccc"),fontWeight:700}}>{lv2}</span>}</div>);})}</div>
            <div style={{fontSize:11,fontWeight:600,color:"#666",marginBottom:6}}>{"Weekly UTC coverage \u2014 "+pvVCat}</div>
            {mkGrid(catAgs2)}
            <div style={{fontSize:9,color:"#aaa",marginTop:6}}>{pvVCat+" agents only \u00B7 coloured by count per UTC hour/day"}</div>
          </div>);`;

const newCatContent = `          var pvCC=CAT_C[pvVCat]||CAT_C["Other"];
          var catAgs2=act.filter(function(a){return gSk(a).some(function(sk){return sk.cat===pvVCat;});});
          var lvlGroups={};catAgs2.forEach(function(a){gSk(a).filter(function(sk){return sk.cat===pvVCat;}).forEach(function(sk){if(!lvlGroups[sk.level])lvlGroups[sk.level]=[];lvlGroups[sk.level].push(a.name);});});
          content=(<div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{["IT Support","Teleradiology"].map(function(c){var sel=pvVCat===c;var cc3=CAT_C[c]||CAT_C["Other"];return(<button key={c} onClick={function(){sPvVCat(c);}} style={{fontSize:11,padding:"5px 14px",borderRadius:6,border:sel?"1.5px solid "+cc3.bd:"1px solid #ddd",background:sel?cc3.bg:"#fafafa",color:sel?cc3.tx:"#888",cursor:"pointer",fontWeight:sel?600:400}}>{c}</button>);})}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,fontSize:12}}><div style={{background:pvCC.bg,borderRadius:6,padding:"6px 12px",border:"1px solid "+pvCC.bd}}><span style={{color:pvCC.tx,fontWeight:600}}>{catAgs2.length+" agent"+(catAgs2.length!==1?"s":"")}</span></div>{LEVELS.filter(function(lv){return lvlGroups[lv]&&lvlGroups[lv].length>0;}).map(function(lv){var lc=LEVEL_C[lv]||{};return(<div key={lv} style={{background:lc.bg||"#f0f0ee",borderRadius:6,padding:"6px 12px",border:"1px solid "+(lc.bd||"#ccc")}}><span style={{color:lc.tx||"#555",fontWeight:600}}>{lv+": "+lvlGroups[lv].length+" · "+lvlGroups[lv].slice(0,2).join(", ")+(lvlGroups[lv].length>2?" +more":"")}</span></div>);})}</div>
            <div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",width:"100%",fontSize:12,minWidth:360}}><thead><tr style={{background:pvCC.bg}}><th style={{textAlign:"left",padding:"7px 12px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Agent</th><th style={{textAlign:"left",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Location</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Level</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Shift</th><th style={{textAlign:"center",padding:"7px 10px",color:pvCC.tx,fontWeight:600,fontSize:11,borderBottom:"2px solid "+pvCC.bd}}>Now</th></tr></thead><tbody>{catAgs2.map(function(a,i){var sk2=gSk(a).filter(function(sk){return sk.cat===pvVCat;});var lv2=sk2.length>0?sk2[0].level:"";var lc2=LEVEL_C[lv2]||{};var onR3=isOn(a,pvH,pvDay,sDt);return(<tr key={i} style={{borderBottom:"1px solid #eef2f8",background:onR3?pvCC.bg+"66":"#fff",cursor:"pointer"}} onClick={function(){sPvTab("agent");sAV(all.indexOf(a));}}><td style={{padding:"8px 12px",fontWeight:600,color:onR3?"#1a1a1a":"#555"}}>{a.name}</td><td style={{padding:"8px 10px",color:"#666",fontSize:11}}>{a.loc}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{lv2?<span style={{fontSize:10,background:lc2.bg||"#f0f0ee",color:lc2.tx||"#555",borderRadius:4,padding:"2px 8px",border:"1px solid "+(lc2.bd||"#ccc"),fontWeight:700}}>{lv2}</span>:<span style={{color:"#ccc"}}>{"—"}</span>}</td><td style={{padding:"8px 10px",textAlign:"center",fontSize:11,color:"#666"}}>{fR(a.s,a.e,u12)}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{onR3?<span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#4A7A28"}}/>:<span style={{color:"#ccc",fontSize:11}}>{"—"}</span>}</td></tr>);})}</tbody></table></div>
          </div>);`;

if (c.includes(oldCatContent)) {
  c = c.replace(oldCatContent, newCatContent);
  console.log('10. Category tab replaced: true');
} else {
  console.log('10. Category tab NOT FOUND');
  const idx = c.indexOf('var pvCC=CAT_C[pvVCat]');
  console.log('Found at:', idx);
}

fs.writeFileSync('c:/Users/JohnManoukian/OneDrive - harrison.ai/Documents/Coding/servicedesk-global/src/App.jsx', c);
console.log('\nAll done!');
