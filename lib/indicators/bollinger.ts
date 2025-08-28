
import { Candle, BollingerInputs, BollingerPoint } from "@/lib/types";

// Simple moving average
function sma(values: number[], length: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (length <= 0) return out;
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= length) {
      sum -= values[i - length];
    }
    if (i >= length - 1) {
      out[i] = sum / length;
    }
  }
  return out;
}

// Population standard deviation over a rolling window (documented in README)
function rollingStdDev(values: number[], length: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (length <= 0) return out;
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    sum += v;
    sumSq += v * v;
    if (i >= length) {
      const old = values[i - length];
      sum -= old;
      sumSq -= old * old;
    }
    if (i >= length - 1) {
      const mean = sum / length;
      const variance = (sumSq / length) - mean * mean;
      out[i] = Math.sqrt(Math.max(variance, 0));
    }
  }
  return out;
}

export function computeBollingerBands(
  candles: Candle[],
  inputs: BollingerInputs
): BollingerPoint[] {
  const closes = candles.map(c => c.close);
  const basisArr = sma(closes, inputs.length);
  const sdArr = rollingStdDev(closes, inputs.length);

  const raw: BollingerPoint[] = candles.map((c, i) => {
    const basis = basisArr[i];
    const sd = sdArr[i];
    if (basis == null || sd == null) {
      return { time: c.timestamp, basis: null, upper: null, lower: null };
    }
    const upper = basis + inputs.stdDev * sd;
    const lower = basis - inputs.stdDev * sd;
    return { time: c.timestamp, basis, upper, lower };
  });

  // Apply offset: shift forward (positive) or backward (negative) by N bars
  const shift = inputs.offset | 0;
  if (shift === 0) return raw;
  const shifted: BollingerPoint[] = raw.map((p, i, arr) => {
    const j = i - shift; // positive shift moves bands forward
    if (j < 0 || j >= arr.length) {
      return { time: p.time, basis: null, upper: null, lower: null };
    }
    return { time: p.time, basis: arr[j].basis, upper: arr[j].upper, lower: arr[j].lower };
  });
  return shifted;
}
