import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useBTCPrice } from "@/lib/btcPrice";
import { RefreshCw } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y" | "ALL";

function generateBTCHistory(spot: number, timeframe: Timeframe): { labels: string[]; prices: number[] } {
  const volatility: Record<Timeframe, number> = {
    "1D": 0.004, "1W": 0.008, "1M": 0.015, "3M": 0.02, "1Y": 0.025, "5Y": 0.04, "ALL": 0.05
  };
  const points: Record<Timeframe, number> = {
    "1D": 48, "1W": 84, "1M": 60, "3M": 90, "1Y": 52, "5Y": 60, "ALL": 72
  };
  const n = points[timeframe];
  const vol = volatility[timeframe];
  const prices: number[] = [];
  let p = spot * 0.85;
  for (let i = 0; i < n; i++) {
    p = p * (1 + (Math.random() - 0.48) * vol);
    prices.push(Math.max(p, 10000));
  }
  prices[prices.length - 1] = spot;

  const now = new Date();
  const labels: string[] = [];
  const intervals: Record<Timeframe, number> = {
    "1D": 30 * 60 * 1000, "1W": 2 * 60 * 60 * 1000, "1M": 12 * 60 * 60 * 1000,
    "3M": 36 * 60 * 60 * 1000, "1Y": 7 * 24 * 60 * 60 * 1000,
    "5Y": 30 * 24 * 60 * 60 * 1000, "ALL": 60 * 24 * 60 * 60 * 1000
  };
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * intervals[timeframe]);
    labels.push(timeframe === "1D"
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" })
    );
  }
  return { labels, prices: prices.reverse().slice(0, n) };
}

const STATS = [
  { label: "Today Open", value: "$93,010" },
  { label: "24hr High", value: "$94,890" },
  { label: "24hr Low", value: "$92,450" },
  { label: "Mkt Cap", value: "$1.86T" },
  { label: "7D Change", value: "+4.2%" },
  { label: "30D Change", value: "+12.8%" },
  { label: "YTD Change", value: "+32.1%" },
  { label: "ATH", value: "$108,786" },
];

export default function BTCChartPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const { price, change, changePercent, direction, isLoading, lastUpdated } = useBTCPrice();
  const [chartData, setChartData] = useState<{ labels: string[]; prices: number[] } | null>(null);

  useEffect(() => {
    if (price) setChartData(generateBTCHistory(price, timeframe));
  }, [price, timeframe]);

  const data = {
    labels: chartData?.labels ?? [],
    datasets: [
      {
        label: "BTC Price (USD)",
        data: chartData?.prices ?? [],
        borderColor: "#F7931A",
        backgroundColor: "rgba(247, 147, 26, 0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `$${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#666", maxTicksLimit: 8, font: { size: 11 } } },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#666",
          font: { size: 11 },
          callback: (v: any) => `$${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  } as any;

  const isPos = direction === "up";

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold text-orange-400">₿</span>
            <h1 className="text-2xl font-serif font-bold text-foreground">Bitcoin (BTC) Price</h1>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold font-mono text-foreground">
              {isLoading ? "..." : `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </span>
            <span className={`text-sm font-mono font-semibold ${isPos ? "text-green-400" : "text-red-400"}`}>
              {isPos ? "▲" : "▼"} ${Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({Math.abs(changePercent).toFixed(2)}%)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} EDT
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-1 flex-wrap">
            {(["1D","1W","1M","3M","1Y","5Y","ALL"] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  timeframe === tf ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        {chartData ? (
          <Line data={data} options={options} height={300} />
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground">Loading chart...</div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className={`text-lg font-mono font-bold ${s.value.startsWith("+") ? "text-green-400" : "text-foreground"}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* OTC CTA */}
      <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/20 border border-orange-400/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Ready to Buy Bitcoin?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Our OTC desk offers 0.20–10 BTC at competitive spreads with 24hr settlement.
          No exchange, no slippage, fully compliant.
        </p>
        <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
          <span>₿</span> Apply for OTC Account →
        </Link>
      </div>
    </div>
  );
}
