import 'swiper/css';
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProviderClient from "./StoreProviderClient";
import AOSInitializer from "@/components/AOSInitializer/AOSInitializer"; 


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lagos School Of Programming",
  description: "The best programming school in Africa",
  icons: {
    icon: "/lasop.png.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lasop.png.ico" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <StoreProviderClient>
            <AOSInitializer />
            {children}
          </StoreProviderClient>
        </Suspense>
      </body>
    </html>
  );
}
