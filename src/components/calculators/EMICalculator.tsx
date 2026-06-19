/**
 * EMICalculator — amortizing-loan EMI island. Same shape as SIPCalculator:
 * pure math in lib/finmath.ts, inputs persisted to localStorage, results +
 * formula visible.
 */
import { useEffect, useMemo, useState } from 'react'
import { calculateEMI, formatINR } from '~/lib/finmath'

const KEY = 'oriz:finance:emi'

interface Saved {
  principal: number
  rate: number
  years: number
}

const DEFAULTS: Saved = { principal: 5000000, rate: 8.5, years: 20 }

function loadSaved(): Saved {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Saved>
    return {
      principal: Number(parsed.principal) || DEFAULTS.principal,
      rate: Number(parsed.rate) || DEFAULTS.rate,
      years: Number(parsed.years) || DEFAULTS.years,
    }
  } catch {
    return DEFAULTS
  }
}

export default function EMICalculator() {
  const [{ principal, rate, years }, setState] = useState<Saved>(DEFAULTS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadSaved())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ principal, rate, years }))
    } catch {
      /* storage unavailable — fine */
    }
  }, [hydrated, principal, rate, years])

  const result = useMemo(() => calculateEMI(principal, rate, years), [principal, rate, years])

  return (
    <div className="emicalc">
      <div className="emicalc-grid">
        <label className="emicalc-field">
          <span>Loan amount</span>
          <input
            type="number"
            min="0"
            step="50000"
            value={principal}
            onChange={(e) => setState((s) => ({ ...s, principal: Number(e.target.value) || 0 }))}
          />
        </label>

        <label className="emicalc-field">
          <span>Interest rate (% per year)</span>
          <input
            type="number"
            min="0"
            max="30"
            step="0.05"
            value={rate}
            onChange={(e) => setState((s) => ({ ...s, rate: Number(e.target.value) || 0 }))}
          />
        </label>

        <label className="emicalc-field">
          <span>Tenure (years)</span>
          <input
            type="number"
            min="1"
            max="40"
            step="1"
            value={years}
            onChange={(e) => setState((s) => ({ ...s, years: Number(e.target.value) || 1 }))}
          />
        </label>
      </div>

      <div className="emicalc-results">
        <Stat label="Monthly EMI" value={formatINR(result.emi)} primary />
        <Stat label="Total interest" value={formatINR(result.totalInterest)} />
        <Stat label="Total payment" value={formatINR(result.totalPayment)} />
      </div>

      <details className="emicalc-formula">
        <summary>Formula &amp; assumptions</summary>
        <p>Standard amortising EMI:</p>
        <pre>EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</pre>
        <ul>
          <li>P = principal ({formatINR(principal)})</li>
          <li>r = monthly rate = annual rate / 12 ({(rate / 12).toFixed(3)}%)</li>
          <li>n = months = years × 12 ({years * 12})</li>
        </ul>
        <p>
          Floating-rate loans reset r when the bank revises its repo-linked rate;
          this calculator assumes a fixed r over the full tenure. Processing fees,
          GST, and insurance are not included. See the{' '}
          <a href="/legal/disclaimer/">disclaimer</a>.
        </p>
      </details>

      <style>{`
        .emicalc { display: flex; flex-direction: column; gap: 1.5rem; }
        .emicalc-grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
        @media (min-width: 720px) { .emicalc-grid { grid-template-columns: repeat(3, 1fr); } }
        .emicalc-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .emicalc-field span { font-size: 0.8125rem; color: var(--color-fg-muted); font-weight: 500; }
        .emicalc-field input {
          height: 44px;
          padding-inline: 0.875rem;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
          color: var(--color-fg);
          font-family: inherit;
          font-size: 1rem;
        }
        .emicalc-field input:focus {
          outline: none;
          border-color: color-mix(in oklab, var(--color-accent) 60%, var(--color-border));
        }
        .emicalc-results { display: grid; gap: 0.75rem; grid-template-columns: 1fr; }
        @media (min-width: 720px) { .emicalc-results { grid-template-columns: repeat(3, 1fr); } }
        details { color: var(--color-prose); }
        summary { cursor: pointer; padding: 0.625rem 0; color: var(--color-fg); font-weight: 500; }
        .emicalc-formula pre {
          padding: 0.75rem 1rem;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          overflow-x: auto;
        }
        .emicalc-formula ul { padding-left: 1.25rem; }
        .emicalc-formula a { color: var(--color-accent); }
      `}</style>
    </div>
  )
}

function Stat({
  label,
  value,
  primary,
}: {
  label: string
  value: string
  primary?: boolean
}) {
  return (
    <div className={primary ? 's s-primary' : 's'}>
      <span className="s-label">{label}</span>
      <span className="s-value">{value}</span>
      <style>{`
        .s {
          display: flex; flex-direction: column; gap: 0.25rem;
          padding: 1rem 1.125rem;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
        }
        .s-label { font-size: 0.75rem; color: var(--color-fg-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .s-value { font-family: var(--font-serif); font-size: 1.375rem; font-weight: 600; color: var(--color-fg); }
        .s-primary { border-color: color-mix(in oklab, var(--color-accent) 60%, var(--color-border)); }
        .s-primary .s-value { color: var(--color-accent); }
      `}</style>
    </div>
  )
}
