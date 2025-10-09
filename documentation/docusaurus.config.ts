import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Sieć Dostępności Cyfrowej',
    tagline: 'Dostępność to Twoje prawo!',
    favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
    url: 'https://siec-dostepnosci-cyfrowej.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/sdc/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Sieć Dostępności Cyfrowej', // Usually your GitHub org/user name.
  projectName: 'sdc/', // Usually your repo name. ???  tu raczej nazwa repozytorium 

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
      defaultLocale: 'pl',
      locales: ['pl'],
  },

  plugins: [
    ['@grnet/docusaurus-terminology', {
      termsDir: './docs/terms',
      docsDir: './docs/',
      glossaryFilepath: './docs/glossary.md'
    }]
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Siec-Dostepnosci-Cyfrowej/sdc/edit/main/documentation/',

        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Siec-Dostepnosci-Cyfrowej/sdc/edit/main/documentation/blog/', // to trzeba poprawić
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
      navbar: {
          title: 'Sieć Dostępności Cyfrowej',
          logo: {
              alt: 'Logo Sieci',
              src: 'img/logo.svg',
          },
          items: [
              {
                  type: 'doc',
                  docId: 'o-sieci/projekt/o-projekcie-sdc',
                  position: 'right',
                  label: 'O Sieci',
                  className: 'osieci',
              },
              { to: '/wymiary', label: 'Wymiary', position: 'left' },
              {
                  type: 'doc',
                  docId: 'komunikacja/wymiar-komunikacja/o-wymiarze-komunikacja',
                  position: 'right',
                  label: 'Komunikacja',
                  className: 'komunikacja',
                  title: 'Komunikacja',
              },
              {
                  type: 'doc',
                  docId: 'cykltik/wymiar-cykl-zycia-tik/o-wymiarze-cykl-zycia-tik',
                  position: 'right',
                  label: 'Cykl życia TIK',
                  className: 'cykltik',
              },
              {
                  type: 'doc',
                  docId: 'wiedza/wymiar-wiedza-i-umiejetnosci/o-wymiarze-wiedza-i-umiejetnosci',
                  position: 'right',
                  label: 'Wiedza i umiejętności',
                  className: 'wiedza',
              },
              {
                  type: 'doc',
                  docId: 'kultura/wymiar-zarzadzanie-i-kultura/o-wymiarze-zarzadzanie-i-kultura',
                  position: 'right',
                  label: 'Zarządzanie i kultura',
                  className: 'kultura',
              },
              {
                  type: 'doc',
                  docId: 'pracownicy/wymiar-pracownicy/o-wymiarze-pracownicy',
                  position: 'right',
                  label: 'Pracownicy',
                  className: 'pracownicy',
              },
              {
                  type: 'doc',
                  docId: 'zaopatrzenie/wymiar-zaopatrzenie/o-wymiarze-zaopatrzenie',
                  position: 'right',
                  label: 'Zaopatrzenie',
                  className: 'zaopatrzenie',
              },
              {
                  type: 'doc',
                  docId: 'wsparcie/wymiar-wsparcie/o-wymiarze-wsparcie',
                  position: 'right',
                  label: 'Wsparcie',
                  className: 'wsparcie',
              },

              { to: '/blog', label: 'Blog', position: 'right' },
              {
                  href: 'https://github.com/irdpl/sdc',
                  label: 'GitHub',
                  position: 'right',
                  icon: 'github',
              },
          ],
      },
      footer: {
          style: 'dark',
          links: [
              {
                  title: 'Dokumenty',
                  items: [
                      {
                          label: 'Komunikacja',
                          to: '/docs/komunikacja/wymiar-komunikacja/o-wymiarze-komunikacja',
                      },
                      {
                          label: 'Cykl życia TIK',
                          to: '/docs/cykltik/wymiar-cykl-zycia-tik/o-wymiarze-cykl-zycia-tik',
                      },
                      {
                          label: 'Wiedza i umiejętności',
                          to: '/docs/wiedza/wymiar-wiedza-i-umiejetnosci/o-wymiarze-wiedza-i-umiejetnosci',
                      },
                      {
                          label: 'Zarządzanie i kultura',
                          to: '/docs/kultura/wymiar-zarzadzanie-i-kultura/o-wymiarze-zarzadzanie-i-kultura',
                      },
                      {
                          label: 'Pracownicy',
                          to: '/docs/pracownicy/wymiar-pracownicy/o-wymiarze-pracownicy',
                      },
                      {
                          label: 'Zaopatrzenie',
                          to: '/docs/zaopatrzenie/wymiar-zaopatrzenie/o-wymiarze-zaopatrzenie',
                      },
                      {
                          label: 'Wsparcie',
                          to: '/docs/wsparcie/wymiar-wsparcie/o-wymiarze-wsparcie',
                      },
                  ],
              },
              {
                  title: 'Społeczność',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
                href: 'https://github.com/Siec-Dostepnosci-Cyfrowej/sdc',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
