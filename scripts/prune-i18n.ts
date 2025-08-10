import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = path.resolve(ROOT, 'src');
const EN_FILE = path.join(SRC, 'locales', 'en.ts');
const ES_FILE = path.join(SRC, 'locales', 'es.ts');
const TYPES_FILE = path.join(SRC, 'types', 'i18n.ts');

const TOP_LEVEL_SECTIONS = [
  'common','nav','auth','wedding','guests','rsvp','weddingParty','invitation','customization','date','validation','errors','success','language'
];

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

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

function safeParseLocaleObject(source: string): Record<string, Json> {
  const match = source.match(/export const\s+\w+\s*(?::\s*[^=]+)?=\s*(\{[\s\S]*\});?/);
  if (!match) throw new Error('Could not find exported object in locale file');
  return new Function(`return (${match[1]})`)() as Record<string, Json>;
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function flatten(obj: Record<string, Json>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const next = prefix ? `${prefix}.${k}` : k;
    if (isRecord(val)) {
      keys = keys.concat(flatten(val as Record<string, Json>, next));
    } else {
      keys.push(next);
    }
  }
  return keys;
}

function collectDestructuredSections(content: string) {
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
  const dot = /\bt\.(?:[a-zA-Z0-9_]+)(?:\.[a-zA-Z0-9_]+)+/g;
  for (const m of content.match(dot) || []) {
    const key = m.replace(/^t\./, '');
    if (allKeys.has(key)) used.add(key);
  }
  const sectionWord = TOP_LEVEL_SECTIONS.join('|');
  const bare = new RegExp(`\\b(?:${sectionWord})\\.(?:[a-zA-Z0-9_]+)(?:\\.[a-zA-Z0-9_]+)*`, 'g');
  for (const m of content.match(bare) || []) if (allKeys.has(m)) used.add(m);
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
  const destructured = collectDestructuredSections(content);
  for (const [local, section] of destructured.entries()) {
    const rDot = new RegExp(`\\b${local}\\.((?:[a-zA-Z0-9_]+)(?:\\.[a-zA-Z0-9_]+)*)`, 'g');
    let dm: RegExpExecArray | null;
    while ((dm = rDot.exec(content))) {
      const key = `${section}.${dm[1]}`;
      if (allKeys.has(key)) used.add(key);
    }
    const rBr = new RegExp(`${local}\\[['"]([a-zA-Z0-9_]+)['"]\\]`, 'g');
    while ((dm = rBr.exec(content))) {
      const key = `${section}.${dm[1]}`;
      if (allKeys.has(key)) used.add(key);
    }
  }
  return used;
}

function computeUnusedKeys(): { all: string[]; used: string[]; unused: string[] } {
  const enSource = fs.readFileSync(EN_FILE, 'utf8');
  const en = safeParseLocaleObject(enSource);
  const allKeys = Array.from(new Set(flatten(en)));

  const files = walk(SRC);
  const usedGlobal = new Set<string>();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const used = scanFileForUsedKeys(content, new Set(allKeys));
    used.forEach(k => usedGlobal.add(k));
  }

  const used = Array.from(usedGlobal);
  const unused = allKeys.filter(k => !usedGlobal.has(k));
  return { all: allKeys, used, unused };
}

function deletePath(obj: Record<string, Json>, pathStr: string) {
  const parts = pathStr.split('.');
  const last = parts.pop() as string;
  let curr: Record<string, Json> | undefined = obj;
  for (const p of parts) {
    if (!isRecord(curr)) return;
    curr = (curr as Record<string, Json>)[p] as Record<string, Json>;
    if (!isRecord(curr)) return;
  }
  if (isRecord(curr) && Object.prototype.hasOwnProperty.call(curr, last)) {
    delete (curr as Record<string, Json>)[last];
  }
}

function pruneObject(obj: Record<string, Json>, unused: string[]) {
  for (const key of unused) deletePath(obj, key);
}

function toTsLiteral(value: Json, indent = 0): string {
  const sp = (n: number) => '  '.repeat(n);
  if (Array.isArray(value)) {
    const items = value.map(v => toTsLiteral(v as Json, indent + 1)).join(', ');
    return `[${items}]`;
  }
  if (isRecord(value)) {
    const entries = Object.entries(value as Record<string, Json>);
    const inner = entries
      .map(([k, v]) => `${sp(indent + 1)}${k}: ${toTsLiteral(v as Json, indent + 1)}`)
      .join(',\n');
    return `{
${inner}
${sp(indent)}}`;
  }
  if (typeof value === 'string') {
    const s = value.replace(/'/g, "\\'");
    return `'${s}'`;
  }
  return JSON.stringify(value);
}

function writeLocale(file: string, varName: string, obj: Record<string, Json>) {
  const header = "import type { TranslationKeys } from '../types/i18n';\n\n";
  const body = `export const ${varName}: TranslationKeys = ${toTsLiteral(obj)};\n`;
  fs.writeFileSync(file, header + body, 'utf8');
}

function generateInterface(name: string, value: Json, indent = 0): string {
  const sp = (n: number) => '  '.repeat(n);
  if (Array.isArray(value)) {
    return 'string[]';
  }
  if (isRecord(value)) {
    const entries = Object.entries(value as Record<string, Json>);
    const inner = entries
      .map(([k, v]) => `${sp(indent + 1)}${k}: ${generateInterface(k, v as Json, indent + 1)};`)
      .join('\n');
    return `{
${inner}
${sp(indent)}}`;
  }
  return 'string';
}

function updateTypesFromObject(obj: Record<string, Json>) {
  const typesSrc = fs.readFileSync(TYPES_FILE, 'utf8');
  const langMatch = typesSrc.match(/export type Language[\s\S]*?;\n\n/);
  const langBlock = langMatch ? langMatch[0] : "export type Language = 'en' | 'es';\n\n";
  const iface = `export interface TranslationKeys ${generateInterface('TranslationKeys', obj, 0)}\n`;
  fs.writeFileSync(TYPES_FILE, langBlock + iface, 'utf8');
}

function deepPick(target: Record<string, Json>, template: Record<string, Json>): Record<string, Json> {
  const out: Record<string, Json> = {};
  for (const key of Object.keys(template)) {
    const tmplVal = template[key];
    const tgtVal = (target as Record<string, Json>)[key];
    if (Array.isArray(tmplVal)) {
      out[key] = Array.isArray(tgtVal) ? tgtVal : tmplVal;
    } else if (isRecord(tmplVal)) {
      const child = deepPick(isRecord(tgtVal) ? (tgtVal as Record<string, Json>) : {}, tmplVal as Record<string, Json>);
      out[key] = child;
    } else {
      out[key] = typeof tgtVal === 'string' ? (tgtVal as string) : tmplVal;
    }
  }
  return out;
}

function main() {
  const { all, used, unused } = computeUnusedKeys();
  console.log(`Total keys: ${all.length}`);
  console.log(`Used keys:  ${used.length}`);
  console.log(`Unused:     ${unused.length}`);

  const enObj = safeParseLocaleObject(fs.readFileSync(EN_FILE, 'utf8'));
  const esObj = safeParseLocaleObject(fs.readFileSync(ES_FILE, 'utf8'));

  pruneObject(enObj, unused);

  const esAligned = deepPick(esObj, enObj);

  writeLocale(EN_FILE, 'englishTranslations', enObj);
  writeLocale(ES_FILE, 'spanishTranslations', esAligned);
  updateTypesFromObject(enObj);

  console.log('Pruned locales, aligned Spanish to English shape, and updated types.');
}

main();
