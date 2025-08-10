import fs from 'fs';
import path from 'path';

const SRC = path.resolve(process.cwd(), 'src');
const TOP_LEVEL_SECTIONS = [
  'common','nav','auth','wedding','guests','rsvp','weddingParty','invitation','customization','date','validation','errors','success','language'
];

function walk(dir: string, files: string[] = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function safeParseLocaleObject(source: string): unknown {
  // support optional type annotation between name and '='
  const match = source.match(/export const\s+\w+\s*(?::\s*[^=]+)?=\s*(\{[\s\S]*\});?/);
  if (!match) return {};
  try {
    const obj = new Function(`return (${match[1]})`)();
    return obj;
  } catch {
    return {};
  }
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const val = (obj as Record<string, unknown>)[k];
    const next = prefix ? `${prefix}.${k}` : k;
    if (isRecord(val)) {
      keys = keys.concat(flatten(val as Record<string, unknown>, next));
    } else {
      keys.push(next);
    }
  }
  return keys;
}

function collectDestructuredSections(content: string) {
  // Matches: const { invitation, common } = t; OR const { invitation: inv } = t;
  const map = new Map<string, string>(); // localVar -> sectionName
  const re = /const\s*\{([^}]+)\}\s*=\s*t\s*;?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const inside = m[1];
    inside.split(',').forEach(part => {
      const p = part.trim();
      if (!p) return;
      const alias = p.match(/(\w+)\s*:\s*(\w+)/);
      if (alias) {
        const section = alias[1];
        const local = alias[2];
        if (TOP_LEVEL_SECTIONS.includes(section)) map.set(local, section);
      } else {
        const name = p;
        if (TOP_LEVEL_SECTIONS.includes(name)) map.set(name, name);
      }
    });
  }
  return map;
}

function scanFileForUsedKeys(content: string, allKeys: Set<string>): Set<string> {
  const used = new Set<string>();

  // 1) Direct dot access: t.section.key[.something]
  const dotMatches = content.match(/\bt\.(?:[a-zA-Z0-9_]+)(?:\.[a-zA-Z0-9_]+)+/g) || [];
  for (const m of dotMatches) {
    const noT = m.replace(/^t\./, '');
    // Trim trailing segments until a known key is found
    const parts = noT.split('.');
    while (parts.length > 1) { // at least section.key
      const candidate = parts.join('.');
      if (allKeys.has(candidate)) {
        used.add(candidate);
        break;
      }
      parts.pop();
    }
  }

  // 2) Heuristic: section.key without t prefix
  const sectionWord = TOP_LEVEL_SECTIONS.join('|');
  const bareSection = new RegExp(`\\b(?:${sectionWord})\\.(?:[a-zA-Z0-9_]+)(?:\\.[a-zA-Z0-9_]+)*`, 'g');
  for (const m of content.match(bareSection) || []) if (allKeys.has(m)) used.add(m);

  // 3) Bracket notation variants
  let bm: RegExpExecArray | null;
  const br1 = /t\[['"]([a-zA-Z0-9_]+)['"]\]\.((?:[a-zA-Z0-9_]+)(?:\.[a-zA-Z0-9_]+)*)/g;
  while ((bm = br1.exec(content))) {
    const key = `${bm[1]}.${bm[2]}`;
    if (allKeys.has(key)) used.add(key);
  }
  const br2 = /t\.([a-zA-Z0-9_]+)\[['"]([a-zA-Z0-9_]+)['"]\]/g;
  while ((bm = br2.exec(content))) {
    const key = `${bm[1]}.${bm[2]}`;
    if (allKeys.has(key)) used.add(key);
  }
  const br3 = /t\[['"]([a-zA-Z0-9_]+)['"]\]\[['"]([a-zA-Z0-9_]+)['"]\]/g;
  while ((bm = br3.exec(content))) {
    const key = `${bm[1]}.${bm[2]}`;
    if (allKeys.has(key)) used.add(key);
  }

  // 4) Destructured sections
  const destructured = collectDestructuredSections(content);
  for (const [local, section] of destructured.entries()) {
    const rDot = new RegExp(`\\b${local}\\.((?:[a-zA-Z0-9_]+)(?:\\.[a-zA-Z0-9_]+)*)`, 'g');
    let dm: RegExpExecArray | null;
    while ((dm = rDot.exec(content))) {
      // Trim trailing segments after the key path
      const parts = dm[1].split('.');
      while (parts.length > 0) {
        const candidate = `${section}.${parts.join('.')}`;
        if (allKeys.has(candidate)) {
          used.add(candidate);
          break;
        }
        parts.pop();
      }
    }
    const rBr = new RegExp(`${local}\\[['"]([a-zA-Z0-9_]+)['"]\\]`, 'g');
    while ((dm = rBr.exec(content))) {
      const key = `${section}.${dm[1]}`;
      if (allKeys.has(key)) used.add(key);
    }
  }

  return used;
}

function main() {
  const enSource = fs.readFileSync(path.join(SRC, 'locales', 'en.ts'), 'utf8');
  const enUnknown = safeParseLocaleObject(enSource);
  const en = isRecord(enUnknown) ? (enUnknown as Record<string, unknown>) : {};
  const allKeys = new Set(flatten(en));

  const files = walk(SRC);
  const usedGlobal = new Set<string>();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const used = scanFileForUsedKeys(content, allKeys);
    used.forEach(k => usedGlobal.add(k));
  }

  const unused = [...allKeys].filter(k => !usedGlobal.has(k));
  console.log(`Total keys: ${allKeys.size}`);
  console.log(`Used keys:  ${usedGlobal.size}`);
  console.log(`Unused:     ${unused.length}`);
  console.log('\nUnused keys:\n');
  for (const k of unused) console.log(k);
}

main();
