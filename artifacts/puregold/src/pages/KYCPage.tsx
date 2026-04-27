import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronLeft, Check, AlertCircle, Info } from "lucide-react";
import { FileUpload } from "@/components/kyc/FileUpload";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = ["Personal Info", "Identity", "Address", "Review"];

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

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
              i < step ? "bg-primary border-primary text-primary-foreground"
              : i === step ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted-foreground"
            }`}>
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
  data: PersonalInfo;
  onChange: (d: PersonalInfo) => void;
  onNext: () => void;
}) {
  const set = (key: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const validate18 = () => {
    if (!data.dob) return false;
    const dob = new Date(data.dob);
    const now = new Date();
    now.setFullYear(now.getFullYear() - 18);
    return dob <= now;
  };

  const isValid = data.firstName && data.lastName && data.dob && validate18() &&
    data.nationality && data.country && data.phone && data.occupation &&
    data.sourceOfFunds && data.purpose && data.volume && data.usCitizen && data.pep;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Personal Information</h2>
        <p className="text-sm text-muted-foreground">All fields are required. This information must match your government ID.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[["firstName","Legal First Name"],["lastName","Legal Last Name"]].map(([k,l]) => (
          <div key={k}>
            <label className="block text-sm font-medium text-foreground mb-1">{l} *</label>
            <input value={(data as any)[k]} onChange={set(k as any)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Date of Birth * (must be 18+)</label>
          <input type="date" value={data.dob} onChange={set("dob")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
          {data.dob && !validate18() && <p className="text-xs text-destructive mt-1">Must be 18 or older</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
          <input type="tel" value={data.phone} onChange={set("phone")} placeholder="+1 555 000 0000"
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nationality *</label>
          <select value={data.nationality} onChange={set("nationality")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Country of Residence *</label>
          <select value={data.country} onChange={set("country")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Occupation *</label>
          <input value={data.occupation} onChange={set("occupation")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">SSN (last 4 digits) — US residents</label>
          <input value={data.ssn4} onChange={set("ssn4")} maxLength={4} placeholder="XXXX"
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
          <p className="text-xs text-muted-foreground mt-1">Used for identity verification only. Never stored in full.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Source of Funds *</label>
          <select value={data.sourceOfFunds} onChange={set("sourceOfFunds")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
            <option value="">Select...</option>
            {SOURCE_OF_FUNDS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Purpose of Purchase *</label>
          <select value={data.purpose} onChange={set("purpose")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
            <option value="">Select...</option>
            {PURPOSE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Expected Annual Purchase Volume *</label>
        <select value={data.volume} onChange={set("volume")}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
          <option value="">Select...</option>
          {VOLUME_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Are you a US citizen or resident? *</label>
          <div className="flex gap-4 mt-2">
            {["Yes","No"].map(v => (
              <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="usCitizen" value={v} checked={data.usCitizen === v} onChange={set("usCitizen")} className="accent-primary" />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
            Are you a politically exposed person (PEP)? *
            <span title="A PEP is a person with a prominent public function"><Info className="h-3 w-3 text-muted-foreground" /></span>
          </label>
          <div className="flex gap-4 mt-2">
            {["Yes","No"].map(v => (
              <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="pep" value={v} checked={data.pep === v} onChange={set("pep")} className="accent-primary" />
                {v}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onNext} disabled={!isValid}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        Next: Identity Document <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function StepIdentity({ data, onChange, onNext, onBack }: {
  data: IdentityInfo; onChange: (d: IdentityInfo) => void; onNext: () => void; onBack: () => void;
}) {
  const isValid = data.docType && data.frontFile;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">National ID Card</h2>
        <p className="text-sm text-muted-foreground">Upload clear photos of your government-issued ID. No selfie required.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Document Type *</label>
        <div className="grid grid-cols-2 gap-2">
          {DOC_TYPES.map(t => (
            <label key={t} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
              data.docType === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
            }`}>
              <input type="radio" name="docType" value={t} checked={data.docType === t}
                onChange={e => onChange({ ...data, docType: e.target.value })} className="accent-primary" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <FileUpload label="Front of ID Card *" icon="🪪"
        onChange={(_, preview) => onChange({ ...data, frontFile: preview })} />
      <FileUpload label="Back of ID Card (if applicable)" icon="🪪"
        onChange={(_, preview) => onChange({ ...data, backFile: preview })} />
      <div className="bg-secondary/30 rounded-lg p-4 text-sm space-y-1">
        <p className="font-medium text-foreground mb-2">ID requirements:</p>
        {["Document is clearly readable","All four corners visible","No flash glare or blur","Must not be expired","Name must match your application"].map(r => (
          <p key={r} className="text-muted-foreground flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-green-400 shrink-0" /> {r}
          </p>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} disabled={!isValid}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          Next: Proof of Address <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepAddress({ data, onChange, onNext, onBack }: {
  data: AddressInfo; onChange: (d: AddressInfo) => void; onNext: () => void; onBack: () => void;
}) {
  const set = (key: keyof AddressInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [key]: e.target.value });
  const isValid = data.docType && data.addressFile && data.street && data.city && data.state && data.zip && data.country;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Proof of Address</h2>
        <p className="text-sm text-muted-foreground">Upload a recent document confirming your residential address.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Document Type *</label>
        <div className="grid grid-cols-2 gap-2">
          {ADDR_DOC_TYPES.map(t => (
            <label key={t} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
              data.docType === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
            }`}>
              <input type="radio" name="addrDocType" value={t} checked={data.docType === t}
                onChange={e => onChange({ ...data, docType: e.target.value })} className="accent-primary" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <FileUpload label="Address Document *" icon="📋"
        onChange={(_, preview) => onChange({ ...data, addressFile: preview })} />
      <p className="text-xs text-muted-foreground -mt-2">Must match the address on your uploaded document.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1">Street Address *</label>
          <input value={data.street} onChange={set("street")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">City *</label>
          <input value={data.city} onChange={set("city")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">State *</label>
          <input value={data.state} onChange={set("state")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">ZIP Code *</label>
          <input value={data.zip} onChange={set("zip")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Country *</label>
          <select value={data.country} onChange={set("country")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground">
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} disabled={!isValid}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          Next: Review <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepReview({ personal, identity, address, onBack, onSubmit, submitting, submitError }: {
  personal: PersonalInfo; identity: IdentityInfo; address: AddressInfo;
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
  const now = new Date();
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
          { done: false, label: "Admin approval or request for more info" },
          { done: false, label: "Approval email sent to you" },
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
      <div className="border-t border-border pt-4 text-sm text-muted-foreground">
        <p className="mt-2">Questions? Call <strong className="text-foreground">1-800-GOLD-NOW</strong> or email <strong className="text-foreground">compliance@puregoldtrading.com</strong></p>
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState<AddressInfo>({ docType: "", addressFile: null, street: "", city: "", state: "", zip: "", country: "" });

  useEffect(() => {
    if (!user) setLocation("/account/login?redirect=/account/kyc");
  }, [user, setLocation]);

  if (kycStatus === KYC_STATUS.APPROVED && !submitted) {
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
        body: JSON.stringify({ personal, identity, address, applicationId: id }),
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
      {step === 3 && <StepReview personal={personal} identity={identity} address={address} onBack={() => setStep(2)} onSubmit={handleSubmit} submitting={submitting} submitError={submitError} />}
    </div>
  );
}
