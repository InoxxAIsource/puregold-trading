import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronLeft, Check, AlertCircle, Camera, Upload, X } from "lucide-react";
import { FileUpload } from "@/components/kyc/FileUpload";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = ["Personal Info", "Identity", "Address", "Selfie", "Review"];

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Japan", "Singapore", "Switzerland", "Netherlands",
  "New Zealand", "Sweden", "Norway", "Denmark", "Austria",
  "Other"
];

const SOURCE_OF_FUNDS = [
  "Employment Income", "Business Income", "Investment Returns",
  "Inheritance", "Real Estate Sale", "Savings", "Other"
];

const PURPOSE_OPTIONS = [
  "Investment / Wealth Preservation", "Portfolio Diversification",
  "Business Treasury", "IRA/Retirement", "Personal Savings", "Other"
];

const VOLUME_OPTIONS = [
  "$10,000–$50,000", "$50,001–$250,000", "$250,001–$1,000,000", "$1M+"
];

const DOC_TYPES = ["US Driver's License", "US Passport", "State ID Card", "Non-US Passport"];
const ADDR_DOC_TYPES = ["Bank Statement (last 90 days)", "Utility Bill (last 90 days)", "Government Letter", "Lease Agreement"];

interface PersonalInfo {
  firstName: string; lastName: string; dob: string; nationality: string;
  country: string; phone: string; ssn4: string; occupation: string;
  sourceOfFunds: string; purpose: string; volume: string;
  usCitizen: string; pep: string;
}
interface IdentityInfo {
  docType: string; frontFile: string | null; backFile: string | null;
}
interface AddressInfo {
  docType: string; addressFile: string | null;
  street: string; city: string; state: string; zip: string; country: string;
}
interface SelfieInfo {
  selfieFile: string | null;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
              ${i < step ? "bg-primary border-primary text-primary-foreground"
              : i === step ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium hidden sm:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepPersonal({ data, onChange, onNext }: {
  data: PersonalInfo; onChange: (d: PersonalInfo) => void; onNext: () => void;
}) {
  const set = (k: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [k]: e.target.value });

  const valid = data.firstName && data.lastName && data.dob && data.nationality &&
    data.country && data.phone && data.occupation && data.sourceOfFunds &&
    data.purpose && data.volume && data.usCitizen && data.pep;

  const inp = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const lbl = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Personal Information</h2>
        <p className="text-sm text-muted-foreground">As it appears on your government-issued ID.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>First Name *</label><input className={inp} value={data.firstName} onChange={set("firstName")} /></div>
        <div><label className={lbl}>Last Name *</label><input className={inp} value={data.lastName} onChange={set("lastName")} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Date of Birth *</label><input type="date" className={inp} value={data.dob} onChange={set("dob")} /></div>
        <div><label className={lbl}>Nationality *</label>
          <select className={inp} value={data.nationality} onChange={set("nationality")}>
            <option value="">Select…</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Country of Residence *</label>
          <select className={inp} value={data.country} onChange={set("country")}>
            <option value="">Select…</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className={lbl}>Phone Number *</label><input className={inp} placeholder="+1 555 000 0000" value={data.phone} onChange={set("phone")} /></div>
      </div>
      <div><label className={lbl}>SSN Last 4 Digits (US only)</label>
        <input className={inp} maxLength={4} placeholder="e.g. 1234" value={data.ssn4} onChange={set("ssn4")} />
      </div>
      <div><label className={lbl}>Occupation *</label><input className={inp} value={data.occupation} onChange={set("occupation")} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Source of Funds *</label>
          <select className={inp} value={data.sourceOfFunds} onChange={set("sourceOfFunds")}>
            <option value="">Select…</option>
            {SOURCE_OF_FUNDS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div><label className={lbl}>Purpose of Purchase *</label>
          <select className={inp} value={data.purpose} onChange={set("purpose")}>
            <option value="">Select…</option>
            {PURPOSE_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div><label className={lbl}>Expected Annual Volume *</label>
        <select className={inp} value={data.volume} onChange={set("volume")}>
          <option value="">Select…</option>
          {VOLUME_OPTIONS.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>US Citizen or Resident? *</label>
          <select className={inp} value={data.usCitizen} onChange={set("usCitizen")}>
            <option value="">Select…</option>
            <option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={lbl}>Politically Exposed Person? *</label>
          <select className={inp} value={data.pep} onChange={set("pep")}>
            <option value="">Select…</option>
            <option>No</option><option>Yes</option>
          </select>
        </div>
      </div>
      <button onClick={onNext} disabled={!valid}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        Continue <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function StepIdentity({ data, onChange, onNext, onBack }: {
  data: IdentityInfo; onChange: (d: IdentityInfo) => void; onNext: () => void; onBack: () => void;
}) {
  const inp = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const lbl = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Identity Document</h2>
        <p className="text-sm text-muted-foreground">Upload clear photos of your government-issued ID. A selfie will be required in a later step.</p>
      </div>
      <div>
        <label className={lbl}>Document Type *</label>
        <select className={inp} value={data.docType} onChange={e => onChange({ ...data, docType: e.target.value })}>
          <option value="">Select document type…</option>
          {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <FileUpload label="Front of ID *" icon="🪪"
        hint="Clear photo of the front — all corners visible, JPG/PNG/PDF"
        onChange={(_, preview) => onChange({ ...data, frontFile: preview })} />
      <FileUpload label="Back of ID (if applicable)" icon="🔄"
        hint="Only needed for driver's license / state ID"
        onChange={(_, preview) => onChange({ ...data, backFile: preview })} />
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} disabled={!data.docType || !data.frontFile}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepAddress({ data, onChange, onNext, onBack }: {
  data: AddressInfo; onChange: (d: AddressInfo) => void; onNext: () => void; onBack: () => void;
}) {
  const set = (k: keyof AddressInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [k]: e.target.value });
  const inp = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const lbl = "block text-sm font-medium text-foreground mb-1.5";
  const valid = data.docType && data.street && data.city && data.state && data.zip && data.country;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Proof of Address</h2>
        <p className="text-sm text-muted-foreground">Upload a utility bill or bank statement from the last 90 days.</p>
      </div>
      <div><label className={lbl}>Document Type *</label>
        <select className={inp} value={data.docType} onChange={set("docType")}>
          <option value="">Select document type…</option>
          {ADDR_DOC_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <FileUpload label="Address Document" icon="📄"
        hint="JPG, PNG, or PDF — must show your name and address"
        onChange={(_, preview) => onChange({ ...data, addressFile: preview })} />
      <div><label className={lbl}>Street Address *</label><input className={inp} placeholder="123 Main St" value={data.street} onChange={set("street")} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>City *</label><input className={inp} value={data.city} onChange={set("city")} /></div>
        <div><label className={lbl}>State *</label><input className={inp} placeholder="TX" value={data.state} onChange={set("state")} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>ZIP Code *</label><input className={inp} value={data.zip} onChange={set("zip")} /></div>
        <div><label className={lbl}>Country *</label>
          <select className={inp} value={data.country} onChange={set("country")}>
            <option value="">Select…</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} disabled={!valid}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepSelfie({ data, onChange, onNext, onBack }: {
  data: SelfieInfo; onChange: (d: SelfieInfo) => void; onNext: () => void; onBack: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "camera" | "upload">("choose");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("Could not access camera. Please use file upload instead.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL("image/jpeg", 0.85);
    onChange({ selfieFile: dataUrl });
    stopCamera();
    setMode("upload");
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  if (mode === "choose") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Selfie Verification</h2>
          <p className="text-sm text-muted-foreground">
            Take a selfie or upload a recent photo of yourself. Your face must be clearly visible, matching your ID document.
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex items-start gap-2 text-sm text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Hold your ID next to your face for a clearer verification photo (optional but recommended).</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setMode("camera"); startCamera(); }}
            className="flex flex-col items-center gap-3 border-2 border-dashed border-primary/50 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Camera className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Take a Photo</p>
              <p className="text-xs text-muted-foreground mt-1">Use your camera</p>
            </div>
          </button>
          <button
            onClick={() => setMode("upload")}
            className="flex flex-col items-center gap-3 border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/50 hover:bg-secondary/30 transition-colors"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Upload Photo</p>
              <p className="text-xs text-muted-foreground mt-1">From your device</p>
            </div>
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button onClick={onNext}
            className="flex-1 border border-primary/40 text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors text-sm">
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  if (mode === "camera") {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Take Your Selfie</h2>
          <p className="text-sm text-muted-foreground">Position your face clearly in the frame, then click Capture.</p>
        </div>
        {cameraError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{cameraError}</div>
        )}
        <div className="relative rounded-xl overflow-hidden bg-black border border-border">
          <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-72 object-cover" />
          {!cameraActive && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-3">
          <button onClick={() => { stopCamera(); setMode("choose"); }}
            className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
            <X className="h-4 w-4" /> Cancel
          </button>
          <button onClick={capture} disabled={!cameraActive}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <Camera className="h-4 w-4" /> Capture
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Selfie Verification</h2>
        <p className="text-sm text-muted-foreground">Upload or retake your selfie photo.</p>
      </div>

      {data.selfieFile ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img src={data.selfieFile} alt="Selfie preview" className="w-full max-h-64 object-cover" />
          <button
            onClick={() => { onChange({ selfieFile: null }); setMode("choose"); }}
            className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
            <Check className="h-3 w-3" /> Photo captured
          </div>
        </div>
      ) : (
        <FileUpload
          label="Selfie Photo *"
          icon="🤳"
          hint="JPG or PNG — face clearly visible, well-lit, no sunglasses"
          onChange={(_, preview) => onChange({ selfieFile: preview })}
        />
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          {data.selfieFile ? <><Check className="h-4 w-4" /> Continue</> : <>Continue without selfie <ChevronRight className="h-4 w-4" /></>}
        </button>
      </div>
    </div>
  );
}

function StepReview({ personal, identity, address, selfie, onBack, onSubmit, submitting, submitError }: {
  personal: PersonalInfo; identity: IdentityInfo; address: AddressInfo; selfie: SelfieInfo;
  onBack: () => void; onSubmit: () => void; submitting?: boolean; submitError?: string | null;
}) {
  const [checks, setChecks] = useState<boolean[]>([false,false,false,false,false]);
  const allChecked = checks.every(Boolean);
  const toggle = (i: number) => setChecks(c => c.map((v,j) => j === i ? !v : v));

  const LEGAL = [
    "I confirm all information provided is true and accurate",
    "I understand KYC is required by US law (Bank Secrecy Act)",
    "I consent to identity verification and document storage",
    "I am not acting on behalf of a third party",
    "I understand purchases over $10,000 are reported to FinCEN",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">Please review your information before submitting.</p>
      </div>

      {[
        { title: "Personal Information", rows: [
          ["Name", `${personal.firstName} ${personal.lastName}`],
          ["DOB", personal.dob], ["Country", personal.country],
          ["Phone", personal.phone], ["Occupation", personal.occupation],
          ["Source of Funds", personal.sourceOfFunds], ["Purpose", personal.purpose],
          ["Volume", personal.volume],
        ]},
        { title: "National ID Card", rows: [
          ["Document Type", identity.docType],
          ["Front of ID", identity.frontFile ? "✅ Uploaded" : "—"],
          ["Back of ID", identity.backFile ? "✅ Uploaded" : "Not provided"],
        ]},
        { title: "Proof of Address", rows: [
          ["Document Type", address.docType],
          ["Address", `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`],
        ]},
        { title: "Selfie", rows: [
          ["Selfie Photo", selfie.selfieFile ? "✅ Uploaded" : "⚠️ Not provided (optional)"],
        ]},
      ].map(section => (
        <div key={section.title} className="bg-secondary/20 border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
          <div className="space-y-1.5">
            {section.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{k}:</span>
                <span className="text-foreground font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        {LEGAL.map((text, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={checks[i]} onChange={() => toggle(i)} className="mt-0.5 accent-primary" />
            <span className="text-sm text-muted-foreground">{text}</span>
          </label>
        ))}
      </div>

      {submitError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
          ⚠️ {submitError}
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={onBack} disabled={submitting} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onSubmit} disabled={!allChecked || submitting}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors">
          {submitting ? "Submitting..." : "Submit KYC Application"}
        </button>
      </div>
    </div>
  );
}

function SubmittedState({ appId }: { appId: string }) {
  const { refreshStatus } = useKYC();
  const [checking, setChecking] = useState(false);
  const now = new Date();

  const handleCheck = async () => {
    setChecking(true);
    await refreshStatus();
    setChecking(false);
  };
  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">🕐</div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Application Under Review</h2>
          <p className="text-sm text-muted-foreground">Application #{appId} · Documents sent to compliance team</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground mb-6">
        <p>Submitted: {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} EDT</p>
        <p>Our compliance team manually reviews all applications. You'll receive an email when your account is approved or if additional information is needed.</p>
      </div>
      <div className="space-y-3 mb-8">
        {[
          { done: true, label: "Documents submitted to compliance team" },
          { done: false, label: "Manual review (1–2 business days)" },
          { done: false, label: "Admin approval with bank wire instructions" },
          { done: false, label: "Approval email sent with wire details (4-hour window)" },
          { done: false, label: "All purchases unlocked (metals + Bitcoin OTC)" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${item.done ? "bg-green-500" : "bg-secondary border border-border"}`}>
              {item.done ? <Check className="h-3 w-3 text-white" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
            </div>
            <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4 space-y-3">
        <button
          onClick={handleCheck}
          disabled={checking}
          className="w-full border border-primary text-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {checking ? "Checking…" : "🔄 Check Approval Status"}
        </button>
        <p className="text-xs text-muted-foreground text-center">Status is also checked automatically every 45 seconds.</p>
        <p className="text-xs text-muted-foreground text-center">Questions? Email <strong className="text-foreground">support@goldbuller.com</strong></p>
      </div>
    </div>
  );
}

export default function KYCPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");
  const { kycStatus, setKYCStatus, setKYCApplicationId } = useKYC();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: "", lastName: "", dob: "", nationality: "", country: "",
    phone: "", ssn4: "", occupation: "", sourceOfFunds: "", purpose: "",
    volume: "", usCitizen: "", pep: ""
  });
  const [identity, setIdentity] = useState<IdentityInfo>({ docType: "", frontFile: null, backFile: null });
  const [address, setAddress] = useState<AddressInfo>({ docType: "", addressFile: null, street: "", city: "", state: "", zip: "", country: "" });
  const [selfie, setSelfie] = useState<SelfieInfo>({ selfieFile: null });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) setLocation("/account/login?redirect=/account/kyc");
  }, [user, setLocation]);

  if (kycStatus === KYC_STATUS.APPROVED) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-400 mb-2">Already Verified</h1>
          <p className="text-muted-foreground mb-6">Your identity has been verified. You can purchase Gold, Silver, Platinum, Copper, and Bitcoin OTC.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
              🥇 Shop Metals →
            </Link>
            <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary/10 transition-colors">
              ₿ Buy Bitcoin OTC →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    const id = `KYC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personal, identity, address, selfie, applicationId: id, userEmail: user?.email || "" }),
      });
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { throw new Error(`Server error (${res.status}). Please try again.`); }
      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed");
      setAppId(id);
      setKYCApplicationId(id);
      setKYCStatus(KYC_STATUS.PENDING_REVIEW);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <SubmittedState appId={appId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏅</span>
          <h1 className="text-2xl font-serif font-bold text-foreground">Identity Verification (KYC)</h1>
        </div>
        <p className="text-sm text-muted-foreground">Required to purchase metals and Bitcoin OTC. Takes approximately 5 minutes. Documents are reviewed manually by our compliance team.</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex items-start gap-2 mb-8 text-sm text-amber-300">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>Your information is encrypted and used solely for compliance verification. We never sell your data.</span>
      </div>

      <ProgressBar step={step} />

      {step === 0 && <StepPersonal data={personal} onChange={setPersonal} onNext={() => setStep(1)} />}
      {step === 1 && <StepIdentity data={identity} onChange={setIdentity} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <StepAddress data={address} onChange={setAddress} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepSelfie data={selfie} onChange={setSelfie} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepReview personal={personal} identity={identity} address={address} selfie={selfie} onBack={() => setStep(3)} onSubmit={handleSubmit} submitting={submitting} submitError={submitError} />}
    </div>
  );
}
