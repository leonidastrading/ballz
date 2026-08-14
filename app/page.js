export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "#0a0a0a",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⛳ Ballz</h1>
      <p style={{ color: "#999" }}>
        Deployed via Claude Cowork → GitHub → Vercel.
      </p>
    </main>
  );
}
