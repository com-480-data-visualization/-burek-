'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface HistoricalEvent {
  date: string;
  year: number;
  label: string;
  description: string;
  color: string;
  impact: 'bullish' | 'bearish' | 'neutral';
}

const EVENTS: HistoricalEvent[] = [
  {
    date: '2017-12-17',
    year: 2017.96,
    label: '2017 ICO Boom',
    description: 'Cryptocurrency ICOs reached peak, Bitcoin hit $20,000',
    color: '#10b981',
    impact: 'bullish',
  },
  {
    date: '2020-03-23',
    year: 2020.22,
    label: 'COVID-19 Crash',
    description: 'Global markets crashed due to pandemic, recovery began shortly after',
    color: '#ef4444',
    impact: 'bearish',
  },
  {
    date: '2021-11-10',
    year: 2021.86,
    label: '2021 Bull Run Peak',
    description: 'Bitcoin reached all-time high of $69,000, crypto market cap exceeded $3T',
    color: '#10b981',
    impact: 'bullish',
  },
  {
    date: '2022-05-09',
    year: 2022.36,
    label: 'Terra/Luna Collapse',
    description: 'Major crypto crash triggered by Terra/Luna collapse, $40B wiped out',
    color: '#ef4444',
    impact: 'bearish',
  },
  {
    date: '2024-04-20',
    year: 2024.3,
    label: 'Bitcoin Halving',
    description: 'Bitcoin block reward halved from 6.25 to 3.125 BTC',
    color: '#3b82f6',
    impact: 'neutral',
  },
];

interface HistoricalEventsProps {
  selectedPeriod: '1y' | '5y' | '10y';
  visible: boolean;
}

export default function HistoricalEvents({ selectedPeriod, visible }: HistoricalEventsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

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

    const g = svg.append('g');

    filtered.forEach(event => {
      const xPos = xScale(event.year);

      const dotY = 8;

      g.append('line')
        .attr('x1', xPos).attr('x2', xPos)
        .attr('y1', dotY + 6).attr('y2', chartH - 30)
        .attr('stroke', event.color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.4);

      g.append('circle')
        .attr('cx', xPos)
        .attr('cy', dotY)
        .attr('r', 6)
        .attr('fill', event.color)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.9)
        .style('cursor', 'pointer')
        .on('mouseenter', function () {
          d3.select(this).attr('r', 8).attr('opacity', 1);
          tooltip
            .style('opacity', '1')
            .style('left', `${xPos}px`)
            .style('top', `${dotY + 18}px`)
            .style('transform', 'translateX(-50%)')
            .html(`
              <div style="font-weight:700;font-size:12px;color:${event.color};margin-bottom:3px">${event.label}</div>
              <div style="font-size:11px;color:#e2e8f0;line-height:1.4">${event.description}</div>
            `);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 6).attr('opacity', 0.9);
          tooltip.style('opacity', '0');
        });
    });

  }, [dims, selectedPeriod, visible]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <svg ref={svgRef} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        <style>{`svg circle { pointer-events: all; }`}</style>
      </svg>
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity duration-150 bg-black/90 border border-white/20 rounded-lg px-3 py-2 text-white shadow-xl"
        style={{ maxWidth: '240px', zIndex: 20 }}
      />
    </div>
  );
}
