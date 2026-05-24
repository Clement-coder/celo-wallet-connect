import { describe, it, expect } from "vitest";
import { CELO_MAINNET, CELO_ALFAJORES, CELO_NETWORKS } from "../src/constants";

describe("constants", () => {
  it("mainnet has correct chainId", () => {
    expect(CELO_MAINNET.chainId).toBe(42220);
  });

  it("alfajores has correct chainId", () => {
    expect(CELO_ALFAJORES.chainId).toBe(44787);
  });

  it("CELO_NETWORKS contains both networks", () => {
    expect(CELO_NETWORKS[42220]).toBeDefined();
    expect(CELO_NETWORKS[44787]).toBeDefined();
  });

  it("mainnet rpcUrl is set", () => {
    expect(CELO_MAINNET.rpcUrl).toBe("https://forno.celo.org");
  });
});
