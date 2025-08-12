import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ecomerz",
  description: "E-commerce demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        <AppProvider>
          <Suspense fallback={<div className="text-sm text-black/60 dark:text-white/60">Loading...</div>}>
            <Navbar />
          </Suspense>
          <main className="mx-auto max-w-6xl px-4 py-6">
            <Suspense fallback={<div className="text-sm text-black/60 dark:text-white/60">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}