import styled from "styled-components";
import { theme } from "../utils/theme";

export const ButtonBase = `
  padding: 12px 18px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 0;
  user-select: none;
  text-align: center;
  font-family: 'Nunito';
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

type ButtonProps = {
  disabled?: boolean;
};

export const ButtonStandard = styled.button<ButtonProps>`
  ${ButtonBase};
  background-color: ${({ disabled }) =>
    disabled ? theme.neutrals["cool-grey-200"] : theme.primary["indigo-500"]};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};

  :hover {
    background-color: ${({ disabled }) =>
      disabled ? theme.neutrals["cool-grey-200"] : theme.primary["indigo-700"]};
  }
`;

export const ButtonLink = styled.a<ButtonProps>`
  ${ButtonBase};
  background-color: ${({ disabled }) =>
    disabled ? theme.neutrals["cool-grey-200"] : theme.primary["indigo-500"]};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};
  text-decoration: none;

  :hover {
    background-color: ${({ disabled }) =>
      disabled ? theme.neutrals["cool-grey-200"] : theme.primary["indigo-700"]};
  }
`;

export const DangerButton = styled.button<ButtonProps>`
  ${ButtonBase};
  background-color: #fff;
  color: ${theme.supporting["red-vivid-700"]};
  border: 1px solid ${theme.supporting["red-vivid-700"]};

  :hover {
    background-color: ${theme.supporting["red-vivid-700"]};
    color: #fff;
  }
`;

export const ButtonSecondary = styled.button`
  color: ${theme.neutrals["cool-grey-400"]};
  ${ButtonBase};
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};

  :hover {
    background-color: ${theme.neutrals["cool-grey-100"]};
  }
`;

export const ButtonSecondaryLink = styled.a<ButtonProps>`
  font-family: Nunito, sans-serif;
  color: ${theme.neutrals["cool-grey-400"]};
  ${ButtonBase};
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

export const ButtonOrange = styled.button`
  color: #fff;
  background-color: ${theme.primary["orange-vivid-300"]};

  ${ButtonBase};
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};

  :hover {
    background-color: ${theme.primary["orange-vivid-400"]};
  }
`;

export const EndButton = styled(ButtonStandard)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 4px 4px 0;
  margin-top: 0;
  width: 60px;
`;
