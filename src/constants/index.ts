import type { CeloNetwork } from "../types";

/** Celo Mainnet */
export const CELO_MAINNET: CeloNetwork = {
  chainId: 42220,
  name: "Celo Mainnet",
  rpcUrl: "https://forno.celo.org",
  explorerUrl: "https://celoscan.io",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
};

/** Alfajores Testnet */
export const CELO_ALFAJORES: CeloNetwork = {
  chainId: 44787,
  name: "Celo Alfajores Testnet",
  rpcUrl: "https://alfajores-forno.celo-testnet.org",
  explorerUrl: "https://alfajores.celoscan.io",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
};

/** All supported networks keyed by chainId */
export const CELO_NETWORKS: Record<number, CeloNetwork> = {
  [CELO_MAINNET.chainId]: CELO_MAINNET,
  [CELO_ALFAJORES.chainId]: CELO_ALFAJORES,
};

/** EIP-3085 chain params for wallet_addEthereumChain */
export const CHAIN_PARAMS: Record<number, object> = {
  [CELO_MAINNET.chainId]: {
    chainId: "0xA4EC",
    chainName: CELO_MAINNET.name,
    rpcUrls: [CELO_MAINNET.rpcUrl],
    blockExplorerUrls: [CELO_MAINNET.explorerUrl],
    nativeCurrency: CELO_MAINNET.nativeCurrency,
  },
  [CELO_ALFAJORES.chainId]: {
    chainId: "0xAEF3",
    chainName: CELO_ALFAJORES.name,
    rpcUrls: [CELO_ALFAJORES.rpcUrl],
    blockExplorerUrls: [CELO_ALFAJORES.explorerUrl],
    nativeCurrency: CELO_ALFAJORES.nativeCurrency,
  },
};

export const DEFAULT_CHAIN_ID = CELO_MAINNET.chainId;
