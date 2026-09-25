/**
 * src/theme/GlossaryTerm/index.tsx
 *
 * Lokalny nadpis (swizzle wrap) komponentu GlossaryTerm z docusaurus-plugin-glossary.
 *
 * Rozszerza oryginał o obsługę pól SDC przekazywanych przez glossary-sdc.cjs:
 *
 *   shortDefinition  — krótka definicja wyświetlana w dymku zamiast pełnej
 *   definitionType   — typ definicji (legal, normative, sdc, ...) wyświetlany jako badge
 *   references       — źródła definicji [{label, url}] wyświetlane pod definicją w dymku
 *   acronym          — skrót terminu wyświetlany w dymku obok pełnej nazwy
 *
 * W miarę jak pola będą wchodzić do oficjalnego pluginu — odpowiednie fragmenty
 * można wyrzucić i wrócić do oryginalnego komponentu (usuwając ten plik).
 *
 * Śledzenie co jeszcze lokalnie:
 *   shortDefinition  — Issue mcclowes/docusaurus-plugin-glossary#?
 *   definitionType   — Issue mcclowes/docusaurus-plugin-glossary#?
 *   references       — Issue mcclowes/docusaurus-plugin-glossary#?
 *   acronym          — Issue mcclowes/docusaurus-plugin-glossary#164
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  useMemo,
} from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import styles from '@docusaurus/theme-classic/lib/theme/MDXComponents/styles.module.css';

// ─── typy ────────────────────────────────────────────────────────────────────

interface Reference {
  label: string;
  url?: string;
}

interface GlossaryTermProps {
  term: string;
  definition?: string;
  shortDefinition?: string;    // [Issue #shortDef] krótka definicja do dymku
  definitionType?: string;     // [Issue #refs]     typ definicji
  references?: string;         // [Issue #refs]     JSON: Reference[]
  acronym?: string;            // [Issue #164]      skrót przy pełnej nazwie
  abbreviation?: string;       // oryginalne pole pluginu
  id?: string;
  routePath?: string;
  documentationPath?: string;
  children?: React.ReactNode;
}

// ─── badge dla definitionType ─────────────────────────────────────────────────
// [Issue #refs] — wyrzucić gdy oficjalny plugin obsłuży definitionType

const DEFINITION_TYPE_LABELS: Record<string, string> = {
  legal:      'Prawna',
  normative:  'Normatywna',
  official:   'Oficjalna',
  industry:   'Branżowa',
  sdc:        'SDC',
};

function DefinitionTypeBadge({ type }: { type: string }) {
  const label = DEFINITION_TYPE_LABELS[type] ?? type;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.65em',
        fontWeight: 600,
        lineHeight: 1,
        padding: '2px 6px',
        borderRadius: 3,
        marginLeft: 6,
        verticalAlign: 'middle',
        background: 'var(--ifm-color-primary-lightest, #e8f4fd)',
        color: 'var(--ifm-color-primary-darkest, #1a3a5c)',
        border: '1px solid var(--ifm-color-primary-light, #a8d4f5)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

// ─── główny komponent ─────────────────────────────────────────────────────────

export default function GlossaryTerm({
  term,
  definition,
  shortDefinition,
  definitionType,
  references: referencesJson,
  acronym,
  abbreviation,
  id,
  routePath = '/glossary',
  documentationPath,
  children,
}: GlossaryTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<{ top: number; left: number } | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  // ── pozycjonowanie dymku (identyczne z oryginałem) ────────────────────────
  const updatePosition = useCallback(() => {
    if (!wrapperRef.current || !tooltipRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const preferredGap = 8;
    const stickyHeader = document.querySelector('.navbar');
    const topBoundary = stickyHeader
      ? Math.max(0, stickyHeader.getBoundingClientRect().bottom)
      : 0;
    const hasSpaceAbove = wrapperRect.top - topBoundary >= tooltipRect.height + preferredGap;
    const hasSpaceBelow = viewportHeight - wrapperRect.bottom >= tooltipRect.height + preferredGap;
    const nextPlacement = hasSpaceAbove || !hasSpaceBelow ? 'top' : 'bottom';
    let top =
      nextPlacement === 'top'
        ? wrapperRect.top - tooltipRect.height - preferredGap
        : wrapperRect.bottom + preferredGap;
    const horizontalMargin = 8;
    let left = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2;
    left = Math.max(
      horizontalMargin,
      Math.min(left, viewportWidth - tooltipRect.width - horizontalMargin),
    );
    setPlacement(nextPlacement);
    setTooltipStyle({ top: Math.max(topBoundary + 4, top), left });
  }, []);

  useEffect(() => {
    if (!showTooltip) return;
    let rafId2: number;
    const rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => updatePosition());
    });
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [showTooltip, updatePosition]);

  // ── dane z pluginu (fallback gdy prop nie przekazany) ─────────────────────
  const pluginData = usePluginData('docusaurus-plugin-glossary') as
    | { terms?: Array<Record<string, unknown>>; routePath?: string }
    | undefined;

  const pluginTerm = useMemo(() => {
    const terms = pluginData?.terms ?? [];
    return terms.find(
      (t) =>
        typeof t.term === 'string' &&
        t.term.toLowerCase() === String(term).toLowerCase(),
    );
  }, [pluginData, term]);

  // ── efektywna definicja ───────────────────────────────────────────────────
  // [Issue #shortDef] preferuj shortDefinition w dymku
  const effectiveTooltipDefinition = useMemo(() => {
    if (shortDefinition?.trim()) return shortDefinition.trim();
    if (definition?.trim()) return definition.trim();
    const found = pluginTerm?.definition;
    return typeof found === 'string' ? found : undefined;
  }, [shortDefinition, definition, pluginTerm]);

  // ── efektywna abbreviation (oryginał) ────────────────────────────────────
  const effectiveAbbreviation = useMemo(() => {
    let value = abbreviation ?? (pluginTerm?.abbreviation as string | undefined);
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === String(term).toLowerCase()) return undefined;
    return trimmed;
  }, [abbreviation, pluginTerm, term]);

  // ── routePath i termId ────────────────────────────────────────────────────
  const effectiveRoutePath = useMemo(() => {
    if (routePath?.trim()) return routePath.trim();
    return pluginData?.routePath ?? '/glossary';
  }, [pluginData, routePath]);

  const effectiveTermId = useMemo(() => {
    if (id?.trim()) return id.trim();
    const found = pluginTerm?.id;
    if (typeof found === 'string') return found;
    return term.toLowerCase().replace(/\s+/g, '-');
  }, [id, pluginTerm, term]);

  const effectiveDocumentationPath = useMemo(() => {
    if (documentationPath) return documentationPath;
    const doc = (pluginTerm?.documentation as { path?: string } | undefined);
    return doc?.path;
  }, [documentationPath, pluginTerm]);

  // ── [Issue #refs] referencje ──────────────────────────────────────────────
  const references = useMemo<Reference[]>(() => {
    if (!referencesJson) return [];
    try { return JSON.parse(referencesJson) as Reference[]; }
    catch { return []; }
  }, [referencesJson]);

  // ── render ────────────────────────────────────────────────────────────────
  const displayText = children ?? term;

  return (
    <span
      ref={wrapperRef}
      className={styles.glossaryTermWrapper ?? 'glossaryTermWrapper'}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link
        to={effectiveDocumentationPath ?? `${effectiveRoutePath}#${effectiveTermId}`}
        className={styles.glossaryTerm ?? 'glossaryTerm'}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-describedby={effectiveTooltipDefinition ? tooltipId : undefined}
      >
        {displayText}
      </Link>

      {effectiveTooltipDefinition && (
        <span
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={[
            styles.tooltip,
            showTooltip ? styles.tooltipVisible : '',
            placement === 'top' ? styles.tooltipTop : styles.tooltipBottom,
            styles.tooltipFloating,
          ]
            .filter(Boolean)
            .join(' ')}
          style={
            showTooltip && tooltipStyle
              ? { top: `${tooltipStyle.top}px`, left: `${tooltipStyle.left}px` }
              : undefined
          }
        >
          {/* Nagłówek dymku: term + badge definitionType + skrót */}
          <strong>
            {term}
            {/* [Issue #164] acronym przy pełnej nazwie */}
            {acronym && ` (${acronym})`}
            {/* oryginalne abbreviation (model odwrotny) */}
            {!acronym && effectiveAbbreviation && ` (${effectiveAbbreviation})`}
            {/* [Issue #refs] badge typu definicji */}
            {definitionType && <DefinitionTypeBadge type={definitionType} />}
          </strong>

          {/* Definicja (krótka jeśli jest, pełna w pozostałych przypadkach) */}
          {' '}
          {effectiveTooltipDefinition}

          {/* [Issue #refs] źródła definicji */}
          {references.length > 0 && (
            <span
              style={{
                display: 'block',
                marginTop: 6,
                fontSize: '0.8em',
                opacity: 0.8,
              }}
            >
              {references.map((ref, i) =>
                ref.url ? (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', color: 'inherit' }}
                  >
                    ↗ {ref.label}
                  </a>
                ) : (
                  <span key={i} style={{ display: 'block' }}>
                    {ref.label}
                  </span>
                ),
              )}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
