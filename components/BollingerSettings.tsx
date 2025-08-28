
"use client";
import { useState, useEffect } from "react";
import type { BollingerInputs, BollingerStyle, LineStyle } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  inputs: BollingerInputs;
  style: BollingerStyle;
  onChangeInputs: (i: BollingerInputs) => void;
  onChangeStyle: (s: BollingerStyle) => void;
};

const LineStyleSelect = ({ value, onChange }: { value: LineStyle; onChange: (v: LineStyle) => void }) => (
  <select className="select" value={value} onChange={e => onChange(e.target.value as LineStyle)}>
    <option value="solid">Solid</option>
    <option value="dashed">Dashed</option>
  </select>
);

export default function BollingerSettings({ open, onClose, inputs, style, onChangeInputs, onChangeStyle }: Props) {
  const [tab, setTab] = useState<"Inputs" | "Style">("Inputs");
  useEffect(() => {
    if (!open) setTab("Inputs");
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="card w-[680px] max-w-[95vw]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Bollinger Bands — Settings</div>
          <button className="btn-outline" onClick={onClose}>✕</button>
        </div>

        <div className="mb-4 border-b border-white/10 flex gap-2">
          {["Inputs", "Style"].map(t => (
            <button key={t} className={`px-3 py-2 ${tab===t? "border-b-2 border-blue-400": "text-white/60"}`} onClick={() => setTab(t as any)}>{t}</button>
          ))}
        </div>

        {tab === "Inputs" && (
          <div className="grid grid-cols-form gap-3">
            <label className="label">Length</label>
            <input className="input" type="number" min={1} value={inputs.length}
              onChange={e => onChangeInputs({ ...inputs, length: parseInt(e.target.value||"20",10) })}/>

            <label className="label">MA Type</label>
            <select className="select" value={inputs.maType} onChange={e => onChangeInputs({ ...inputs, maType: e.target.value as any })}>
              <option value="SMA">SMA</option>
            </select>

            <label className="label">Source</label>
            <select className="select" value={inputs.source} onChange={e => onChangeInputs({ ...inputs, source: e.target.value as any })}>
              <option value="close">Close</option>
            </select>

            <label className="label">StdDev</label>
            <input className="input" type="number" step="0.1" value={inputs.stdDev}
              onChange={e => onChangeInputs({ ...inputs, stdDev: parseFloat(e.target.value||"2") })}/>

            <label className="label">Offset</label>
            <input className="input" type="number" step="1" value={inputs.offset}
              onChange={e => onChangeInputs({ ...inputs, offset: parseInt(e.target.value||"0",10) })}/>
          </div>
        )}

        {tab === "Style" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 text-sm font-semibold opacity-80">Middle (Basis)</div>
              <label className="flex items-center gap-2"><input type="checkbox" className="checkbox" checked={style.showBasis} onChange={e => onChangeStyle({ ...style, showBasis: e.target.checked })}/> <span className="label">Visible</span></label>
              <input type="color" value={style.basisColor} onChange={e => onChangeStyle({ ...style, basisColor: e.target.value })}/>
              <div className="flex items-center gap-2"><span className="label">Width</span><input type="number" className="input w-20" min={1} max={4} value={style.basisWidth} onChange={e => onChangeStyle({ ...style, basisWidth: parseInt(e.target.value||"1",10) })}/></div>
              <div className="col-span-3"><LineStyleSelect value={style.basisStyle} onChange={v => onChangeStyle({ ...style, basisStyle: v })}/></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 text-sm font-semibold opacity-80">Upper</div>
              <label className="flex items-center gap-2"><input type="checkbox" className="checkbox" checked={style.showUpper} onChange={e => onChangeStyle({ ...style, showUpper: e.target.checked })}/> <span className="label">Visible</span></label>
              <input type="color" value={style.upperColor} onChange={e => onChangeStyle({ ...style, upperColor: e.target.value })}/>
              <div className="flex items-center gap-2"><span className="label">Width</span><input type="number" className="input w-20" min={1} max={4} value={style.upperWidth} onChange={e => onChangeStyle({ ...style, upperWidth: parseInt(e.target.value||"1",10) })}/></div>
              <div className="col-span-3"><LineStyleSelect value={style.upperStyle} onChange={v => onChangeStyle({ ...style, upperStyle: v })}/></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 text-sm font-semibold opacity-80">Lower</div>
              <label className="flex items-center gap-2"><input type="checkbox" className="checkbox" checked={style.showLower} onChange={e => onChangeStyle({ ...style, showLower: e.target.checked })}/> <span className="label">Visible</span></label>
              <input type="color" value={style.lowerColor} onChange={e => onChangeStyle({ ...style, lowerColor: e.target.value })}/>
              <div className="flex items-center gap-2"><span className="label">Width</span><input type="number" className="input w-20" min={1} max={4} value={style.lowerWidth} onChange={e => onChangeStyle({ ...style, lowerWidth: parseInt(e.target.value||"1",10) })}/></div>
              <div className="col-span-3"><LineStyleSelect value={style.lowerStyle} onChange={v => onChangeStyle({ ...style, lowerStyle: v })}/></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 text-sm font-semibold opacity-80">Background Fill</div>
              <label className="flex items-center gap-2"><input type="checkbox" className="checkbox" checked={style.fillBetween} onChange={e => onChangeStyle({ ...style, fillBetween: e.target.checked })}/> <span className="label">Visible</span></label>
              <div className="col-span-2 flex items-center gap-2">
                <span className="label">Opacity</span>
                <input type="range" min={0} max={1} step={0.05} value={style.fillOpacity} onChange={e => onChangeStyle({ ...style, fillOpacity: parseFloat(e.target.value) })}/>
                <span className="text-sm">{Math.round(style.fillOpacity*100)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
