
export type Candle = {
  timestamp: number; // milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type BollingerInputs = {
  length: number;       // window length for SMA/stddev
  source: "close";      // close only per assignment
  maType: "SMA";        // SMA only for this task
  stdDev: number;       // multiplier
  offset: number;       // shift bars
};

export type LineStyle = "solid" | "dashed";

export type BollingerStyle = {
  showBasis: boolean;
  basisColor: string;
  basisWidth: number;
  basisStyle: LineStyle;

  showUpper: boolean;
  upperColor: string;
  upperWidth: number;
  upperStyle: LineStyle;

  showLower: boolean;
  lowerColor: string;
  lowerWidth: number;
  lowerStyle: LineStyle;

  fillBetween: boolean;
  fillOpacity: number; // 0..1
};

export type BollingerPoint = {
  time: number;
  basis: number | null;
  upper: number | null;
  lower: number | null;
};
