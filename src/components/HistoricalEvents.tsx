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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [lockedEvent, setLockedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

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
      if (target.closest('[data-event-dot]')) return;
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
  const shouldRender = visible && dims.width > 0 && filtered.length > 0;

  const activeEvent = lockedEvent || hoveredEvent;
  const activeData = activeEvent ? filtered.find(e => e.date === activeEvent) : null;
  const activeXPos = activeData ? getXPos(activeData.year) : 0;

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
      {/* SVG for dashed lines only */}
      <svg
        width={dims.width}
        height={dims.height}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
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
            <svg width={r * 2 + 6} height={r * 2 + 6} style={{ overflow: 'visible', flexShrink: 0 }}>
              {isLocked && (
                <circle
                  cx={r + 3} cy={r + 3} r={r + 3}
                  fill="transparent"
                  stroke={event.color}
                  strokeWidth={1.5}
                  opacity={0.4}
                />
              )}
              <circle
                cx={r + 3} cy={r + 3} r={r}
                fill={event.color}
                stroke="#ffffff"
                strokeWidth={isLocked ? 3 : 2}
                opacity={isActive ? 1 : 0.9}
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
            top: dotY + 26,
            transform: tooltipTransform,
            maxWidth: '320px',
            minWidth: '260px',
            zIndex: 200,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            pointerEvents: lockedEvent ? 'auto' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff' }}>{activeData.label}</span>
            <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '12px', whiteSpace: 'nowrap' }}>{formatDate(activeData.date)}</span>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#cbd5e1', marginBottom: '10px' }}>{activeData.description}</div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 10px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Market Impact
              <span style={{ color: IMPACT_COLORS[activeData.impact], fontSize: '11px' }}>
                {IMPACT_ICONS[activeData.impact]} {IMPACT_LABELS[activeData.impact]}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>{activeData.marketImpact}</div>
          </div>
        </div>
      )}
      </>}
    </div>
  );
}
