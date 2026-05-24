import { describe, it, expect } from "vitest";
import { formatBalance, shortenAddress, hexToChainId, chainIdToHex, isBrowser } from "../src/utils";

describe("formatBalance", () => {
  it("formats 1 CELO correctly", () => {
    expect(formatBalance(1_000_000_000_000_000_000n)).toBe("1");
  });
  it("formats 0.5 CELO correctly", () => {
    expect(formatBalance(500_000_000_000_000_000n)).toBe("0.5");
  });
});

describe("shortenAddress", () => {
  it("shortens an address", () => {
    expect(shortenAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x1234…5678");
  });
});

describe("hexToChainId / chainIdToHex", () => {
  it("converts hex to chainId", () => {
    expect(hexToChainId("0xA4EC")).toBe(42220);
  });
  it("converts chainId to hex", () => {
    expect(chainIdToHex(42220)).toBe("0xa4ec");
  });
});

describe("isBrowser", () => {
  it("returns true in jsdom test environment", () => {
    // jsdom provides window, so isBrowser() correctly returns true here
    expect(isBrowser()).toBe(true);
  });
});
