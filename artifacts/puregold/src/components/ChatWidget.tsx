import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, X, Send, ChevronDown, ShieldCheck, Clock, Star } from "lucide-react";

interface Message {
  id: string;
  from: "user" | "support";
  text: string;
}

// ─── Session ID ───────────────────────────────────────────────────────────────
function getOrCreateSessionId(): string {
  const KEY = "gb_chat_sid";
  const existing = sessionStorage.getItem(KEY);
  if (existing) return existing;
  const id = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  sessionStorage.setItem(KEY, id);
  return id;
}

const SESSION_ID = getOrCreateSessionId();

const INTRO: Message = {
  id: "intro",
  from: "support",
  text: "👋 Hi! Welcome to GoldBuller. How can we help you today? Ask about pricing, shipping, KYC, Bitcoin OTC, or anything else.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(0);
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [lastPollTs, setLastPollTs] = useState(Date.now());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const [location] = useLocation();
  const { user } = useAuth();

  // Show teaser after 5 seconds (once per session)
  useEffect(() => {
    const dismissed = sessionStorage.getItem("gb_teaser_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShowTeaser(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTeaser = () => {
    setShowTeaser(false);
    setTeaserDismissed(true);
    sessionStorage.setItem("gb_teaser_dismissed", "1");
  };

  const openChat = () => {
    dismissTeaser();
    setOpen(true);
  };

  // Auto-fill name if logged in
  useEffect(() => {
    if (user?.name && showNamePrompt) {
      setName(user.name);
      setShowNamePrompt(false);
    }
  }, [user, showNamePrompt]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = useCallback((msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);
  }, []);

  // ─── Poll for Telegram replies ────────────────────────────────────────────
  useEffect(() => {
    if (!hasSentMessage) return;
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/chat/replies?sessionId=${SESSION_ID}&after=${lastPollTs}`
        );
        const data = await res.json();
        if (data.success && data.replies?.length) {
          for (const r of data.replies) {
            addMessage({ from: "support", text: r.text });
            if (!openRef.current) setUnread((n) => n + 1);
          }
          setLastPollTs(data.replies[data.replies.length - 1].ts);
        }
      } catch {
        // ignore
      }
    };
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [hasSentMessage, lastPollTs, addMessage]);

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setInput("");
    setError("");
    addMessage({ from: "user", text: trimmed });
    setSending(true);
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          name: name.trim() || (user?.name ?? ""),
          email: user?.email ?? "",
          page: location,
          sessionId: SESSION_ID,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (!hasSentMessage) {
          setTimeout(() => {
            addMessage({
              from: "support",
              text: "✅ Message received! Our team has been notified and will reply here shortly.",
            });
          }, 600);
          setHasSentMessage(true);
          setLastPollTs(Date.now());
        }
      } else {
        setError("Couldn't send. Please email support@goldbuller.com directly.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Teaser card ─────────────────────────────────────────────────── */}
      {showTeaser && !open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-72 animate-in slide-in-from-bottom-4 fade-in duration-500"
          style={{ animationFillMode: "both" }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/30"
            style={{
              background: "linear-gradient(135deg, #1a1608 0%, #0d0d0d 60%, #1a1200 100%)",
            }}
          >
            {/* Gold top bar */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #b8973a, #f0d060, #b8973a)" }} />

            {/* Dismiss */}
            <button
              onClick={dismissTeaser}
              className="absolute top-3 right-3 h-5 w-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="h-3 w-3 text-white/60" />
            </button>

            <div className="px-4 pt-4 pb-4">
              {/* Avatar row */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: "#b8973a", background: "linear-gradient(135deg, #2a1f00, #1a1200)" }}
                  >
                    <span className="font-serif font-bold text-base" style={{ color: "#f0d060" }}>G</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">GoldBuller Expert</p>
                  <p className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Online now
                  </p>
                </div>
              </div>

              {/* Headline */}
              <p className="text-white font-serif font-bold text-[17px] leading-snug mb-1">
                Talk to a Bullion Expert
              </p>
              <p className="text-white/60 text-[12px] leading-relaxed mb-4">
                Get personalized advice on gold, silver & Bitcoin OTC. No pressure — just real answers.
              </p>

              {/* Trust badges */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2 text-[11px] text-white/50">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: "#b8973a" }} />
                  <span>KYC-verified · Insured shipping</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/50">
                  <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "#b8973a" }} />
                  <span>Avg. reply under 2 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/50">
                  <Star className="h-3.5 w-3.5 shrink-0" style={{ color: "#b8973a" }} />
                  <span>U.S.-based team · Mon–Fri, 9am–6pm ET</span>
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={openChat}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110 active:scale-95"
                style={{ background: "linear-gradient(90deg, #b8973a, #f0d060, #b8973a)" }}
              >
                Start Free Consultation →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating button ──────────────────────────────────────────────── */}
      <button
        onClick={() => { setOpen((o) => !o); if (!open) dismissTeaser(); }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #b8973a, #f0d060)" }}
        aria-label="Open chat"
      >
        {open ? (
          <ChevronDown className="h-6 w-6 text-black" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-black" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{
            maxHeight: "520px",
            background: "#0d0d0d",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{ background: "linear-gradient(135deg, #1a1608, #2a1f00)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center border-2"
                  style={{ borderColor: "#b8973a", background: "#1a1200" }}
                >
                  <span className="font-serif font-bold text-sm" style={{ color: "#f0d060" }}>G</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 bg-emerald-400"
                  style={{ borderColor: "#1a1608" }} />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight text-white">GoldBuller Support</p>
                <p className="text-white/50 text-[11px] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {hasSentMessage ? "Waiting for reply…" : "Bullion experts online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Gold divider */}
          <div className="h-px w-full shrink-0"
            style={{ background: "linear-gradient(90deg, transparent, #b8973a55, transparent)" }} />

          {/* Name prompt */}
          {showNamePrompt && !user && (
            <div className="px-4 py-3 border-b shrink-0"
              style={{ background: "#111", borderColor: "#222" }}>
              <label className="text-[11px] text-white/40 font-medium block mb-1.5 uppercase tracking-wide">
                Your name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1"
                style={{ background: "#1a1a1a", border: "1px solid #333", focusRingColor: "#b8973a" }}
                onBlur={() => { if (name.trim()) setShowNamePrompt(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") setShowNamePrompt(false); }}
              />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                {msg.from === "support" && (
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center mr-2 mt-0.5 shrink-0 border"
                    style={{ background: "#1a1200", borderColor: "#b8973a55" }}
                  >
                    <span className="font-bold text-xs font-serif" style={{ color: "#f0d060" }}>G</span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.from === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                  }`}
                  style={
                    msg.from === "user"
                      ? { background: "linear-gradient(135deg, #b8973a, #f0d060)", color: "#000", fontWeight: 500 }
                      : { background: "#1a1a1a", color: "#e5e5e5", border: "1px solid #2a2a2a" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="h-7 w-7 rounded-full flex items-center justify-center mr-2 shrink-0 border"
                  style={{ background: "#1a1200", borderColor: "#b8973a55" }}>
                  <span className="font-bold text-xs font-serif" style={{ color: "#f0d060" }}>G</span>
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                  <div className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "#b8973a", animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "#b8973a", animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "#b8973a", animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 text-center rounded-lg px-3 py-2"
                style={{ background: "#2a0a0a" }}>
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid #222", background: "#0d0d0d" }}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about gold, silver, OTC…"
                disabled={sending}
                className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none disabled:opacity-50"
                style={{ background: "#1a1a1a", border: "1px solid #333" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #b8973a, #f0d060)" }}
              >
                <Send className="h-4 w-4 text-black" />
              </button>
            </div>
            <p className="text-[10px] text-white/20 text-center mt-2">
              GoldBuller Support ·{" "}
              <a href="mailto:support@goldbuller.com" className="hover:text-yellow-600 transition-colors">
                support@goldbuller.com
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
