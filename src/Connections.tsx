import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { getConnections } from "./utils/utils";
import { ResolvedAttestation } from "./utils/types";
import { AttestationItem } from "./AttestationItem";
import invariant from "tiny-invariant";
import { useNavigate } from "react-router";

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

function Connections() {
  const { address } = useAccount();
  const [attestations, setAttestations] = useState<ResolvedAttestation[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      return navigate("/");
    }

    async function getAtts() {
      setAttestations([]);
      setLoading(true);

      invariant(address, "Address should be defined");
      const resolvedAttestations = await getConnections(address);

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

export default Connections;
