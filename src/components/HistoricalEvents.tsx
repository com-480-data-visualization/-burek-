'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

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

interface ImpactZone {
  eventDate: string;
  startYear: number;
  endYear: number;
  color: string;
  opacity: number;
  description: string;
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

const IMPACT_ZONES: ImpactZone[] = [
  { eventDate: '2017-12-17', startYear: 2017.67, endYear: 2018.04, color: '#10b981', opacity: 0.08, description: 'ICO Mania Period' },
  { eventDate: '2020-03-23', startYear: 2020.13, endYear: 2020.27, color: '#ef4444', opacity: 0.12, description: 'COVID-19 Market Crash' },
  { eventDate: '2021-11-10', startYear: 2021.67, endYear: 2022.0, color: '#10b981', opacity: 0.07, description: 'Crypto Bull Run Peak' },
  { eventDate: '2022-05-09', startYear: 2022.34, endYear: 2022.46, color: '#ef4444', opacity: 0.13, description: 'Terra/Luna & 3AC Contagion' },
  { eventDate: '2024-04-20', startYear: 2024.17, endYear: 2024.42, color: '#3b82f6', opacity: 0.06, description: 'Halving Anticipation Period' },
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [lockedEvent, setLockedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [showZones, setShowZones] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setLockedEvent(null);
      setHoveredEvent(null);
    }
  }, [visible, selectedPeriod]);

  useEffect(() => {
    if (!lockedEvent) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-event-dot]') || target.closest('[data-zone-toggle]')) return;
      setLockedEvent(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [lockedEvent]);

  const startYear = selectedPeriod === '1y' ? 2023 : selectedPeriod === '5y' ? 2019 : 2014;
  const endYear = 2024;
  const margin = { left: 65, right: 30 };

  const getXPos = useCallback((year: number) => {
    if (dims.width === 0) return 0;
    const chartW = dims.width - margin.left - margin.right;
    return margin.left + ((year - startYear) / (endYear - startYear)) * chartW;
  }, [dims.width, startYear]);

  const filtered = EVENTS.filter(e => e.year >= startYear && e.year <= endYear);
  const filteredZones = IMPACT_ZONES.filter(z => z.endYear >= startYear && z.startYear <= endYear);
  const shouldRender = visible && dims.width > 0 && filtered.length > 0;

  const activeEvent = lockedEvent || hoveredEvent;
  const activeData = activeEvent ? filtered.find(e => e.date === activeEvent) : null;
  const activeXPos = activeData ? getXPos(activeData.year) : 0;
  const activeZone = activeData ? IMPACT_ZONES.find(z => z.eventDate === activeData.date) : null;

  const dotY = 10;

  let tooltipLeft = activeXPos;
  let tooltipTransform = 'translateX(-50%)';
  if (activeXPos < 180) {
    tooltipLeft = activeXPos - 6;
    tooltipTransform = 'translateX(0)';
  } else if (activeXPos > dims.width - 180) {
    tooltipLeft = activeXPos + 6;
    tooltipTransform = 'translateX(-100%)';
  }

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 10, pointerEvents: 'none' }}>
      {!shouldRender ? null : <>
      {/* Zone toggle button */}
      <div
        data-zone-toggle
        style={{
          position: 'absolute',
          top: 4,
          right: 8,
          pointerEvents: 'auto',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => setShowZones(prev => !prev)}
          className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
            showZones
              ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
              : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
          }`}
        >
          {showZones ? 'Zones On' : 'Zones Off'}
        </button>
      </div>

      {/* SVG for impact zones, lines, and crosshair */}
      <svg
        width={dims.width}
        height={dims.height}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        {/* Impact zones (colored rectangles) */}
        {showZones && filteredZones.map(zone => {
          const x1 = getXPos(Math.max(zone.startYear, startYear));
          const x2 = getXPos(Math.min(zone.endYear, endYear));
          const w = x2 - x1;
          if (w < 3) return null;

          const isRelatedToActive = activeData && zone.eventDate === activeData.date;

          return (
            <g key={zone.eventDate + '-zone'}>
              <rect
                x={x1}
                y={dotY + 12}
                width={w}
                height={dims.height - dotY - 42}
                fill={zone.color}
                opacity={isRelatedToActive ? zone.opacity * 2.5 : zone.opacity}
                rx={3}
                style={{ transition: 'opacity 0.3s ease' }}
              />
              {/* Zone label at top (only if wide enough) */}
              {w > 60 && (
                <text
                  x={x1 + w / 2}
                  y={dotY + 26}
                  textAnchor="middle"
                  fill={zone.color}
                  fontSize="9px"
                  fontWeight="bold"
                  opacity={isRelatedToActive ? 0.9 : 0.5}
                  style={{ transition: 'opacity 0.3s ease', pointerEvents: 'none' }}
                >
                  {zone.description}
                </text>
              )}
            </g>
          );
        })}

        {/* Vertical dashed lines */}
        {filtered.map(event => {
          const xPos = getXPos(event.year);
          return (
            <line
              key={event.date}
              x1={xPos} x2={xPos}
              y1={dotY + 8} y2={dims.height - 30}
              stroke={event.color}
              strokeWidth={1.5}
              strokeDasharray="5,5"
              opacity={0.35}
            />
          );
        })}

        {/* Crosshair (full-height solid line on hover) */}
        {activeData && (
          <line
            x1={activeXPos} x2={activeXPos}
            y1={0} y2={dims.height}
            stroke={activeData.color}
            strokeWidth={1}
            strokeDasharray="3,3"
            opacity={0.6}
            style={{ transition: 'opacity 0.15s ease' }}
          />
        )}
      </svg>

      {/* React DOM dots + labels (reliable pointer events) */}
      {filtered.map(event => {
        const xPos = getXPos(event.year);
        const isLocked = lockedEvent === event.date;
        const isHovered = hoveredEvent === event.date;
        const isActive = isLocked || isHovered;
        const r = isLocked ? 9 : isActive ? 8 : 6;

        return (
          <div
            key={event.date}
            data-event-dot
            style={{
              position: 'absolute',
              left: xPos,
              top: dotY,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (lockedEvent === event.date) {
                setLockedEvent(null);
              } else {
                setLockedEvent(event.date);
              }
            }}
            onMouseEnter={() => {
              if (!lockedEvent) setHoveredEvent(event.date);
            }}
            onMouseLeave={() => {
              if (!lockedEvent) setHoveredEvent(null);
            }}
          >
            {/* Pulse ring (CSS animation) */}
            <svg width={r * 2 + 10} height={r * 2 + 10} style={{ overflow: 'visible', flexShrink: 0 }}>
              {showZones && IMPACT_ZONES.some(z => z.eventDate === event.date) && (
                <circle
                  cx={r + 5} cy={r + 5} r={r + 4}
                  fill="transparent"
                  stroke={event.color}
                  strokeWidth={1}
                  opacity={0.4}
                  className="animate-ping"
                  style={{ transformOrigin: `${r + 5}px ${r + 5}px`, animationDuration: '2.5s' }}
                />
              )}
              {isLocked && (
                <circle
                  cx={r + 5} cy={r + 5} r={r + 3}
                  fill="transparent"
                  stroke={event.color}
                  strokeWidth={1.5}
                  opacity={0.4}
                />
              )}
              <circle
                cx={r + 5} cy={r + 5} r={r}
                fill={event.color}
                stroke="#ffffff"
                strokeWidth={isLocked ? 3 : 2}
                opacity={isActive ? 1 : 0.9}
                style={{ transition: 'r 0.2s ease, opacity 0.2s ease' }}
              />
            </svg>

            {dims.width > 640 && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#ffffff',
                  background: 'rgba(0,0,0,0.75)',
                  border: `0.5px solid ${event.color}`,
                  borderRadius: '4px',
                  padding: '2px 6px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'auto',
                }}
              >
                {event.shortLabel}
              </span>
            )}
          </div>
        );
      })}

      {/* Tooltip */}
      {activeData && (
        <div
          style={{
            position: 'absolute',
            left: tooltipLeft,
            top: dotY + 30,
            transform: tooltipTransform,
            maxWidth: '340px',
            minWidth: '270px',
            zIndex: 200,
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px 16px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
            pointerEvents: lockedEvent ? 'auto' : 'none',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', marginBottom: '8px', borderBottom: `2px solid ${activeData.color}` }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>{activeData.label}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '12px', whiteSpace: 'nowrap' }}>{formatDate(activeData.date)}</span>
          </div>

          {/* Description */}
          <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#cbd5e1', marginBottom: '10px' }}>{activeData.description}</div>

          {/* Market Impact */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '6px', marginBottom: activeZone ? '10px' : '0' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Market Impact
              <span style={{ color: IMPACT_COLORS[activeData.impact], fontSize: '11px', fontWeight: 600 }}>
                {IMPACT_ICONS[activeData.impact]} {IMPACT_LABELS[activeData.impact]}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.55 }}>{activeData.marketImpact}</div>
          </div>

          {/* Impact Period (if zone exists) */}
          {activeZone && (
            <div style={{
              background: `${activeZone.color}10`,
              padding: '8px 10px',
              borderRadius: '6px',
              borderLeft: `3px solid ${activeZone.color}`,
            }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px' }}>Impact Period</div>
              <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: 500 }}>{activeZone.description}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
                {Math.round((activeZone.endYear - activeZone.startYear) * 12)} months duration
              </div>
            </div>
          )}

          {/* Click hint */}
          {!lockedEvent && (
            <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '8px', textAlign: 'center' }}>
              Click to pin this tooltip
            </div>
          )}
        </div>
      )}

      {/* Impact zones legend */}
      {showZones && dims.width > 500 && (
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            left: margin.left,
            display: 'flex',
            gap: '12px',
            pointerEvents: 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#64748b' }}>
            <span style={{ width: 10, height: 10, background: '#10b981', opacity: 0.3, borderRadius: 2, display: 'inline-block' }} />
            Bullish
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#64748b' }}>
            <span style={{ width: 10, height: 10, background: '#ef4444', opacity: 0.3, borderRadius: 2, display: 'inline-block' }} />
            Bearish
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#64748b' }}>
            <span style={{ width: 10, height: 10, background: '#3b82f6', opacity: 0.3, borderRadius: 2, display: 'inline-block' }} />
            Neutral
          </span>
        </div>
      )}
      </>}
    </div>
  );
}
