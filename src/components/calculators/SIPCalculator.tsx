/**
 * SIPCalculator — small React island that drives the SIP future-value formula.
 * Inputs persist to localStorage so a refresh does not lose work. The math
 * lives in lib/finmath.ts so it can be tested without a DOM.
 */
import { useEffect, useMemo, useState } from 'react'
import { calculateSIP, formatINR } from '~/lib/finmath'

const KEY = 'oriz:finance:sip'

interface Saved {
  monthly: number
  rate: number
  years: number
}

const DEFAULTS: Saved = { monthly: 10000, rate: 12, years: 15 }

function loadSaved(): Saved {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Saved>
    return {
      monthly: Number(parsed.monthly) || DEFAULTS.monthly,
      rate: Number(parsed.rate) || DEFAULTS.rate,
      years: Number(parsed.years) || DEFAULTS.years,
    }
  } catch {
    return DEFAULTS
  }
}

export default function SIPCalculator() {
  const [{ monthly, rate, years }, setState] = useState<Saved>(DEFAULTS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadSaved())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ monthly, rate, years }))
    } catch {
      /* storage unavailable — fine */
    }
  }, [hydrated, monthly, rate, years])

  const result = useMemo(() => calculateSIP(monthly, rate, years), [monthly, rate, years])

  return (
    <div className="sipcalc">
      <div className="sipcalc-grid">
        <label className="sipcalc-field">
          <span>Monthly investment</span>
          <input
            type="number"
            min="0"
            step="500"
            value={monthly}
            onChange={(e) => setState((s) => ({ ...s, monthly: Number(e.target.value) || 0 }))}
          />
          <input
            type="range"
            min="500"
            max="200000"
            step="500"
            value={monthly}
            onChange={(e) => setState((s) => ({ ...s, monthly: Number(e.target.value) }))}
            aria-label="Monthly investment slider"
          />
        </label>

        <label className="sipcalc-field">
          <span>Expected annual return (%)</span>
          <input
            type="number"
            min="0"
            max="40"
            step="0.5"
            value={rate}
            onChange={(e) => setState((s) => ({ ...s, rate: Number(e.target.value) || 0 }))}
          />
          <input
            type="range"
            min="1"
            max="30"
            step="0.5"
            value={rate}
            onChange={(e) => setState((s) => ({ ...s, rate: Number(e.target.value) }))}
            aria-label="Return slider"
          />
        </label>

        <label className="sipcalc-field">
          <span>Tenure (years)</span>
          <input
            type="number"
            min="1"
            max="50"
            step="1"
            value={years}
            onChange={(e) => setState((s) => ({ ...s, years: Number(e.target.value) || 1 }))}
          />
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={years}
            onChange={(e) => setState((s) => ({ ...s, years: Number(e.target.value) }))}
            aria-label="Tenure slider"
          />
        </label>
      </div>

      <div className="sipcalc-results">
        <ResultStat label="Invested" value={formatINR(result.investedAmount)} />
        <ResultStat label="Wealth gained" value={formatINR(result.wealthGained)} accent />
        <ResultStat label="Future value" value={formatINR(result.totalValue)} primary />
      </div>

      <details className="sipcalc-formula">
        <summary>Formula &amp; assumptions</summary>
        <p>
          Standard SIP future-value formula, with each instalment paid at the start
          of the month (annuity-due):
        </p>
        <pre>FV = P × ((1 + r)^n - 1) / r × (1 + r)</pre>
        <ul>
          <li>P = monthly investment ({formatINR(monthly)})</li>
          <li>r = monthly rate = annual rate / 12 ({(rate / 12).toFixed(3)}%)</li>
          <li>n = number of instalments = years × 12 ({years * 12} months)</li>
        </ul>
        <p>
          The annual return is treated as constant; in practice equity-fund returns
          vary year-to-year. Returns are nominal (pre-inflation), pre-expense-ratio,
          pre-tax. This is a teaching tool — see the{' '}
          <a href="/legal/disclaimer/">SEBI disclaimer</a>.
        </p>
      </details>

      {result.yearlyBreakdown.length > 0 && (
        <details className="sipcalc-table-wrap">
          <summary>Year-by-year breakdown</summary>
          <div className="sipcalc-table-scroll">
            <table className="sipcalc-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Invested</th>
                  <th>Value</th>
                  <th>Gains</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{formatINR(row.invested)}</td>
                    <td>{formatINR(row.value)}</td>
                    <td>{formatINR(row.gains)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      <style>{`
        .sipcalc { display: flex; flex-direction: column; gap: 1.5rem; }
        .sipcalc-grid {
          display: grid; gap: 1rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 720px) { .sipcalc-grid { grid-template-columns: repeat(3, 1fr); } }
        .sipcalc-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .sipcalc-field span {
          font-size: 0.8125rem;
          color: var(--color-fg-muted);
          font-weight: 500;
        }
        .sipcalc-field input[type="number"] {
          height: 44px;
          padding-inline: 0.875rem;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
          color: var(--color-fg);
          font-family: inherit;
          font-size: 1rem;
        }
        .sipcalc-field input:focus {
          outline: none;
          border-color: color-mix(in oklab, var(--color-accent) 60%, var(--color-border));
        }
        .sipcalc-field input[type="range"] { accent-color: var(--color-accent); }
        .sipcalc-results {
          display: grid; gap: 0.75rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 720px) { .sipcalc-results { grid-template-columns: repeat(3, 1fr); } }
        details { color: var(--color-prose); }
        summary {
          cursor: pointer;
          padding: 0.625rem 0;
          color: var(--color-fg);
          font-weight: 500;
        }
        .sipcalc-formula pre {
          padding: 0.75rem 1rem;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          overflow-x: auto;
        }
        .sipcalc-formula ul { padding-left: 1.25rem; }
        .sipcalc-formula a { color: var(--color-accent); }
        .sipcalc-table-scroll { overflow-x: auto; }
        .sipcalc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .sipcalc-table th, .sipcalc-table td {
          text-align: right;
          padding: 0.5rem 0.875rem;
          border-bottom: 1px solid var(--color-border);
        }
        .sipcalc-table th:first-child, .sipcalc-table td:first-child { text-align: left; }
        .sipcalc-table thead th {
          color: var(--color-fg-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.6875rem;
        }
      `}</style>
    </div>
  )
}

function ResultStat({
  label,
  value,
  primary,
  accent,
}: {
  label: string
  value: string
  primary?: boolean
  accent?: boolean
}) {
  const cls = primary ? 'rs rs-primary' : accent ? 'rs rs-accent' : 'rs'
  return (
    <div className={cls}>
      <span className="rs-label">{label}</span>
      <span className="rs-value">{value}</span>
      <style>{`
        .rs {
          display: flex; flex-direction: column; gap: 0.25rem;
          padding: 1rem 1.125rem;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
        }
        .rs-label { font-size: 0.75rem; color: var(--color-fg-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .rs-value { font-family: var(--font-serif); font-size: 1.375rem; font-weight: 600; color: var(--color-fg); }
        .rs-primary { border-color: color-mix(in oklab, var(--color-accent) 60%, var(--color-border)); }
        .rs-primary .rs-value { color: var(--color-accent); }
        .rs-accent .rs-value { color: var(--color-fg); }
      `}</style>
    </div>
  )
}
