// =============================================================
// File: src/app/layout.tsx
// =============================================================

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./globals.css";

import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Loading from "./loading";
import StoreProviderClient from "./StoreProviderClient";
import AOSInitializer from "@/components/AOSInitializer/AOSInitializer";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import FacebookPixel from "@/components/FacebookPixel";

const inter = Inter({ subsets: ["latin"] });

const PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";

export const metadata: Metadata = {
  title: "Lagos School Of Programming",
  description: "The best programming school in Africa",
  icons: {
    icon: "/lasop.png.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <StoreProviderClient>
            <AOSInitializer />

            {/* Facebook Pixel (only loads if ID exists) */}
            {PIXEL_ID && <FacebookPixel pixelId={PIXEL_ID} />}

            {children}

            <ScrollToTop />
          </StoreProviderClient>
        </Suspense>
      </body>
    </html>
  );
}
