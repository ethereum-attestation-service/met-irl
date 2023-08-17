import { Header } from "./components/Header";
import { Outlet } from "react-router";
import * as chains from "wagmi/chains";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import "./App.css";
import invariant from "tiny-invariant";
import { activeChainConfig, alchemyApiKey } from "./utils/utils";

invariant(activeChainConfig, "Chain config is not set");

type Chain = {
  readonly id: number;
  readonly network: string;
  readonly name: string;
  readonly nativeCurrency: {
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
  };
  readonly rpcUrls: any;
  readonly blockExplorers: any;
  readonly contracts: any;
};

type ChainConfig = {
  chainName: string;
  chain: Chain;
};

const allChains: ChainConfig[] = [
  {
    chainName: "mainnet",
    chain: chains.mainnet,
  },
  {
    chainName: "arbitrum",
    chain: chains.arbitrum,
  },
  {
    chainName: "sepolia",
    chain: chains.sepolia,
  },
  {
    chainName: "optimism",
    chain: chains.optimism,
  },
  {
    chainName: "polygon",
    chain: chains.polygon,
  },
  {
    chainName: "optimism-goerli",
    chain: chains.optimismGoerli,
  },
  {
    chainName: "base-goerli",
    // @ts-ignore
    chain: chains.baseGoerli,
  },
];

const usableChains = allChains
  .filter((chain) => chain.chainName === activeChainConfig!.chainName)
  .map((chain) => chain.chain);

const config = createConfig(
  getDefaultConfig({
    alchemyId: alchemyApiKey,
    walletConnectProjectId: "20ce3c35631a2b931e382204d8bfb6f1",
    appName: "Ethereum Attestation Service - Attestation Explorer",

    chains: usableChains,
  })
);

export function Root() {
  return (
    <>
      <WagmiConfig config={config}>
        <ConnectKitProvider
          theme={"soft"}
          customTheme={{
            "--ck-font-family": '"Nunito", sans-serif',
          }}
          options={{
            hideQuestionMarkCTA: true,
            hideTooltips: true,
          }}
        >
          <Header />
          <Outlet />
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
}
