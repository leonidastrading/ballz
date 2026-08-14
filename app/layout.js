export const metadata = {
  title: "Ball Test Explorer",
  description: "Compare golf balls by footprint, dispersion, curve, and compression",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ background: "#000" }}>
      <body style={{ margin: 0, background: "#000" }}>{children}</body>
    </html>
  );
}
