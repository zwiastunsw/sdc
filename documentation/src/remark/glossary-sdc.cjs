'use strict';

/**
 * glossary-sdc.cjs
 *
 * Lokalny remark plugin — rozszerzenie docusaurus-plugin-glossary o funkcje
 * zgłoszone jako issues/PR. W miarę jak autor będzie mergował kolejne funkcje
 * do oficjalnego pluginu, odpowiednie bloki można wyrzucić i wrócić do
 * getRemarkPlugin z paczki.
 *
 * Funkcje ponad oryginał:
 *
 *   [Issue #?]  linkOnlyFirstOccurrence  — linkuj tylko pierwsze wystąpienie
 *   [Issue #164] acronym                 — pole skrótu przy pełnej nazwie jako haśle kanonicznym
 *               expandAcronymsOnFirstUse rozumie "acronym" tak samo jak "abbreviation"
 *               ale w odwrotnym kierunku: "Pełna Nazwa (SKR)" zamiast "SKR (Pełna Nazwa)"
 *   [Issue #?]  shortDefinition          — krótka definicja do dymków (przekazywana do komponentu)
 *   [Issue #?]  definitionType           — typ definicji (przekazywany do komponentu)
 *   [Issue #?]  references               — źródła definicji (przekazywane do komponentu)
 *
 * Umieść jako: src/remark/glossary-sdc.cjs
 *
 * W docusaurus.config.ts:
 *   const _require = createRequire(__filename);
 *   const remarkGlossarySdc = _require('./src/remark/glossary-sdc.cjs');
 *   const glossaryRemarkPlugin = [remarkGlossarySdc, glossaryOptions] as const;
 */

// Własna implementacja visit — eliminuje zależność ESM-only unist-util-visit
function visit(tree, type, visitor) {
  function walk(node, index, parent) {
    if (node.type === type) {
      const result = visitor(node, index, parent);
      if (typeof result === 'number') return result;
    }
    if (Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        const result = walk(node.children[i], i, node);
        if (typeof result === 'number') {
          i = result - 1;
        }
      }
    }
  }
  walk(tree, 0, null);
}

const path = require('path');
const fs = require('fs');

// ─── cache ────────────────────────────────────────────────────────────────────
const glossaryCache = new Map();
const CACHE_TTL = 5000;

function clearGlossaryCache(filePath) {
  if (filePath) glossaryCache.delete(filePath);
  else glossaryCache.clear();
}

// ─── walidacja JSON ───────────────────────────────────────────────────────────
function validateGlossaryTerms(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    errors.push('Glossary data must be an object');
    return { terms: [], errors };
  }
  if (!Array.isArray(data.terms)) {
    errors.push('Field "terms" must be an array');
    return { terms: [], errors };
  }
  const validTerms = data.terms.filter((t, i) => {
    if (!t || typeof t !== 'object')                   { errors.push(`terms[${i}]: not an object`);    return false; }
    if (typeof t.term !== 'string' || !t.term.trim())  { errors.push(`terms[${i}]: missing "term"`);   return false; }
    if (typeof t.definition !== 'string')               { errors.push(`terms[${i}]: missing "definition"`); return false; }
    return true;
  });
  return { terms: validTerms, errors };
}

// ─── główna funkcja ───────────────────────────────────────────────────────────
function remarkGlossarySdc({
  terms = [],
  glossaryPath = null,
  routePath = '/glossary',
  siteDir = null,

  // --- funcje z oficjalnego pluginu ---
  expandAcronymsOnFirstUse = false,  // rozwiń skrót przy pierwszym wystąpieniu
  linkOnlyFirstOccurrence = false,   // [Issue #linkOnly] linkuj tylko pierwsze wystąpienie

  // --- funkcje lokalne SDC (do wyrzucenia gdy wejdą do oficjalnego pluginu) ---
  // [Issue #164] obsługa pola `acronym` — pełna nazwa jako hasło kanoniczne, skrót jako pole
  // [Issue #shortDef] shortDefinition przekazywane do komponentu GlossaryTerm
  // [Issue #refs] definitionType i references przekazywane do komponentu GlossaryTerm
} = {}) {

  // ── wczytaj terminy z JSON (z cache) ──────────────────────────────────────
  let glossaryTerms = terms;
  if (!glossaryTerms.length && glossaryPath && siteDir) {
    try {
      const absPath = path.resolve(siteDir, glossaryPath);
      const now = Date.now();
      const cached = glossaryCache.get(absPath);
      if (cached && now - cached.loadedAt < CACHE_TTL) {
        glossaryTerms = cached.terms;
      } else if (fs.existsSync(absPath)) {
        const raw = fs.readFileSync(absPath, 'utf8');
        let parsed;
        try { parsed = JSON.parse(raw); }
        catch (e) {
          console.error(`[glossary-sdc] JSON parse error in ${glossaryPath}:`, e.message);
          glossaryCache.set(absPath, { terms: [], loadedAt: now });
          return (tree) => tree;
        }
        const { terms: valid, errors } = validateGlossaryTerms(parsed);
        if (errors.length) errors.forEach(e => console.warn(`[glossary-sdc] ${e}`));
        glossaryTerms = valid;
        glossaryCache.set(absPath, { terms: valid, loadedAt: now });
        if (!cached && process.env.NODE_ENV !== 'production')
          console.log(`[glossary-sdc] Loaded ${valid.length} terms from ${glossaryPath}`);
      } else {
        glossaryCache.set(absPath, { terms: [], loadedAt: now });
        console.warn(`[glossary-sdc] File not found: ${glossaryPath}`);
      }
    } catch (e) {
      console.warn(`[glossary-sdc] Failed to load ${glossaryPath}:`, e.message);
    }
  }

  // ── buduj mapę termin → dane ───────────────────────────────────────────────
  // Rejestrujemy zarówno pełną nazwę jak i skrót (z pola acronym) jako frazy do szukania,
  // ale oba wskazują na ten sam termObj (hasło kanoniczne = pełna nazwa).
  const termMap = new Map();
  for (const termObj of glossaryTerms) {
    if (!termObj.term || termObj.autoLink === false) continue;
    const caseSensitive = termObj.caseSensitive === true;

    const register = (phrase) => {
      if (typeof phrase !== 'string' || !phrase.trim()) return;
      const key = phrase.toLowerCase();
      if (!termMap.has(key)) termMap.set(key, { termObj, phrase, caseSensitive });
    };

    register(termObj.term);
    if (Array.isArray(termObj.aliases)) termObj.aliases.forEach(register);

    // [Issue #164] pole acronym: rejestruj skrót jako dodatkową frazę do linkowania
    // ale wskazuje na ten sam termObj (pełna nazwa jako kanoniczne)
    if (typeof termObj.acronym === 'string' && termObj.acronym.trim()) {
      register(termObj.acronym);
    }
  }

  const sortedTerms = Array.from(termMap.entries()).sort((a, b) => b[0].length - a[0].length);
  if (!sortedTerms.length) return (tree) => tree;

  // ── resolveDisplayText ─────────────────────────────────────────────────────
  // Decyduje jaki tekst wyświetlić wewnątrz komponentu GlossaryTerm.
  //
  // Obsługuje dwa modele rozwijania skrótów:
  //
  // Model A (oficjalny plugin): `abbreviation`
  //   term = "PSP", abbreviation = "Payment Service Provider"
  //   → pierwsze wystąpienie "PSP" renderuje jako "Payment Service Provider (PSP)"
  //
  // Model B (SDC, Issue #164): `acronym`
  //   term = "System zapewniania dostępności cyfrowej", acronym = "SZDC"
  //   → pierwsze wystąpienie pełnej nazwy renderuje jako "System zapewniania dostępności cyfrowej (SZDC)"
  //   → pierwsze wystąpienie "SZDC" (aliasu) renderuje jako "SZDC" — skrót stoi samodzielnie, nie rozwijamy
  function resolveDisplayText(match, text, seenTerms) {
    const { termObj } = match;
    if (!expandAcronymsOnFirstUse) return match.originalText;
    if (seenTerms.has(termObj.term)) return match.originalText;

    // Model A: abbreviation (oryginalne zachowanie pluginu)
    if (termObj.abbreviation) {
      const isCanonical =
        match.originalText.toLowerCase() === termObj.term.toLowerCase();
      if (!isCanonical) return match.originalText;
      const lookback = text
        .substring(Math.max(0, match.index - termObj.abbreviation.length - 10), match.index)
        .toLowerCase();
      if (lookback.includes(termObj.abbreviation.toLowerCase())) return match.originalText;
      return `${termObj.abbreviation} (${match.originalText})`;
    }

    // Model B: acronym (Issue #164) — rozwijaj tylko gdy trafiono w pełną nazwę, nie w skrót
    if (termObj.acronym) {
      const hitFullName =
        match.originalText.toLowerCase() === termObj.term.toLowerCase();
      if (!hitFullName) return match.originalText; // trafiono w skrót — nie rozwijaj
      return `${match.originalText} (${termObj.acronym})`;
    }

    return match.originalText;
  }

  // ── replaceTermsInText ─────────────────────────────────────────────────────
  function replaceTermsInText(text, seenTerms) {
    if (!text) return [{ type: 'text', value: text }];

    const matches = [];

    for (const [, { termObj, phrase, caseSensitive }] of sortedTerms) {
      if (linkOnlyFirstOccurrence && seenTerms.has(termObj.term)) continue;

      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags   = caseSensitive ? 'gu' : 'giu';
      const regex   = new RegExp(`(?<!\\p{L}|\\p{N})${escaped}(?!\\p{L}|\\p{N})`, flags);

      let m;
      while ((m = regex.exec(text)) !== null) {
        matches.push({
          index: m.index,
          length: m[0].length,
          termObj,
          originalText: m[0],
        });
        if (linkOnlyFirstOccurrence) break;
      }
    }

    matches.sort((a, b) => a.index - b.index);
    const picked = [];
    let lastEnd = 0;
    for (const m of matches) {
      if (m.index >= lastEnd) { picked.push(m); lastEnd = m.index + m.length; }
    }

    if (!picked.length) return [{ type: 'text', value: text }];

    const result = [];
    let cursor = 0;
    for (const match of picked) {
      if (match.index > cursor)
        result.push({ type: 'text', value: text.substring(cursor, match.index) });

      const displayText = resolveDisplayText(match, text, seenTerms);
      seenTerms.add(match.termObj.term);

      // Buduj atrybuty komponentu GlossaryTerm.
      // Przekazujemy wszystkie pola SDC — komponent (swizzled lub oryginalny)
      // sam decyduje co z nimi zrobi. Pola których oficjalny plugin nie zna
      // są po prostu ignorowane przez oryginalny komponent.
      const attributes = [
        { type: 'mdxJsxAttribute', name: 'term',       value: match.termObj.term },
        { type: 'mdxJsxAttribute', name: 'definition', value: match.termObj.definition || '' },
        { type: 'mdxJsxAttribute', name: 'routePath',  value: routePath },
      ];

      // [Issue #shortDef] shortDefinition — krótka definicja do dymków
      if (typeof match.termObj.shortDefinition === 'string') {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'shortDefinition',
          value: match.termObj.shortDefinition,
        });
      }

      // [Issue #refs] definitionType — typ definicji (legal, normative, sdc, ...)
      if (typeof match.termObj.definitionType === 'string') {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'definitionType',
          value: match.termObj.definitionType,
        });
      }

      // [Issue #refs] references — tablica źródeł [{label, url}] serializowana jako JSON
      if (Array.isArray(match.termObj.references) && match.termObj.references.length) {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'references',
          value: JSON.stringify(match.termObj.references),
        });
      }

      // [Issue #164] acronym — przekazujemy do komponentu (może pokazać w dymku)
      if (typeof match.termObj.acronym === 'string') {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'acronym',
          value: match.termObj.acronym,
        });
      }

      result.push({
        type: 'mdxJsxFlowElement',
        name: 'GlossaryTerm',
        attributes,
        children: [{ type: 'text', value: displayText }],
      });
      cursor = match.index + match.length;
    }
    if (cursor < text.length)
      result.push({ type: 'text', value: text.substring(cursor) });

    return result;
  }

  // ── transformer ───────────────────────────────────────────────────────────
  return function transformer(tree) {
    let usedGlossaryTerm = false;

    const headingTextNodes = new WeakSet();
    visit(tree, 'heading', (h) => {
      visit(h, 'text', (t) => headingTextNodes.add(t));
    });

    const seenTerms = new Set();

    visit(tree, 'text', (node, index, parent) => {
      if (
        parent.type === 'code'              ||
        parent.type === 'inlineCode'        ||
        parent.type === 'link'              ||
        parent.type === 'mdxJsxFlowElement' ||
        parent.type === 'mdxJsxTextElement'
      ) return;
      if (headingTextNodes.has(node)) return;

      const replacements = replaceTermsInText(node.value, seenTerms);
      if (replacements.length === 1 && replacements[0].type === 'text') return;

      const newNodes = replacements.map((r) => {
        if (r.type === 'mdxJsxFlowElement' && parent.type === 'paragraph') {
          usedGlossaryTerm = true;
          return { type: 'mdxJsxTextElement', name: r.name,
                   attributes: r.attributes, children: r.children };
        }
        if (r.type === 'mdxJsxFlowElement') usedGlossaryTerm = true;
        return r;
      });

      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length - 1;
    });

    if (usedGlossaryTerm) {
      const importNode = {
        type: 'mdxjsEsm',
        value: 'import GlossaryTerm from "@theme/GlossaryTerm";',
        data: {
          estree: {
            type: 'Program', sourceType: 'module',
            body: [{
              type: 'ImportDeclaration',
              specifiers: [{ type: 'ImportDefaultSpecifier',
                             local: { type: 'Identifier', name: 'GlossaryTerm' } }],
              source: { type: 'Literal', value: '@theme/GlossaryTerm',
                        raw: '"@theme/GlossaryTerm"' },
            }],
          },
        },
      };
      const hasImport = Array.isArray(tree.children) &&
        tree.children.some(
          (n) => n.type === 'mdxjsEsm' &&
                 (n.value?.includes('@theme/GlossaryTerm') ||
                  n.data?.estree?.body?.some((s) => s.source?.value === '@theme/GlossaryTerm'))
        );
      if (!hasImport) {
        if (!Array.isArray(tree.children)) tree.children = [];
        let insertAt = 0;
        for (let i = 0; i < tree.children.length; i++) {
          if (tree.children[i].type === 'yaml' || tree.children[i].type === 'toml')
            insertAt = i + 1;
          else break;
        }
        tree.children.splice(insertAt, 0, importNode);
      }
    }
  };
}

module.exports = remarkGlossarySdc;
module.exports.clearGlossaryCache = clearGlossaryCache;
