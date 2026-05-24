// React example — connect a Celo wallet and display balance
import React from "react";
import {
  CeloWalletProvider,
  useWallet,
  useBalance,
  useCeloAccount,
} from "celo-wallet-connect";

function WalletButton() {
  const { connect, disconnect, isConnected, isConnecting, address, error } = useWallet();
  const { balance } = useBalance();
  const { network } = useCeloAccount();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <p>Network: {network?.name}</p>
        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      <button onClick={() => connect("metamask")} disabled={isConnecting}>
        {isConnecting ? "Connecting…" : "Connect MetaMask"}
      </button>
      <button onClick={() => connect("valora")}>Connect Valora</button>
      <button onClick={() => connect("minipay")}>Connect MiniPay</button>
    </div>
  );
}

export default function App() {
  return (
    <CeloWalletProvider config={{ defaultChainId: 42220, autoConnect: true }}>
      <h1>Celo Wallet Connect — React Example</h1>
      <WalletButton />
    </CeloWalletProvider>
  );
}
