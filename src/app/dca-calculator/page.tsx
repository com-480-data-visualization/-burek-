'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, Calendar, TrendingUp, Calculator, ArrowLeft, Coins, Activity } from 'lucide-react';
import InfoTip from '../../components/Tooltip';

interface MonthlyData {
  bitcoin: number;
  ethereum: number;
  solana: number;
  cardano: number;
  polygon: number;
  chainlink: number;
  avalanche: number;
  sp500: number;
  nasdaq: number;
  russell2000: number;
  ftse100: number;
  nikkei225: number;
  dax: number;
  qqq: number;
  vti: number;
  gold: number;
  silver: number;
  wtiOil: number;
  copper: number;
  naturalGas: number;
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
  startDate?: string;
}

export default function DCACalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(500);
  const [selectedAsset, setSelectedAsset] = useState<string>('bitcoin');
  const [startDate, setStartDate] = useState<string>('2020-01');
  const [endDate, setEndDate] = useState<string>('2024-12');

  const monthlyPriceData: Record<string, Record<string, MonthlyData>> = {
    "2020": {
      "01": { bitcoin: 9355, ethereum: 181, solana: 0.52, cardano: 0.044, polygon: 0.014, chainlink: 2.21, avalanche: 0, sp500: 3225, nasdaq: 9150, russell2000: 1614, ftse100: 7286, nikkei225: 23205, dax: 12981, qqq: 221, vti: 166, gold: 1587, silver: 18.0, wtiOil: 57.5, copper: 2.56, naturalGas: 2.02, realEstate: 213 },
      "02": { bitcoin: 8593, ethereum: 223, solana: 0.48, cardano: 0.052, polygon: 0.013, chainlink: 3.71, avalanche: 0, sp500: 2954, nasdaq: 8567, russell2000: 1476, ftse100: 6581, nikkei225: 21143, dax: 11890, qqq: 202, vti: 152, gold: 1585, silver: 16.6, wtiOil: 44.8, copper: 2.51, naturalGas: 1.68, realEstate: 214 },
      "03": { bitcoin: 6434, ethereum: 133, solana: 0.37, cardano: 0.028, polygon: 0.010, chainlink: 2.22, avalanche: 0, sp500: 2584, nasdaq: 7700, russell2000: 1153, ftse100: 5672, nikkei225: 18917, dax: 9936, qqq: 183, vti: 133, gold: 1591, silver: 14.0, wtiOil: 20.5, copper: 2.17, naturalGas: 1.64, realEstate: 216 },
      "04": { bitcoin: 8636, ethereum: 207, solana: 0.60, cardano: 0.040, polygon: 0.016, chainlink: 3.60, avalanche: 0, sp500: 2912, nasdaq: 8889, russell2000: 1310, ftse100: 5901, nikkei225: 20193, dax: 10862, qqq: 213, vti: 149, gold: 1714, silver: 15.1, wtiOil: 18.8, copper: 2.31, naturalGas: 1.73, realEstate: 217 },
      "05": { bitcoin: 9460, ethereum: 231, solana: 0.67, cardano: 0.052, polygon: 0.017, chainlink: 3.97, avalanche: 0, sp500: 3044, nasdaq: 9490, russell2000: 1394, ftse100: 6076, nikkei225: 21878, dax: 11587, qqq: 228, vti: 155, gold: 1736, silver: 17.8, wtiOil: 35.3, copper: 2.39, naturalGas: 1.75, realEstate: 219 },
      "06": { bitcoin: 9139, ethereum: 225, solana: 0.73, cardano: 0.080, polygon: 0.016, chainlink: 4.44, avalanche: 0, sp500: 3100, nasdaq: 10058, russell2000: 1431, ftse100: 6170, nikkei225: 22288, dax: 12311, qqq: 241, vti: 158, gold: 1781, silver: 18.3, wtiOil: 39.3, copper: 2.72, naturalGas: 1.63, realEstate: 220 },
      "07": { bitcoin: 11341, ethereum: 345, solana: 1.32, cardano: 0.131, polygon: 0.018, chainlink: 7.87, avalanche: 0, sp500: 3271, nasdaq: 10745, russell2000: 1480, ftse100: 5898, nikkei225: 21710, dax: 12313, qqq: 260, vti: 166, gold: 1975, silver: 24.5, wtiOil: 40.3, copper: 2.88, naturalGas: 1.77, realEstate: 222 },
      "08": { bitcoin: 11665, ethereum: 434, solana: 3.41, cardano: 0.122, polygon: 0.019, chainlink: 14.91, avalanche: 0, sp500: 3500, nasdaq: 11975, russell2000: 1561, ftse100: 5963, nikkei225: 23140, dax: 12945, qqq: 293, vti: 177, gold: 1969, silver: 27.3, wtiOil: 42.6, copper: 2.95, naturalGas: 2.30, realEstate: 224 },
      "09": { bitcoin: 10785, ethereum: 360, solana: 2.90, cardano: 0.103, polygon: 0.020, chainlink: 10.50, avalanche: 3.30, sp500: 3363, nasdaq: 11167, russell2000: 1507, ftse100: 5866, nikkei225: 23185, dax: 12761, qqq: 273, vti: 171, gold: 1886, silver: 23.3, wtiOil: 40.2, copper: 3.03, naturalGas: 1.92, realEstate: 227 },
      "10": { bitcoin: 13792, ethereum: 382, solana: 1.62, cardano: 0.098, polygon: 0.015, chainlink: 10.86, avalanche: 3.80, sp500: 3269, nasdaq: 10911, russell2000: 1538, ftse100: 5577, nikkei225: 22977, dax: 11556, qqq: 272, vti: 168, gold: 1879, silver: 23.6, wtiOil: 35.8, copper: 3.04, naturalGas: 2.53, realEstate: 229 },
      "11": { bitcoin: 19696, ethereum: 616, solana: 1.89, cardano: 0.152, polygon: 0.017, chainlink: 13.12, avalanche: 3.50, sp500: 3626, nasdaq: 12036, russell2000: 1820, ftse100: 6267, nikkei225: 26434, dax: 13291, qqq: 301, vti: 185, gold: 1775, silver: 23.5, wtiOil: 45.3, copper: 3.24, naturalGas: 2.61, realEstate: 232 },
      "12": { bitcoin: 28987, ethereum: 737, solana: 1.52, cardano: 0.177, polygon: 0.018, chainlink: 12.24, avalanche: 3.40, sp500: 3756, nasdaq: 12888, russell2000: 1975, ftse100: 6460, nikkei225: 27444, dax: 13719, qqq: 313, vti: 192, gold: 1895, silver: 26.5, wtiOil: 48.5, copper: 3.52, naturalGas: 2.36, realEstate: 234 }
    },
    "2021": {
      "01": { bitcoin: 33114, ethereum: 1311, solana: 3.42, cardano: 0.358, polygon: 0.032, chainlink: 22.51, avalanche: 8.50, sp500: 3714, nasdaq: 13070, russell2000: 2073, ftse100: 6408, nikkei225: 27663, dax: 13432, qqq: 316, vti: 192, gold: 1848, silver: 25.5, wtiOil: 52.2, copper: 3.56, naturalGas: 2.56, realEstate: 236 },
      "02": { bitcoin: 45137, ethereum: 1417, solana: 11.17, cardano: 1.230, polygon: 0.132, chainlink: 29.23, avalanche: 27.30, sp500: 3811, nasdaq: 13192, russell2000: 2201, ftse100: 6484, nikkei225: 28966, dax: 13786, qqq: 319, vti: 197, gold: 1728, silver: 26.9, wtiOil: 61.5, copper: 3.91, naturalGas: 2.91, realEstate: 239 },
      "03": { bitcoin: 58918, ethereum: 1918, solana: 16.58, cardano: 1.195, polygon: 0.363, chainlink: 30.21, avalanche: 28.50, sp500: 3972, nasdaq: 13246, russell2000: 2221, ftse100: 6713, nikkei225: 29179, dax: 14621, qqq: 318, vti: 205, gold: 1714, silver: 25.1, wtiOil: 62.3, copper: 4.06, naturalGas: 2.62, realEstate: 242 },
      "04": { bitcoin: 57757, ethereum: 2775, solana: 44.08, cardano: 1.316, polygon: 0.372, chainlink: 36.68, avalanche: 28.80, sp500: 4181, nasdaq: 13962, russell2000: 2266, ftse100: 6970, nikkei225: 28812, dax: 15136, qqq: 338, vti: 214, gold: 1769, silver: 25.9, wtiOil: 63.6, copper: 4.34, naturalGas: 2.93, realEstate: 244 },
      "05": { bitcoin: 37292, ethereum: 2711, solana: 35.51, cardano: 1.576, polygon: 2.138, chainlink: 25.88, avalanche: 24.50, sp500: 4204, nasdaq: 13748, russell2000: 2248, ftse100: 7023, nikkei225: 28860, dax: 15421, qqq: 329, vti: 216, gold: 1903, silver: 27.8, wtiOil: 66.3, copper: 4.63, naturalGas: 2.99, realEstate: 247 },
      "06": { bitcoin: 35032, ethereum: 2274, solana: 31.45, cardano: 1.389, polygon: 1.430, chainlink: 20.16, avalanche: 15.10, sp500: 4297, nasdaq: 14503, russell2000: 2310, ftse100: 7037, nikkei225: 28792, dax: 15531, qqq: 354, vti: 221, gold: 1763, silver: 26.1, wtiOil: 73.5, copper: 4.29, naturalGas: 3.37, realEstate: 250 },
      "07": { bitcoin: 41609, ethereum: 2530, solana: 34.52, cardano: 1.280, polygon: 1.020, chainlink: 19.62, avalanche: 14.20, sp500: 4395, nasdaq: 14672, russell2000: 2226, ftse100: 7032, nikkei225: 27284, dax: 15544, qqq: 364, vti: 226, gold: 1814, silver: 25.5, wtiOil: 73.9, copper: 4.42, naturalGas: 3.84, realEstate: 252 },
      "08": { bitcoin: 47136, ethereum: 3432, solana: 74.00, cardano: 2.870, polygon: 1.456, chainlink: 26.47, avalanche: 41.50, sp500: 4522, nasdaq: 15116, russell2000: 2274, ftse100: 7120, nikkei225: 27789, dax: 15835, qqq: 371, vti: 232, gold: 1813, silver: 23.7, wtiOil: 68.5, copper: 4.36, naturalGas: 4.07, realEstate: 254 },
      "09": { bitcoin: 43807, ethereum: 2926, solana: 141.50, cardano: 2.110, polygon: 1.196, chainlink: 24.92, avalanche: 64.30, sp500: 4307, nasdaq: 14448, russell2000: 2204, ftse100: 7028, nikkei225: 29452, dax: 15261, qqq: 359, vti: 224, gold: 1757, silver: 22.2, wtiOil: 75.0, copper: 4.22, naturalGas: 5.11, realEstate: 256 },
      "10": { bitcoin: 61318, ethereum: 4289, solana: 183.93, cardano: 2.020, polygon: 1.735, chainlink: 30.26, avalanche: 60.00, sp500: 4605, nasdaq: 15498, russell2000: 2297, ftse100: 7238, nikkei225: 28893, dax: 15689, qqq: 382, vti: 236, gold: 1783, silver: 23.4, wtiOil: 83.6, copper: 4.38, naturalGas: 5.51, realEstate: 257 },
      "11": { bitcoin: 57020, ethereum: 4632, solana: 204.25, cardano: 1.592, polygon: 1.867, chainlink: 27.83, avalanche: 117.00, sp500: 4567, nasdaq: 15537, russell2000: 2245, ftse100: 7044, nikkei225: 27822, dax: 15100, qqq: 386, vti: 234, gold: 1776, silver: 23.0, wtiOil: 66.2, copper: 4.28, naturalGas: 4.68, realEstate: 260 },
      "12": { bitcoin: 46306, ethereum: 3682, solana: 170.17, cardano: 1.310, polygon: 2.485, chainlink: 19.35, avalanche: 98.00, sp500: 4766, nasdaq: 15644, russell2000: 2245, ftse100: 7385, nikkei225: 28792, dax: 15885, qqq: 394, vti: 241, gold: 1828, silver: 23.3, wtiOil: 75.2, copper: 4.42, naturalGas: 3.73, realEstate: 262 }
    },
    "2022": {
      "01": { bitcoin: 38469, ethereum: 2686, solana: 100.25, cardano: 1.040, polygon: 1.640, chainlink: 16.68, avalanche: 75.00, sp500: 4515, nasdaq: 14239, russell2000: 2007, ftse100: 7466, nikkei225: 27002, dax: 15472, qqq: 362, vti: 230, gold: 1797, silver: 22.4, wtiOil: 88.2, copper: 4.46, naturalGas: 4.38, realEstate: 264 },
      "02": { bitcoin: 43194, ethereum: 2920, solana: 95.10, cardano: 0.937, polygon: 1.540, chainlink: 14.72, avalanche: 77.50, sp500: 4373, nasdaq: 13751, russell2000: 2031, ftse100: 7459, nikkei225: 26527, dax: 14461, qqq: 348, vti: 224, gold: 1901, silver: 24.0, wtiOil: 95.7, copper: 4.52, naturalGas: 4.47, realEstate: 266 },
      "03": { bitcoin: 45538, ethereum: 3282, solana: 103.50, cardano: 1.075, polygon: 1.601, chainlink: 15.36, avalanche: 82.00, sp500: 4530, nasdaq: 14220, russell2000: 2091, ftse100: 7516, nikkei225: 27821, dax: 14414, qqq: 355, vti: 229, gold: 1929, silver: 24.7, wtiOil: 107.9, copper: 4.70, naturalGas: 5.56, realEstate: 269 },
      "04": { bitcoin: 37714, ethereum: 2814, solana: 83.60, cardano: 0.820, polygon: 1.297, chainlink: 12.85, avalanche: 56.00, sp500: 4131, nasdaq: 12534, russell2000: 1864, ftse100: 7515, nikkei225: 26848, dax: 14098, qqq: 316, vti: 211, gold: 1896, silver: 22.9, wtiOil: 104.7, copper: 4.42, naturalGas: 6.58, realEstate: 272 },
      "05": { bitcoin: 31778, ethereum: 1942, solana: 44.20, cardano: 0.539, polygon: 0.658, chainlink: 7.44, avalanche: 25.50, sp500: 4132, nasdaq: 11928, russell2000: 1862, ftse100: 7607, nikkei225: 27280, dax: 14388, qqq: 298, vti: 211, gold: 1837, silver: 21.7, wtiOil: 114.7, copper: 4.27, naturalGas: 8.14, realEstate: 273 },
      "06": { bitcoin: 19784, ethereum: 1068, solana: 33.50, cardano: 0.460, polygon: 0.432, chainlink: 6.22, avalanche: 17.50, sp500: 3785, nasdaq: 11028, russell2000: 1707, ftse100: 7169, nikkei225: 26393, dax: 12784, qqq: 280, vti: 195, gold: 1807, silver: 20.6, wtiOil: 109.8, copper: 3.72, naturalGas: 5.73, realEstate: 275 },
      "07": { bitcoin: 23335, ethereum: 1683, solana: 39.80, cardano: 0.509, polygon: 0.882, chainlink: 7.57, avalanche: 24.50, sp500: 4130, nasdaq: 12390, russell2000: 1885, ftse100: 7423, nikkei225: 27802, dax: 13484, qqq: 311, vti: 210, gold: 1764, silver: 20.3, wtiOil: 98.6, copper: 3.49, naturalGas: 7.28, realEstate: 275 },
      "08": { bitcoin: 20050, ethereum: 1554, solana: 32.40, cardano: 0.444, polygon: 0.826, chainlink: 7.16, avalanche: 23.00, sp500: 3955, nasdaq: 11816, russell2000: 1849, ftse100: 7284, nikkei225: 28092, dax: 12835, qqq: 297, vti: 204, gold: 1711, silver: 18.5, wtiOil: 89.6, copper: 3.54, naturalGas: 9.33, realEstate: 275 },
      "09": { bitcoin: 19431, ethereum: 1328, solana: 33.00, cardano: 0.425, polygon: 0.755, chainlink: 7.28, avalanche: 17.50, sp500: 3585, nasdaq: 10575, russell2000: 1664, ftse100: 6894, nikkei225: 25937, dax: 12114, qqq: 267, vti: 187, gold: 1669, silver: 19.0, wtiOil: 79.5, copper: 3.37, naturalGas: 6.83, realEstate: 275 },
      "10": { bitcoin: 20495, ethereum: 1574, solana: 31.40, cardano: 0.391, polygon: 0.916, chainlink: 7.36, avalanche: 18.50, sp500: 3871, nasdaq: 10988, russell2000: 1847, ftse100: 7095, nikkei225: 27587, dax: 13243, qqq: 278, vti: 198, gold: 1633, silver: 19.1, wtiOil: 86.5, copper: 3.39, naturalGas: 5.56, realEstate: 274 },
      "11": { bitcoin: 17168, ethereum: 1297, solana: 13.55, cardano: 0.315, polygon: 0.884, chainlink: 6.32, avalanche: 13.00, sp500: 4080, nasdaq: 11468, russell2000: 1886, ftse100: 7573, nikkei225: 27969, dax: 14397, qqq: 289, vti: 208, gold: 1754, silver: 21.4, wtiOil: 80.3, copper: 3.64, naturalGas: 6.26, realEstate: 273 },
      "12": { bitcoin: 16547, ethereum: 1196, solana: 11.04, cardano: 0.255, polygon: 0.800, chainlink: 5.63, avalanche: 11.00, sp500: 3839, nasdaq: 10466, russell2000: 1761, ftse100: 7452, nikkei225: 26095, dax: 13924, qqq: 266, vti: 196, gold: 1819, silver: 23.9, wtiOil: 80.3, copper: 3.80, naturalGas: 4.48, realEstate: 272 }
    },
    "2023": {
      "01": { bitcoin: 23126, ethereum: 1588, solana: 24.30, cardano: 0.373, polygon: 1.106, chainlink: 6.95, avalanche: 18.50, sp500: 4076, nasdaq: 11584, russell2000: 1912, ftse100: 7765, nikkei225: 27327, dax: 15129, qqq: 286, vti: 208, gold: 1923, silver: 23.7, wtiOil: 78.9, copper: 4.07, naturalGas: 2.68, realEstate: 271 },
      "02": { bitcoin: 23147, ethereum: 1606, solana: 22.60, cardano: 0.363, polygon: 1.252, chainlink: 7.34, avalanche: 17.80, sp500: 3970, nasdaq: 11455, russell2000: 1900, ftse100: 7876, nikkei225: 27445, dax: 15362, qqq: 289, vti: 203, gold: 1826, silver: 20.9, wtiOil: 77.1, copper: 3.92, naturalGas: 2.45, realEstate: 270 },
      "03": { bitcoin: 28456, ethereum: 1824, solana: 20.80, cardano: 0.340, polygon: 1.091, chainlink: 7.10, avalanche: 17.00, sp500: 4109, nasdaq: 12021, russell2000: 1802, ftse100: 7631, nikkei225: 28041, dax: 15629, qqq: 308, vti: 210, gold: 1969, silver: 23.4, wtiOil: 75.7, copper: 3.96, naturalGas: 2.22, realEstate: 270 },
      "04": { bitcoin: 29268, ethereum: 1832, solana: 21.10, cardano: 0.387, polygon: 1.055, chainlink: 7.57, avalanche: 17.50, sp500: 4169, nasdaq: 12226, russell2000: 1790, ftse100: 7870, nikkei225: 28856, dax: 15922, qqq: 318, vti: 213, gold: 1990, silver: 24.9, wtiOil: 76.8, copper: 3.88, naturalGas: 2.21, realEstate: 271 },
      "05": { bitcoin: 27219, ethereum: 1901, solana: 20.50, cardano: 0.368, polygon: 0.866, chainlink: 6.49, avalanche: 14.80, sp500: 4179, nasdaq: 12935, russell2000: 1772, ftse100: 7446, nikkei225: 30888, dax: 15664, qqq: 332, vti: 213, gold: 1943, silver: 23.5, wtiOil: 71.6, copper: 3.65, naturalGas: 2.19, realEstate: 272 },
      "06": { bitcoin: 30478, ethereum: 1930, solana: 18.95, cardano: 0.285, polygon: 0.649, chainlink: 5.76, avalanche: 12.50, sp500: 4450, nasdaq: 13689, russell2000: 1888, ftse100: 7532, nikkei225: 33189, dax: 16148, qqq: 361, vti: 226, gold: 1919, silver: 22.8, wtiOil: 70.6, copper: 3.78, naturalGas: 2.58, realEstate: 273 },
      "07": { bitcoin: 29230, ethereum: 1851, solana: 25.60, cardano: 0.304, polygon: 0.683, chainlink: 7.42, avalanche: 13.50, sp500: 4588, nasdaq: 14346, russell2000: 2003, ftse100: 7694, nikkei225: 33172, dax: 16447, qqq: 374, vti: 233, gold: 1958, silver: 24.4, wtiOil: 81.8, copper: 3.87, naturalGas: 2.62, realEstate: 275 },
      "08": { bitcoin: 25931, ethereum: 1633, solana: 20.30, cardano: 0.258, polygon: 0.545, chainlink: 6.01, avalanche: 10.20, sp500: 4507, nasdaq: 14034, russell2000: 1854, ftse100: 7439, nikkei225: 31625, dax: 15832, qqq: 367, vti: 228, gold: 1938, silver: 24.0, wtiOil: 83.6, copper: 3.77, naturalGas: 2.72, realEstate: 277 },
      "09": { bitcoin: 26967, ethereum: 1668, solana: 22.60, cardano: 0.249, polygon: 0.515, chainlink: 6.71, avalanche: 9.10, sp500: 4288, nasdaq: 13219, russell2000: 1785, ftse100: 7608, nikkei225: 31858, dax: 15387, qqq: 353, vti: 219, gold: 1847, silver: 22.5, wtiOil: 90.8, copper: 3.72, naturalGas: 2.73, realEstate: 279 },
      "10": { bitcoin: 34667, ethereum: 1815, solana: 32.40, cardano: 0.289, polygon: 0.575, chainlink: 9.46, avalanche: 10.40, sp500: 4193, nasdaq: 12851, russell2000: 1729, ftse100: 7321, nikkei225: 30858, dax: 14810, qqq: 347, vti: 213, gold: 1981, silver: 22.6, wtiOil: 85.5, copper: 3.61, naturalGas: 3.01, realEstate: 280 },
      "11": { bitcoin: 37712, ethereum: 2094, solana: 56.80, cardano: 0.382, polygon: 0.805, chainlink: 14.12, avalanche: 22.40, sp500: 4567, nasdaq: 14226, russell2000: 1862, ftse100: 7454, nikkei225: 33487, dax: 15966, qqq: 384, vti: 230, gold: 2036, silver: 24.5, wtiOil: 77.0, copper: 3.77, naturalGas: 2.82, realEstate: 282 },
      "12": { bitcoin: 42265, ethereum: 2291, solana: 101.50, cardano: 0.602, polygon: 0.997, chainlink: 15.60, avalanche: 38.00, sp500: 4769, nasdaq: 15011, russell2000: 2027, ftse100: 7733, nikkei225: 33464, dax: 16752, qqq: 403, vti: 240, gold: 2062, silver: 24.1, wtiOil: 71.4, copper: 3.85, naturalGas: 2.51, realEstate: 282 }
    },
    "2024": {
      "01": { bitcoin: 42897, ethereum: 2234, solana: 97.20, cardano: 0.534, polygon: 0.836, chainlink: 14.38, avalanche: 35.00, sp500: 4845, nasdaq: 15099, russell2000: 1985, ftse100: 7630, nikkei225: 36286, dax: 16899, qqq: 413, vti: 243, gold: 2030, silver: 22.8, wtiOil: 75.9, copper: 3.85, naturalGas: 2.09, realEstate: 283 },
      "02": { bitcoin: 61187, ethereum: 3382, solana: 116.00, cardano: 0.625, polygon: 0.956, chainlink: 18.53, avalanche: 38.50, sp500: 5096, nasdaq: 16091, russell2000: 2048, ftse100: 7630, nikkei225: 39166, dax: 17419, qqq: 434, vti: 255, gold: 2043, silver: 22.6, wtiOil: 77.0, copper: 3.86, naturalGas: 1.73, realEstate: 285 },
      "03": { bitcoin: 69630, ethereum: 3513, solana: 187.50, cardano: 0.712, polygon: 1.080, chainlink: 19.14, avalanche: 53.50, sp500: 5254, nasdaq: 16379, russell2000: 2124, ftse100: 7953, nikkei225: 40369, dax: 18477, qqq: 444, vti: 262, gold: 2230, silver: 25.1, wtiOil: 83.2, copper: 4.01, naturalGas: 1.76, realEstate: 286 },
      "04": { bitcoin: 60636, ethereum: 2985, solana: 133.00, cardano: 0.460, polygon: 0.714, chainlink: 13.79, avalanche: 34.50, sp500: 5018, nasdaq: 15657, russell2000: 1973, ftse100: 8144, nikkei225: 38405, dax: 17932, qqq: 423, vti: 251, gold: 2297, silver: 26.9, wtiOil: 81.9, copper: 4.39, naturalGas: 1.89, realEstate: 287 },
      "05": { bitcoin: 67493, ethereum: 3769, solana: 167.00, cardano: 0.457, polygon: 0.724, chainlink: 16.36, avalanche: 36.00, sp500: 5277, nasdaq: 16735, russell2000: 2069, ftse100: 8275, nikkei225: 38488, dax: 18693, qqq: 450, vti: 264, gold: 2327, silver: 30.4, wtiOil: 77.9, copper: 4.58, naturalGas: 2.53, realEstate: 289 },
      "06": { bitcoin: 62688, ethereum: 3377, solana: 133.00, cardano: 0.381, polygon: 0.564, chainlink: 13.67, avalanche: 25.50, sp500: 5460, nasdaq: 17732, russell2000: 2047, ftse100: 8164, nikkei225: 39583, dax: 18235, qqq: 477, vti: 272, gold: 2323, silver: 29.4, wtiOil: 81.5, copper: 4.38, naturalGas: 2.73, realEstate: 290 },
      "07": { bitcoin: 64619, ethereum: 3177, solana: 185.00, cardano: 0.405, polygon: 0.558, chainlink: 13.20, avalanche: 26.50, sp500: 5522, nasdaq: 17599, russell2000: 2254, ftse100: 8203, nikkei225: 39101, dax: 18508, qqq: 472, vti: 278, gold: 2399, silver: 28.9, wtiOil: 77.9, copper: 4.14, naturalGas: 2.07, realEstate: 291 },
      "08": { bitcoin: 58969, ethereum: 2515, solana: 143.00, cardano: 0.337, polygon: 0.419, chainlink: 10.18, avalanche: 22.00, sp500: 5648, nasdaq: 17516, russell2000: 2217, ftse100: 8377, nikkei225: 38647, dax: 18907, qqq: 471, vti: 282, gold: 2500, silver: 29.1, wtiOil: 73.6, copper: 4.08, naturalGas: 2.10, realEstate: 291 },
      "09": { bitcoin: 63300, ethereum: 2635, solana: 158.00, cardano: 0.383, polygon: 0.401, chainlink: 11.26, avalanche: 27.50, sp500: 5762, nasdaq: 17923, russell2000: 2229, ftse100: 8237, nikkei225: 37920, dax: 19325, qqq: 487, vti: 289, gold: 2614, silver: 31.2, wtiOil: 68.2, copper: 4.42, naturalGas: 2.24, realEstate: 291 },
      "10": { bitcoin: 69483, ethereum: 2580, solana: 173.00, cardano: 0.352, polygon: 0.367, chainlink: 11.18, avalanche: 27.00, sp500: 5793, nasdaq: 18179, russell2000: 2210, ftse100: 8110, nikkei225: 38053, dax: 19078, qqq: 491, vti: 289, gold: 2718, silver: 33.7, wtiOil: 69.3, copper: 4.34, naturalGas: 2.29, realEstate: 291 },
      "11": { bitcoin: 96834, ethereum: 3162, solana: 237.00, cardano: 0.942, polygon: 0.575, chainlink: 18.15, avalanche: 44.50, sp500: 6026, nasdaq: 19054, russell2000: 2434, ftse100: 8072, nikkei225: 38208, dax: 19400, qqq: 512, vti: 300, gold: 2660, silver: 30.8, wtiOil: 68.0, copper: 4.08, naturalGas: 3.18, realEstate: 290 },
      "12": { bitcoin: 93799, ethereum: 3197, solana: 189.00, cardano: 0.884, polygon: 0.480, chainlink: 22.78, avalanche: 40.00, sp500: 5964, nasdaq: 19705, russell2000: 2230, ftse100: 8173, nikkei225: 39895, dax: 19909, qqq: 515, vti: 296, gold: 2668, silver: 29.5, wtiOil: 71.7, copper: 4.03, naturalGas: 3.36, realEstate: 289 }
    }
  };

  const investments: Investment[] = [
    { name: 'Bitcoin', symbol: 'bitcoin', color: '#F7931A', description: 'The first and most well-known cryptocurrency' },
    { name: 'Ethereum', symbol: 'ethereum', color: '#627EEA', description: 'Leading smart contract platform' },
    { name: 'Solana', symbol: 'solana', color: '#9945FF', description: 'High-performance Layer 1 blockchain' },
    { name: 'Cardano', symbol: 'cardano', color: '#0033AD', description: 'Proof-of-stake blockchain platform' },
    { name: 'Polygon', symbol: 'polygon', color: '#8247E5', description: 'Ethereum scaling solution' },
    { name: 'Chainlink', symbol: 'chainlink', color: '#375BD2', description: 'Decentralized oracle network' },
    { name: 'Avalanche', symbol: 'avalanche', color: '#E84142', description: 'Fast smart contract platform', startDate: '2020-09' },
    { name: 'S&P 500', symbol: 'sp500', color: '#2563EB', description: 'Index of the 500 largest US companies' },
    { name: 'NASDAQ', symbol: 'nasdaq', color: '#00D4FF', description: 'US technology stock index' },
    { name: 'Russell 2000', symbol: 'russell2000', color: '#06B6D4', description: 'US small-cap stock index' },
    { name: 'FTSE 100', symbol: 'ftse100', color: '#DC2626', description: 'UK blue-chip stock index' },
    { name: 'Nikkei 225', symbol: 'nikkei225', color: '#F43F5E', description: 'Japanese stock market index' },
    { name: 'DAX', symbol: 'dax', color: '#FBBF24', description: 'German stock market index' },
    { name: 'QQQ ETF', symbol: 'qqq', color: '#10B981', description: 'NASDAQ-100 tracking ETF' },
    { name: 'VTI ETF', symbol: 'vti', color: '#14B8A6', description: 'Vanguard Total Stock Market ETF' },
    { name: 'Gold', symbol: 'gold', color: '#FFD700', description: 'Precious metal, traditional safe haven' },
    { name: 'Silver', symbol: 'silver', color: '#C0C0C0', description: 'Precious metal, industrial & investment' },
    { name: 'WTI Oil', symbol: 'wtiOil', color: '#78350F', description: 'West Texas Intermediate crude oil' },
    { name: 'Copper', symbol: 'copper', color: '#B45309', description: 'Industrial metal, economic indicator' },
    { name: 'Natural Gas', symbol: 'naturalGas', color: '#65A30D', description: 'Energy commodity' },
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
    const averageCost = totalShares > 0 ? totalInvested / totalShares : 0;

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

  const assetStartNote = selectedInvestment?.startDate
    ? (() => {
        const [sy, sm] = startDate.split('-').map(Number);
        const [ay, am] = selectedInvestment.startDate.split('-').map(Number);
        if (sy < ay || (sy === ay && sm < am)) {
          return `Note: ${selectedInvestment.name} data starts from ${selectedInvestment.startDate}. DCA contributions begin from that date.`;
        }
        return null;
      })()
    : null;

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
                Dollar Cost Averaging - Compare 21 assets with real historical data (2020-2024)
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
              onChange={(e) => setSelectedAsset(e.target.value)}
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
              <optgroup label="Stock Indices & ETFs">
                <option value="sp500">S&P 500</option>
                <option value="nasdaq">NASDAQ</option>
                <option value="russell2000">Russell 2000</option>
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
              <optgroup label="Real Estate">
                <option value="realEstate">US Real Estate</option>
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

        {assetStartNote && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-300 text-sm">{assetStartNote}</p>
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
                    const formatted = `$${Number(value).toLocaleString()}`;
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
