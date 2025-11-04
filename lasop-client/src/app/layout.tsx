// =============================================================
// File: src/app/layout.tsx   (UPDATED)
// =============================================================
import "swiper/css";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProviderClient from "./StoreProviderClient";
import AOSInitializer from "@/components/AOSInitializer/AOSInitializer";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import FacebookPixel from "@/components/FacebookPixel";   // ✅ NEW

const inter = Inter({ subsets: ["latin"] });
const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'YOUR_PIXEL_ID'; // ✅ NEW

export const metadata: Metadata = {
  title: "Lagos School Of Programming",
  description: "The best programming school in Africa",
  icons: { icon: "/lasop.png.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lasop.png.ico" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <StoreProviderClient>
            <AOSInitializer />
            {/* ✅ Facebook Pixel globally available */}
            <FacebookPixel pixelId={PIXEL_ID} />
            {children}
            <ScrollToTop />
          </StoreProviderClient>
        </Suspense>
      </body>
    </html>
  );
}
