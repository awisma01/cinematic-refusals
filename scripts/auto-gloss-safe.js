// Replace existing <span class="vocab-term" data-term="...">text</span> with <a href="glossary.html#term-..." class="gloss-inline">text</a>
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

const root = path.join(__dirname, '..');
const files = walk(root).filter(f => f.endsWith('.html') && !f.includes(`${path.sep}node_modules${path.sep}`));
files.forEach(file=>{
  const rel = path.relative(root, file).replace(/\\/g,'/');
  if (rel === 'glossary.html') return;
  let src = fs.readFileSync(file,'utf8');
  const backup = file + '.bak-auto-gloss';
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, src, 'utf8');

  // replace spans with data-term
  const out = src.replace(/<span([^>]*class="[^"]*vocab-term[^"]*"[^>]*)data-term="([^"]+)"([^>]*)>([\s\S]*?)<\/span>/gi,
    (m, before, id, after, inner) => {
      // skip if already inside an anchor (rough check)
      if (/href=/.test(before+after+inner)) return m;
      return `<a class="gloss-inline" href="glossary.html#${id}">${inner}</a>`;
    }
  );

  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('Patched', rel);
  }
});
console.log('Done. Review changes (git diff).');