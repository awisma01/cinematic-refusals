const fs = require('fs');
const path = require('path');

function walk(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e => {
    const res = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') return walk(res);
    return e.isFile() ? [res] : [];
  });
}
function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// 1) read glossary and extract terms (id + visible name)
const GLOSSARY = path.join(__dirname, '..', 'glossary.html');
let gtext = fs.readFileSync(GLOSSARY, 'utf8');
const termRe = /<div[^>]*\bid="(term-[^"]+)"[^>]*>[\s\S]*?<h3[^>]*class="term-name"[^>]*>([\s\S]*?)<\/h3>/gi;
const terms = [];
let m;
while((m = termRe.exec(gtext))){
  const id = m[1].trim();
  const name = m[2].replace(/<[^>]+>/g,'').trim();
  if (id && name) terms.push({ id, name });
}
if (!terms.length) {
  console.error('No terms found in glossary.html. Aborting.');
  process.exit(1);
}
terms.sort((a,b)=> b.name.length - a.name.length); // longer names first

// 2) scan HTML files and insert first occurrence per page for each term
const root = path.join(__dirname, '..');
const files = walk(root).filter(f => f.endsWith('.html') && !f.includes(`${path.sep}node_modules${path.sep}`));
const glossaryPath = 'glossary.html';
const usage = {}; // termId -> Set of pages

terms.forEach(t => usage[t.id] = new Set());

files.forEach(file => {
  const rel = path.relative(root, file).replace(/\\/g,'/');
  if (rel === glossaryPath) return; // skip glossary itself
  let src = fs.readFileSync(file, 'utf8');
  const backup = file + '.bak-auto-gloss';
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, src, 'utf8');

  // split into tags and text nodes so we don't insert inside tags
  const parts = src.split(/(<[^>]+>)/g);
  let changed = false;
  // For each text part, attempt to insert for any term not yet found in this doc
  const foundThisDoc = new Set();
  for (let i = 0; i < parts.length; i += 2) { // even indices are text nodes (split preserves)
    let text = parts[i];
    if (!text) continue;
    // skip if already likely a link to glossary
    if (text.includes('glossary.html')) continue;
    for (const t of terms) {
      if (foundThisDoc.has(t.id)) continue; // one insertion per term per page
      const re = new RegExp('\\b' + escapeRegExp(t.name) + '\\b', 'i');
      const match = text.match(re);
      if (match) {
        // preserve original case
        const original = match[0];
        const anchor = `<a href="${glossaryPath}#${t.id}" class="gloss-inline">${original}</a>`;
        text = text.replace(re, anchor);
        parts[i] = text;
        foundThisDoc.add(t.id);
        usage[t.id].add(rel);
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(file, parts.join(''), 'utf8');
    console.log('Updated', rel);
  }
});

// 3) update glossary.html term-card elements to include data-used-on="pageA.html,pageB.html"
let out = gtext;
terms.forEach(t => {
  const pages = Array.from(usage[t.id] || []).map(p => p.replace(/\.\//,'')).join(',');
  const attrRe = new RegExp(`(<div[^>]*\\bid="${t.id}"[^>]*)(data-used-on="[^"]*"\\s*)?([>])`, 'i');
  out = out.replace(attrRe, (m0, before, existing, end) => {
    if (!pages) {
      // remove existing attribute if no pages found
      return before.replace(/\sdata-used-on="[^"]*"\s*/i, '') + end;
    }
    // add or replace
    const newAttr = ` data-used-on="${pages}" `;
    if (existing) {
      return before.replace(/\sdata-used-on="[^"]*"\s*/i, ' ') + newAttr + end;
    }
    return before + newAttr + end;
  });
});
if (out !== gtext) {
  const backupG = GLOSSARY + '.bak-auto-gloss';
  if (!fs.existsSync(backupG)) fs.writeFileSync(backupG, gtext, 'utf8');
  fs.writeFileSync(GLOSSARY, out, 'utf8');
  console.log('Updated glossary.html with data-used-on for terms.');
} else {
  console.log('No changes to glossary.html needed.');
}

console.log('Done. Review changes and run git diff. Manual edits recommended for ambiguous matches.');