'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';

interface AssetData {
  avgReturn: number;
  volatility: number;
  sharpeRatio: number;
}

interface Point {
  name: string;
  avgReturn: number;
  volatility: number;
  sharpeRatio: number;
  category: 'crypto' | 'stocks' | 'commodities';
}

const CATEGORIES: Record<string, 'crypto' | 'stocks' | 'commodities'> = {
  Bitcoin: 'crypto', Ethereum: 'crypto', Solana: 'crypto', Cardano: 'crypto',
  Polygon: 'crypto', Chainlink: 'crypto', Avalanche: 'crypto',
  'S&P500': 'stocks', QQQ: 'stocks', VTI: 'stocks', Russell2000: 'stocks',
  FTSE100: 'stocks', Nikkei225: 'stocks', DAX: 'stocks', US_Real_Estate: 'stocks',
  Gold: 'commodities', Silver: 'commodities', WTI_Crude: 'commodities',
  Copper: 'commodities', Natural_Gas: 'commodities',
};

const CAT_COLORS: Record<string, string> = {
  crypto: '#3b82f6',
  stocks: '#10b981',
  commodities: '#f59e0b',
};

const CAT_LABELS: Record<string, string> = {
  crypto: 'Crypto',
  stocks: 'Stocks',
  commodities: 'Commodities',
};

export default function RiskReturnScatter() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [rawData, setRawData] = useState<Record<string, AssetData> | null>(null);
  const [filters, setFilters] = useState({ crypto: true, stocks: true, commodities: true });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    fetch('/data/risk_return.json')
      .then(r => r.json())
      .then(setRawData);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const draw = useCallback(() => {
    if (!rawData || !svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const points: Point[] = Object.entries(rawData)
      .filter(([name]) => {
        const cat = CATEGORIES[name];
        return cat && filters[cat];
      })
      .map(([name, d]) => ({
        name,
        avgReturn: d.avgReturn * 100,
        volatility: d.volatility * 100,
        sharpeRatio: d.sharpeRatio,
        category: CATEGORIES[name],
      }));

    if (points.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const chartWidth = Math.min(width, 700);
    const height = Math.min(chartWidth * 0.65, 420);
    const innerW = chartWidth - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr('width', chartWidth).attr('height', height);

    const xMax = d3.max(points, d => d.volatility)! * 1.1;
    const yMin = d3.min(points, d => d.avgReturn)!;
    const yMax = d3.max(points, d => d.avgReturn)!;
    const yPad = (yMax - yMin) * 0.15;

    const x = d3.scaleLinear().domain([0, xMax]).range([0, innerW]);
    const y = d3.scaleLinear().domain([yMin - yPad, yMax + yPad]).range([innerH, 0]);

    const radiusScale = d3.scaleLinear()
      .domain([d3.min(points, d => d.sharpeRatio)!, d3.max(points, d => d.sharpeRatio)!])
      .range([4, 12])
      .clamp(true);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}%`))
      .call(g => g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', '#334155'))
      .call(g => g.select('.domain').attr('stroke', '#334155'));

    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => `${d}%`))
      .call(g => g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', '#334155'))
      .call(g => g.select('.domain').attr('stroke', '#334155'));

    g.append('g')
      .selectAll('line')
      .data(x.ticks(6))
      .join('line')
      .attr('x1', d => x(d)).attr('x2', d => x(d))
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '2,3');

    g.append('g')
      .selectAll('line')
      .data(y.ticks(6))
      .join('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '2,3');

    if (y.domain()[0] < 0 && y.domain()[1] > 0) {
      g.append('line')
        .attr('x1', 0).attr('x2', innerW)
        .attr('y1', y(0)).attr('y2', y(0))
        .attr('stroke', '#475569').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
    }

    const medianVol = d3.median(points, d => d.volatility)!;
    const medianRet = d3.median(points, d => d.avgReturn)!;

    g.append('line')
      .attr('x1', x(medianVol)).attr('x2', x(medianVol))
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#475569').attr('stroke-width', 1).attr('stroke-dasharray', '6,4').attr('opacity', 0.6);

    g.append('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', y(medianRet)).attr('y2', y(medianRet))
      .attr('stroke', '#475569').attr('stroke-width', 1).attr('stroke-dasharray', '6,4').attr('opacity', 0.6);

    const quadrantLabels = [
      { label: 'Low Risk\nHigh Return', x: x(medianVol / 2), y: y(medianRet + (yMax + yPad - medianRet) / 2) },
      { label: 'High Risk\nHigh Return', x: x(medianVol + (xMax - medianVol) / 2), y: y(medianRet + (yMax + yPad - medianRet) / 2) },
      { label: 'Low Risk\nLow Return', x: x(medianVol / 2), y: y(medianRet - (medianRet - yMin + yPad) / 2) },
      { label: 'High Risk\nLow Return', x: x(medianVol + (xMax - medianVol) / 2), y: y(medianRet - (medianRet - yMin + yPad) / 2) },
    ];

    quadrantLabels.forEach(q => {
      const lines = q.label.split('\n');
      const text = g.append('text')
        .attr('x', q.x).attr('y', q.y)
        .attr('text-anchor', 'middle')
        .attr('fill', '#334155')
        .attr('font-size', '10px')
        .attr('pointer-events', 'none');
      lines.forEach((line, i) => {
        text.append('tspan')
          .attr('x', q.x)
          .attr('dy', i === 0 ? 0 : 13)
          .text(line);
      });
    });

    svg.append('text')
      .attr('x', margin.left + innerW / 2)
      .attr('y', height - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '12px')
      .text('Risk (Volatility %)');

    svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -(margin.top + innerH / 2))
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '12px')
      .text('Avg Monthly Return (%)');

    const tooltip = d3.select(tooltipRef.current);

    g.selectAll('circle')
      .data(points)
      .join('circle')
      .attr('cx', d => x(d.volatility))
      .attr('cy', d => y(d.avgReturn))
      .attr('r', d => radiusScale(d.sharpeRatio))
      .attr('fill', d => CAT_COLORS[d.category])
      .attr('fill-opacity', 0.8)
      .attr('stroke', d => CAT_COLORS[d.category])
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.4)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2.5)
          .attr('r', radiusScale(d.sharpeRatio) + 3);

        tooltip
          .style('opacity', '1')
          .style('left', `${event.offsetX + 16}px`)
          .style('top', `${event.offsetY - 16}px`)
          .html(`
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;color:${CAT_COLORS[d.category]}">${d.name.replace('_', ' ')}</div>
            <div style="display:grid;grid-template-columns:auto auto;gap:2px 10px;font-size:12px">
              <span style="color:#94a3b8">Return</span><span style="font-weight:600;${d.avgReturn >= 0 ? 'color:#4ade80' : 'color:#f87171'}">${d.avgReturn >= 0 ? '+' : ''}${d.avgReturn.toFixed(2)}%</span>
              <span style="color:#94a3b8">Volatility</span><span style="font-weight:600">${d.volatility.toFixed(2)}%</span>
              <span style="color:#94a3b8">Sharpe</span><span style="font-weight:600;${d.sharpeRatio >= 0.5 ? 'color:#4ade80' : d.sharpeRatio >= 0 ? 'color:#fbbf24' : 'color:#f87171'}">${d.sharpeRatio.toFixed(4)}</span>
            </div>
          `);
      })
      .on('mousemove', function (event) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        const tooltipEl = tooltipRef.current;
        if (!containerRect || !tooltipEl) return;

        let left = event.offsetX + 16;
        let top = event.offsetY - 16;

        if (left + tooltipEl.offsetWidth > containerRect.width - 10) {
          left = event.offsetX - tooltipEl.offsetWidth - 16;
        }
        if (top < 0) top = event.offsetY + 16;

        tooltip.style('left', `${left}px`).style('top', `${top}px`);
      })
      .on('mouseleave', function (_, d) {
        d3.select(this)
          .attr('fill-opacity', 0.8)
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 1.5)
          .attr('r', radiusScale(d.sharpeRatio));
        tooltip.style('opacity', '0');
      });

    g.selectAll('.label')
      .data(points.filter(d => d.volatility > xMax * 0.15 || Math.abs(d.avgReturn) > (yMax - yMin) * 0.25))
      .join('text')
      .attr('x', d => x(d.volatility) + radiusScale(d.sharpeRatio) + 4)
      .attr('y', d => y(d.avgReturn) + 3)
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text(d => d.name.replace('_', ' '));

  }, [rawData, filters, width]);

  useEffect(() => { draw(); }, [draw]);

  const toggleFilter = (cat: string) => {
    setFilters(prev => ({ ...prev, [cat]: !prev[cat as keyof typeof prev] }));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              filters[key as keyof typeof filters]
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/5 bg-white/[0.02] text-gray-500'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: filters[key as keyof typeof filters] ? CAT_COLORS[key] : '#475569' }}
            />
            {label}
          </button>
        ))}
        <span className="text-[11px] text-gray-500 ml-auto">Point size = Sharpe Ratio</span>
      </div>

      <div ref={containerRef} className="relative w-full max-w-[700px] mx-auto">
        <svg ref={svgRef} />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none opacity-0 transition-opacity duration-150 bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-xs shadow-xl z-10"
          style={{ whiteSpace: 'nowrap' }}
        />
      </div>
    </div>
  );
}
