import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MagicCards — Create a Moment They'll Remember",
  description:
    "Create beautiful interactive greeting cards with shareable links."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
