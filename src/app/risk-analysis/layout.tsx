import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Risk Analysis - Professional Investment Metrics | AssetComparator',
  description: 'Analyze investments with institutional-grade risk metrics. Calculate Sharpe ratios, Sortino ratios, max drawdowns, VaR, beta, alpha, and correlation matrices for crypto and traditional assets.',
  keywords: 'investment risk analysis, sharpe ratio calculator, portfolio risk metrics, volatility analysis, max drawdown, VaR calculator, beta alpha analysis, correlation matrix',
  openGraph: {
    title: 'Professional Investment Risk Analysis Tools',
    description: 'Advanced risk metrics for Bitcoin, Ethereum, S&P 500, Gold, and more',
    url: 'https://assetcomparator.com/risk-analysis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Investment Risk Analysis',
    description: 'Calculate Sharpe ratios, max drawdowns, and correlation matrices',
  },
}

export default function RiskAnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}