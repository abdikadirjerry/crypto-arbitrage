export type ExchangeName = "Binance" | "Coinbase" | "Kraken" | "Bybit";

export type AssetSymbol = "BTC/USDT" | "ETH/USDT" | "SOL/USDT";

export interface ExchangeTicker {
  exchange: ExchangeName;
  symbol: AssetSymbol;
  bid: number;
  ask: number;
  timestamp: string;
}

export interface ArbitrageOpportunity {
  id: string;
  symbol: AssetSymbol;
  buyExchange: ExchangeName;
  buyPrice: number;
  sellExchange: ExchangeName;
  sellPrice: number;
  spreadPercent: number;
  timestamp: string;
}
