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

export interface WireInfo {
  wireDeadline: string | null;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  bankAddress: string | null;
}

interface KYCContextType {
  kycStatus: KYCStatus;
  setKYCStatus: (status: KYCStatus) => void;
  isApproved: boolean;
  kycApplicationId: string | null;
  setKYCApplicationId: (id: string) => void;
  wireInfo: WireInfo | null;
  refreshStatus: () => Promise<void>;
}

const KYCContext = createContext<KYCContextType>({
  kycStatus: KYC_STATUS.NOT_STARTED,
  setKYCStatus: () => {},
  isApproved: false,
  kycApplicationId: null,
  setKYCApplicationId: () => {},
  wireInfo: null,
  refreshStatus: async () => {},
});

function getUserEmail(): string | null {
  try {
    const stored = localStorage.getItem("pg_auth");
    if (stored) return JSON.parse(stored).email || null;
  } catch {}
  return null;
}

function loadWireInfo(): WireInfo | null {
  try {
    const s = localStorage.getItem("kyc_wire_info");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveWireInfo(info: WireInfo | null) {
  if (info) localStorage.setItem("kyc_wire_info", JSON.stringify(info));
  else localStorage.removeItem("kyc_wire_info");
}

export function KYCProvider({ children }: { children: ReactNode }) {
  const [kycStatus, setKYCStatusState] = useState<KYCStatus>(() =>
    (localStorage.getItem("kyc_status") as KYCStatus) || KYC_STATUS.NOT_STARTED
  );
  const [kycApplicationId, setKYCApplicationIdState] = useState<string | null>(
    () => localStorage.getItem("kyc_application_id")
  );
  const [wireInfo, setWireInfoState] = useState<WireInfo | null>(() => loadWireInfo());

  const setKYCStatus = useCallback((status: KYCStatus) => {
    localStorage.setItem("kyc_status", status);
    setKYCStatusState(status);
  }, []);

  const setKYCApplicationId = useCallback((id: string) => {
    localStorage.setItem("kyc_application_id", id);
    setKYCApplicationIdState(id);
  }, []);

  const setWireInfo = useCallback((info: WireInfo | null) => {
    saveWireInfo(info);
    setWireInfoState(info);
  }, []);

  const refreshStatus = useCallback(async () => {
    const email = getUserEmail();
    if (!email) return;
    try {
      const res = await fetch(`/api/kyc/status?email=${encodeURIComponent(email)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.status) {
        if (data.status !== kycStatus) {
          setKYCStatus(data.status as KYCStatus);
          window.dispatchEvent(new Event("kycUpdated"));
        }
        if (data.applicationId) setKYCApplicationId(data.applicationId);

        if (data.status === "approved") {
          const info: WireInfo = {
            wireDeadline:  data.wireDeadline  ?? null,
            bankName:      data.bankName      ?? null,
            accountName:   data.accountName   ?? null,
            accountNumber: data.accountNumber ?? null,
            routingNumber: data.routingNumber ?? null,
            swiftCode:     data.swiftCode     ?? null,
            bankAddress:   data.bankAddress   ?? null,
          };
          setWireInfo(info);
        } else {
          setWireInfo(null);
        }
      }
    } catch {}
  }, [kycStatus, setKYCStatus, setKYCApplicationId, setWireInfo]);

  useEffect(() => {
    const email = getUserEmail();
    if (email) refreshStatus();
  }, []);

  useEffect(() => {
    const handleLogin = () => refreshStatus();
    const handleLogout = () => {
      localStorage.removeItem("kyc_status");
      localStorage.removeItem("kyc_application_id");
      localStorage.removeItem("kyc_wire_info");
      setKYCStatusState(KYC_STATUS.NOT_STARTED);
      setKYCApplicationIdState(null);
      setWireInfoState(null);
    };
    window.addEventListener("authLogin", handleLogin);
    window.addEventListener("authLogout", handleLogout);
    return () => {
      window.removeEventListener("authLogin", handleLogin);
      window.removeEventListener("authLogout", handleLogout);
    };
  }, [refreshStatus]);

  useEffect(() => {
    if (kycStatus !== KYC_STATUS.PENDING_REVIEW) return;
    const interval = setInterval(refreshStatus, 45_000);
    return () => clearInterval(interval);
  }, [kycStatus, refreshStatus]);

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
      wireInfo,
      refreshStatus,
    }}>
      {children}
    </KYCContext.Provider>
  );
}

export function useKYC() {
  return useContext(KYCContext);
}
