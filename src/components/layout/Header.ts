/**
 * FinSuite OS - Header Component
 * Sticky header with glassmorphism and responsive navigation
 *
 * @description Single Responsibility: Only handles header UI and navigation
 * @follows SOLID principles
 */

export interface HeaderConfig {
  brandTitle?: string;
  brandIcon?: string;
  onMenuToggle?: () => void;
}

const DEFAULT_CONFIG: HeaderConfig = {
  brandTitle: 'FinSuite OS',
  brandIcon: '💎',
};

/**
 * Navigation links for the header
 */
const NAV_LINKS = [
  { path: '/system/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/apps/wealth/sip', label: 'Calculators', icon: '🧮' },
  { path: '/apps/market/crypto', label: 'Markets', icon: '📊' },
  { path: '/apps/news/tech', label: 'News', icon: '📰' },
  { path: '/system/chat', label: 'AI Assistant', icon: '💬' },
];

/**
 * Renders the site header
 * @param config - Optional configuration for customization (Open/Closed principle)
 */
export function renderHeader(config: HeaderConfig = {}): string {
  const { brandTitle, brandIcon } = { ...DEFAULT_CONFIG, ...config };

  return `
    <header class="site-header" id="site-header">
      <div class="header-container">
        <!-- Mobile Menu Button -->
        <button class="header-menu-btn" id="header-menu-toggle" aria-label="Toggle navigation menu">
          <span class="hamburger-icon">☰</span>
        </button>

        <!-- Brand -->
        <a href="/system/dashboard" class="header-brand" onclick="event.preventDefault(); window.router.navigate('/system/dashboard')">
          <span class="header-brand-icon">${brandIcon}</span>
          <span class="header-brand-title">${brandTitle}</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="header-nav" id="header-nav">
          ${NAV_LINKS.map(link => `
            <a href="${link.path}"
               class="header-nav-link"
               data-path="${link.path}"
               onclick="event.preventDefault(); window.router.navigate('${link.path}')">
              <span class="nav-link-icon">${link.icon}</span>
              <span class="nav-link-label">${link.label}</span>
            </a>
          `).join('')}
        </nav>

        <!-- Right Actions -->
        <div class="header-actions">
          <a href="/system/settings"
             class="header-action-btn"
             title="Settings"
             onclick="event.preventDefault(); window.router.navigate('/system/settings')">
            ⚙️
          </a>
          <a href="/system/profile"
             class="header-action-btn"
             title="Profile"
             onclick="event.preventDefault(); window.router.navigate('/system/profile')">
            👤
          </a>
        </div>
      </div>
    </header>
  `;
}

/**
 * Updates active state of navigation links based on current path
 * @param path - Current route path
 */
export function updateHeaderActiveState(path: string): void {
  document.querySelectorAll('.header-nav-link').forEach((link) => {
    const linkPath = link.getAttribute('data-path');
    link.classList.toggle('active', linkPath === path);
  });
}

/**
 * Initializes header event listeners
 * @param onMenuToggle - Callback when hamburger menu is clicked
 */
export function initHeader(onMenuToggle?: () => void): void {
  const menuBtn = document.getElementById('header-menu-toggle');

  if (menuBtn && onMenuToggle) {
    menuBtn.addEventListener('click', onMenuToggle);
  }

  // Add scroll effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const currentScroll = window.scrollY;

    // Add shadow on scroll
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
