import type { Metadata } from "next";
import { Inter, Fira_Mono } from "next/font/google";
import "../globals.css";

import BottomNavigation from "@/components/BottomNavigation";
import TopNavbar from "@/components/TopNavbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title:
    "Restro - Order delicious food from your favorite restaurant with Restro.",
  description:
    "Order delicious food from your favorite restaurant with Restro. Fast delivery, great taste, and amazing offers!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <TopNavbar />
        {children}
        <BottomNavigation />
    </>
  );
}
