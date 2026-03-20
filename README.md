# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
|Nicholas Brandstätter |330394 |
|Marko Djuric |330515 |
|Toufan Kashaev |347341 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (20th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

This project is an interactive investment comparator visualizing 2014–2024 performance, volatility, and correlations across cryptocurrencies (Bitcoin, Ethereum, Solana) and traditional assets (S&P 500, NASDAQ-100/QQQ, Russell 2000/IWM, Gold, Silver, WTI Oil, US Real Estate via Case-Shiller). It uses four clean, public datasets from Kaggle and official sources, drawing from Yahoo Finance (stocks/ETFs), CoinMarketCap & CoinGecko (crypto), Macrotrends.net & Kitco (gold/silver), EIA (WTI Oil), LBMA/COMEX (metals), and FRED (housing). Preprocessing is minimal: date parsing, year-end extraction, merging, and return/volatility calculations in pandas.
Cryptocurrency Historical Prices by sudalairajkumar (Kaggle): daily closes for BTC (2013+), ETH (2015+), Solana. → Year-end prices, performance %, volatility; line charts. Very clean; filter years only.
30-yrs Stock Market Data by asimislam (Kaggle): daily adjusted closes for S&P 500, QQQ, IWM from Yahoo Finance. → Return visualizations and multi-asset comparisons. Minor date/column cleanup.
Bitcoin, Gold, Oil, S&P 500 by prasertk + Gold and Silver Prices by lbronchal (Kaggle): Gold, Silver, WTI Oil from EIA, LBMA/COMEX, Yahoo Finance. → Volatility heatmaps, inflation-hedge dashboards. Date-merge required.
Case-Shiller Home Price Index (CSUSHPINSA) from FRED: monthly housing index. → Real-estate cycle charts vs. crypto volatility. Slice December values.
These datasets enable EDA and visualizations (matplotlib/seaborn, Streamlit) with no scraping and high accuracy from primary sources.

### Problematic

This project analyzes and compares different asset classes over 2014–2024, focusing on cryptocurrencies (Bitcoin, Ethereum, Solana) versus traditional investments (S&P 500, NASDAQ-100, Russell 2000, Gold, Silver, WTI Oil, and US real estate via Case-Shiller).
What am I trying to show?
The main axis is the risk-return profile and diversification potential of these assets: how do cryptocurrencies deliver dramatically higher but far more volatile returns compared to traditional assets? What patterns emerge during market cycles (crypto booms/busts vs. stable stock/real estate growth), and how do assets behave as inflation hedges during economic uncertainty? Through interactive visualizations (line charts, bar charts, heatmaps, scatter plots), I aim to reveal whether crypto acts as a true alternative asset class or simply amplifies risk.
Overview, motivation, and target audience
This project builds an educational investment comparator letting users explore historical data to understand asset class behaviors. My motivation stems from the growing interest in crypto among retail investors and the need for clear, data-driven comparisons to counter hype or fear. The target audience includes students, beginner investors, and finance enthusiasts seeking accessible insights without deep financial knowledge. Built in Python with Streamlit, matplotlib, and seaborn, the tool will be interactive, letting users select time periods, assets, and metrics to answer: "Is crypto worth the risk compared to gold, stocks, and real estate?"

### Exploratory Data Analysis

**Preprocessing.** Raw daily/monthly prices from four Kaggle datasets and FRED were reduced to year-end closing values (2014–2024), producing an 11×22 matrix (11 years, 22 asset columns). Each asset was normalized to base 100 at its start year. A key finding: only 9 assets (BTC, ETH, S&P 500, NASDAQ, Russell 2000, Gold, Silver, WTI Oil, Real Estate) have full 2014–2024 coverage. Solana and Avalanche are `undefined` before 2020, while 10 other assets (Cardano, Polygon, Chainlink, FTSE 100, Nikkei, DAX, Copper, Natural Gas, QQQ, VTI) are padded with the constant value 100 before 2020 — effectively masking their absence. This two-tier completeness (full vs. 2020-only) must be accounted for in any cross-asset analysis.

**Basic Statistics.** Across the 9 fully-tracked assets, cumulative returns range from +31.8% (WTI Oil) to +29,637% (Bitcoin), spanning three orders of magnitude. Mean cumulative return by category: crypto 37,887% (σ=11,620), traditional 167% (σ=139), commodities 99% (σ=75). Reported volatilities confirm this: crypto 50–55%, traditional 5–19%, commodities 18–25%. The dataset contains 12 `undefined` cells (Solana/Avalanche pre-2020) and 60 constant-100 cells for the late-entry assets — together 33% of the matrix carries no real signal. Monthly return data (available 2020–2024 in the risk-analysis module) provides 60 observations per asset for finer-grained Sharpe/Sortino ratio computation.

**Insights.** The 2017 crypto boom (BTC +1,363% YoY), 2018 crash (BTC −74%), 2020 COVID rebound, and 2021–2022 bull/bear cycle are clearly visible. Traditional assets show consistent growth with moderate drawdowns (S&P 500 worst year: −19% in 2022). Gold decorrelated from equities post-2020, rising 77% while BTC fell 64% in 2022 — suggesting genuine diversification value. The extreme return dispersion across categories validates the project's core question: is crypto worth the added risk?

### Related work


**What others have already done with the data?**
The datasets used have been widely explored in finance and data communities. On Kaggle, many notebooks visualize Bitcoin price evolution, crypto trends, or simple BTC vs. Gold/S&P 500 comparisons (line charts, correlation heatmaps, volatility clustering). Sites like CoinMarketCap, TradingView, and Yahoo Finance offer built-in historical charts. Macrotrends.net publishes long-term gold/oil/stock charts, and academic papers (SSRN, arXiv) analyze crypto as an asset class using FRED or EIA data.

**Why is my approach original?**
Existing work often focuses on single assets or narrow comparisons. My project creates an interactive, multi-asset comparator letting users dynamically select any combination of 10+ assets (crypto, stocks, commodities, real estate) across 2014–2024. It emphasizes visual storytelling of risk-return trade-offs and diversification through unified dashboards (normalized growth lines, annual performance bars, correlation heatmaps, Sharpe ratio scatter plots). This holistic, user-driven view is more educational and accessible than static notebooks or blog posts.

**Sources of inspiration.**
Portfolio Visualizer (interactive backtesting), TradingView correlation tools, NYT/FT interactive graphics, CoinGecko/Messari dashboards, and Tableau Public finance galleries influenced the interactive filtering, normalized price lines starting from 100, and asset color-coding.

**Previous exploration.**
I have not previously explored these datasets in another course (ML, ADA, or semester project). This is a new project built specifically for this visualization milestone.

## Milestone 2 (17th April, 5pm)

**10% of the final grade**


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

