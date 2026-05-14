'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: 'What does base-100 normalization mean?',
    a: 'Every asset starts at 100 at the beginning of the period. If Bitcoin reaches 300, it tripled in value. If Gold reaches 150, it gained 50%. This lets you compare assets with wildly different prices — a $60,000 Bitcoin vs. a $2,000 Gold price — on the same chart.',
  },
  {
    q: 'Why do some assets show N/A for certain periods?',
    a: 'Some assets didn\'t exist for the full 10-year period. Solana launched in 2020 and Avalanche in late 2020, so they have no data before that. When you select "10 Years", these assets show N/A because there\'s no historical price to compare.',
  },
  {
    q: 'How is volatility calculated?',
    a: 'Volatility is the annualized standard deviation of monthly returns. In simple terms: it measures how much an asset\'s price swings up and down. Bitcoin at ~55% volatility means its price can swing roughly 55% in a year. Real Estate at ~5% is very stable by comparison.',
  },
  {
    q: 'What\'s a good Sharpe Ratio?',
    a: 'The Sharpe Ratio measures return per unit of risk. Below 0.5 is poor, 0.5–1.0 is acceptable, 1.0–2.0 is good, and above 2.0 is excellent. A Sharpe of 1.5 means you earned 1.5% of extra return for every 1% of risk you took.',
  },
  {
    q: 'What is Maximum Drawdown?',
    a: 'The largest peak-to-trough drop in value. If an asset went from $10,000 to $4,000 before recovering, the max drawdown is -60%. It shows the worst-case scenario — how much you could have lost if you bought at the peak and sold at the bottom.',
  },
  {
    q: 'Should I use DCA or lump sum investing?',
    a: 'DCA (investing a fixed amount monthly) reduces timing risk — you buy more when prices are low. Lump sum statistically outperforms DCA about 2/3 of the time because markets trend upward. DCA is better for peace of mind; lump sum is better for maximizing expected returns.',
  },
  {
    q: 'What time period should I choose?',
    a: '1 Year shows recent performance and short-term trends. 5 Years captures a full market cycle (bull and bear). 10 Years gives the most complete picture but fewer assets have data. Start with 5 Years for a balanced view.',
  },
  {
    q: 'How often is the data updated?',
    a: 'The tool uses historical year-end data from 2014 to 2024. It\'s not real-time — it\'s designed for educational comparison of long-term trends, not for tracking today\'s prices.',
  },
  {
    q: 'Can I trust historical performance for future results?',
    a: 'No. Past performance does not guarantee future results. Bitcoin\'s +29,000% return over 10 years is exceptional and unlikely to repeat. Use this tool to understand risk-return relationships and asset class behavior, not to predict the future.',
  },
  {
    q: 'How do I read the correlation matrix?',
    a: 'Values range from -1 to +1. A value of +1 means two assets move in perfect sync. A value of 0 means they\'re independent. A value of -1 means they move in opposite directions. For diversification, you want assets with low or negative correlations.',
  },
];

function Accordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-200 hover:text-white transition-colors"
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span className="ml-4 text-gray-500 text-lg shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-400 leading-relaxed">{item.a}</div>
      )}
    </div>
  );
}

export default function HelpModal({ open, onClose, onStartTour }: HelpModalProps) {
  const [filter, setFilter] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setFilter('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const filtered = filter
    ? faqs.filter(f =>
        f.q.toLowerCase().includes(filter.toLowerCase()) ||
        f.a.toLowerCase().includes(filter.toLowerCase())
      )
    : faqs;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Help"
    >
      <div
        ref={modalRef}
        className="bg-slate-800 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white">Help & FAQ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close help"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Quick Start</h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
                <span><strong>Select assets</strong> — click cards to pick 2–20 assets from crypto, stocks, and commodities.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>Choose a period</strong> — 1 year, 5 years, or 10 years of historical data.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Set an amount</strong> — enter how much you would have invested.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">4</span>
                <span><strong>Read the results</strong> — compare returns, volatility, and risk in the chart, cards, and table.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">5</span>
                <span><strong>Go deeper</strong> — try the DCA Calculator or Risk Analysis pages for more insights.</span>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Key Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium text-sm">Return %</p>
                <p className="text-gray-400 text-xs mt-1">Total profit or loss as a percentage. +200% means your $10,000 became $30,000.</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium text-sm">Volatility</p>
                <p className="text-gray-400 text-xs mt-1">How much the price swings. 55% is very volatile (crypto), 5% is very stable (real estate).</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium text-sm">Sharpe Ratio</p>
                <p className="text-gray-400 text-xs mt-1">Return per unit of risk. Above 1 is good, above 2 is excellent. Higher is better.</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium text-sm">Max Drawdown</p>
                <p className="text-gray-400 text-xs mt-1">Worst peak-to-trough drop. -53% means you could have lost over half your money.</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium text-sm">Correlation</p>
                <p className="text-gray-400 text-xs mt-1">How assets move together. Low correlation = better diversification. Range: -1 to +1.</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium text-sm">Base 100</p>
                <p className="text-gray-400 text-xs mt-1">All assets start at 100 for fair comparison. Value of 300 = tripled. Value of 50 = halved.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Frequently Asked Questions</h3>
            <input
              type="text"
              placeholder="Search questions..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {filtered.length === 0 && (
              <p className="text-gray-500 text-sm py-4 text-center">No matching questions found.</p>
            )}
            {filtered.map((faq, i) => (
              <Accordion key={i} item={faq} />
            ))}
          </section>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => { onClose(); onStartTour(); }}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Take the Guided Tour
          </button>
          <p className="text-xs text-gray-500">
            COM-480 Data Visualization — EPFL 2025
          </p>
        </div>
      </div>
    </div>
  );
}
