import { useState } from "react";
import { useRoute } from "wouter";
import { useGetPriceHistory } from "@workspace/api-client-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Title } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Skeleton } from "@/components/ui/skeleton";
import type { GetPriceHistoryTimeframe } from "@workspace/api-client-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Title);

export default function MetalChartPage() {
  const [, params] = useRoute("/charts/:metal");
  const metal = params?.metal as "gold" | "silver" | "platinum" | "palladium" | "copper" | "bitcoin" || "gold";
  
  const [timeframe, setTimeframe] = useState<GetPriceHistoryTimeframe>("1y");
  
  const { data, isLoading } = useGetPriceHistory(metal, { timeframe }, {
    query: {
      enabled: !!metal,
      queryKey: ['/api/prices/history', metal, timeframe]
    }
  });

  const chartData = {
    labels: data?.data.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: `${metal.charAt(0).toUpperCase() + metal.slice(1)} Price`,
        data: data?.data.map(d => d.price) || [],
        fill: true,
        backgroundColor: 'rgba(201, 168, 76, 0.1)',
        borderColor: '#C9A84C',
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#111111',
        titleColor: '#F5F5F0',
        bodyColor: '#C9A84C',
        borderColor: '#594A22',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, color: '#333333' },
        ticks: { maxTicksLimit: 8, color: '#8A8A8E' }
      },
      y: {
        grid: { color: '#222222' },
        ticks: {
          color: '#8A8A8E',
          callback: function(value: any) {
            return '$' + value;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold text-foreground capitalize mb-2">{metal} Price Chart</h1>
      <p className="text-muted-foreground mb-8">Live and historical spot price for {metal}.</p>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Current Price</div>
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <div className="text-3xl font-mono font-bold text-primary">
                ${data?.currentPrice?.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            )}
          </div>
          
          <div className="flex bg-background border border-border rounded-md p-1 overflow-x-auto">
            {['1d', '1w', '1m', '3m', '1y', '5y', 'all'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as GetPriceHistoryTimeframe)}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors uppercase ${
                  timeframe === tf ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}
