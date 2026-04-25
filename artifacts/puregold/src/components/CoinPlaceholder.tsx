interface CoinPlaceholderProps {
  metal: string;
  name: string;
  size?: number;
}

export function CoinPlaceholder({ metal, name, size = 160 }: CoinPlaceholderProps) {
  const gradient =
    metal === "gold"
      ? "radial-gradient(circle at 40% 35%, #F5D97A, #C9A84C 50%, #8B6914)"
      : metal === "silver"
      ? "radial-gradient(circle at 40% 35%, #F0F0F0, #C0C0C0 50%, #808080)"
      : metal === "platinum"
      ? "radial-gradient(circle at 40% 35%, #E8E8F0, #A8A8C0 50%, #606080)"
      : metal === "palladium"
      ? "radial-gradient(circle at 40% 35%, #E0E8E0, #90A890 50%, #506050)"
      : "radial-gradient(circle at 40% 35%, #D4956A, #B5632A 50%, #7A3010)";

  const textColor =
    metal === "gold" ? "#3d2b00" : metal === "silver" ? "#2a2a2a" : "#1a1a1a";

  const shortName = name.replace(/\d{4}\s/, "").slice(0, 22);
  const fontSize = size < 140 ? "10px" : size > 250 ? "14px" : "10px";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.3)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize,
          textAlign: "center",
          color: textColor,
          fontWeight: "700",
          padding: `${Math.round(size * 0.12)}px`,
          lineHeight: 1.3,
          letterSpacing: "0.02em",
        }}
      >
        {shortName}
      </span>
    </div>
  );
}
