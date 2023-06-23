import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount, useEnsName, useSigner } from "wagmi";
import { useModal } from "connectkit";
import {
  CUSTOM_SCHEMAS,
  EASContractAddress,
  getAddressForENS,
  getAttestation,
  timeFormatString,
} from "./utils/utils";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import invariant from "tiny-invariant";
import { ethers } from "ethers";
import { Attestation } from "./utils/types";
import dayjs from "dayjs";
import { Identicon } from "./components/Identicon";
import { Link, useSearchParams } from "react-router-dom";
import { FaQrcode } from "react-icons/fa";

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

const NewConnection = styled.div`
  color: #333342;
  text-align: center;
  font-size: 25px;
  font-family: Montserrat, sans-serif;
  font-style: italic;
  font-weight: 700;
  margin-top: 20px;
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

const Time = styled.div`
  color: #163a54;
  font-size: 18px;
  font-family: Chalkboard, sans-serif;
  margin-top: 20px;
`;

const SubText = styled(Link)`
  display: block;
  cursor: pointer;
  text-decoration: underline;
  color: #ababab;
  margin-top: 20px;
`;

const GotoAttestationButton = styled.div`
  color: #163a54;
  font-size: 16px;
  font-family: Chalkboard, sans-serif;
  padding: 14px 20px;
  border-radius: 8px;
  border: 1px solid #163a54;
  background: #fff;
  margin-top: 30px;
  cursor: pointer;
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

const QrIcon = styled(FaQrcode)`
  margin-top: 40px;
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

const FinalAddress = styled.div`
  color: #333342;
  text-align: center;
  font-size: 36px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  word-break: break-all;
`;

const SmallWhiteBox = styled(WhiteBox)`
  max-width: 400px;
  margin-top: 80px;
  position: relative;
  padding-top: 80px;
  padding-bottom: 40px;
`;

const IconHolder = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
`;

const eas = new EAS(EASContractAddress);

function Home() {
  const { status } = useAccount();
  const modal = useModal();
  const [address, setAddress] = useState("");
  const { data: signer } = useSigner();
  const [attesting, setAttesting] = useState(false);
  const [ensResolvedAddress, setEnsResolvedAddress] = useState("Dakh.eth");
  const [finalAttestation, setFinalAttestation] = useState<Attestation | null>(
    null
  );
  const [searchParams] = useSearchParams();

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

  return (
    <Container>
      <GradientBar />
      {!finalAttestation ? (
        <WhiteBox>
          <Title>
            I <b>attest</b> that I met
          </Title>

          <InputContainer>
            <InputBlock
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

                  invariant(signer, "signer must be defined");
                  eas.connect(signer);

                  const tx = await eas.attest({
                    data: {
                      recipient: ensResolvedAddress
                        ? ensResolvedAddress
                        : address,
                      data: encoded,
                      refUID: ethers.constants.HashZero,
                      revocable: true,
                      expirationTime: 0,
                    },
                    schema: CUSTOM_SCHEMAS.MET_IRL_SCHEMA,
                  });

                  const uid = await tx.wait();

                  const attestation = await getAttestation(uid);

                  setFinalAttestation(attestation);

                  // window.open(
                  //   `https://sepolia.easscan.org/attestation/view/${uid}`,
                  //   "_blank"
                  // );
                } catch (e) {}

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
      ) : (
        <>
          <NewConnection>New Connection! 👋</NewConnection>

          <SmallWhiteBox>
            <IconHolder>
              <Identicon address={finalAttestation.recipient} size={100} />
            </IconHolder>
            <FinalAddress>
              {ensResolvedAddress ? ensResolvedAddress : address}
            </FinalAddress>

            <Time>
              {dayjs.unix(finalAttestation.time).format(timeFormatString)}
            </Time>

            <GotoAttestationButton
              onClick={() => {
                window.open(
                  `https://sepolia.easscan.org/attestation/view/${finalAttestation?.id}`,
                  "_blank"
                );
              }}
            >
              Go to attestation record
            </GotoAttestationButton>
          </SmallWhiteBox>
        </>
      )}
    </Container>
  );
}

export default Home;
