export interface AssetInput {
  name: string;
  returns: number[];
}

export interface PortfolioResult {
  weights: Record<string, number>;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function covarianceMatrix(assets: AssetInput[]): number[][] {
  const n = assets.length;
  const means = assets.map(a => mean(a.returns));
  const T = assets[0].returns.length;
  const cov: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let t = 0; t < T; t++) {
        sum += (assets[i].returns[t] - means[i]) * (assets[j].returns[t] - means[j]);
      }
      cov[i][j] = sum / T;
      cov[j][i] = cov[i][j];
    }
  }
  return cov;
}

function portfolioReturn(weights: number[], expectedReturns: number[]): number {
  return weights.reduce((s, w, i) => s + w * expectedReturns[i], 0);
}

function portfolioVariance(weights: number[], cov: number[][]): number {
  const n = weights.length;
  let variance = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      variance += weights[i] * weights[j] * cov[i][j];
    }
  }
  return variance;
}

function randomWeights(n: number): number[] {
  const raw = Array.from({ length: n }, () => Math.random());
  const sum = raw.reduce((s, v) => s + v, 0);
  return raw.map(v => v / sum);
}

function generateDirectedWeights(n: number, targetIdx: number, bias: number): number[] {
  const raw = Array.from({ length: n }, (_, i) =>
    i === targetIdx ? Math.random() * bias + bias : Math.random()
  );
  const sum = raw.reduce((s, v) => s + v, 0);
  return raw.map(v => v / sum);
}

export function calculateEfficientFrontier(
  assets: AssetInput[],
  riskFreeRate: number = 0.05,
  numSimulations: number = 8000,
  numPoints: number = 80
): { frontier: PortfolioResult[]; tangency: PortfolioResult; minVariance: PortfolioResult } {
  const n = assets.length;
  const cov = covarianceMatrix(assets);
  const expectedReturns = assets.map(a => mean(a.returns) * 12);
  const annualRf = riskFreeRate;

  const portfolios: PortfolioResult[] = [];

  for (let i = 0; i < numSimulations; i++) {
    let weights: number[];
    if (i < numSimulations * 0.3) {
      const targetIdx = Math.floor(Math.random() * n);
      weights = generateDirectedWeights(n, targetIdx, 2 + Math.random() * 3);
    } else {
      weights = randomWeights(n);
    }

    const ret = portfolioReturn(weights, expectedReturns);
    const vol = Math.sqrt(portfolioVariance(weights, cov) * 12);
    const sharpe = vol === 0 ? 0 : (ret - annualRf) / vol;

    const weightMap: Record<string, number> = {};
    assets.forEach((a, idx) => { weightMap[a.name] = weights[idx]; });

    portfolios.push({ weights: weightMap, expectedReturn: ret, volatility: vol, sharpeRatio: sharpe });
  }

  portfolios.sort((a, b) => a.volatility - b.volatility);

  const minVol = portfolios[0].volatility;
  const maxVol = portfolios[portfolios.length - 1].volatility;
  const step = (maxVol - minVol) / numPoints;

  const frontier: PortfolioResult[] = [];
  for (let i = 0; i < numPoints; i++) {
    const lo = minVol + step * i;
    const hi = lo + step;
    const bucket = portfolios.filter(p => p.volatility >= lo && p.volatility < hi);
    if (bucket.length === 0) continue;
    const best = bucket.reduce((max, p) => p.expectedReturn > max.expectedReturn ? p : max);
    frontier.push(best);
  }

  const tangency = portfolios.reduce((max, p) => p.sharpeRatio > max.sharpeRatio ? p : max);
  const minVariance = portfolios.reduce((min, p) => p.volatility < min.volatility ? p : min);

  return { frontier, tangency, minVariance };
}

export function getAssetStats(assets: AssetInput[]): { name: string; expectedReturn: number; volatility: number }[] {
  return assets.map(a => {
    const m = mean(a.returns);
    const variance = a.returns.reduce((s, r) => s + (r - m) ** 2, 0) / a.returns.length;
    return {
      name: a.name,
      expectedReturn: m * 12,
      volatility: Math.sqrt(variance * 12),
    };
  });
}
