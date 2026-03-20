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

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (17th April, 5pm)

**10% of the final grade**


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

