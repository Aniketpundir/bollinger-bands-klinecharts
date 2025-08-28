📊 FindScan – Frontend Intern Assignment

Bollinger Bands Indicator using KLineCharts

🚀 Tech Stack

Next.js (App Router)

React + TypeScript

TailwindCSS

KLineCharts (v9.8.6)

🎯 Features Implemented

✔️ Candlestick chart with 200+ OHLCV candles
✔️ Custom Bollinger Bands Indicator (Basis, Upper, Lower)
✔️ Inputs Tab – Length, MA Type (SMA), Source (Close), StdDev multiplier, Offset
✔️ Style Tab – Visibility toggle, color picker, line width, line style (solid/dashed), background fill with opacity
✔️ Tooltip/Crosshair – Displays Basis, Upper, Lower values for hovered candle
✔️ Dark theme UI with clean Tailwind design
✔️ Instant updates on every setting change

🧮 Formulas Used

Basis (Middle Band) = SMA(close, length)

StdDev = population standard deviation of last length closes

Upper Band = Basis + (StdDev × multiplier)

Lower Band = Basis – (StdDev × multiplier)

Offset = shift all bands forward/backward by N candles

(Documented: used population StdDev for consistency)

📂 Project Structure
/app
  /page.tsx                → Main chart + settings modal + tooltip
  /layout.tsx              → Root layout & globals
/components
  Chart.tsx                → KLineCharts init + overlays for Bollinger Bands
  BollingerSettings.tsx    → Inputs + Style settings UI
/lib
  /indicators/bollinger.ts → computeBollingerBands() utility
  /types.ts                → Candle, Indicator, Style types
/public/data/ohlcv.json    → Demo dataset (~260 candles)
/README.md                 → Documentation

🖥️ Quick Start
# install dependencies
npm install

# run locally
npm run dev

# open in browser
http://localhost:3000

📸 Screenshots

(Add your own screenshots here)

Candlestick chart with Bollinger Bands overlay

Settings modal (Inputs + Style tabs)

🌐 Live Demo

👉 Vercel Deployment Link
 (add after deployment)

✅ Acceptance Criteria Coverage

Correctness: ✔️

UI/UX (TradingView-style): ✔️

Performance on 200+ candles: ✔️

Code Quality (modular, typed): ✔️

KLineCharts only: ✔️

👤 Author

Aniket Kumar Pundir
Frontend Intern Candidate – FindScan
