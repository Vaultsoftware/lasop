"use client";

import dynamic from "next/dynamic";

const StoreProvider = dynamic(() => import("@/store/StoreProvider"), { ssr: false });

export default function StoreProviderClient({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
