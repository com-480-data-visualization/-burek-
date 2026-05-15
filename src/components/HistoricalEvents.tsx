'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface HistoricalEvent {
  date: string;
  year: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  marketImpact: string;
}

const IMPACT_ICONS: Record<string, string> = {
  bullish: '\u25B2',
  bearish: '\u25BC',
  neutral: '\u25C6',
};

const IMPACT_COLORS: Record<string, string> = {
  bullish: '#4ade80',
  bearish: '#f87171',
  neutral: '#60a5fa',
};

const IMPACT_LABELS: Record<string, string> = {
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
};

const EVENTS: HistoricalEvent[] = [
  {
    date: '2017-12-17',
    year: 2017.96,
    label: '2017 ICO Boom',
    shortLabel: 'ICO Boom',
    description: 'Cryptocurrency ICOs reached peak, Bitcoin hit $20,000',
    color: '#10b981',
    impact: 'bullish',
    marketImpact: 'Massive cryptocurrency rally. Bitcoin surged 1300% in 2017. Altcoins gained 5000%+ as ICO mania peaked. Many projects raised hundreds of millions in minutes.',
  },
  {
    date: '2020-03-23',
    year: 2020.22,
    label: 'COVID-19 Crash',
    shortLabel: 'COVID',
    description: 'Global markets crashed due to pandemic',
    color: '#ef4444',
    impact: 'bearish',
    marketImpact: 'Global panic selling. S&P 500 dropped 34% in 23 days. Bitcoin fell 50% in one day. Central banks responded with massive stimulus, triggering rapid recovery.',
  },
  {
    date: '2021-11-10',
    year: 2021.86,
    label: '2021 Bull Run Peak',
    shortLabel: 'Bull Peak',
    description: 'Bitcoin reached all-time high of $69,000',
    color: '#10b981',
    impact: 'bullish',
    marketImpact: 'Crypto market cap exceeded $3 trillion. Bitcoin hit $69k, Ethereum $4.8k. Institutional adoption accelerated. NFT and DeFi boom. Peak euphoria before downturn.',
  },
  {
    date: '2022-05-09',
    year: 2022.36,
    label: 'Terra/Luna Collapse',
    shortLabel: 'Terra Crash',
    description: 'Major crypto crash triggered by Terra/Luna',
    color: '#ef4444',
    impact: 'bearish',
    marketImpact: '$40 billion wiped out in 48 hours. Algorithmic stablecoin UST lost peg. Triggered contagion: lending platforms froze, hedge funds collapsed. Bitcoin fell to $17k.',
  },
  {
    date: '2024-04-20',
    year: 2024.3,
    label: 'Bitcoin Halving',
    shortLabel: 'BTC Halving',
    description: 'Bitcoin block reward halved from 6.25 to 3.125 BTC',
    color: '#3b82f6',
    impact: 'neutral',
    marketImpact: 'Fourth Bitcoin halving event. Mining rewards cut by 50%, reducing new supply. Historically bullish 6-12 months after halving. Market anticipation built for months prior.',
  },
];

interface HistoricalEventsProps {
  selectedPeriod: '1y' | '5y' | '10y';
  visible: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoricalEvents({ selectedPeriod, visible }: HistoricalEventsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [lockedEvent, setLockedEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ width, height });
    });
    obs.observe(parent);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) setLockedEvent(null);
  }, [visible, selectedPeriod]);

  useEffect(() => {
    if (!svgRef.current || dims.width === 0 || !visible) {
      if (svgRef.current) d3.select(svgRef.current).selectAll('*').remove();
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const startYear = selectedPeriod === '1y' ? 2023 : selectedPeriod === '5y' ? 2019 : 2014;
    const endYear = 2024;

    const filtered = EVENTS.filter(e => e.year >= startYear && e.year <= endYear);
    if (filtered.length === 0) return;

    const margin = { left: 65, right: 30 };
    const chartW = dims.width - margin.left - margin.right;
    const chartH = dims.height;

    const xScale = d3.scaleLinear()
      .domain([startYear, endYear])
      .range([margin.left, margin.left + chartW]);

    svg.attr('width', dims.width).attr('height', chartH);

    const tooltip = d3.select(tooltipRef.current);
    const dotY = 10;

    const g = svg.append('g');

    filtered.forEach(event => {
      const xPos = xScale(event.year);

      g.append('line')
        .attr('x1', xPos).attr('x2', xPos)
        .attr('y1', dotY + 8).attr('y2', chartH - 30)
        .attr('stroke', event.color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.35);

      if (dims.width > 640) {
        const labelText = event.shortLabel;
        const labelX = xPos + 12;
        const labelW = labelText.length * 6.5 + 10;

        g.append('rect')
          .attr('x', labelX - 5)
          .attr('y', dotY - 9)
          .attr('width', labelW)
          .attr('height', 18)
          .attr('rx', 4)
          .attr('fill', 'rgba(0,0,0,0.75)')
          .attr('stroke', event.color)
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.9);

        g.append('text')
          .attr('x', labelX)
          .attr('y', dotY + 4)
          .attr('fill', '#ffffff')
          .attr('font-size', '10px')
          .attr('font-weight', '500')
          .attr('pointer-events', 'none')
          .text(labelText);
      }

      const circle = g.append('circle')
        .attr('cx', xPos)
        .attr('cy', dotY)
        .attr('r', lockedEvent === event.date ? 9 : 6)
        .attr('fill', event.color)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', lockedEvent === event.date ? 3 : 2)
        .attr('opacity', 0.9)
        .style('cursor', 'pointer');

      circle
        .on('mouseenter', function () {
          if (lockedEvent && lockedEvent !== event.date) return;
          d3.select(this).attr('r', 8).attr('opacity', 1);
          if (!lockedEvent) {
            showTooltip(event, xPos);
          }
        })
        .on('mouseleave', function () {
          if (lockedEvent === event.date) {
            d3.select(this).attr('r', 9);
            return;
          }
          d3.select(this).attr('r', 6).attr('opacity', 0.9);
          if (!lockedEvent) {
            tooltip.style('opacity', '0');
          }
        })
        .on('click', function () {
          if (lockedEvent === event.date) {
            setLockedEvent(null);
            tooltip.style('opacity', '0');
            d3.select(this).attr('r', 6).attr('stroke-width', 2);
          } else {
            setLockedEvent(event.date);
            showTooltip(event, xPos);
            g.selectAll('circle').attr('r', 6).attr('stroke-width', 2);
            d3.select(this).attr('r', 9).attr('stroke-width', 3);
          }
        });
    });

    function showTooltip(event: HistoricalEvent, xPos: number) {
      const impactIcon = IMPACT_ICONS[event.impact];
      const impactColor = IMPACT_COLORS[event.impact];
      const impactLabel = IMPACT_LABELS[event.impact];

      let left = xPos;
      let transform = 'translateX(-50%)';
      if (xPos < 180) {
        left = xPos - 6;
        transform = 'translateX(0)';
      } else if (xPos > dims.width - 180) {
        left = xPos + 6;
        transform = 'translateX(-100%)';
      }

      tooltip
        .style('opacity', '1')
        .style('left', `${left}px`)
        .style('top', `${dotY + 22}px`)
        .style('transform', transform)
        .html(`
          <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.1)">
            <span style="font-weight:600;font-size:14px;color:#ffffff">${event.label}</span>
            <span style="font-size:12px;color:#94a3b8;margin-left:12px;white-space:nowrap">${formatDate(event.date)}</span>
          </div>
          <div style="font-size:13px;line-height:1.5;color:#cbd5e1;margin-bottom:10px">${event.description}</div>
          <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:6px">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:4px;display:flex;align-items:center;gap:6px">
              Market Impact
              <span style="color:${impactColor};font-size:11px">${impactIcon} ${impactLabel}</span>
            </div>
            <div style="font-size:12px;color:#e2e8f0;line-height:1.5">${event.marketImpact}</div>
          </div>
        `);
    }

  }, [dims, selectedPeriod, visible, lockedEvent]);

  useEffect(() => {
    if (!lockedEvent) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.tagName === 'circle') return;
      setLockedEvent(null);
      if (tooltipRef.current) {
        d3.select(tooltipRef.current).style('opacity', '0');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [lockedEvent]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <svg ref={svgRef} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        <style>{`svg circle, svg rect { pointer-events: all; }`}</style>
      </svg>
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity duration-200 rounded-lg text-white"
        style={{
          maxWidth: '320px',
          minWidth: '260px',
          zIndex: 20,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
        }}
      />
    </div>
  );
}
