import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export function PriceLockTimer({ minutes = 10, onExpire }: { minutes?: number, onExpire?: () => void }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarning = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded bg-card border ${isWarning ? 'border-destructive text-destructive' : 'border-border text-foreground'}`} data-testid="price-lock-timer">
      <Timer className={`h-4 w-4 ${isWarning ? 'animate-pulse' : ''}`} />
      <span>Price Lock:</span>
      <span className="font-bold">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
