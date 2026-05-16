'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { PortfolioResult } from '../lib/portfolioOptimizer';

interface AssetPoint {
  name: string;
  expectedReturn: number;
  volatility: number;
}

interface EfficientFrontierProps {
  frontierData: PortfolioResult[];
  tangency: PortfolioResult;
  minVariance: PortfolioResult;
  assets: AssetPoint[];
  riskFreeRate: number;
  onPortfolioSelect: (portfolio: PortfolioResult) => void;
  selectedPortfolio: PortfolioResult | null;
}

export default function EfficientFrontier({
  frontierData,
  tangency,
  minVariance,
  assets,
  riskFreeRate,
  onPortfolioSelect,
  selectedPortfolio,
}: EfficientFrontierProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const draw = useCallback(() => {
    if (!svgRef.current || width === 0 || frontierData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const chartWidth = Math.min(width, 700);
    const height = Math.min(chartWidth * 0.7, 450);
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerW = chartWidth - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr('width', chartWidth).attr('height', height);

    const allVols = [...frontierData.map(d => d.volatility), ...assets.map(a => a.volatility)];
    const allRets = [...frontierData.map(d => d.expectedReturn), ...assets.map(a => a.expectedReturn)];

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(allVols)! * 1.15])
      .range([margin.left, margin.left + innerW]);

    const yMin = d3.min(allRets)!;
    const yMax = d3.max(allRets)!;
    const yPad = (yMax - yMin) * 0.15;
    const yScale = d3.scaleLinear()
      .domain([Math.min(yMin - yPad, -0.1), yMax + yPad])
      .range([margin.top + innerH, margin.top]);

    const g = svg.append('g');

    g.append('g')
      .attr('transform', `translate(0,${margin.top + innerH})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d => `${((d as number) * 100).toFixed(0)}%`))
      .call(g => g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', '#334155'))
      .call(g => g.select('.domain').attr('stroke', '#334155'));

    g.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => `${((d as number) * 100).toFixed(0)}%`))
      .call(g => g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', '#334155'))
      .call(g => g.select('.domain').attr('stroke', '#334155'));

    g.selectAll('.grid-x')
      .data(xScale.ticks(6))
      .join('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', margin.top).attr('y2', margin.top + innerH)
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '2,3');

    g.selectAll('.grid-y')
      .data(yScale.ticks(6))
      .join('line')
      .attr('x1', margin.left).attr('x2', margin.left + innerW)
      .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '2,3');

    svg.append('text')
      .attr('x', margin.left + innerW / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', '12px')
      .text('Portfolio Risk (Volatility)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerH / 2)).attr('y', 14)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', '12px')
      .text('Expected Annual Return');

    // Capital Market Line
    const cmlEndVol = d3.max(allVols)! * 1.1;
    const cmlEndRet = riskFreeRate + tangency.sharpeRatio * cmlEndVol;
    g.append('line')
      .attr('x1', xScale(0)).attr('y1', yScale(riskFreeRate))
      .attr('x2', xScale(cmlEndVol)).attr('y2', yScale(cmlEndRet))
      .attr('stroke', '#10b981').attr('stroke-width', 1).attr('stroke-dasharray', '6,4').attr('opacity', 0.5);

    // Efficient Frontier curve
    const line = d3.line<PortfolioResult>()
      .x(d => xScale(d.volatility))
      .y(d => yScale(d.expectedReturn))
      .curve(d3.curveBasis);

    g.append('path')
      .datum(frontierData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('opacity', 0.9);

    // Individual assets
    const tooltip = d3.select(tooltipRef.current);

    assets.forEach(asset => {
      g.append('circle')
        .attr('cx', xScale(asset.volatility))
        .attr('cy', yScale(asset.expectedReturn))
        .attr('r', 5)
        .attr('fill', '#f59e0b')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event) {
          d3.select(this).attr('r', 7).attr('opacity', 1);
          tooltip.style('opacity', '1')
            .style('left', `${event.offsetX + 12}px`)
            .style('top', `${event.offsetY - 30}px`)
            .html(`<strong>${asset.name}</strong><br/>Return: ${(asset.expectedReturn * 100).toFixed(1)}%<br/>Risk: ${(asset.volatility * 100).toFixed(1)}%`);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 5).attr('opacity', 0.8);
          tooltip.style('opacity', '0');
        });

      if (chartWidth > 500) {
        g.append('text')
          .attr('x', xScale(asset.volatility) + 8)
          .attr('y', yScale(asset.expectedReturn) + 3)
          .attr('fill', '#94a3b8').attr('font-size', '9px')
          .attr('pointer-events', 'none')
          .text(asset.name);
      }
    });

    // Min variance portfolio
    g.append('circle')
      .attr('cx', xScale(minVariance.volatility))
      .attr('cy', yScale(minVariance.expectedReturn))
      .attr('r', 7).attr('fill', '#8b5cf6').attr('stroke', '#ffffff').attr('stroke-width', 2);

    // Tangency portfolio (max Sharpe)
    g.append('circle')
      .attr('cx', xScale(tangency.volatility))
      .attr('cy', yScale(tangency.expectedReturn))
      .attr('r', 8).attr('fill', '#10b981').attr('stroke', '#ffffff').attr('stroke-width', 2);

    // Selected portfolio
    if (selectedPortfolio) {
      g.append('circle')
        .attr('cx', xScale(selectedPortfolio.volatility))
        .attr('cy', yScale(selectedPortfolio.expectedReturn))
        .attr('r', 9).attr('fill', 'transparent').attr('stroke', '#ffffff').attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '4,2');
    }

    // Interactive frontier points
    g.selectAll('.frontier-hit')
      .data(frontierData)
      .join('circle')
      .attr('cx', d => xScale(d.volatility))
      .attr('cy', d => yScale(d.expectedReturn))
      .attr('r', 8)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', 'rgba(59,130,246,0.3)');
        tooltip.style('opacity', '1')
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 30}px`)
          .html(`Return: ${(d.expectedReturn * 100).toFixed(1)}%<br/>Risk: ${(d.volatility * 100).toFixed(1)}%<br/>Sharpe: ${d.sharpeRatio.toFixed(2)}`);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', 'transparent');
        tooltip.style('opacity', '0');
      })
      .on('click', (_, d) => onPortfolioSelect(d));

  }, [frontierData, tangency, minVariance, assets, riskFreeRate, selectedPortfolio, width, onPortfolioSelect]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity duration-150 bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-xs shadow-xl"
        style={{ whiteSpace: 'nowrap', zIndex: 20 }}
      />
      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3b82f6]" />Efficient Frontier</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10b981]" />Max Sharpe</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />Min Variance</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" />Individual Assets</span>
      </div>
    </div>
  );
}
