import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scheduly — Build your best semester",
  description: "A smarter way to find courses and build a college schedule that fits your life.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
