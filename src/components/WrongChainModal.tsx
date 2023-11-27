import { useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { IoExitOutline } from "react-icons/io5";
import { theme } from "../utils/theme";
import { Modal } from "./ui/Modal";
import { activeChainConfig } from "../utils/utils";

const Container = styled(Modal)`
  max-width: 330px !important;
  box-sizing: border-box;
`;

const Inner = styled.div`
  padding: 12px !important;
`;

const Title = styled.div`
  font-family: Nunito, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.neutrals["cool-grey-700"]};
  text-align: center;
`;

const Subtitle = styled.div`
  font-family: Nunito, sans-serif;
  font-size: 16px;
  color: ${theme.neutrals["cool-grey-300"]};
  text-align: center;
  margin-top: 16px;
`;

const ChainBlock = styled.div`
  display: flex;
  padding: 8px;
  background: ${theme.neutrals["cool-grey-050"]};
  border-radius: 8px;
  text-transform: capitalize;
  color: ${theme.neutrals["cool-grey-700"]};
  margin-top: 24px;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const OrLine = styled.div`
  border-top: 1px solid ${theme.neutrals["cool-grey-100"]};
  position: relative;
  margin-top: 34px;
`;

const OrText = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0 10px;
  font-size: 16px;
  color: ${theme.neutrals["cool-grey-300"]};
`;

const DisconnectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  color: ${theme.neutrals["cool-grey-800"]};
  font-family: Nunito, sans-serif;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid ${theme.neutrals["cool-grey-100"]};
  border-radius: 8px;
  padding: 8px;
  gap: 8px;
`;

export function WrongChainModal() {
  const { chain } = useNetwork();
  invariant(activeChainConfig, "No active chain config");
  const { switchNetwork } = useSwitchNetwork({
    chainId: activeChainConfig.chainId,
  });

  const { disconnect } = useDisconnect();

  const isCorrectChain = chain && chain.id === activeChainConfig!.chainId;

  return (
    <Container isVisible={!isCorrectChain && !!chain} handleClose={() => {}}>
      <Inner>
        <Title>Switch Networks</Title>
        <Subtitle>
          This app does not support the current connected network. Switch or
          disconnect to continue.
        </Subtitle>

        <ChainBlock onClick={() => switchNetwork!()}>
          <img
            src={`/images/network/${activeChainConfig.chainName}.png`}
            alt="chain logo"
            width={26}
            height={26}
          />
          {activeChainConfig.chainName}
        </ChainBlock>

        <OrLine>
          <OrText>or</OrText>
        </OrLine>

        <DisconnectButton onClick={() => disconnect!()}>
          <IoExitOutline size={20} />
          Disconnect
        </DisconnectButton>
      </Inner>
    </Container>
  );
}
