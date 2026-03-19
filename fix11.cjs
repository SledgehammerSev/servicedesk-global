const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(file, 'utf8');

function rep(old, nw, label, all) {
  if (!code.includes(old)) { console.log('MISS', label); return false; }
  code = all ? code.split(old).join(nw) : code.replace(old, nw);
  console.log('OK  ', label);
  return true;
}

// ─── Level pill counts: Who's on now + UTC overview (both use catFilter) ──────
// Change from any-skill matching to first-skill-per-agent matching
// so an agent with IT Support L2 + Teleradiology L2/3 only counts in ONE bucket
rep(
  'var cnt=lv?act.filter(function(a){return gSk(a).some(function(sk){return sk.level===lv&&(!catFilter||sk.cat===catFilter);});}).length:null;',
  'var cnt=lv?act.filter(function(a){var s=gSk(a);if(catFilter){var sk=s.find(function(x){return x.cat===catFilter;});return sk&&sk.level===lv;}return s.length>0&&s[0].level===lv;}).length:null;',
  'level cnt dedup (catFilter)',
  true // replaces both Who\'s on now and UTC overview
);

// ─── Level pill counts: Coverage heatmap (uses hmCatF) ───────────────────────
rep(
  'var cnt=lv?act.filter(function(a){return gSk(a).some(function(sk){return sk.level===lv&&(!hmCatF||sk.cat===hmCatF);});}).length:null;',
  'var cnt=lv?act.filter(function(a){var s=gSk(a);if(hmCatF){var sk=s.find(function(x){return x.cat===hmCatF;});return sk&&sk.level===lv;}return s.length>0&&s[0].level===lv;}).length:null;',
  'level cnt dedup (hmCatF)'
);

// ─── Company tab level columns: also deduplicate per agent per category ───────
// An agent should only count in ONE level column per category row
rep(
  'var cnt5=cAgs5.filter(function(a){return gSk(a).some(function(sk){return sk.cat===cd.cat&&sk.level===lv;});}).length;',
  'var cnt5=cAgs5.filter(function(a){var sk=gSk(a).find(function(x){return x.cat===cd.cat;});return sk&&sk.level===lv;}).length;',
  'company level col dedup'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
