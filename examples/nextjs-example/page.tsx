// Next.js example — app/providers.tsx
"use client";
import { CeloWalletProvider } from "celo-wallet-connect";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CeloWalletProvider config={{ defaultChainId: 42220 }}>
      {children}
    </CeloWalletProvider>
  );
}

// app/layout.tsx
// import { Providers } from "./providers";
// export default function RootLayout({ children }) {
//   return <html><body><Providers>{children}</Providers></body></html>;
// }

// app/page.tsx — use hooks directly in client components
"use client";
import { useWallet, useBalance } from "celo-wallet-connect";

export default function Page() {
  const { connect, address, isConnected } = useWallet();
  const { balance } = useBalance();

  return (
    <main>
      {isConnected ? (
        <p>{address} — {balance?.formatted} CELO</p>
      ) : (
        <button onClick={() => connect("metamask")}>Connect</button>
      )}
    </main>
  );
}
