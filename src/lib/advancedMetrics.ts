export interface AdvancedMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  sortinoRatio: number;
  calmarRatio: number;
  downsideDeviation: number;
  winRate: number;
  var95: number;
  cvar95: number;
  beta: number;
  alpha: number;
  treynorRatio: number;
  informationRatio: number;
  upsideCapture: number;
  downsideCapture: number;
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

function annualizeMonthly(monthlyReturn: number): number {
  return monthlyReturn * 12;
}

function annualizeMonthlyVol(monthlyVol: number): number {
  return monthlyVol * Math.sqrt(12);
}

export function calculateAdvancedMetrics(
  assetReturns: number[],
  marketReturns: number[],
  riskFreeRates: number[]
): AdvancedMetrics {
  if (assetReturns.length === 0) {
    return {
      volatility: 0, sharpeRatio: 0, maxDrawdown: 0,
      sortinoRatio: 0, calmarRatio: 0, downsideDeviation: 0,
      winRate: 0, var95: 0, cvar95: 0, beta: 0, alpha: 0,
      treynorRatio: 0, informationRatio: 0, upsideCapture: 0, downsideCapture: 0,
    };
  }

  const n = assetReturns.length;
  const avgReturn = mean(assetReturns);
  const avgRf = mean(riskFreeRates.slice(0, n)) / 12;
  const vol = stdDev(assetReturns);
  const annVol = annualizeMonthlyVol(vol);
  const annReturn = annualizeMonthly(avgReturn);
  const annRf = mean(riskFreeRates.slice(0, n));

  // Volatility (annualized %)
  const volatility = annVol * 100;

  // Sharpe Ratio
  const sharpeRatio = annVol === 0 ? 0 : (annReturn - annRf) / annVol;

  // Max Drawdown
  let peak = 0;
  let maxDD = 0;
  let cumulative = 0;
  for (const r of assetReturns) {
    cumulative += r;
    if (cumulative > peak) peak = cumulative;
    const dd = peak - cumulative;
    if (dd > maxDD) maxDD = dd;
  }
  const maxDrawdown = maxDD * 100;

  // Downside Deviation (annualized)
  const negativeReturns = assetReturns.filter(r => r < 0);
  const downsideDev = negativeReturns.length > 0
    ? Math.sqrt(negativeReturns.reduce((s, r) => s + r ** 2, 0) / n)
    : 0;
  const downsideDeviation = annualizeMonthlyVol(downsideDev) * 100;

  // Sortino Ratio
  const annDownsideDev = annualizeMonthlyVol(downsideDev);
  const sortinoRatio = annDownsideDev === 0 ? 0 : (annReturn - annRf) / annDownsideDev;

  // Calmar Ratio
  const calmarRatio = maxDD === 0 ? 0 : annReturn / (maxDD);

  // Win Rate
  const winRate = (assetReturns.filter(r => r > 0).length / n) * 100;

  // VaR 95% (historical, monthly)
  const sorted = [...assetReturns].sort((a, b) => a - b);
  const varIndex = Math.floor(n * 0.05);
  const var95 = -sorted[varIndex] * 100;

  // CVaR 95% (Expected Shortfall)
  const tailLosses = sorted.slice(0, varIndex + 1);
  const cvar95 = tailLosses.length > 0 ? -mean(tailLosses) * 100 : 0;

  // Align asset and market returns (use minimum shared length)
  const sharedLen = Math.min(assetReturns.length, marketReturns.length);
  const aRet = assetReturns.slice(assetReturns.length - sharedLen);
  const mRet = marketReturns.slice(marketReturns.length - sharedLen);

  // Beta
  const meanA = mean(aRet);
  const meanM = mean(mRet);
  let cov = 0;
  let varM = 0;
  for (let i = 0; i < sharedLen; i++) {
    cov += (aRet[i] - meanA) * (mRet[i] - meanM);
    varM += (mRet[i] - meanM) ** 2;
  }
  cov /= sharedLen;
  varM /= sharedLen;
  const beta = varM === 0 ? 0 : cov / varM;

  // Alpha (annualized Jensen's Alpha)
  const annMarketReturn = annualizeMonthly(meanM);
  const alpha = (annReturn - annRf) - beta * (annMarketReturn - annRf);

  // Treynor Ratio
  const treynorRatio = beta === 0 ? 0 : (annReturn - annRf) / beta;

  // Information Ratio
  const trackingDiff = aRet.map((r, i) => r - mRet[i]);
  const trackingError = stdDev(trackingDiff);
  const annTrackingError = annualizeMonthlyVol(trackingError);
  const informationRatio = annTrackingError === 0 ? 0 :
    annualizeMonthly(mean(trackingDiff)) / annTrackingError;

  // Upside Capture Ratio
  const upMonths: { a: number; m: number }[] = [];
  const downMonths: { a: number; m: number }[] = [];
  for (let i = 0; i < sharedLen; i++) {
    if (mRet[i] > 0) upMonths.push({ a: aRet[i], m: mRet[i] });
    else if (mRet[i] < 0) downMonths.push({ a: aRet[i], m: mRet[i] });
  }
  const upsideCapture = upMonths.length > 0
    ? (mean(upMonths.map(u => u.a)) / mean(upMonths.map(u => u.m))) * 100
    : 0;
  const downsideCapture = downMonths.length > 0
    ? (mean(downMonths.map(d => d.a)) / mean(downMonths.map(d => d.m))) * 100
    : 0;

  return {
    volatility,
    sharpeRatio,
    maxDrawdown,
    sortinoRatio,
    calmarRatio,
    downsideDeviation,
    winRate,
    var95,
    cvar95,
    beta,
    alpha: alpha * 100,
    treynorRatio,
    informationRatio,
    upsideCapture,
    downsideCapture,
  };
}
