# TypeScript Crypto Arbitrage Tracker (`ts-crypto-arbitrage`)

A real-time cryptocurrency exchange arbitrage tracker and market spread dashboard built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Simulated WebSocket Ticker Feed:** Generates dynamic live price jitter across mock exchanges (Binance, Coinbase, Kraken, Bybit).
- **Automated Arbitrage Detection:** Scans order books in real time to locate buy-low / sell-higher price discrepancies.
- **Strict TypeScript Types:** Fully typed interfaces for tickers, exchange pairs, and spread opportunities.
- **Tailwind CSS Terminal UI:** Dark-mode responsive dashboard designed for high-frequency trading clarity.

## Setup & Running

1. Clone repository & install dependencies:
   ```bash
   cd ts-crypto-arbitrage
   npm install
   ```
