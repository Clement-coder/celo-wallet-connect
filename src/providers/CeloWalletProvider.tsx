"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { CeloWalletClient } from "../core/client";
import type { CeloWalletConfig, WalletState } from "../types";

interface CeloWalletContextValue {
  client: CeloWalletClient;
  state: WalletState;
}

const CeloWalletContext = createContext<CeloWalletContextValue | null>(null);

export interface CeloWalletProviderProps {
  config?: CeloWalletConfig;
  children: React.ReactNode;
}

/**
 * CeloWalletProvider — wrap your app with this to enable all SDK hooks.
 *
 * @example
 * <CeloWalletProvider config={{ defaultChainId: 42220 }}>
 *   <App />
 * </CeloWalletProvider>
 */
export function CeloWalletProvider({ config, children }: CeloWalletProviderProps) {
  const clientRef = useRef<CeloWalletClient>(new CeloWalletClient(config));
  const [state, setState] = useState<WalletState>(clientRef.current.getState());

  useEffect(() => {
    return clientRef.current.subscribe(setState);
  }, []);

  return (
    <CeloWalletContext.Provider value={{ client: clientRef.current, state }}>
      {children}
    </CeloWalletContext.Provider>
  );
}

/** Internal hook — access the raw context */
export function useCeloWalletContext(): CeloWalletContextValue {
  const ctx = useContext(CeloWalletContext);
  if (!ctx) {
    throw new Error("useCeloWalletContext must be used inside <CeloWalletProvider>");
  }
  return ctx;
}
