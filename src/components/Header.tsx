import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import { theme } from "../utils/theme";
import { CustomConnectButton } from "./ui/CustomConnectKit";
import { activeChainConfig } from "../utils/utils";
import invariant from "tiny-invariant";
import { useAccount } from "wagmi";
import { FaQrcode } from "react-icons/fa";

const Outer = styled.div`
  font-family: "Nunito", sans-serif;
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid ${theme.neutrals["cool-grey-100"]};

  padding: 1rem 3rem;
  color: #000;

  @media only screen and (max-width: 750px) {
    padding: 1rem 1rem;
  }
`;

const Container = styled.div`
  display: flex;
`;

const LogoContainer = styled.div`
  min-width: 100px;
  display: flex;
  align-items: center;
`;

const MainNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const QR = styled(FaQrcode)`
  margin-right: 10px;
`;

const LogoImage = styled.img`
  width: 40px;
  margin-right: 4px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;

  @media only screen and (min-width: 700px) {
    .second-search-bar {
      display: none;
    }
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media only screen and (max-width: 700px) {
    display: none;
  }
`;

const MobileLinks = styled.div`
  display: block;
  margin-top: 20px;

  @media only screen and (min-width: 900px) {
    display: none;
  }
`;

const LogoText = styled.span`
  font-family: Audiowide, sans-serif;
  font-size: 22px;
  font-weight: 400;
  white-space: nowrap;
`;

type MenuItemProps = {
  active: boolean;
};

const MenuItem = styled.div<MenuItemProps>`
  background-color: ${({ active }) => (active ? "#F1F4F9" : "#FFF")};
  border-radius: 20px;
  padding: 12px 20px;
  font-family: "Montserrat", serif;
  font-style: normal;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  color: #333342;

  :hover {
    background-color: ${({ active }) => (active ? "#F1F4F9" : "#f1f4f966")};
  }
`;

type MenuItemType = {
  title: string;
  path: string;
  onClick: () => void;
};

export function Header() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation();

  let menuItems: MenuItemType[] = [
    {
      title: "Attest",
      onClick: () => navigate("/"),
      path: "/",
    },
  ];

  if (address) {
    menuItems.push({
      title: "Connections",
      onClick: () => navigate("/connections"),
      path: "/connections",
    });
  }

  invariant(activeChainConfig, "activeChainConfig is not set");

  return (
    <>
      <Outer>
        <Container>
          <MainNavigation>
            <LogoContainer>
              <Logo onClick={() => navigate("/")}>
                <LogoImage src="/logo.png" />
                <LogoText>METIRL</LogoText>
              </Logo>
            </LogoContainer>
            <Left>
              <Links>
                {address && (
                  <QR
                    size={20}
                    color={"#BD9EFF"}
                    onClick={() => navigate("/qr")}
                  />
                )}
                {menuItems.map((menuItem, i) => (
                  <MenuItem
                    key={i}
                    onClick={menuItem.onClick}
                    active={menuItem.path === location.pathname}
                  >
                    {menuItem.title}
                  </MenuItem>
                ))}
              </Links>

              <MobileLinks></MobileLinks>
            </Left>
            <Right>
              <CustomConnectButton />
            </Right>
          </MainNavigation>
        </Container>
      </Outer>
    </>
  );
}
