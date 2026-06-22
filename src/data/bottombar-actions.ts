import type { BottomBarAction } from '@chirag127/astro-chrome/BottomBar.astro'

export const bottomBarActions: BottomBarAction[] = [
  { icon: '⌂', label: 'Home', href: '/' },
  { icon: '⚒', label: 'Tools', href: '/calculators/' },
  { icon: '⌗', label: 'News', href: '/news/' },
  { icon: '★', label: 'Saved', href: '/saved/' },
  { icon: '☰', label: 'Menu', href: '#sb-toggle' },
]
