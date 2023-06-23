export type EASChainConfig = {
  chainId: number;
  chainName: string;
  version: string;
  contractAddress: string;
  schemaRegistryAddress: string;
  etherscanURL: string;
  /** Must contain a trailing dot (unless mainnet). */
  subdomain: string;
  contractStartBlock: number;
  rpcProvider: string;
};

export interface AttestationResult {
  data: Data;
}

export interface Data {
  attestation: Attestation | null;
}

export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  revocationTime: number;
  expirationTime: number;
  time: number;
  txid: string;
  data: string;
}
