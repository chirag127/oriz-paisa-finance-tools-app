/**
 * Per-site config for oriz-finance. The OrizSiteConfig type is owned by
 * @chirag127/oriz-ui so every site uses the same shape.
 */
import type { OrizSiteConfig } from '@chirag127/oriz-ui'

export const SITE_CONFIG: OrizSiteConfig = {
  slug: 'finance',
  name: 'Finance',
  origin: 'https://finance.oriz.in',
  tagline: 'SIP, EMI, FIRE, tax — calculators that show the math',
  description:
    'Free, browser-only personal-finance calculators for India: SIP, lumpsum, step-up SIP, SWP, FIRE, EMI, FD, RD, PPF, NPS, take-home pay, HRA, GST. No sign-up. No data leaves your device.',
}

/** Site-specific niceties. */
export const SITE_EMOJI = '📊'
