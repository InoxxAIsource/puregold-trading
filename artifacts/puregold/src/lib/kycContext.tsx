import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export const KYC_STATUS = {
  NOT_STARTED:  "not_started",
  IN_PROGRESS:  "in_progress",
  PENDING_REVIEW: "pending_review",
  APPROVED:     "approved",
  REJECTED:     "rejected",
  MORE_INFO:    "more_info_required",
} as const;

export type KYCStatus = typeof KYC_STATUS[keyof typeof KYC_STATUS];

interface KYCContextType {
  kycStatus: KYCStatus;
  setKYCStatus: (status: KYCStatus) => void;
  isApproved: boolean;
  kycApplicationId: string | null;
  setKYCApplicationId: (id: string) => void;
  refreshStatus: () => Promise<void>;
}

const KYCContext = createContext<KYCContextType>({
  kycStatus: KYC_STATUS.NOT_STARTED,
  setKYCStatus: () => {},
  isApproved: false,
  kycApplicationId: null,
  setKYCApplicationId: () => {},
  refreshStatus: async () => {},
});

function getUserEmail(): string | null {
  try {
    const stored = localStorage.getItem("pg_auth");
    if (stored) return JSON.parse(stored).email || null;
  } catch {}
  return null;
}

export function KYCProvider({ children }: { children: ReactNode }) {
  const [kycStatus, setKYCStatusState] = useState<KYCStatus>(() =>
    (localStorage.getItem("kyc_status") as KYCStatus) || KYC_STATUS.NOT_STARTED
  );
  const [kycApplicationId, setKYCApplicationIdState] = useState<string | null>(
    () => localStorage.getItem("kyc_application_id")
  );

  const setKYCStatus = useCallback((status: KYCStatus) => {
    localStorage.setItem("kyc_status", status);
    setKYCStatusState(status);
  }, []);

  const setKYCApplicationId = useCallback((id: string) => {
    localStorage.setItem("kyc_application_id", id);
    setKYCApplicationIdState(id);
  }, []);

  // Check server for latest KYC status
  const refreshStatus = useCallback(async () => {
    const email = getUserEmail();
    if (!email) return;
    try {
      const res = await fetch(`/api/kyc/status?email=${encodeURIComponent(email)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.status && data.status !== kycStatus) {
        setKYCStatus(data.status as KYCStatus);
        if (data.applicationId) setKYCApplicationId(data.applicationId);
        window.dispatchEvent(new Event("kycUpdated"));
      }
    } catch {}
  }, [kycStatus, setKYCStatus, setKYCApplicationId]);

  // On mount: always sync with server if user is logged in
  useEffect(() => {
    const email = getUserEmail();
    if (email) {
      refreshStatus();
    }
  }, []);

  // Poll every 45 seconds while pending
  useEffect(() => {
    if (kycStatus !== KYC_STATUS.PENDING_REVIEW) return;
    const interval = setInterval(refreshStatus, 45_000);
    return () => clearInterval(interval);
  }, [kycStatus, refreshStatus]);

  // Listen for manual kycUpdated events
  useEffect(() => {
    const handle = () => {
      const status = localStorage.getItem("kyc_status") as KYCStatus;
      if (status) setKYCStatusState(status);
    };
    window.addEventListener("kycUpdated", handle);
    return () => window.removeEventListener("kycUpdated", handle);
  }, []);

  return (
    <KYCContext.Provider value={{
      kycStatus,
      setKYCStatus,
      isApproved: kycStatus === KYC_STATUS.APPROVED,
      kycApplicationId,
      setKYCApplicationId,
      refreshStatus,
    }}>
      {children}
    </KYCContext.Provider>
  );
}

export function useKYC() {
  return useContext(KYCContext);
}
