import { ConnectKitButton } from "connectkit";
import styled from "styled-components";
import { ButtonBase } from "../../styles/buttons";
import { theme } from "../../utils/theme";

const StyledButton = styled.button`
  ${ButtonBase};

  min-width: 150px;
  background-color: ${theme.neutrals["cool-grey-050"]};
  border: 1px solid ${theme.neutrals["cool-grey-100"]}
  padding: 10px 25px;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 10px -4px ${theme.primary["indigo-100"]};
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 10px -4px ${theme.primary["indigo-100"]};
  }
`;

export const CustomConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <StyledButton onClick={show}>
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </StyledButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
