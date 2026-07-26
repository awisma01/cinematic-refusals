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
function stripTags(s){ return s.replace(/<[^>]+>/g,'').trim(); }
function normalize(s){ return (s||'').toLowerCase().normalize('NFKD'); }
function slugify(s){
  return 'term-' + s.toLowerCase()
    .replace(/[\u0300-\u036f]/g,'') // strip accents
    .replace(/[^a-z0-9]+/gi,'-')
    .replace(/^-+|-+$/g,'');
}

const ROOT = path.join(__dirname, '..');
const GPATH = path.join(ROOT, 'glossary.html');
if (!fs.existsSync(GPATH)) { console.error('glossary.html not found'); process.exit(1); }
let gsrc = fs.readFileSync(GPATH, 'utf8');

// collect existing glossary term names (visible text)
const termRe = /<div[^>]*\bid="(term-[^"]+)"[^>]*>[\s\S]*?<h3[^>]*class="term-name"[^>]*>([\s\S]*?)<\/h3>/gi;
const existing = new Map();
let m;
while((m = termRe.exec(gsrc))){
  const id = m[1].trim();
  const name = stripTags(m[2]);
  existing.set(normalize(name), { id, name });
}

// scan all html for vocab-term spans
const files = walk(ROOT).filter(f => f.endsWith('.html') && !f.includes(`${path.sep}node_modules${path.sep}`));
const found = new Map(); // normalized -> {label, pages: Set}
files.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g,'/');
  if (rel === 'glossary.html') return;
  const src = fs.readFileSync(f, 'utf8');
  const spanRe = /<span[^>]*class="[^"]*vocab-term[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
  let mm;
  while((mm = spanRe.exec(src))){
    const raw = stripTags(mm[1]);
    if (!raw) continue;
    const key = normalize(raw);
    if (!found.has(key)) found.set(key, { label: raw, pages: new Set() });
    found.get(key).pages.add(rel);
  }
});

// compute missing terms
const missing = [];
found.forEach((v,k) => {
  if (!existing.has(k)) missing.push({ key: k, label: v.label, pages: Array.from(v.pages) });
});

if (!missing.length){
  console.log('No missing terms found. All vocab-term spans are present in glossary.');
  process.exit(0);
}

// create backup and append an AUTO-ADDED group to glossary
const backup = GPATH + '.bak-auto-gloss';
if (!fs.existsSync(backup)) fs.writeFileSync(backup, gsrc, 'utf8');

let insert = '\n\n<!-- AUTO-ADDED TERMS (review & relocate manually) -->\n<div class="letter-group" id="group-AUTO-ADDED">\n  <h2 class="letter-heading" id="letter-AUTO-ADDED">AUTO‑ADDED</h2>\n';

missing.forEach(item => {
  const id = slugify(item.label);
  const safeId = id || ('term-auto-' + Math.random().toString(36).slice(2,8));
  insert += `
  <div class="term-card" id="${safeId}" data-cat="uncategorized" data-used-on="${item.pages.join(',')}">
    <div class="term-header">
      <h3 class="term-name">${item.label}</h3>
      <span class="term-category uncategorized">Uncategorized</span>
      <span class="term-source">Auto-detected</span>
    </div>
    <p class="term-def">(definition needed — auto‑added from site occurrences)</p>
    <p class="term-usage"><strong>Found on</strong> ${item.pages.map(p=>`<a href="${p}">${p}</a>`).join(', ')}</p>
  </div>\n`;
});

insert += '</div>\n<!-- END AUTO-ADDED TERMS -->\n';

// append before closing main (try to find a </main>), otherwise append to end
let out;
if (gsrc.includes('</main>')) {
  out = gsrc.replace('</main>', insert + '\n</main>');
} else {
  out = gsrc + '\n' + insert;
}

fs.writeFileSync(GPATH, out, 'utf8');
console.log(`Appended ${missing.length} auto-added terms to glossary.html (backup at ${path.basename(backup)}).`);
console.log('Review glossary.html, relocate items into proper letter groups and add definitions.'); 