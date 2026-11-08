import React, { useState, useEffect } from "react";
import type {
  ExchangeTicker,
  ArbitrageOpportunity,
  AssetSymbol,
  ExchangeName,
} from "./types/crypto";

const EXCHANGES: ExchangeName[] = ["Binance", "Coinbase", "Kraken", "Bybit"];
const SYMBOLS: AssetSymbol[] = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];

const BASE_PRICES: Record<AssetSymbol, number> = {
  "BTC/USDT": 91500,
  "ETH/USDT": 3400,
  "SOL/USDT": 185,
};

export const App: React.FC = () => {
  const [tickers, setTickers] = useState<ExchangeTicker[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>(
    [],
  );
  const [selectedSymbol, setSelectedSymbol] = useState<AssetSymbol>("BTC/USDT");
  const [minSpread, setMinSpread] = useState<number>(0.15); // 0.15% threshold

  // Simulated WebSocket feed generator (updates every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const newTickers: ExchangeTicker[] = [];
      const now = new Date().toLocaleTimeString();

      SYMBOLS.forEach((symbol) => {
        const base = BASE_PRICES[symbol];
        EXCHANGES.forEach((exchange) => {
          // Add random jitter to simulate live exchange price discrepancies
          const jitter = (Math.random() - 0.5) * (base * 0.004);
          const price = Number((base + jitter).toFixed(2));
          const spreadOffset = price * 0.0005;

          newTickers.push({
            exchange,
            symbol,
            bid: Number((price - spreadOffset).toFixed(2)),
            ask: Number((price + spreadOffset).toFixed(2)),
            timestamp: now,
          });
        });
      });

      setTickers(newTickers);

      // Detect Arbitrage Opportunities for the selected symbol
      const symbolTickers = newTickers.filter(
        (t) => t.symbol === selectedSymbol,
      );
      const foundOpps: ArbitrageOpportunity[] = [];

      for (let i = 0; i < symbolTickers.length; i++) {
        for (let j = 0; j < symbolTickers.length; j++) {
          if (i === j) continue;
          const buyT = symbolTickers[i]; // Lowest ask
          const sellT = symbolTickers[j]; // Highest bid

          if (sellT.bid > buyT.ask) {
            const spread = ((sellT.bid - buyT.ask) / buyT.ask) * 100;
            if (spread >= minSpread) {
              foundOpps.push({
                id: `${buyT.exchange}-${sellT.exchange}-${Date.now()}`,
                symbol: selectedSymbol,
                buyExchange: buyT.exchange,
                buyPrice: buyT.ask,
                sellExchange: sellT.exchange,
                sellPrice: sellT.bid,
                spreadPercent: Number(spread.toFixed(3)),
                timestamp: now,
              });
            }
          }
        }
      }

      setOpportunities((prev) => [
        ...foundOpps.slice(0, 5),
        ...prev.slice(0, 15), // keep history bounded
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedSymbol, minSpread]);

  const currentTickers = tickers.filter((t) => t.symbol === selectedSymbol);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-lg shadow-emerald-950/50">
            ARB
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-wider uppercase">
              TS-CRYPTO // Arbitrage Terminal
            </h1>
            <p className="text-[10px] text-slate-400">
              SIMULATED WEBSOCKET FEED & SPREAD TRACKER
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>
            Feed:{" "}
            <strong className="text-emerald-400">Live WS Connected</strong>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Controls Bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Asset Pair:</span>
            {SYMBOLS.map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedSymbol === sym
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Min Profit Spread Threshold:
            </span>
            <select
              value={minSpread}
              onChange={(e) => setMinSpread(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
            >
              <option value={0.05}>0.05% (High Frequency)</option>
              <option value={0.15}>0.15% (Standard)</option>
              <option value={0.3}>0.30% (Conservative)</option>
            </select>
          </div>
        </div>

        {/* Order Book Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {EXCHANGES.map((exchange) => {
            const ticker = currentTickers.find((t) => t.exchange === exchange);
            return (
              <div
                key={exchange}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-200">
                    {exchange}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {ticker?.timestamp || "Connecting..."}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">
                      Best Bid
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ${ticker?.bid.toLocaleString() || "---"}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">
                      Best Ask
                    </span>
                    <span className="text-rose-400 font-bold">
                      ${ticker?.ask.toLocaleString() || "---"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Arbitrage Opportunities Feed */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Live Arbitrage Spread Alerts ({selectedSymbol})
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold">
              ● Scanning Order Books
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Buy Exchange (Ask)</th>
                  <th className="py-3 px-4">Sell Exchange (Bid)</th>
                  <th className="py-3 px-4">Spread Margin</th>
                  <th className="py-3 px-4 text-right">Actionable Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {opportunities.length > 0 ? (
                  opportunities.map((opp) => (
                    <tr
                      key={opp.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {opp.timestamp}
                      </td>
                      <td className="py-3 px-4 text-rose-400 font-bold">
                        {opp.buyExchange}{" "}
                        <span className="text-slate-300 font-normal">
                          (${opp.buyPrice.toLocaleString()})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {opp.sellExchange}{" "}
                        <span className="text-slate-300 font-normal">
                          (${opp.sellPrice.toLocaleString()})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">
                        +{opp.spreadPercent}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          Profitable Spread
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-500"
                    >
                      Waiting for arbitrage spread opportunities &gt;{" "}
                      {minSpread}%...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
