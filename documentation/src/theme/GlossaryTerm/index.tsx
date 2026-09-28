import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  useMemo,
} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// ─── typy ─────────────────────────────────────────────────────────────────────

interface GlossaryTermProps {
  term: string;
  definition?: string;
  shortDefinition?: string;
  references?: string; // JSON: Reference[] — przekazywane przez remark, niewyświetlane w dymku (WCAG: tooltip pasywny)
  acronym?: string;    // przekazywane przez remark, niewyświetlane w dymku
  definitionType?: string; // przekazywane przez remark, niewyświetlane w dymku
  id?: string;
  routePath?: string;
  documentationPath?: string;
  children?: React.ReactNode;
}

// ─── główny komponent ──────────────────────────────────────────────────────────
// Wzorzec „tooltip-popover": definicja pokazywana TYLKO po
// jawnym kliknięciu przycisku, nie na hover/focus. Dzięki temu:
//  - WCAG 1.4.13 (Content on Hover or Focus) nie ma zastosowania — brak treści
//    wywoływanej hoverem/focusem,
//  - tap na link jest przewidywalny (nawigacja do hasła w słowniku), a dymek ma
//    własny, czytelnie opisany przycisk (WCAG 2.5.3 Label in Name, 3.2.1 On Focus).

export default function GlossaryTerm({
  term,
  definition,
  shortDefinition,
  references: _references,   // przekazywane przez remark, nieużywane w dymku
  acronym: _acronym,         // przekazywane przez remark, nieużywane w dymku
  definitionType: _definitionType, // przekazywane przez remark, nieużywane w dymku
  id,
  routePath = '/slownik',
  documentationPath,
  children,
}: GlossaryTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<{ top: number; left: number } | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  // ── pozycjonowanie dymku ───────────────────────────────────────────────────
  const updatePosition = useCallback(() => {
    if (!anchorRef.current || !tooltipRef.current) return;
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const preferredGap = 8;
    const stickyHeader = document.querySelector('.navbar');
    const topBoundary = stickyHeader
      ? Math.max(0, stickyHeader.getBoundingClientRect().bottom)
      : 0;
    const hasSpaceAbove = anchorRect.top - topBoundary >= tooltipRect.height + preferredGap;
    const hasSpaceBelow = viewportHeight - anchorRect.bottom >= tooltipRect.height + preferredGap;
    const nextPlacement = hasSpaceAbove || !hasSpaceBelow ? 'top' : 'bottom';
    let top =
      nextPlacement === 'top'
        ? anchorRect.top - tooltipRect.height - preferredGap
        : anchorRect.bottom + preferredGap;
    const horizontalMargin = 8;
    let left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
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

  // ── dismiss: Escape, kliknięcie/tap poza wrapperem, zejście focusem ───────
  useEffect(() => {
    if (!showTooltip) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTooltip(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setShowTooltip(false);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    wrapperRef.current?.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      wrapperRef.current?.removeEventListener('focusout', onFocusOut);
    };
  }, [showTooltip]);

  // ── definicja do dymku (shortDefinition priorytetowo) ─────────────────────
  const tooltipDefinition = useMemo(() => {
    if (shortDefinition?.trim()) return shortDefinition.trim();
    if (definition?.trim()) return definition.trim();
    return undefined;
  }, [shortDefinition, definition]);

  // ── id hasła do anchor linka ───────────────────────────────────────────────
  const termId = useMemo(
    () => id?.trim() || term.toLowerCase().replace(/\s+/g, '-'),
    [id, term],
  );

  // ── render ─────────────────────────────────────────────────────────────────
  const displayText = children ?? term;
  const labelText = typeof displayText === 'string' ? displayText : term;

  return (
    <span ref={wrapperRef} className={styles.glossaryTermWrapper}>
      <Link
        to={documentationPath ?? `${routePath}#${termId}`}
        className={styles.glossaryTerm}
      >
        {displayText}
      </Link>

      {tooltipDefinition && (
        <>
          <button
            type="button"
            ref={anchorRef as React.RefObject<HTMLButtonElement>}
            className={styles.infoButton}
            aria-expanded={showTooltip}
            aria-controls={tooltipId}
            aria-describedby={showTooltip ? tooltipId : undefined}
            aria-label={`Pokaż definicję: ${labelText}`}
            onClick={() => setShowTooltip((v) => !v)}
          >
            <span aria-hidden="true" className={styles.infoIcon}>ⓘ</span>
          </button>

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
            {tooltipDefinition}
          </span>
        </>
      )}
    </span>
  );
}
