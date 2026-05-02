import { Link } from "wouter";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";

interface KYCStatusBadgeProps {
  showCTA?: boolean;
  compact?: boolean;
}

export function KYCStatusBadge({ showCTA = false, compact = false }: KYCStatusBadgeProps) {
  const { kycStatus } = useKYC();

  const configs = {
    [KYC_STATUS.NOT_STARTED]: {
      dot: "bg-red-500", label: "KYC Required",
      text: "Complete KYC to buy BTC", cta: "Complete KYC Now →", href: "/account/kyc"
    },
    [KYC_STATUS.IN_PROGRESS]: {
      dot: "bg-orange-500", label: "KYC In Progress",
      text: "Continue your application", cta: "Continue KYC →", href: "/account/kyc"
    },
    [KYC_STATUS.PENDING_REVIEW]: {
      dot: "bg-yellow-500", label: "KYC Under Review",
      text: "1–2 business days for approval", cta: null, href: null
    },
    [KYC_STATUS.APPROVED]: {
      dot: "bg-green-500", label: "KYC Verified ✓",
      text: "Bitcoin OTC unlocked", cta: "Apply to Buy Bitcoin →", href: "/bitcoin-otc/apply"
    },
    [KYC_STATUS.REJECTED]: {
      dot: "bg-red-500", label: "KYC Rejected",
      text: "Contact us for assistance", cta: "View Details →", href: "/account/kyc"
    },
    [KYC_STATUS.MORE_INFO]: {
      dot: "bg-orange-500", label: "Action Required",
      text: "Additional documents needed", cta: "Provide Documents →", href: "/account/kyc"
    },
  };

  const cfg = configs[kycStatus] ?? configs[KYC_STATUS.NOT_STARTED];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
        <span className="text-xs font-medium text-muted-foreground">{cfg.label}</span>
      </span>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${kycStatus === KYC_STATUS.APPROVED ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-card'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${cfg.dot}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
            <p className="text-xs text-muted-foreground">{cfg.text}</p>
          </div>
        </div>
        {showCTA && cfg.cta && cfg.href && (
          <Link href={cfg.href} className="shrink-0 text-xs font-medium text-primary hover:underline whitespace-nowrap">
            {cfg.cta}
          </Link>
        )}
      </div>
    </div>
  );
}
