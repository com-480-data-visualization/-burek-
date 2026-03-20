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

This project is an interactive investment comparator visualizing from 2014 to 2024, the performance, volatility, and correlations across cryptocurrencies (Bitcoin, Ethereum, Solana) and traditional assets (S&P 500, NASDAQ-100/QQQ, Russell 2000/IWM, Gold, Silver, WTI Oil, US Real Estate via Case-Shiller). It uses four clean, public datasets from Kaggle and official sources, drawing from Yahoo Finance (stocks/ETFs), CoinMarketCap & CoinGecko (crypto), Macrotrends.net & Kitco (gold/silver), EIA (WTI Oil), LBMA/COMEX (metals), and FRED (housing). Preprocessing is minimal: date parsing, year-end extraction, merging, and return/volatility calculations in pandas.

#### Dataset Breakdown

* **Cryptocurrency Historical Prices** *by sudalairajkumar (Kaggle)*: 
  Daily closes for BTC (2013+), ETH (2015+), Solana.
  > **Visualization goal**: Year-end prices, performance (%), volatility and line charts.
  >
  > **Data status**: Very clean, filter years only.

* **30-yrs Stock Market Data** *by asimislam (Kaggle)*: 
  Daily adjusted closes for S&P 500, QQQ, IWM from Yahoo Finance.
  > **Visualization goal**: Multi-asset comparisons.
  >
  > **Data status**: Minor date/column cleanup.

* **Bitcoin, Gold, Oil, S&P 500** *by prasertk*, **Gold and Silver Prices** *by lbronchal (Kaggle)*: 
  Gold, Silver, WTI Oil from EIA, LBMA/COMEX, Yahoo Finance.
  > **Visualization goal**: Volatility heatmaps, inflation-hedge dashboards.
  >
  > **Data status**: Date-merge required.

* **Case-Shiller Home Price Index (CSUSHPINSA)** *from FRED*: 
  Monthly housing index.
  > **Visualization goal**: Real-estate cycle charts vs crypto volatility.
  >
  > **Data status**: Slice December values.

These datasets enable EDA and visualizations (matplotlib/seaborn, Streamlit) with no scraping and high accuracy from primary sources.

### Problematic

This project analyzes and compares different asset classes over 2014–2024, focusing on cryptocurrencies (Bitcoin, Ethereum, Solana) versus traditional investments (S&P 500, NASDAQ-100, Russell 2000, Gold, Silver, WTI Oil, and US real estate via Case-Shiller).
What are we trying to show?
The main axis is the risk-return profile and diversification potential of these assets: how do cryptocurrencies deliver dramatically higher but far more volatile returns compared to traditional assets? What patterns emerge during market cycles (crypto booms/busts vs. stable stock/real estate growth), and how do assets behave as inflation hedges during economic uncertainty? Through interactive visualizations (line charts, bar charts, heatmaps, scatter plots), We aim to reveal whether crypto acts as a true alternative asset class or simply amplifies risk.
We want this project to build an educational investment comparator letting users explore historical data to understand asset class behaviors. Our motivation stems from the growing interest in crypto among retail investors and the need for clear, data-driven comparisons to counter hype or fear. The target audience includes students, beginner investors, and finance enthusiasts seeking accessible insights without deep financial knowledge. Built in Python with Streamlit, matplotlib, and seaborn, the tool will be interactive, letting users select time periods, assets, and metrics to answer: "Is crypto worth the risk compared to gold, stocks, and real estate?"

### Exploratory Data Analysis

> The full analysis is in our Jupyter notebook [`eda.ipynb`](eda.ipynb), which contains all the code, computed statistics, and generated visualizations ([`correlation_matrix.png`](correlation_matrix.png), [`risk_return_scatter.png`](risk_return_scatter.png), [`growth_by_category.png`](growth_by_category.png)). Below is a summary of the key findings.

**Preprocessing.** Raw daily/monthly prices from four Kaggle datasets and FRED were reduced to year-end closing values (2014–2024), producing a dataframe of 11 rows x 10 assets. Each series was normalized to base 100 at launch. Solana has 6 missing values (2014–2019, `NaN`); all other assets have full coverage. Total missing: 6/110 cells (5.5%).

**Basic Statistics (computed via pandas).** Mean annual returns by category: Crypto +1,163% (std 2,074), Traditional +11.8% (std 15.4), Commodities +8.9% (std 23.2). Best single-year returns: Solana +11,189% (2021), Bitcoin +1,362% (2017), Ethereum +825% (2017). Worst: Solana −94% (2022), Ethereum −82% (2018), Bitcoin −74% (2018). Traditional worst: all in 2022 (S&P −19%, NASDAQ −34%, Russell −22%). Real Estate never had a negative year (min +3.9%). Correlation analysis shows BTC-ETH are strongly correlated (r = 0.69), stock indices cluster tightly (S&P/NASDAQ/Russell r = 0.82–0.89), while Gold-Silver (r = 0.70) form a separate group. Crypto to stocks correlation is moderate (r = 0.28–0.56).

**Insights.** The risk-return scatter plot reveals three distinct clusters confirming the category taxonomy. Crypto assets are extreme outliers in both return and volatility. Gold's best year was 2024 (+62%), decorrelating from equities that fell in 2022, suggesting hedging value. Real Estate shows the lowest std (3.8%) with steady positive returns, acting as a volatility anchor.

### Related work

**What others have already done with the data ?**
The datasets used have been widely explored in finance and data communities. On Kaggle, many notebooks visualize Bitcoin price evolution, crypto trends, or simple BTC vs. Gold/S&P 500 comparisons (line charts, correlation heatmaps, volatility clustering). Sites like CoinMarketCap, TradingView, and Yahoo Finance offer built-in historical charts. Macrotrends.net publishes long-term gold/oil/stock charts, and academic papers (SSRN, arXiv) analyze crypto as an asset class using FRED or EIA data.

**Why is our approach original ?**
Existing work often focuses on single assets or narrow comparisons. Our project will create an interactive, multi-asset comparator letting users dynamically select any combination of 10+ assets (crypto, stocks, commodities, real estate) across the period 2014–2024. It emphasizes visual storytelling of risk-return trade-offs and diversification through unified dashboards : normalized growth lines, annual performance bars, correlation heatmaps or Sharpe ratio scatter plots. This holistic, user-driven view is more educational and accessible than static notebooks or blog posts.

**Sources of inspiration :**
Portfolio Visualizer (interactive backtesting), TradingView correlation tools, NYT/FT interactive graphics, CoinGecko/Messari dashboards, and Tableau Public finance galleries influenced the interactive filtering, normalized price lines starting from 100, and asset color-coding.

**Previous exploration :**
We have not previously explored these datasets in another course (ML, ADA, or semester project). This is a new project built specifically for this visualization milestone.

## Milestone 2 (17th April, 5pm)

**10% of the final grade**


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

