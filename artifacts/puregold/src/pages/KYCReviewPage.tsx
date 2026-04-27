import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function KYCReviewPage() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id") || "";
  const token  = params.get("token") || "";
  const action = params.get("action") || "approve";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id || !token) {
      setStatus("error");
      setMessage("Invalid approval link — missing id or token.");
      return;
    }

    fetch(`/api/kyc/review?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}&action=${encodeURIComponent(action)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Done.");
        } else {
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Could not reach the server. Please try again.");
      });
  }, [id, token, action]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-bold text-foreground mb-2">Processing…</h1>
            <p className="text-muted-foreground text-sm">Updating KYC status for application #{id}</p>
          </>
        )}

        {status === "success" && action === "approve" && (
          <>
            <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-400 mb-2">Application Approved</h1>
            <p className="text-muted-foreground text-sm mb-1">Application <strong className="text-foreground">#{id}</strong></p>
            <p className="text-muted-foreground text-sm">{message}</p>
            <p className="mt-6 text-xs text-muted-foreground">The user will see their verified status next time they check the site.</p>
          </>
        )}

        {status === "success" && action === "decline" && (
          <>
            <XCircle className="h-14 w-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-400 mb-2">Application Declined</h1>
            <p className="text-muted-foreground text-sm mb-1">Application <strong className="text-foreground">#{id}</strong></p>
            <p className="text-muted-foreground text-sm">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-14 w-14 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Action Failed</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to PureGold Trading</Link>
        </div>
      </div>
    </div>
  );
}
