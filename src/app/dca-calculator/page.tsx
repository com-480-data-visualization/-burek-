'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, Calendar, TrendingUp, Calculator, ArrowLeft, Coins, Activity } from 'lucide-react';
import InfoTip from '../../components/Tooltip';

interface MonthlyData {
  bitcoin: number;
  ethereum: number;
  sp500: number;
  nasdaq: number;
  gold: number;
  realEstate: number;
}

interface DCAResult {
  totalInvested: number;
  finalValue: number;
  totalReturn: number;
  returnPercentage: number;
  sharesAcquired: number;
  averageCost: number;
  monthlyData: Array<{
    month: string;
    price: number;
    sharesBought: number;
    totalShares: number;
    totalInvested: number;
    portfolioValue: number;
  }>;
}

interface Investment {
  name: string;
  symbol: string;
  color: string;
  description: string;
}

export default function DCACalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(500);
  const [selectedAsset, setSelectedAsset] = useState<string>('bitcoin');
  const [startDate, setStartDate] = useState<string>('2020-01');
  const [endDate, setEndDate] = useState<string>('2024-12');
  const [showAssetMessage, setShowAssetMessage] = useState<string | null>(null);

  const monthlyPriceData: Record<string, Record<string, MonthlyData>> = {
    "2020": {
      "01": { bitcoin: 9355, ethereum: 181, sp500: 3225, nasdaq: 9150, gold: 1587, realEstate: 213 },
      "02": { bitcoin: 8593, ethereum: 223, sp500: 2954, nasdaq: 8567, gold: 1585, realEstate: 214 },
      "03": { bitcoin: 6434, ethereum: 133, sp500: 2584, nasdaq: 7700, gold: 1591, realEstate: 216 },
      "04": { bitcoin: 8636, ethereum: 207, sp500: 2912, nasdaq: 8889, gold: 1714, realEstate: 217 },
      "05": { bitcoin: 9460, ethereum: 231, sp500: 3044, nasdaq: 9490, gold: 1736, realEstate: 219 },
      "06": { bitcoin: 9139, ethereum: 225, sp500: 3100, nasdaq: 10058, gold: 1781, realEstate: 220 },
      "07": { bitcoin: 11341, ethereum: 345, sp500: 3271, nasdaq: 10745, gold: 1975, realEstate: 222 },
      "08": { bitcoin: 11665, ethereum: 434, sp500: 3500, nasdaq: 11975, gold: 1969, realEstate: 224 },
      "09": { bitcoin: 10785, ethereum: 360, sp500: 3363, nasdaq: 11167, gold: 1886, realEstate: 227 },
      "10": { bitcoin: 13792, ethereum: 382, sp500: 3269, nasdaq: 10911, gold: 1879, realEstate: 229 },
      "11": { bitcoin: 19696, ethereum: 616, sp500: 3626, nasdaq: 12036, gold: 1775, realEstate: 232 },
      "12": { bitcoin: 28987, ethereum: 737, sp500: 3756, nasdaq: 12888, gold: 1895, realEstate: 234 }
    },
    "2021": {
      "01": { bitcoin: 33114, ethereum: 1311, sp500: 3714, nasdaq: 13070, gold: 1848, realEstate: 236 },
      "02": { bitcoin: 45137, ethereum: 1417, sp500: 3811, nasdaq: 13192, gold: 1728, realEstate: 239 },
      "03": { bitcoin: 58918, ethereum: 1918, sp500: 3972, nasdaq: 13246, gold: 1714, realEstate: 242 },
      "04": { bitcoin: 57757, ethereum: 2775, sp500: 4181, nasdaq: 13962, gold: 1769, realEstate: 244 },
      "05": { bitcoin: 37292, ethereum: 2711, sp500: 4204, nasdaq: 13748, gold: 1903, realEstate: 247 },
      "06": { bitcoin: 35032, ethereum: 2274, sp500: 4297, nasdaq: 14503, gold: 1763, realEstate: 250 },
      "07": { bitcoin: 41609, ethereum: 2530, sp500: 4395, nasdaq: 14672, gold: 1814, realEstate: 252 },
      "08": { bitcoin: 47136, ethereum: 3432, sp500: 4522, nasdaq: 15116, gold: 1813, realEstate: 254 },
      "09": { bitcoin: 43807, ethereum: 2926, sp500: 4307, nasdaq: 14448, gold: 1757, realEstate: 256 },
      "10": { bitcoin: 61318, ethereum: 4289, sp500: 4605, nasdaq: 15498, gold: 1783, realEstate: 257 },
      "11": { bitcoin: 57020, ethereum: 4632, sp500: 4567, nasdaq: 15537, gold: 1776, realEstate: 260 },
      "12": { bitcoin: 46306, ethereum: 3682, sp500: 4766, nasdaq: 15644, gold: 1828, realEstate: 262 }
    },
    "2022": {
      "01": { bitcoin: 38469, ethereum: 2686, sp500: 4515, nasdaq: 14239, gold: 1797, realEstate: 264 },
      "02": { bitcoin: 43194, ethereum: 2920, sp500: 4373, nasdaq: 13751, gold: 1901, realEstate: 266 },
      "03": { bitcoin: 45538, ethereum: 3282, sp500: 4530, nasdaq: 14220, gold: 1929, realEstate: 269 },
      "04": { bitcoin: 37714, ethereum: 2814, sp500: 4131, nasdaq: 12534, gold: 1896, realEstate: 272 },
      "05": { bitcoin: 31778, ethereum: 1942, sp500: 4132, nasdaq: 11928, gold: 1837, realEstate: 273 },
      "06": { bitcoin: 19784, ethereum: 1068, sp500: 3785, nasdaq: 11028, gold: 1807, realEstate: 275 },
      "07": { bitcoin: 23335, ethereum: 1683, sp500: 4130, nasdaq: 12390, gold: 1764, realEstate: 275 },
      "08": { bitcoin: 20050, ethereum: 1554, sp500: 3955, nasdaq: 11816, gold: 1711, realEstate: 275 },
      "09": { bitcoin: 19431, ethereum: 1328, sp500: 3585, nasdaq: 10575, gold: 1669, realEstate: 275 },
      "10": { bitcoin: 20495, ethereum: 1574, sp500: 3871, nasdaq: 10988, gold: 1633, realEstate: 274 },
      "11": { bitcoin: 17168, ethereum: 1297, sp500: 4080, nasdaq: 11468, gold: 1754, realEstate: 273 },
      "12": { bitcoin: 16547, ethereum: 1196, sp500: 3839, nasdaq: 10466, gold: 1819, realEstate: 272 }
    },
    "2023": {
      "01": { bitcoin: 23126, ethereum: 1588, sp500: 4076, nasdaq: 11584, gold: 1923, realEstate: 271 },
      "02": { bitcoin: 23147, ethereum: 1606, sp500: 3970, nasdaq: 11455, gold: 1826, realEstate: 270 },
      "03": { bitcoin: 28456, ethereum: 1824, sp500: 4109, nasdaq: 12021, gold: 1969, realEstate: 270 },
      "04": { bitcoin: 29268, ethereum: 1832, sp500: 4169, nasdaq: 12226, gold: 1990, realEstate: 271 },
      "05": { bitcoin: 27219, ethereum: 1901, sp500: 4179, nasdaq: 12935, gold: 1943, realEstate: 272 },
      "06": { bitcoin: 30478, ethereum: 1930, sp500: 4450, nasdaq: 13689, gold: 1919, realEstate: 273 },
      "07": { bitcoin: 29230, ethereum: 1851, sp500: 4588, nasdaq: 14346, gold: 1958, realEstate: 275 },
      "08": { bitcoin: 25931, ethereum: 1633, sp500: 4507, nasdaq: 14034, gold: 1938, realEstate: 277 },
      "09": { bitcoin: 26967, ethereum: 1668, sp500: 4288, nasdaq: 13219, gold: 1847, realEstate: 279 },
      "10": { bitcoin: 34667, ethereum: 1815, sp500: 4193, nasdaq: 12851, gold: 1981, realEstate: 280 },
      "11": { bitcoin: 37712, ethereum: 2094, sp500: 4567, nasdaq: 14226, gold: 2036, realEstate: 282 },
      "12": { bitcoin: 42265, ethereum: 2291, sp500: 4769, nasdaq: 15011, gold: 2062, realEstate: 282 }
    },
    "2024": {
      "01": { bitcoin: 42897, ethereum: 2234, sp500: 4845, nasdaq: 15099, gold: 2030, realEstate: 283 },
      "02": { bitcoin: 61187, ethereum: 3382, sp500: 5096, nasdaq: 16091, gold: 2043, realEstate: 285 },
      "03": { bitcoin: 69630, ethereum: 3513, sp500: 5254, nasdaq: 16379, gold: 2230, realEstate: 286 },
      "04": { bitcoin: 60636, ethereum: 2985, sp500: 5018, nasdaq: 15657, gold: 2297, realEstate: 287 },
      "05": { bitcoin: 67493, ethereum: 3769, sp500: 5277, nasdaq: 16735, gold: 2327, realEstate: 289 },
      "06": { bitcoin: 62688, ethereum: 3377, sp500: 5460, nasdaq: 17732, gold: 2323, realEstate: 290 },
      "07": { bitcoin: 64619, ethereum: 3177, sp500: 5522, nasdaq: 17599, gold: 2399, realEstate: 291 },
      "08": { bitcoin: 58969, ethereum: 2515, sp500: 5648, nasdaq: 17516, gold: 2500, realEstate: 291 },
      "09": { bitcoin: 63300, ethereum: 2635, sp500: 5762, nasdaq: 17923, gold: 2614, realEstate: 291 },
      "10": { bitcoin: 69483, ethereum: 2580, sp500: 5793, nasdaq: 18179, gold: 2718, realEstate: 291 },
      "11": { bitcoin: 96834, ethereum: 3162, sp500: 6026, nasdaq: 19054, gold: 2660, realEstate: 290 },
      "12": { bitcoin: 93799, ethereum: 3197, sp500: 5964, nasdaq: 19705, gold: 2668, realEstate: 289 }
    }
  };

  const investments: Investment[] = [
    { name: 'Bitcoin', symbol: 'bitcoin', color: '#F7931A', description: 'The first and most well-known cryptocurrency' },
    { name: 'Ethereum', symbol: 'ethereum', color: '#627EEA', description: 'Leading smart contract platform' },
    { name: 'S&P 500', symbol: 'sp500', color: '#2563EB', description: 'Index of the 500 largest US companies' },
    { name: 'NASDAQ', symbol: 'nasdaq', color: '#00D4FF', description: 'US technology stock index' },
    { name: 'Gold', symbol: 'gold', color: '#FFD700', description: 'Precious metal, traditional safe haven' },
    { name: 'Real Estate', symbol: 'realEstate', color: '#8B5CF6', description: 'US residential real estate index' }
  ];

  const calculateDCA = (): DCAResult => {
    const [startYear, startMonth] = startDate.split('-');
    const [endYear, endMonth] = endDate.split('-');

    const monthlyData: Array<{
      month: string;
      price: number;
      sharesBought: number;
      totalShares: number;
      totalInvested: number;
      portfolioValue: number;
    }> = [];

    let totalInvested = 0;
    let totalShares = 0;
    let currentYear = parseInt(startYear);
    let currentMonth = parseInt(startMonth);

    while (
      currentYear < parseInt(endYear) ||
      (currentYear === parseInt(endYear) && currentMonth <= parseInt(endMonth))
    ) {
      const monthKey = currentMonth.toString().padStart(2, '0');
      const yearData = monthlyPriceData[currentYear.toString()];

      if (yearData && yearData[monthKey]) {
        const monthData = yearData[monthKey];
        const price = monthData[selectedAsset as keyof MonthlyData];

        if (price !== null && price > 0) {
          const sharesBought = monthlyAmount / price;
          totalShares += sharesBought;
          totalInvested += monthlyAmount;

          monthlyData.push({
            month: `${currentYear}-${monthKey}`,
            price: price,
            sharesBought: sharesBought,
            totalShares: totalShares,
            totalInvested: totalInvested,
            portfolioValue: totalShares * price
          });
        }
      }

      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }

    const finalPrice = monthlyData[monthlyData.length - 1]?.price || 0;
    const finalValue = totalShares * finalPrice;
    const totalReturn = finalValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    const averageCost = totalInvested / totalShares;

    return {
      totalInvested,
      finalValue,
      totalReturn,
      returnPercentage,
      sharesAcquired: totalShares,
      averageCost,
      monthlyData
    };
  };

  const dcaResult = calculateDCA();
  const selectedInvestment = investments.find(inv => inv.symbol === selectedAsset);

  const chartData = dcaResult.monthlyData.map(data => ({
    month: data.month,
    invested: data.totalInvested,
    value: data.portfolioValue
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Comparator
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 rounded-full p-3">
              <Calculator className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                DCA Calculator
              </h1>
              <p className="text-gray-300">
                Dollar Cost Averaging - Compare assets with real historical data
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center"><InfoTip text="Investing a fixed amount regularly (e.g. $500/month) regardless of price. You buy more when prices are low, less when high — reducing timing risk.">What is Dollar Cost Averaging?</InfoTip></h2>
          <p className="text-center text-gray-300 mb-6">
            DCA is an investment strategy where you invest a fixed amount regularly, regardless of market price.
            This reduces the impact of volatility and can lower your average cost per share over time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Regular Investment</h3>
              <p className="text-sm text-gray-300">Invest the same amount every month</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Reduce Volatility</h3>
              <p className="text-sm text-gray-300">Buy more when prices are low, less when high</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Lower Average Cost</h3>
              <p className="text-sm text-gray-300">Potentially better than trying to time the market</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Monthly Investment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Investment Asset
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => {
                const val = e.target.value;
                const supported = ['bitcoin', 'ethereum', 'sp500', 'nasdaq', 'gold', 'realEstate'];
                if (supported.includes(val)) {
                  setSelectedAsset(val);
                  setShowAssetMessage(null);
                } else {
                  setShowAssetMessage(val);
                }
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <optgroup label="Cryptocurrencies">
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="solana">Solana</option>
                <option value="cardano">Cardano</option>
                <option value="polygon">Polygon</option>
                <option value="chainlink">Chainlink</option>
                <option value="avalanche">Avalanche</option>
              </optgroup>
              <optgroup label="Traditional Assets">
                <option value="sp500">S&P 500</option>
                <option value="nasdaq">NASDAQ</option>
                <option value="russell2000">Russell 2000</option>
                <option value="realEstate">Real Estate</option>
                <option value="ftse100">FTSE 100</option>
                <option value="nikkei225">Nikkei 225</option>
                <option value="dax">DAX</option>
                <option value="qqq">QQQ ETF</option>
                <option value="vti">VTI ETF</option>
              </optgroup>
              <optgroup label="Commodities">
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="wtiOil">WTI Oil</option>
                <option value="copper">Copper</option>
                <option value="naturalGas">Natural Gas</option>
              </optgroup>
            </select>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Start Date
            </label>
            <input
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min="2020-01"
              max="2024-11"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              End Date
            </label>
            <input
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min="2020-02"
              max="2024-12"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {showAssetMessage && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Calculator className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Asset not yet available in prototype</p>
              <p className="text-gray-400 text-sm mt-1">
                Full DCA analysis for all 21 assets including {showAssetMessage} will be available in the final version.
                Currently available: Bitcoin, Ethereum, S&P 500, NASDAQ, Gold, Real Estate.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className="font-bold text-green-400"><InfoTip text="The sum of all your monthly contributions over the selected period.">Total Invested</InfoTip></h3>
            </div>
            <p className="text-2xl font-bold text-white">${dcaResult.totalInvested.toLocaleString()}</p>
            <p className="text-sm text-gray-300">Over {dcaResult.monthlyData.length} months</p>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-blue-400"><InfoTip text="What all your accumulated units are worth at the current market price.">Portfolio Value</InfoTip></h3>
            </div>
            <p className="text-2xl font-bold text-white">${dcaResult.finalValue.toLocaleString()}</p>
            <p className="text-sm text-gray-300">Current market value</p>
          </div>

          <div className={`backdrop-blur-sm rounded-xl p-6 border ${
            dcaResult.totalReturn >= 0
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className={`w-6 h-6 ${dcaResult.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
              <h3 className={`font-bold ${dcaResult.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                Total Return
              </h3>
            </div>
            <p className={`text-2xl font-bold ${dcaResult.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {dcaResult.totalReturn >= 0 ? '+' : ''}${dcaResult.totalReturn.toLocaleString()}
            </p>
            <p className="text-sm text-gray-300">
              {dcaResult.returnPercentage >= 0 ? '+' : ''}{dcaResult.returnPercentage.toFixed(1)}% return
            </p>
          </div>

          <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-6 h-6 text-purple-400" />
              <h3 className="font-bold text-purple-400"><InfoTip text="Your average purchase price per unit. DCA typically lowers this compared to buying all at once.">Average Cost</InfoTip></h3>
            </div>
            <p className="text-2xl font-bold text-white">${dcaResult.averageCost.toLocaleString()}</p>
            <p className="text-sm text-gray-300">
              {dcaResult.sharesAcquired.toFixed(4)} {selectedInvestment?.name} units
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <h3 className="text-xl font-bold mb-4">DCA Performance Over Time</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => {
                    const formatted = `${Number(value).toLocaleString()}`;
                    if (name === 'invested') return [formatted, 'Total Invested'];
                    if (name === 'value') return [formatted, 'Portfolio Value'];
                    return [formatted, name];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke="#64748b"
                  strokeWidth={2}
                  name="Total Invested"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={selectedInvestment?.color || '#3B82F6'}
                  strokeWidth={3}
                  name="Portfolio Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 text-center py-4 border border-white/10 rounded-xl bg-white/5">
          <p className="text-gray-300 font-semibold text-sm mb-1">Full DCA Analysis Coming in Final Version</p>
          <p className="text-gray-500 text-xs">21 assets with detailed monthly breakdowns, price history charts, asset performance comparison, and investment strategy recommendations.</p>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-8 border border-green-500/30 text-center mt-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Compare More Assets?</h3>
          <p className="text-gray-300 mb-6">
            Try different assets, time periods, and investment amounts to see how DCA would have performed.
            Compare multiple strategies side by side with our main investment comparator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/risk-analysis"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              <Activity className="w-5 h-5" />
              Analyze Risk Metrics
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              Explore Investment Comparator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
