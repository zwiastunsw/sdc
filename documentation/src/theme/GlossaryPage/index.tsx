import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
// ─── typy (lokalne, żeby nie zależeć od haszowanych nazw paczki) ──────────────

interface GlossaryReference {
  label: string;
  url: string;
}

interface GlossaryDocumentation {
  path: string;
  label?: string;
}

interface GlossaryTerm {
  term: string;
  definition: string;
  abbreviation?: string;
  definitionType?: string;
  relatedTerms?: string[];
  id?: string;
  autoLink?: boolean;
  aliases?: string[];
  references?: GlossaryReference[];
  documentation?: GlossaryDocumentation;
}

// ─── badge dla definitionType ──────────────────────────────────────────────────

const DEFINITION_TYPE_LABELS: Record<string, string> = {
  legal:     'Prawna',
  normative: 'Normatywna',
  official:  'Oficjalna',
  industry:  'Branżowa',
  sdc:       'SDC',
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

interface GlossaryData {
  terms: GlossaryTerm[];
  title?: string;
  description?: string;
}

/**
 * Groups glossary terms by their first letter
 */
function groupTermsByLetter(terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const grouped: Record<string, GlossaryTerm[]> = {};

  terms.forEach(term => {
    const firstLetter = term.term.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(term);
  });

  Object.keys(grouped).forEach(letter => {
    grouped[letter].sort((a, b) => a.term.localeCompare(b.term, 'pl'));
  });

  return grouped;
}

/**
 * GlossaryPage – swizzlowany komponent ze spolszczonymi tekstami UI
 */
export default function GlossaryPage({ glossaryData }: { glossaryData?: GlossaryData | null }) {
  const [searchTerm, setSearchTerm] = useState('');

  const terms = useMemo(() => glossaryData?.terms || [], [glossaryData?.terms]);
  const termIds = useMemo(
    () =>
      new Map(
        terms.map(term => [
          term.term.toLowerCase(),
          term.id || term.term.toLowerCase().replace(/\s+/g, '-'),
        ])
      ),
    [terms]
  );

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return terms;

    const lowerSearch = searchTerm.toLowerCase();
    return terms.filter(term => {
      const haystack = [
        term.term,
        term.definition,
        term.abbreviation,
        term.documentation?.label,
        ...(term.aliases || []),
        ...(term.references || []).map(reference => reference.label),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(lowerSearch);
    });
  }, [terms, searchTerm]);

  const groupedTerms = useMemo(() => groupTermsByLetter(filteredTerms), [filteredTerms]);
  const letters = Object.keys(groupedTerms).sort();

  const glossaryTitle = glossaryData?.title || 'Słownik';

  return (
    <Layout title={glossaryTitle} description="Słownik pojęć i definicji">
      <div className={styles.glossaryContainer}>
        <header className={styles.glossaryHeader}>
          <h1>{glossaryTitle}</h1>
          <p className={styles.glossaryDescription}>
            {glossaryData?.description || 'Zbiór pojęć i ich definicji'}
          </p>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Szukaj pojęć..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {filteredTerms.length === 0 ? (
          <div className={styles.noResults}>
            <p>Nie znaleziono pojęć pasujących do „{searchTerm}"</p>
          </div>
        ) : (
          <div className={styles.glossaryContent}>
            <nav className={styles.letterNav}>
              {letters.map(letter => (
                <a key={letter} href={`#letter-${letter}`} className={styles.letterLink}>
                  {letter}
                </a>
              ))}
            </nav>

            {letters.map(letter => (
              <section key={letter} id={`letter-${letter}`} className={styles.letterSection}>
                <h2 className={styles.letterHeading}>{letter}</h2>
                <dl className={styles.termList}>
                  {groupedTerms[letter].map((term, index) => (
                    <div
                      key={`${letter}-${index}`}
                      className={styles.termItem}
                      id={term.id || term.term.toLowerCase().replace(/\s+/g, '-')}
                    >
                      <dt className={styles.termName}>
                        {term.term}
                        {term.abbreviation && (
                          <span className={styles.abbreviation}> ({term.abbreviation})</span>
                        )}
                        {term.definitionType && (
                          <DefinitionTypeBadge type={term.definitionType} />
                        )}
                      </dt>
                      <dd className={styles.termDefinition}>
                        {term.definition}
                        {term.documentation && (
                          <div className={styles.documentation}>
                            <Link to={term.documentation.path}>
                              {term.documentation.label || 'Czytaj więcej'}
                            </Link>
                          </div>
                        )}
                        {term.references && term.references.length > 0 && (
                          <div className={styles.references}>
                            <strong>Źródła:</strong>{' '}
                            {term.references.map((reference, idx) => (
                              <React.Fragment key={`${reference.url}-${idx}`}>
                                {idx > 0 && ', '}
                                <a href={reference.url}>{reference.label}</a>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                        {term.relatedTerms && term.relatedTerms.length > 0 && (
                          <div className={styles.relatedTerms}>
                            <strong>Powiązane pojęcia:</strong>{' '}
                            {term.relatedTerms.map((related, idx) => (
                              <React.Fragment key={idx}>
                                {idx > 0 && ', '}
                                <a
                                  href={`#${termIds.get(related.toLowerCase()) || related.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  {related}
                                </a>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}

        <footer className={styles.glossaryFooter}>
          <p>Liczba pojęć: {terms.length}</p>
        </footer>
      </div>
    </Layout>
  );
}
