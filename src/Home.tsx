import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import {
  baseURL,
  CUSTOM_SCHEMAS,
  EASContractAddress,
  getAddressForENS,
  submitSignedAttestation,
} from "./utils/utils";
import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import invariant from "tiny-invariant";
import { ethers } from "ethers";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import { useSigner } from "./utils/wagmi-utils";

const Title = styled.div`
  color: #163a54;
  font-size: 22px;
  font-family: Montserrat, sans-serif;
`;

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const MetButton = styled.div`
  border-radius: 10px;
  border: 1px solid #cfb9ff;
  background: #333342;
  width: 100%;
  padding: 20px 10px;
  box-sizing: border-box;
  color: #fff;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  cursor: pointer;
`;

const SubText = styled(Link)`
  display: block;
  cursor: pointer;
  text-decoration: underline;
  color: #ababab;
  margin-top: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  height: 90px;
`;

const EnsLogo = styled.img`
  position: absolute;
  left: 14px;
  top: 28px;
  width: 30px;
`;

const InputBlock = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  border: 1px solid rgba(19, 30, 38, 0.33);
  background: rgba(255, 255, 255, 0.5);
  color: #131e26;
  font-size: 18px;
  font-family: Chalkboard, sans-serif;
  padding: 20px 10px;
  text-align: center;
  margin-top: 12px;
  box-sizing: border-box;
  width: 100%;
`;

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 36px;
  max-width: 590px;
  border-radius: 10px;
  margin: 40px auto 0;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

function Home() {
  const { status, address: myAddress } = useAccount();
  const modal = useModal();
  const [address, setAddress] = useState("");
  const signer = useSigner();
  const [attesting, setAttesting] = useState(false);
  const [ensResolvedAddress, setEnsResolvedAddress] = useState("Dakh.eth");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const addressParam = searchParams.get("address");
    if (addressParam) {
      setAddress(addressParam);
    }
  }, []);

  useEffect(() => {
    async function checkENS() {
      if (address.includes(".eth")) {
        const tmpAddress = await getAddressForENS(address);

        if (tmpAddress) {
          setEnsResolvedAddress(tmpAddress);
        } else {
          setEnsResolvedAddress("");
        }
      } else {
        setEnsResolvedAddress("");
      }
    }

    checkENS();
  }, [address]);

  // useEffect(() => {
  //   async function runGetConnections() {
  //     invariant(myAddress, "myAddress must be defined");
  //
  //     const connections = await getConnections(myAddress);
  //     setAttestations(connections);
  //   }
  //
  //   runGetConnections();
  // }, [myAddress]);

  return (
    <Container>
      <GradientBar />
      <WhiteBox>
        <Title>
          I <b>attest</b> that I met
        </Title>

        <InputContainer>
          <InputBlock
            autoCorrect={"off"}
            autoComplete={"off"}
            autoCapitalize={"off"}
            placeholder={"Address/ENS"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {ensResolvedAddress && <EnsLogo src={"/ens-logo.png"} />}
        </InputContainer>
        <MetButton
          onClick={async () => {
            if (status !== "connected") {
              modal.setOpen(true);
            } else {
              setAttesting(true);
              try {
                const schemaEncoder = new SchemaEncoder("bool metIRL");
                const encoded = schemaEncoder.encodeData([
                  { name: "metIRL", type: "bool", value: true },
                ]);

                const eas = new EAS(EASContractAddress);

                invariant(signer, "signer must be defined");
                eas.connect(signer);

                // const offchain = await eas.getOffchain();
                const offchain = await eas.getOffchain();

                const recipient = ensResolvedAddress
                  ? ensResolvedAddress
                  : address;

                const signedOffchainAttestation =
                  await offchain.signOffchainAttestation(
                    {
                      schema: CUSTOM_SCHEMAS.MET_IRL_SCHEMA,
                      recipient,
                      refUID: ethers.ZeroHash,
                      data: encoded,
                      time: BigInt(dayjs().unix()),
                      revocable: true,
                      expirationTime: BigInt(0),
                      version: 1,
                      nonce: BigInt(0),
                    },
                    signer
                  );

                const pkg: AttestationShareablePackageObject = {
                  signer: myAddress,
                  sig: signedOffchainAttestation,
                };

                const res = await submitSignedAttestation(pkg);

                if (!res.data.error) {
                  try {
                    // Update ENS names
                    await Promise.all([
                      axios.get(`${baseURL}/api/getENS/${myAddress}`),
                      axios.get(`${baseURL}/api/getENS/${recipient}`),
                    ]);
                  } catch (e) {
                    console.error("ens error:", e);
                  }

                  setTimeout(() => {
                    navigate(`/connections`);
                  }, 500);
                } else {
                  console.error(res.data.error);
                }
              } catch (e) {
                console.error(e);
              }

              setAttesting(false);
            }
          }}
        >
          {attesting
            ? "Attesting..."
            : status === "connected"
            ? "Make attestation"
            : "Connect wallet"}
        </MetButton>

        {status === "connected" && (
          <>
            <SubText to={"/qr"}>Show my QR code</SubText>
            <SubText to={"/connections"}>Connections</SubText>
          </>
        )}
      </WhiteBox>
    </Container>
  );
}

export default Home;
