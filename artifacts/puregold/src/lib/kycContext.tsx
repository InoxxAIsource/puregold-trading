import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export const KYC_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  PENDING_REVIEW: "pending_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  MORE_INFO: "more_info_required",
} as const;

export type KYCStatus = typeof KYC_STATUS[keyof typeof KYC_STATUS];

interface KYCContextType {
  kycStatus: KYCStatus;
  setKYCStatus: (status: KYCStatus) => void;
  isApproved: boolean;
  kycApplicationId: string | null;
  setKYCApplicationId: (id: string) => void;
}

const KYCContext = createContext<KYCContextType>({
  kycStatus: KYC_STATUS.NOT_STARTED,
  setKYCStatus: () => {},
  isApproved: false,
  kycApplicationId: null,
  setKYCApplicationId: () => {},
});

export function KYCProvider({ children }: { children: ReactNode }) {
  const [kycStatus, setKYCStatusState] = useState<KYCStatus>(() => {
    return (localStorage.getItem("kyc_status") as KYCStatus) || KYC_STATUS.NOT_STARTED;
  });
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

  useEffect(() => {
    const handleKYCUpdate = () => {
      const status = localStorage.getItem("kyc_status") as KYCStatus;
      if (status) setKYCStatusState(status);
    };
    window.addEventListener("kycUpdated", handleKYCUpdate);
    return () => window.removeEventListener("kycUpdated", handleKYCUpdate);
  }, []);

  return (
    <KYCContext.Provider value={{
      kycStatus,
      setKYCStatus,
      isApproved: kycStatus === KYC_STATUS.APPROVED,
      kycApplicationId,
      setKYCApplicationId,
    }}>
      {children}
    </KYCContext.Provider>
  );
}

export function useKYC() {
  return useContext(KYCContext);
}
