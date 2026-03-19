const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Bump HR: 30 -> 32
if (!code.includes('var W=860,HR=30,')) { console.log('MISS HR'); }
else {
  code = code.replace('var W=860,HR=30,', 'var W=860,HR=32,');
  console.log('OK   HR 30->32');
}

// 2. Move CONFIG + HEATMAP sections to just after UTC overview
const CFG_START = '\n      {/* CONFIG */}';
const STATS_START = '\n      {/* STATS */}';

const cfgIdx = code.indexOf(CFG_START);
const statsIdx = code.indexOf(STATS_START);

if (cfgIdx === -1) { console.log('MISS CFG_START'); process.exit(1); }
if (statsIdx === -1) { console.log('MISS STATS_START'); process.exit(1); }

// Extract the block (CONFIG + blank line + HEATMAP + blank line)
const blockToMove = code.slice(cfgIdx, statsIdx);
console.log('Block to move starts with:', JSON.stringify(blockToMove.slice(0, 40)));
console.log('Block to move ends with:', JSON.stringify(blockToMove.slice(-40)));

// Remove block from current location
code = code.slice(0, cfgIdx) + code.slice(statsIdx);

// Find UTC overview closing </div> followed by summary stats div
const UTC_END_MARKER = '</div>\n        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8,padding:"8px 12px"';
const utcIdx = code.indexOf(UTC_END_MARKER);

if (utcIdx === -1) { console.log('MISS UTC_END_MARKER'); process.exit(1); }

// Insert blockToMove between </div> and the summary stats div
const insertAt = utcIdx + '</div>'.length;
code = code.slice(0, insertAt) + blockToMove + code.slice(insertAt);
console.log('OK   moved CONFIG+HEATMAP after UTC overview');

fs.writeFileSync(file, code);
console.log('Done. Lines:', code.split('\n').length);
