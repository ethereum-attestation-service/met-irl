import styled from "styled-components";

const GradientBarContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 200px;
  left: 0;
  top: 79px;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(194, 240, 255, 0.25) 0%,
    rgba(184, 251, 247, 0.25) 19.15%,
    rgba(237, 203, 192, 0.165) 38.91%,
    rgba(135, 169, 239, 0.25) 51.27%,
    rgba(201, 179, 244, 0.25) 66.09%
  );
  filter: blur(50px);
`;

const GradientBar = () => {
  return <GradientBarContainer />;
};

export default GradientBar;
