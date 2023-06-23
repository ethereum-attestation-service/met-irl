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
  getENSName,
  timeFormatString,
} from "./utils/utils";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import invariant from "tiny-invariant";
import { ethers } from "ethers";
import { Attestation } from "./utils/types";
import dayjs from "dayjs";
import { Identicon } from "./components/Identicon";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
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
    margin: 10px auto;
  }
`;

const SubText = styled(Link)`
  display: block;
  cursor: pointer;
  text-decoration: underline;
  color: #ababab;
  margin-top: 20px;

  @media (min-width: 700px) {
    display: none;
  }
`;

const FinalAddress = styled.div`
  color: #333342;
  text-align: center;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  word-break: break-all;
`;

const SmallWhiteBox = styled(WhiteBox)`
  max-width: 400px;
  position: relative;
  padding-bottom: 40px;
`;

function Home() {
  const { address } = useAccount();
  const [ens, setEns] = useState("");

  useEffect(() => {
    async function checkENS() {
      if (!address) return;
      const name = await getENSName(address);
      if (name) {
        setEns(name);
      } else {
        setEns("");
      }
    }

    checkENS();
  }, [address]);

  return (
    <Container>
      <GradientBar />
      <SmallWhiteBox>
        <FinalAddress>{ens ? ens : address}</FinalAddress>

        {address && (
          <QRCodeSVG
            style={{}}
            value={`https://metirl.org/?address=${ens ? ens : address}`}
            includeMargin={true}
            size={300}
          />
        )}

        <SubText to={"/"}>Back home</SubText>
      </SmallWhiteBox>
    </Container>
  );
}

export default Home;
