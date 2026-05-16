'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Activity, TrendingUp, Play } from 'lucide-react';

const AnimatedTimeline = dynamic(() => import('../../components/AnimatedTimeline'), { ssr: false });

interface DataPoint {
  year: number;
  return: number;
  volatility: number;
}

interface AssetData {
  name: string;
  category: 'crypto' | 'stocks' | 'commodities';
  timeline: DataPoint[];
}

export default function AssetEvolutionPage() {
  const [data, setData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/annual_evolution.json')
      .then(res => res.json())
      .then((d: AssetData[]) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
            <div className="bg-purple-500/20 rounded-full p-3">
              <Play className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Asset Evolution Timeline
              </h1>
              <p className="text-gray-300">
                Watch how 21 assets evolved from 2014 to 2024 — Hans Rosling style
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-blue-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Risk vs Return</h3>
              <p className="text-xs text-gray-400">X-axis shows volatility, Y-axis shows annual return</p>
            </div>
            <div>
              <div className="bg-purple-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <Play className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Animated Playback</h3>
              <p className="text-xs text-gray-400">Press Play to animate year by year, or drag the scrubber</p>
            </div>
            <div>
              <div className="bg-emerald-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Track Any Asset</h3>
              <p className="text-xs text-gray-400">Click a bubble to see its full journey path over time</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
              <span className="ml-3 text-gray-400">Loading timeline data...</span>
            </div>
          ) : data.length > 0 ? (
            <AnimatedTimeline data={data} />
          ) : (
            <div className="text-center py-24 text-gray-400">Failed to load data.</div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/risk-analysis"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all text-sm"
          >
            <Activity className="w-5 h-5" />
            Risk Analysis
          </Link>
          <Link
            href="/portfolio-optimizer"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all text-sm"
          >
            <TrendingUp className="w-5 h-5" />
            Portfolio Optimizer
          </Link>
        </div>
      </div>
    </div>
  );
}
