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

// Scope every localStorage key to the logged-in user's email so that
// signing in as a different account never inherits another user's KYC state.
function statusKey(email: string | null): string {
  return email ? `kyc_status_${email}` : "kyc_status";
}
function appIdKey(email: string | null): string {
  return email ? `kyc_app_id_${email}` : "kyc_application_id";
}
function wireKey(email: string | null): string {
  return email ? `kyc_wire_${email}` : "kyc_wire_info";
}

function loadWireInfo(email: string | null): WireInfo | null {
  try {
    const s = localStorage.getItem(wireKey(email));
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveWireInfo(email: string | null, info: WireInfo | null) {
  if (info) localStorage.setItem(wireKey(email), JSON.stringify(info));
  else localStorage.removeItem(wireKey(email));
}

// Remove all kyc_* keys from localStorage (used on logout so no stale
// data from this user can bleed into the next session on the same browser).
function clearAllKycKeys() {
  const toRemove = Object.keys(localStorage).filter(k =>
    k.startsWith("kyc_") ||
    k === "kyc_status" ||
    k === "kyc_application_id" ||
    k === "kyc_wire_info"
  );
  toRemove.forEach(k => localStorage.removeItem(k));
}

export function KYCProvider({ children }: { children: ReactNode }) {
  const email = getUserEmail();

  const [kycStatus, setKYCStatusState] = useState<KYCStatus>(() =>
    (localStorage.getItem(statusKey(email)) as KYCStatus) || KYC_STATUS.NOT_STARTED
  );
  const [kycApplicationId, setKYCApplicationIdState] = useState<string | null>(
    () => localStorage.getItem(appIdKey(email))
  );
  const [wireInfo, setWireInfoState] = useState<WireInfo | null>(() => loadWireInfo(email));

  const setKYCStatus = useCallback((status: KYCStatus) => {
    const e = getUserEmail();
    localStorage.setItem(statusKey(e), status);
    setKYCStatusState(status);
  }, []);

  const setKYCApplicationId = useCallback((id: string) => {
    const e = getUserEmail();
    localStorage.setItem(appIdKey(e), id);
    setKYCApplicationIdState(id);
  }, []);

  const setWireInfo = useCallback((info: WireInfo | null) => {
    const e = getUserEmail();
    saveWireInfo(e, info);
    setWireInfoState(info);
  }, []);

  const refreshStatus = useCallback(async () => {
    const e = getUserEmail();
    if (!e) return;
    try {
      const res = await fetch(`/api/kyc/status?email=${encodeURIComponent(e)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.status) {
        const normalised = (data.status === "declined" ? KYC_STATUS.REJECTED : data.status) as KYCStatus;
        setKYCStatus(normalised);
        window.dispatchEvent(new Event("kycUpdated"));
        if (data.applicationId) setKYCApplicationId(data.applicationId);

        if (data.status === "approved") {
          setWireInfo({
            wireDeadline:  data.wireDeadline  ?? null,
            bankName:      data.bankName      ?? null,
            accountName:   data.accountName   ?? null,
            accountNumber: data.accountNumber ?? null,
            routingNumber: data.routingNumber ?? null,
            swiftCode:     data.swiftCode     ?? null,
            bankAddress:   data.bankAddress   ?? null,
          });
        } else {
          setWireInfo(null);
        }
      }
    } catch {}
  }, [setKYCStatus, setKYCApplicationId, setWireInfo]);

  useEffect(() => {
    const e = getUserEmail();
    if (e) refreshStatus();
  }, []);

  useEffect(() => {
    const handleLogin = () => {
      // Immediately reset to NOT_STARTED so no stale status from a previous
      // user (or a previous session) is shown while the server fetch runs.
      setKYCStatusState(KYC_STATUS.NOT_STARTED);
      setKYCApplicationIdState(null);
      setWireInfoState(null);
      refreshStatus();
    };

    const handleLogout = () => {
      // Clear ALL kyc_* localStorage keys so the next user on this browser
      // starts with a clean slate.
      clearAllKycKeys();
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
      const e = getUserEmail();
      const status = localStorage.getItem(statusKey(e)) as KYCStatus;
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
