"use client";

import { useEffect, useRef } from "react";
import type { Candle, BollingerInputs, BollingerStyle, BollingerPoint } from "@/lib/types";
import { computeBollingerBands } from "@/lib/indicators/bollinger";
import { init, dispose, Chart, KLineData } from "klinecharts";


type Props = {
  data: Candle[];
  inputs: BollingerInputs;
  style: BollingerStyle;
  hoveringPoint?: BollingerPoint | null;
  onHover?: (p: BollingerPoint | null) => void;
};

// Convert Candle -> KLineData
function toKline(c: Candle): KLineData {
  return {
    timestamp: c.timestamp,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume,
  };
}



export default function ChartView({ data, inputs, style, onHover }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const overlayIdRef = useRef<string | null>(null);
  const fillIdRef = useRef<string | null>(null);

  // ---- Init chart once ----
  useEffect(() => {
    if (!ref.current) return;

    const chart = init(ref.current, {
      styles: {
        candle: { upColor: "#22c55e", downColor: "#ef4444" },
      },
    });

    chartRef.current = chart;
    chart.applyNewData(data.map(toKline));
    chart.setLocale("en-US");
    chart.setTimezone("Asia/Kolkata");

    const onCrosshairChange = (p: any) => {
      if (!onHover) return;
      if (p?.dataIndex == null) {
        onHover(null);
        return;
      }
      const di: number = p.dataIndex;
      const bands = computeBollingerBands(data, inputs);
      const bp = bands[di] ?? null;
      onHover(bp && bp.basis != null ? bp : null);
    };

    chart.subscribeAction("crosshair", onCrosshairChange);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.unsubscribeAction("crosshair", onCrosshairChange);
      dispose(chart);   // ✅ instead of chart.dispose()
    };
  }, []);

  // ---- Update data when candles change ----
  useEffect(() => {
    chartRef.current?.applyNewData(data.map(toKline));
  }, [data]);

  // ---- Draw Bollinger bands ----
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const bands = computeBollingerBands(data, inputs);

    // Prepare overlay points
    const basisPoints = bands.map(b => ({ timestamp: b.time, value: b.basis ?? null }));
    const upperPoints = bands.map(b => ({ timestamp: b.time, value: b.upper ?? null }));
    const lowerPoints = bands.map(b => ({ timestamp: b.time, value: b.lower ?? null }));

    // Remove old overlays
    if (overlayIdRef.current) chart.removeOverlay(overlayIdRef.current);
    if (fillIdRef.current) chart.removeOverlay(fillIdRef.current);

    // ---- Fill area between upper & lower bands ----
    if (style.fillBetween) {
      const fillId = chart.createOverlay({
        name: "polygon",
        lock: true,
        points: [
          ...upperPoints.filter(p => p.value != null),
          ...lowerPoints.filter(p => p.value != null).reverse(),
        ],
        styles: {
          style: "stroke_fill",
          borderColor: "transparent",
          color: `rgba(99, 102, 241, ${Math.min(Math.max(style.fillOpacity, 0), 1)})`,
        },
      });
      fillIdRef.current = fillId;
    }

    // ---- Lines (basis, upper, lower) ----
    let firstLineId: string | null = null;

    if (style.showBasis) {
      const id = chart.createOverlay({
        name: "polyline",
        lock: true,
        points: basisPoints.filter(p => p.value != null),
        styles: {
          color: style.basisColor,
          size: style.basisWidth,
          style: style.basisStyle === "dashed" ? "dashed" : "solid",
        },
      });
      if (!firstLineId) firstLineId = id;
    }

    if (style.showUpper) {
      const id = chart.createOverlay({
        name: "polyline",
        lock: true,
        points: upperPoints.filter(p => p.value != null),
        styles: {
          color: style.upperColor,
          size: style.upperWidth,
          style: style.upperStyle === "dashed" ? "dashed" : "solid",
        },
      });
      if (!firstLineId) firstLineId = id;
    }

    if (style.showLower) {
      const id = chart.createOverlay({
        name: "polyline",
        lock: true,
        points: lowerPoints.filter(p => p.value != null),
        styles: {
          color: style.lowerColor,
          size: style.lowerWidth,
          style: style.lowerStyle === "dashed" ? "dashed" : "solid",
        },
      });
      if (!firstLineId) firstLineId = id;
    }

    overlayIdRef.current = firstLineId;
  }, [data, inputs, style]);

  return <div className="h-[70vh] w-full rounded-2xl overflow-hidden" ref={ref} />;
}
