import { Header } from "./components/Header";
import { Outlet } from "react-router";
import { createClient, WagmiConfig } from "wagmi";
import * as chains from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
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

const client = createClient(
  getDefaultClient({
    appName: "Speaketh",
    alchemyId: alchemyApiKey,
    chains: usableChains,
  })
);

export function Root() {
  return (
    <>
      <WagmiConfig client={client}>
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
