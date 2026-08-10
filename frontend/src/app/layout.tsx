import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Finder",
  description: "A simple way to search the Montclair course catalog.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
