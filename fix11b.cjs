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

// Prefer intermediate levels (L1/2, L2/3) when deduplicating across categories.
// "if an agent is L2/3 just pick that one" — intermediate wins over pure levels.
// With a category filter, use that category's skill level (exact, already per-agent).

rep(
  'var cnt=lv?act.filter(function(a){var s=gSk(a);if(catFilter){var sk=s.find(function(x){return x.cat===catFilter;});return sk&&sk.level===lv;}return s.length>0&&s[0].level===lv;}).length:null;',
  'var cnt=lv?act.filter(function(a){var s=gSk(a);if(catFilter){var sk=s.find(function(x){return x.cat===catFilter;});return sk&&sk.level===lv;}var inter=s.find(function(sk){return sk.level==="L1/2"||sk.level==="L2/3";});var pl=inter?inter.level:(s.length>0?s[0].level:null);return pl===lv;}).length:null;',
  'level cnt prefer-intermediate (catFilter)',
  true
);

rep(
  'var cnt=lv?act.filter(function(a){var s=gSk(a);if(hmCatF){var sk=s.find(function(x){return x.cat===hmCatF;});return sk&&sk.level===lv;}return s.length>0&&s[0].level===lv;}).length:null;',
  'var cnt=lv?act.filter(function(a){var s=gSk(a);if(hmCatF){var sk=s.find(function(x){return x.cat===hmCatF;});return sk&&sk.level===lv;}var inter=s.find(function(sk){return sk.level==="L1/2"||sk.level==="L2/3";});var pl=inter?inter.level:(s.length>0?s[0].level:null);return pl===lv;}).length:null;',
  'level cnt prefer-intermediate (hmCatF)'
);

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
