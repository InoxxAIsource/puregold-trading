import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, X, Send, CheckCircle, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
}

const BOT_INTROS: Message[] = [
  {
    id: "intro",
    from: "bot",
    text: "👋 Hi! Welcome to GoldBuller. How can we help you today? Ask about pricing, shipping, KYC, Bitcoin OTC, or anything else.",
  },
];

const AUTO_REPLIES: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /price|spot|gold|silver|platinum|oz/i,
    reply: "Our prices update in real-time from live spot markets. Check the ticker at the top of any page, or visit our Charts section for historical data. A team member will follow up shortly!",
  },
  {
    pattern: /ship|deliver|how long|when|arrival/i,
    reply: "We offer insured shipping on all orders. Standard delivery is 3–5 business days, expedited is 1–2 days. A specialist will confirm your order details soon.",
  },
  {
    pattern: /kyc|verify|verification|identity|id/i,
    reply: "KYC verification takes ~5 minutes online and is approved within 1–2 business days. Head to Account → KYC Status to get started. We'll be in touch shortly!",
  },
  {
    pattern: /bitcoin|btc|otc|crypto/i,
    reply: "Our Bitcoin OTC desk handles 0.20–10 BTC purchases via insured bank wire. All buyers must complete KYC first. A specialist will reach out to walk you through the process.",
  },
  {
    pattern: /wire|bank|payment|pay/i,
    reply: "We accept bank wire transfers. Once your order is placed, our team sends personalized wire instructions with a 4-hour settlement window. We'll follow up with full details.",
  },
];

function getBotReply(message: string): string {
  const match = AUTO_REPLIES.find((r) => r.pattern.test(message));
  return (
    match?.reply ||
    "Thanks for your message! Our team has been notified and will get back to you shortly. We typically respond within a few hours during business hours (Mon–Fri, 9am–6pm ET)."
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(BOT_INTROS);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(1);
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.name && showNamePrompt) {
      setName(user.name);
      setShowNamePrompt(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);
  };

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
        }),
      });
      const data = await res.json();
      if (data.success) {
        const reply = getBotReply(trimmed);
        setTimeout(() => addMessage({ from: "bot", text: reply }), 800);
        setSent(true);
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
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-2xl flex items-center justify-center transition-all hover:scale-110 hover:bg-primary/90 active:scale-95"
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

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "520px" }}>
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
                <span className="text-black font-bold font-serif text-sm">G</span>
              </div>
              <div>
                <p className="text-black font-bold text-sm leading-tight">GoldBuller Support</p>
                <p className="text-black/70 text-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-800 inline-block" />
                  Typically replies in a few hours
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-black/60 hover:text-black transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Name prompt (if not logged in and haven't set name) */}
          {showNamePrompt && !user && (
            <div className="px-4 py-3 bg-secondary/30 border-b border-border shrink-0">
              <label className="text-xs text-muted-foreground font-medium block mb-1.5">
                Your name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                onBlur={() => { if (name.trim()) setShowNamePrompt(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") setShowNamePrompt(false); }}
              />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "bot" && (
                  <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <span className="text-primary font-bold text-xs font-serif">G</span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-primary text-black rounded-br-sm font-medium"
                      : "bg-secondary/50 text-foreground rounded-bl-sm border border-border/50"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 shrink-0">
                  <span className="text-primary font-bold text-xs font-serif">G</span>
                </div>
                <div className="bg-secondary/50 border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive text-center bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-3 py-3 border-t border-border shrink-0 bg-card">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                disabled={sending}
                className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 text-black" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Powered by GoldBuller Support · <a href="mailto:support@goldbuller.com" className="hover:text-primary transition-colors">support@goldbuller.com</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
