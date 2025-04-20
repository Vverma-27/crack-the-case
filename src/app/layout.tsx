import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./App.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crack-the-Case | Interactive Detective Mystery Experience",
  description:
    "Solve intriguing mysteries with Crack-the-Case's immersive detective files, evidence, and interactive 3D case files. Perfect for game nights and mystery enthusiasts.",
  keywords:
    "detective game, mystery solving, interactive case files, murder mystery, crime solving, detective experience, escape room alternative",
  authors: [{ name: "Crack-the-Case" }],
  applicationName: "Crack-the-Case",
  themeColor: "#b87f35",
  icons: {
    icon: "/textures/shield.png",
    apple: "/textures/shield.png",
  },
  openGraph: {
    type: "website",
    url: "https://crack-the-case.com/",
    title: "Crack-the-Case | Interactive Detective Mystery Experience",
    description:
      "Dive into immersive detective mysteries with realistic case files, evidence, and interactive 3D experiences. Can you solve the case?",
    images: ["/textures/shield.png"],
    siteName: "Crack-the-Case",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crack-the-Case | Interactive Detective Mystery Experience",
    description:
      "Dive into immersive detective mysteries with realistic case files, evidence, and interactive 3D experiences. Can you solve the case?",
    images: ["/textures/shield.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
