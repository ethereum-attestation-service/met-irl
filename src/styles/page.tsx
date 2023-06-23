import styled from "styled-components";
import { theme } from "../utils/theme";

export const OuterScreenBlockPadding = styled.div`
  padding: 1rem 2rem;
  box-sizing: border-box;
  height: 100%;

  @media only screen and (max-width: 800px) {
    padding: 0.5rem 0.5rem;
  }
`;

export const PageTitle = styled.div`
  font-family: "Montserrat", serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #000000;
  margin-top: 20px;
  margin-bottom: 20px;

  @media only screen and (max-width: 700px) {
    padding-left: 20px;
  }
`;

type ScreenOuterBlockProps = {
  width?: number;
};

export const ScreenOuterBlock = styled.div<ScreenOuterBlockProps>`
  margin: 0 auto;
  max-width: ${({ width }) => width ?? 1200}px;
`;

export const globalRadiusWhite = `
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 20px #e6e6e6;
`;

export const ScreenWhiteBlock = styled.div`
  padding: 2rem 3rem;
  box-sizing: border-box;
  ${globalRadiusWhite};

  @media only screen and (max-width: 750px) {
    padding: 0.5rem 0.5rem;
  }
`;

export const TableHolder = styled.div`
  margin-top: 12px;
  overflow-x: auto;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const Alert = styled.div`
  background-color: ${theme.primary["orange-vivid-700"]};
  display: flex;
  padding: 10px 15px;
  justify-content: center;
  border-radius: 2px;
  color: #fff;
  align-items: center;
  margin-bottom: 1rem;
  box-sizing: border-box;
`;
export const ColumnContainer = styled.div`
  width: 700px;
  border-radius: 10px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;
export const PostsContainer = styled.div`
  padding: 28px 46px;
  background-color: #fff;
  box-sizing: border-box;

  @media (max-width: 700px) {
    padding: 28px 0px 20px 20px;
  }
`;
export const PostBlockContainer = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  border-radius: 10px 10px 0 0;
  background-color: #fff;
  padding: 36px 36px 0 36px;

  @media (max-width: 700px) {
    padding: 36px 8px 0 8px;
    box-sizing: border-box;
  }
`;
export const BlackButton = styled.div`
  background: #000;
  border-radius: 15px;
  font-family: "Audiowide", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #ffffff;
  padding: 0 10px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-transform: uppercase;
`;
