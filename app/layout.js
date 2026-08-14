export const metadata = {
  title: "Ballz",
  description: "Deployed via Claude Cowork -> GitHub -> Vercel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
