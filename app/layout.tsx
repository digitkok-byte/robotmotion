import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROBOTMOTION — Creative Motion Studio",
  description: "AI-powered motion design and creative technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
