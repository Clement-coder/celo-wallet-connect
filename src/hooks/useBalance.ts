"use client";

import { useCallback, useEffect, useState } from "react";
import { useCeloWalletContext } from "../providers/CeloWalletProvider";
import type { Address } from "viem";
import type { BalanceResult } from "../types";

/**
 * useBalance — fetches and auto-refreshes the CELO balance for an address.
 *
 * @example
 * const { balance, isLoading } = useBalance();
 * const { balance } = useBalance("0x1234...");
 */
export function useBalance(address?: Address) {
  const { client, state } = useCeloWalletContext();
  const target = address ?? state.address ?? undefined;

  const [balance, setBalance] = useState<BalanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!target) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await client.getBalance(target);
      setBalance(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [client, target]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { balance, isLoading, error, refetch: fetch };
}
