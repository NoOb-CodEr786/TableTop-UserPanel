import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileOnlyWrapper from "../components/MobileOnlyWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TableTop - Delicious Food Delivered",
  description: "Order delicious food from your favorite restaurant with TableTop. Fast delivery, great taste, and amazing offers!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-xl mx-auto`}
      >
        {/* <MobileOnlyWrapper> */}
          {children}
        {/* </MobileOnlyWrapper> */}
      </body>
    </html>
  );
}
