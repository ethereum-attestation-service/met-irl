import * as jdenticon from "jdenticon";
import styled from "styled-components";

type ContainerProps = {
  size: number;
};

const Container = styled.div<ContainerProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  cursor: pointer;
`;

type Props = {
  address: string;
  size: number;
  className?: string;
  onClick?: () => void;
};

export function Identicon({ address, size, className, onClick }: Props) {
  const icon = jdenticon.toSvg(address, size, { padding: 0 });

  if (!address || !icon) return null;

  return (
    <Container size={size} className={className} onClick={onClick}>
      <img
        alt={"Identicon"}
        style={{ borderRadius: 100 }}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
      />
    </Container>
  );
}
