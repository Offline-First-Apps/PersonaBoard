import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import "../index.css";
import "../landing.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PersonaBoard — Everything you copy, kept close",
  description:
    "PersonaBoard is a quiet clipboard history for your desktop. Summon it with a hotkey, find what you copied, paste it, and get back to work. No cloud, no accounts — everything stays on your machine.",
  appleWebApp: {
    title: "PersonaBoard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
