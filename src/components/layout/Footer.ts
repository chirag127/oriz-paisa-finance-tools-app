/**
 * FinSuite OS - Footer Component
 * Multi-column responsive footer with navigation links
 *
 * @description Single Responsibility: Only handles footer UI
 * @follows SOLID principles
 */

export interface FooterConfig {
  brandName?: string;
  copyrightYear?: number;
  showSocialLinks?: boolean;
}

const DEFAULT_CONFIG: FooterConfig = {
  brandName: 'FinSuite OS',
  copyrightYear: new Date().getFullYear(),
  showSocialLinks: true,
};

/**
 * Footer link sections
 */
const FOOTER_SECTIONS = [
  {
    title: 'Calculators',
    icon: '🧮',
    links: [
      { path: '/apps/wealth/sip', label: 'SIP Calculator' },
      { path: '/apps/banking/emi-home', label: 'EMI Calculator' },
      { path: '/apps/wealth/tax', label: 'Tax Calculator' },
      { path: '/apps/wealth/fire', label: 'FIRE Calculator' },
      { path: '/apps/loans/compare', label: 'Loan Compare' },
      { path: '/apps/gen/compound-interest', label: 'Compound Interest' },
    ],
  },
  {
    title: 'Markets',
    icon: '📊',
    links: [
      { path: '/apps/market/crypto', label: 'Crypto Dashboard' },
      { path: '/apps/market/gold', label: 'Gold Tracker' },
      { path: '/apps/market/converter', label: 'Currency Converter' },
      { path: '/apps/market/sentiment', label: 'Market Sentiment' },
      { path: '/apps/market/watchlist', label: 'Watchlist' },
    ],
  },
  {
    title: 'Resources',
    icon: '📚',
    links: [
      { path: '/apps/news/tech', label: 'Tech News' },
      { path: '/apps/news/crypto', label: 'Crypto News' },
      { path: '/apps/news/ai', label: 'AI News' },
      { path: '/system/chat', label: 'AI Assistant' },
      { path: '/system/files', label: 'Saved Files' },
    ],
  },
  {
    title: 'Company',
    icon: '🏢',
    links: [
      { path: '/about', label: 'About Us' },
      { path: '/privacy-policy', label: 'Privacy Policy' },
      { path: '/terms', label: 'Terms of Service' },
      { path: '/system/settings', label: 'Settings' },
    ],
  },
];

/**
 * Renders the site footer
 * @param config - Optional configuration for customization (Open/Closed principle)
 */
export function renderFooter(config: FooterConfig = {}): string {
  const { brandName, copyrightYear, showSocialLinks } = { ...DEFAULT_CONFIG, ...config };

  return `
    <footer class="site-footer" id="site-footer">
      <div class="footer-container">
        <!-- Footer Columns -->
        <div class="footer-columns">
          ${FOOTER_SECTIONS.map(section => `
            <div class="footer-column">
              <h3 class="footer-column-title">
                <span class="footer-column-icon">${section.icon}</span>
                ${section.title}
              </h3>
              <ul class="footer-links">
                ${section.links.map(link => `
                  <li>
                    <a href="${link.path}"
                       class="footer-link"
                       onclick="event.preventDefault(); window.router.navigate('${link.path}')">
                      ${link.label}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-copyright">
            <span class="footer-brand-icon">💎</span>
            <span>&copy; ${copyrightYear} ${brandName}. All rights reserved.</span>
          </div>

          ${showSocialLinks ? `
            <div class="footer-social">
              <a href="https://github.com/chirag127"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="footer-social-link"
                 title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://twitter.com/chirag127"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="footer-social-link"
                 title="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          ` : ''}

          <div class="footer-made-with">
            <span>Made with</span>
            <span class="heart">❤️</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
