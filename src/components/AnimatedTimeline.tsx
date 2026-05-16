'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

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

interface AnimatedTimelineProps {
  data: AssetData[];
}

interface YearPoint {
  name: string;
  category: string;
  year: number;
  return: number;
  volatility: number;
  rank: number;
}

export default function AnimatedTimeline({ data }: AnimatedTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState(2014);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Store refs to scales/groups so update can use them without recreating
  const scalesRef = useRef<{
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    sizeScale: d3.ScalePower<number, number>;
    colorMap: Record<string, string>;
    width: number;
    height: number;
    margin: { top: number; right: number; bottom: number; left: number };
  } | null>(null);
  const setupDoneRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => setContainerWidth(entries[0].contentRect.width));
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Compute ranks per year
  const getRankedData = useCallback((year: number): YearPoint[] => {
    const yearPoints: YearPoint[] = [];
    data.forEach(asset => {
      const point = asset.timeline.find(d => d.year === year);
      if (point) {
        yearPoints.push({ name: asset.name, category: asset.category, ...point, rank: 0 });
      }
    });
    yearPoints.sort((a, b) => b.return - a.return);
    yearPoints.forEach((p, i) => { p.rank = i + 1; });
    return yearPoints;
  }, [data]);

  // Initial setup - only runs when container resizes or data changes
  useEffect(() => {
    if (!svgRef.current || containerWidth === 0 || data.length === 0) return;

    const width = Math.min(containerWidth, 920);
    const height = Math.min(width * 0.65, 580);
    const margin = { top: 50, right: 30, bottom: 70, left: 70 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Flatten all points for scale domains
    const allPoints = data.flatMap(d => d.timeline);
    const maxVol = d3.max(allPoints, d => d.volatility)! * 1.1;
    const minRet = d3.min(allPoints, d => d.return)!;
    const maxRet = d3.max(allPoints, d => d.return)!;
    const retPad = (maxRet - minRet) * 0.1;

    const xScale = d3.scaleLinear().domain([0, maxVol]).range([margin.left, margin.left + innerW]);
    const yScale = d3.scaleLinear().domain([Math.min(minRet - retPad, -0.6), Math.min(maxRet + retPad, 15)]).range([margin.top + innerH, margin.top]);
    const sizeScale = d3.scaleSqrt().domain([0, Math.min(d3.max(allPoints, d => Math.abs(d.return))!, 15)]).range([5, Math.min(width / 18, 42)]).clamp(true);
    const colorMap: Record<string, string> = { crypto: '#3b82f6', stocks: '#10b981', commodities: '#f59e0b' };

    scalesRef.current = { xScale, yScale, sizeScale, colorMap, width, height, margin };

    // Grid
    svg.selectAll('.grid-x')
      .data(xScale.ticks(6))
      .join('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', margin.top).attr('y2', margin.top + innerH)
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '2,4');

    svg.selectAll('.grid-y')
      .data(yScale.ticks(6))
      .join('line')
      .attr('x1', margin.left).attr('x2', margin.left + innerW)
      .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '2,4');

    // Zero line
    if (yScale.domain()[0] < 0 && yScale.domain()[1] > 0) {
      svg.append('line')
        .attr('class', 'zero-line')
        .attr('x1', margin.left).attr('x2', margin.left + innerW)
        .attr('y1', yScale(0)).attr('y2', yScale(0))
        .attr('stroke', '#475569').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
    }

    // Axes
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${margin.top + innerH})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d => `${((d as number) * 100).toFixed(0)}%`))
      .call(g => g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', '#334155'))
      .call(g => g.select('.domain').attr('stroke', '#334155'));

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(8).tickFormat(d => `${((d as number) * 100).toFixed(0)}%`))
      .call(g => g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', '#334155'))
      .call(g => g.select('.domain').attr('stroke', '#334155'));

    // Axis labels
    svg.append('text')
      .attr('x', margin.left + innerW / 2).attr('y', height - 10)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', '12px')
      .text('Annualized Volatility (Risk)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerH / 2)).attr('y', 14)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', '12px')
      .text('Annual Return');

    // Year watermark
    svg.append('text')
      .attr('class', 'year-watermark')
      .attr('x', margin.left + innerW - 10).attr('y', margin.top + 50)
      .attr('text-anchor', 'end')
      .attr('font-size', `${Math.min(width / 12, 72)}px`)
      .attr('font-weight', 'bold')
      .attr('fill', 'rgba(255,255,255,0.07)')
      .text(currentYear);

    // Create persistent groups for layered rendering
    svg.append('g').attr('class', 'trails-group');
    svg.append('g').attr('class', 'bubbles-group');
    svg.append('g').attr('class', 'labels-group');

    setupDoneRef.current = true;
  }, [containerWidth, data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update function - transitions bubbles smoothly when year/selectedAsset changes
  useEffect(() => {
    if (!svgRef.current || !scalesRef.current || !setupDoneRef.current) return;

    const svg = d3.select(svgRef.current);
    const { xScale, yScale, sizeScale, colorMap, width } = scalesRef.current;
    const tooltip = d3.select(tooltipRef.current);
    const duration = 1400 / playbackSpeed;

    const yearData = getRankedData(currentYear);

    // --- Year watermark with smooth counter ---
    const watermark = svg.select('.year-watermark');
    watermark
      .transition()
      .duration(duration)
      .ease(d3.easeQuadInOut)
      .tween('text', function () {
        const node = this as SVGTextElement;
        const oldVal = parseInt(node.textContent || '2014') || currentYear - 1;
        const interp = d3.interpolateNumber(oldVal, currentYear);
        return (t: number) => { node.textContent = String(Math.round(interp(t))); };
      });

    // --- Trail for selected asset ---
    const trailsGroup = svg.select('.trails-group');
    trailsGroup.selectAll('*').remove();

    if (selectedAsset) {
      const asset = data.find(d => d.name === selectedAsset);
      if (asset) {
        const trailData = asset.timeline.filter(d => d.year <= currentYear);
        if (trailData.length > 1) {
          const line = d3.line<DataPoint>()
            .x(d => xScale(d.volatility))
            .y(d => yScale(d.return))
            .curve(d3.curveCatmullRom);

          const path = trailsGroup.append('path')
            .datum(trailData)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', colorMap[asset.category])
            .attr('stroke-width', 2.5)
            .attr('opacity', 0.6);

          // Animate trail drawing
          const pathNode = path.node();
          if (pathNode) {
            const totalLength = pathNode.getTotalLength();
            path
              .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(duration * 1.2)
              .ease(d3.easeQuadOut)
              .attr('stroke-dashoffset', 0);
          }

          // Year dots on trail
          trailsGroup.selectAll('.trail-dot')
            .data(trailData)
            .join('circle')
            .attr('class', 'trail-dot')
            .attr('cx', d => xScale(d.volatility))
            .attr('cy', d => yScale(d.return))
            .attr('r', 3)
            .attr('fill', colorMap[asset.category])
            .attr('opacity', 0)
            .transition()
            .delay((_, i) => i * (duration / trailData.length))
            .duration(300)
            .attr('opacity', 0.6);

          // Year labels on trail (desktop only)
          if (width > 600) {
            trailsGroup.selectAll('.trail-year')
              .data(trailData.slice(0, -1))
              .join('text')
              .attr('class', 'trail-year')
              .attr('x', d => xScale(d.volatility) + 5)
              .attr('y', d => yScale(d.return) - 6)
              .attr('fill', '#64748b')
              .attr('font-size', '8px')
              .attr('opacity', 0)
              .text(d => d.year)
              .transition()
              .delay((_, i) => i * (duration / trailData.length))
              .duration(300)
              .attr('opacity', 0.7);
          }
        }
      }
    }

    // --- Bubbles with smooth transitions ---
    const bubblesGroup = svg.select('.bubbles-group');

    const bubbles = bubblesGroup.selectAll<SVGCircleElement, YearPoint>('.bubble')
      .data(yearData, (d) => d.name);

    // EXIT: shrink and fade out
    bubbles.exit()
      .transition()
      .duration(duration * 0.6)
      .ease(d3.easeCubicIn)
      .attr('r', 0)
      .attr('opacity', 0)
      .remove();

    // ENTER: appear from zero radius
    const enter = bubbles.enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(d.volatility))
      .attr('cy', d => yScale(d.return))
      .attr('r', 0)
      .attr('fill', d => colorMap[d.category])
      .attr('opacity', 0)
      .attr('stroke', 'rgba(255,255,255,0.5)')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    // ENTER + UPDATE: smooth transition to new positions
    const merged = enter.merge(bubbles);

    merged
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .interrupt('hover-out')
          .transition('hover-in')
          .duration(150)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
          .attr('stroke', '#ffffff');
        tooltip.style('opacity', '1')
          .style('left', `${event.offsetX + 15}px`)
          .style('top', `${event.offsetY - 10}px`)
          .html(`
            <div class="font-bold text-sm mb-1">${d.name}</div>
            <div class="text-xs space-y-0.5">
              <div>Return: <span class="${d.return >= 0 ? 'text-emerald-400' : 'text-red-400'}">${(d.return * 100).toFixed(1)}%</span></div>
              <div>Volatility: ${(d.volatility * 100).toFixed(1)}%</div>
              <div>Rank: #${d.rank} of ${yearData.length}</div>
            </div>
          `);
      })
      .on('mouseleave', function (_, d) {
        const opTarget = selectedAsset && selectedAsset !== d.name ? 0.25 : 0.8;
        d3.select(this)
          .interrupt('hover-in')
          .transition('hover-out')
          .duration(300)
          .attr('opacity', opTarget)
          .attr('stroke-width', selectedAsset === d.name ? 3 : 1.5)
          .attr('stroke', selectedAsset === d.name ? '#ffffff' : 'rgba(255,255,255,0.5)');
        tooltip.style('opacity', '0');
      })
      .on('click', (_, d) => {
        setSelectedAsset(prev => prev === d.name ? null : d.name);
      });

    // Animate positions, size, opacity with stagger
    merged
      .transition()
      .delay((_, i) => i * 15)
      .duration(duration)
      .ease(d3.easeCubicInOut)
      .attr('cx', d => xScale(d.volatility))
      .attr('cy', d => yScale(d.return))
      .attr('r', d => sizeScale(Math.abs(d.return)))
      .attr('fill', d => colorMap[d.category])
      .attr('opacity', d => selectedAsset && selectedAsset !== d.name ? 0.25 : 0.8)
      .attr('stroke', d => selectedAsset === d.name ? '#ffffff' : 'rgba(255,255,255,0.5)')
      .attr('stroke-width', d => selectedAsset === d.name ? 3 : 1.5);

    // --- Labels: top performers ---
    const labelsGroup = svg.select('.labels-group');
    const topN = width > 500 ? 3 : 1;
    const topPerformers = yearData.filter(d => d.rank <= topN);

    const labels = labelsGroup.selectAll<SVGTextElement, YearPoint>('.top-label')
      .data(topPerformers, d => d.name);

    labels.exit()
      .transition()
      .duration(duration * 0.4)
      .attr('opacity', 0)
      .remove();

    const labelsEnter = labels.enter()
      .append('text')
      .attr('class', 'top-label')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .attr('x', d => xScale(d.volatility) + sizeScale(Math.abs(d.return)) + 6)
      .attr('y', d => yScale(d.return) + 4);

    labelsEnter.merge(labels)
      .text(d => `#${d.rank} ${d.name}`)
      .transition()
      .delay(duration * 0.3)
      .duration(duration * 0.7)
      .ease(d3.easeCubicInOut)
      .attr('x', d => xScale(d.volatility) + sizeScale(Math.abs(d.return)) + 6)
      .attr('y', d => yScale(d.return) + 4)
      .attr('opacity', 1);

  }, [currentYear, selectedAsset, data, getRankedData, playbackSpeed]);

  // Playback loop - interval matches transition duration
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentYear(y => {
        if (y >= 2024) { setIsPlaying(false); return 2024; }
        return y + 1;
      });
    }, 1600 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  return (
    <div ref={containerRef} className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => { if (currentYear >= 2024) setCurrentYear(2014); setIsPlaying(!isPlaying); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          onClick={() => { setCurrentYear(2014); setIsPlaying(false); }}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
        >
          ⏮ Reset
        </button>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-gray-400">Speed:</span>
          {[1, 2, 4].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                playbackSpeed === speed ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {selectedAsset && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400">Tracking:</span>
            <span className="text-xs font-bold text-blue-300">{selectedAsset}</span>
            <button onClick={() => setSelectedAsset(null)} className="text-xs text-gray-500 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* Year scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 w-8">2014</span>
        <input
          type="range"
          min={2014}
          max={2024}
          value={currentYear}
          onChange={(e) => { setCurrentYear(parseInt(e.target.value)); setIsPlaying(false); }}
          className="flex-1 accent-blue-500"
        />
        <span className="text-xs text-gray-500 w-8">2024</span>
        <span className="text-xl font-bold text-white min-w-[50px] text-right">{currentYear}</span>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg ref={svgRef} className="w-full" />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none opacity-0 transition-opacity duration-150 bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-white text-xs shadow-xl"
          style={{ zIndex: 20, whiteSpace: 'nowrap' }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3b82f6]" />Crypto</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10b981]" />Stocks & ETFs</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" />Commodities</span>
        <span className="text-gray-600">|</span>
        <span>Bubble size = return magnitude</span>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Click any bubble to track its path over time. Bubble size reflects absolute return magnitude.
      </p>
    </div>
  );
}
