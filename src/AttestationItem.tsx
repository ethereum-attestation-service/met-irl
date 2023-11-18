import { ResolvedAttestation } from "./utils/types";
import styled from "styled-components";
import { Identicon } from "./components/Identicon";
import { useAccount, useEnsAvatar } from "wagmi";
import dayjs from "dayjs";
import {
  baseURL,
  CUSTOM_SCHEMAS,
  EASContractAddress,
  submitSignedAttestation,
  timeFormatString,
} from "./utils/utils";
import { theme } from "./utils/theme";
import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import invariant from "tiny-invariant";
import { ethers } from "ethers";
import { useState } from "react";
import { MdOutlineVerified, MdVerified } from "react-icons/md";
import { useSigner } from "./utils/wagmi-utils";

const Container = styled.div`
  border-radius: 25px;
  border: 1px solid rgba(168, 198, 207, 0.4);
  background: #fff;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  @media (max-width: 700px) {
    display: block;
    text-align: center;
  }
`;

const VerifyIconContainer = styled.div`
  @media (max-width: 700px) {
    margin-top: 16px;
  }
`;

const IconHolder = styled.div`
  @media (max-width: 700px) {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
`;
const NameHolder = styled.div`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  word-break: break-all;

  @media (max-width: 700px) {
    margin-bottom: 10px;
  }
`;
const Time = styled.div`
  color: #adadad;
  text-align: center;
  font-size: 14px;
  font-family: Montserrat, serif;
`;
const Check = styled.div``;

const ConfirmButton = styled.div`
  display: inline-block;
  border-radius: 10px;
  border: 1px solid #cfb9ff;
  background: #333342;
  padding: 8px;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  cursor: pointer;

  :hover {
    background: #cfb9ff;
    color: #333342;
  }

  @media (max-width: 700px) {
    margin-top: 10px;
    width: 100%;
    padding: 14px 8px;
  }
`;

type Props = {
  data: ResolvedAttestation;
};

const eas = new EAS(EASContractAddress);

export function AttestationItem({ data }: Props) {
  const { address } = useAccount();
  const isAttester = data.attester.toLowerCase() === address?.toLowerCase();
  const [confirming, setConfirming] = useState(false);
  const subjectAddress = isAttester ? data.recipient : data.attester;
  const { data: avatar } = useEnsAvatar({
    cacheTime: 60 * 60 * 24 * 7 * 1000,
    name: data.name,
  });
  const signer = useSigner();

  if (!address) return null;

  const isConfirmed = !!data.confirmation;

  const isConfirmable = !isAttester && !isConfirmed;

  let Icon = MdVerified;
  if (!isConfirmed) {
    Icon = MdOutlineVerified;
  }

  return (
    <Container
      onClick={() => {
        window.open(`${baseURL}/attestation/view/${data.id}`);
      }}
    >
      <IconHolder>
        {avatar ? (
          <img
            src={avatar}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              objectFit: "cover",
            }}
          />
        ) : (
          <Identicon address={subjectAddress} size={60} />
        )}
      </IconHolder>
      <NameHolder>{data.name}</NameHolder>
      <Time>{dayjs.unix(data.time).format(timeFormatString)}</Time>
      <Check>
        {isConfirmable ? (
          <ConfirmButton
            onClick={async (e) => {
              e.stopPropagation();

              setConfirming(true);
              try {
                const schemaEncoder = new SchemaEncoder("bool confirm");
                const encoded = schemaEncoder.encodeData([
                  { name: "confirm", type: "bool", value: true },
                ]);

                invariant(signer, "signer must be defined");
                eas.connect(signer);

                const offchain = await eas.getOffchain();

                const signedOffchainAttestation =
                  await offchain.signOffchainAttestation(
                    {
                      schema: CUSTOM_SCHEMAS.CONFIRM_SCHEMA,
                      recipient: ethers.ZeroAddress,
                      refUID: data.id,
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
                  signer: address,
                  sig: signedOffchainAttestation,
                };

                const result = await submitSignedAttestation(pkg);

                window.location.reload();
                setConfirming(false);
              } catch (e) {}
            }}
          >
            {confirming ? "Confirming..." : "Confirm we met"}
          </ConfirmButton>
        ) : (
          <VerifyIconContainer>
            <Icon
              color={
                data.confirmation
                  ? theme.supporting["green-vivid-400"]
                  : theme.neutrals["cool-grey-100"]
              }
              size={22}
            />
          </VerifyIconContainer>
        )}
      </Check>
    </Container>
  );
}
