import { Attestation, ResolvedAttestation } from "./utils/types";
import styled from "styled-components";
import { Identicon } from "./components/Identicon";
import { useAccount } from "wagmi";
import dayjs from "dayjs";
import { timeFormatString } from "./utils/utils";

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
  font-family: Montserrat;
`;
const Check = styled.div``;

type Props = {
  data: ResolvedAttestation;
};

export function AttestationItem({ data }: Props) {
  const { address } = useAccount();
  if (!address) return null;

  const isAttester = data.attester.toLowerCase() === address.toLowerCase();

  return (
    <Container
      onClick={() => {
        window.open(`https://sepolia.easscan.org/attestation/view/${data.id}`);
      }}
    >
      <IconHolder>
        <Identicon
          address={isAttester ? data.recipient : data.attester}
          size={60}
        />
      </IconHolder>
      <NameHolder>{data.name}</NameHolder>
      <Time>{dayjs.unix(data.time).format(timeFormatString)}</Time>
    </Container>
  );
}
