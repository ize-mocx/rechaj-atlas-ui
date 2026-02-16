import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rechaj stations",
  description: "Rechaj stations management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.className} flex h-svh flex-col overflow-hidden antialiased`}
      >
        <Header />
        <main className="min-h-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
