
# FindScan – Frontend Intern Assignment: Bollinger Bands (KLineCharts)

Tech stack: **Next.js (App Router) + TypeScript + TailwindCSS + KLineCharts**.

## Quick Start
```bash
npm i
npm run dev
# open http://localhost:3000
```

## What’s included
- `app/page.tsx` – renders candlesticks, settings modal, hover tooltip.
- `components/Chart.tsx` – KLineCharts init, candlestick series, custom overlays for bands + fill.
- `components/BollingerSettings.tsx` – Inputs (Length, MA Type=SMA, Source=close, StdDev, Offset) and Style (visibility, colors, widths, line style, fill opacity).
- `lib/indicators/bollinger.ts` – `computeBollingerBands()` utility.
- `public/data/ohlcv.json` – ~260 demo candles (5m).
- Tailwind, TS, project configs.

## Formulas
- Basis = **SMA(close, length)**
- StdDev = **population** standard deviation of last `length` closes (σ = sqrt(E[x^2] - μ^2)).
- Upper = Basis + (multiplier × StdDev)
- Lower = Basis - (multiplier × StdDev)
- Offset shifts the three series by `offset` bars (positive = forward).

Recomputations happen on every input change; rendering uses KLineCharts overlays (`polyline` + `polygon`).

## KLineCharts
- Version: `9.8.6`
- Docs: https://klinecharts.com/en-US/

## Notes & Trade-offs
- Lines and background fill are implemented via **overlays** (`polyline`, `polygon`) to satisfy the “KLineCharts only” constraint.
- Line styles (solid/dashed), widths, colors, and visibility are fully controllable in the Style tab.
- Tooltip displays Basis/Upper/Lower for the hovered candle using the same compute function to avoid drift.
- For simplicity the **Source** is fixed to `close` and MA type to `SMA` as required, but the UI exposes these fields.

## Screenshots
- See the app running and open the Settings to view Inputs/Style tabs (add your own screenshots/GIF after running locally).

## Deployment
- One-click deploy on Vercel works out of the box.
