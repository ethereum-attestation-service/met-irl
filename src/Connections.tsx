import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import {
  getAttestationsForAddress,
  getConfirmationAttestationsForUIDs,
  getENSNames,
} from "./utils/utils";
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

      const uids = tmpAttestations.map((att) => att.id);

      const confirmations = await getConfirmationAttestationsForUIDs(uids);

      tmpAttestations.forEach((att) => {
        const amIAttester =
          att.attester.toLowerCase() === address.toLowerCase();

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
          {attestations.length > 0 || loading ? (
            attestations.map((attestation, i) => (
              <AttestationItem key={i} data={attestation} />
            ))
          ) : (
            <div>No one here yet</div>
          )}
        </WhiteBox>
      </AttestationHolder>
    </Container>
  );
}

export default Home;
