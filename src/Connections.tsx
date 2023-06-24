import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import {
  EASContractAddress,
  getAttestationsForAddress,
  getENSNames,
} from "./utils/utils";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ResolvedAttestation } from "./utils/types";
import { AttestationItem } from "./AttestationItem";

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const AttestationHolder = styled.div``;

const NewConnection = styled.div`
  color: #333342;
  text-align: center;
  font-size: 25px;
  font-family: Montserrat, sans-serif;
  font-style: italic;
  font-weight: 700;
  margin-top: 20px;
`;

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 20px;
  width: 590px;
  border-radius: 10px;
  margin: 40px auto 0;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const eas = new EAS(EASContractAddress);

function Home() {
  const { address } = useAccount();
  const [attestations, setAttestations] = useState<ResolvedAttestation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getAtts() {
      setAttestations([]);
      setLoading(true);
      if (!address) return;
      const tmpAttestations = await getAttestationsForAddress(address);

      const addresses = new Set<string>();

      tmpAttestations.forEach((att) => {
        addresses.add(att.attester);
        addresses.add(att.recipient);
      });

      let resolvedAttestations: ResolvedAttestation[] = [];

      const ensNames = await getENSNames(Array.from(addresses));

      tmpAttestations.forEach((att) => {
        const identity =
          att.attester.toLowerCase() === address.toLocaleLowerCase()
            ? att.recipient
            : att.attester;

        resolvedAttestations.push({
          ...att,
          name:
            ensNames.find(
              (name) => name.id.toLowerCase() === identity.toLowerCase()
            )?.name || identity,
        });
      });

      setAttestations(resolvedAttestations);
      setLoading(false);
    }
    getAtts();
  }, [address]);

  return (
    <Container>
      <GradientBar />
      <NewConnection>Who you met IRL.</NewConnection>
      <AttestationHolder>
        <WhiteBox>
          {loading && <div>Loading...</div>}
          {attestations.map((attestation, i) => (
            <AttestationItem key={i} data={attestation} />
          ))}
        </WhiteBox>
      </AttestationHolder>
    </Container>
  );
}

export default Home;
