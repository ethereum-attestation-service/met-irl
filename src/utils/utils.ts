import invariant from "tiny-invariant";
import type {
  Attestation,
  AttestationResult,
  EASChainConfig,
  EnsNamesResult,
  MyAttestationResult,
} from "./types";
import {
  ResolvedAttestation,
  StoreAttestationRequest,
  StoreIPFSActionReturn,
} from "./types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { AttestationShareablePackageObject } from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";

export const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

export const CUSTOM_SCHEMAS = {
  MET_IRL_SCHEMA:
    "0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7",
  CONFIRM_SCHEMA:
    "0x4eb603f49d68888d7f8b1fadd351b35a252f287ba465408ceb2b1e1e1efd90d5",
};

dayjs.extend(duration);
dayjs.extend(relativeTime);

function getChainId() {
  return Number(process.env.REACT_APP_CHAIN_ID);
}

export const CHAINID = getChainId();
invariant(CHAINID, "No chain ID env found");

export const EAS_CHAIN_CONFIGS: EASChainConfig[] = [
  {
    chainId: 11155111,
    chainName: "sepolia",
    subdomain: "sepolia.",
    version: "0.26",
    contractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    etherscanURL: "https://sepolia.etherscan.io",
    contractStartBlock: 2958570,
    rpcProvider: `https://sepolia.infura.io/v3/`,
  },
  {
    chainId: 1,
    chainName: "mainnet",
    subdomain: "",
    version: "0.26",
    contractAddress: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
    contractStartBlock: 16756720,
    etherscanURL: "https://etherscan.io",
    rpcProvider: `https://mainnet.infura.io/v3/`,
  },
];

export const activeChainConfig = EAS_CHAIN_CONFIGS.find(
  (config) => config.chainId === CHAINID
);

export const baseURL = `https://${activeChainConfig!.subdomain}easscan.org`;

invariant(activeChainConfig, "No chain config found for chain ID");
export const EASContractAddress = activeChainConfig.contractAddress;

export const EASVersion = activeChainConfig.version;
export const timeFormatString = "MM/DD/YYYY h:mm:ss a";
export async function getAddressForENS(name: string) {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      "mainnet",
      {
        staticNetwork: new ethers.Network("mainnet", 1),
      }
    );

    return await provider.resolveName(name);
  } catch (e) {
    return null;
  }
}
export async function getENSName(address: string) {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      "mainnet",
      {
        staticNetwork: new ethers.Network("mainnet", 1),
      }
    );
    return await provider.lookupAddress(address);
  } catch (e) {
    return null;
  }
}
export async function getAttestation(uid: string): Promise<Attestation | null> {
  const response = await axios.post<AttestationResult>(
    `${baseURL}/graphql`,
    {
      query:
        "query Query($where: AttestationWhereUniqueInput!) {\n  attestation(where: $where) {\n    id\n    attester\n    recipient\n    revocationTime\n    expirationTime\n    time\n    txid\n    data\n  }\n}",
      variables: {
        where: {
          id: uid,
        },
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestation;
}
export async function getAttestationsForAddress(address: string) {
  const response = await axios.post<MyAttestationResult>(
    `${baseURL}/graphql`,
    {
      query:
        "query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {\n  attestations(where: $where, orderBy: $orderBy) {\n    attester\n    revocationTime\n    expirationTime\n    time\n    recipient\n    id\n    data\n  }\n}",

      variables: {
        where: {
          schemaId: {
            equals: CUSTOM_SCHEMAS.MET_IRL_SCHEMA,
          },
          OR: [
            {
              attester: {
                equals: address,
              },
            },
            {
              recipient: {
                equals: address,
              },
            },
          ],
        },
        orderBy: [
          {
            time: "desc",
          },
        ],
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestations;
}
export async function getConfirmationAttestationsForUIDs(refUids: string[]) {
  const response = await axios.post<MyAttestationResult>(
    `${baseURL}/graphql`,
    {
      query:
        "query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {\n  attestations(where: $where, orderBy: $orderBy) {\n    attester\n    revocationTime\n    expirationTime\n    time\n    recipient\n    id\n    data\n  refUID\n  }\n}",

      variables: {
        where: {
          schemaId: {
            equals: CUSTOM_SCHEMAS.CONFIRM_SCHEMA,
          },
          refUID: {
            in: refUids,
          },
        },
        orderBy: [
          {
            time: "desc",
          },
        ],
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestations;
}
export async function getENSNames(addresses: string[]) {
  const response = await axios.post<EnsNamesResult>(
    `${baseURL}/graphql`,
    {
      query:
        "query Query($where: EnsNameWhereInput) {\n  ensNames(where: $where) {\n    id\n    name\n  }\n}",
      variables: {
        where: {
          id: {
            in: addresses,
            mode: "insensitive",
          },
        },
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.ensNames;
}

export async function submitSignedAttestation(
  pkg: AttestationShareablePackageObject
) {
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg),
  };

  return await axios.post<StoreIPFSActionReturn>(
    `${baseURL}/offchain/store`,
    data
  );
}

export async function getConnections(address: `0x${string}`) {
  const tmpAttestations = await getAttestationsForAddress(address);

  const addresses = new Set<string>();

  tmpAttestations.forEach((att) => {
    addresses.add(att.attester);
    addresses.add(att.recipient);
  });

  let resolvedAttestations: ResolvedAttestation[] = [];

  const ensNames = await getENSNames(Array.from(addresses));

  const uids = tmpAttestations.map((att) => att.id);

  const confirmations = await getConfirmationAttestationsForUIDs(uids);

  tmpAttestations.forEach((att) => {
    const amIAttester = att.attester.toLowerCase() === address.toLowerCase();

    const otherGuy = amIAttester ? att.recipient : att.attester;

    const relatedConfirmation = confirmations.find((conf) => {
      return (
        conf.refUID === att.id &&
        ((amIAttester &&
          conf.attester.toLowerCase() === otherGuy.toLowerCase()) ||
          (!amIAttester &&
            conf.attester.toLowerCase() === address.toLowerCase()))
      );
    });

    resolvedAttestations.push({
      ...att,
      confirmation: relatedConfirmation,
      name:
        ensNames.find(
          (name) => name.id.toLowerCase() === otherGuy.toLowerCase()
        )?.name || otherGuy,
    });
  });
  return resolvedAttestations;
}
