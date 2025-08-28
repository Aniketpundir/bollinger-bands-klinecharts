
'use client';
import { useEffect, useState } from 'react';
import ChartView from '@/components/Chart';
import BollingerSettings from '@/components/BollingerSettings';
import type { Candle, BollingerInputs, BollingerStyle, BollingerPoint } from '@/lib/types';

const defaultInputs: BollingerInputs = { length: 20, source: 'close', maType: 'SMA', stdDev: 2, offset: 0 };
const defaultStyle: BollingerStyle = {
  showBasis: true, basisColor: '#60a5fa', basisWidth: 1, basisStyle: 'solid',
  showUpper: true, upperColor: '#a78bfa', upperWidth: 1, upperStyle: 'solid',
  showLower: true, lowerColor: '#34d399', lowerWidth: 1, lowerStyle: 'solid',
  fillBetween: true, fillOpacity: 0.12,
};

export default function Page() {
  const [data, setData] = useState<Candle[]>([]);
  const [inputs, setInputs] = useState<BollingerInputs>(defaultInputs);
  const [style, setStyle] = useState<BollingerStyle>(defaultStyle);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<BollingerPoint | null>(null);

  useEffect(() => {
    fetch('/data/ohlcv.json').then(r => r.json()).then(setData);
  }, []);

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">FindScan — Bollinger Bands (KLineCharts)</h1>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => setOpen(true)}>⚙️ Settings</button>
          <a href="https://klinecharts.com/en-US/" target="_blank" className="btn-outline">KLineCharts Docs ↗</a>
        </div>
      </div>

      <div className="card">
        <ChartView data={data} inputs={inputs} style={style} onHover={setHover} />
      </div>

      <div className="card">
        <div className="text-sm opacity-80">Tooltip (hover candle)</div>
        {hover ? (
          <div className="text-sm mt-1">
            <span className="mr-4">Basis: <b>{hover.basis?.toFixed(2)}</b></span>
            <span className="mr-4">Upper: <b>{hover.upper?.toFixed(2)}</b></span>
            <span>Lower: <b>{hover.lower?.toFixed(2)}</b></span>
          </div>
        ) : <div className="text-sm mt-1 opacity-60">Move crosshair over a candle to see values…</div>}
      </div>

      <BollingerSettings
        open={open}
        onClose={() => setOpen(false)}
        inputs={inputs}
        style={style}
        onChangeInputs={setInputs}
        onChangeStyle={setStyle}
      />
    </main>
  );
}
