import styled from "styled-components";
import React from "react";
import { theme } from "../../utils/theme";

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.neutrals["cool-grey-500"]}88;
  padding: 8px;
  box-sizing: border-box;
`;

const DialogContainer = styled.div`
  z-index: 2;
  max-width: 800px;
  position: relative;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 4px ${theme.neutrals["cool-grey-500"]};
`;

const Body = styled.div`
  padding: 12px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
`;

type Props = {
  children: React.ReactNode;
  isVisible: boolean;
  handleClose: () => void;
  className?: string;
};

export function Modal({ children, isVisible, handleClose, className }: Props) {
  return isVisible ? (
    <Container onClick={handleClose}>
      <DialogContainer
        onClick={(event) => event.stopPropagation()}
        className={className}
      >
        <Body>{children}</Body>
      </DialogContainer>
    </Container>
  ) : null;
}
