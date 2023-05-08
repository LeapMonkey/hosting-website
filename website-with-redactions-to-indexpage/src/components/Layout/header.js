import styled from "styled-components";
import { useState } from "react";
import { Column, DefaultImage, GreenText, Row } from "../Element";
import { BiMenu } from "react-icons/bi";
import { Logo } from "../Image";

const items = [
  {
    href: "/services",
    title: "Services",
  },
  {
    href: "/contact",
    title: "Contact",
  },
  {
    href: "/wiki",
    title: "Wiki",
  },
];

const Header = () => {
  const [mobileFlag, setMobileFlag] = useState(false);

  return (
    <Wrapper>
      <Container>
        <DefaultImage src={Logo} />
        <ItemWrapper>
          {items.map((item, key) => (
            <ItemContent href={item.href} key={key}>
              {item.title}
            </ItemContent>
          ))}
        </ItemWrapper>
        <ItemContent href="/login">
          <DefaultImage src="https://minotar.net/helm/MHF_Steve/24.png" />
          <>Login</>
        </ItemContent>
      </Container>

      <MobileContainer>
        <MenuDiv>
          <BiMenu onClick={() => setMobileFlag(!mobileFlag)}></BiMenu>
        </MenuDiv>

        <MobileMenu flag={mobileFlag}>
          {items.map((item, key) => (
            <ItemContent href={item.href} key={key}>
              {item.title}
            </ItemContent>
          ))}
        </MobileMenu>
      </MobileContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
const ItemWrapper = styled(Row)`
  position: relative;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const Container = styled(Row)`
  justify-content: space-between;
  img {
    width: 70px;
  }
  background-color: #2f2f2f;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled(Column)`
  max-height: ${(props) => (props.flag ? 0 : "300px")};
  transition: all 0.3s;
  background-color: rgba(16, 16, 16, 0.95);
  width: 100%;
`;

const MobileContainer = styled(Column)`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: linear-gradient(90deg, #077d09, #0e400d);
    line-height: 64px;
  }
`;

const MenuDiv = styled(Row)`
  background-color: rgba(16, 16, 16, 0.95);
  line-height: 64px;
  padding: 10px;
  svg {
    /* transform: scale(2); */
    color: white;
    font-size: 40px;
  }
`;

const ItemContent = styled.a`
  font-size: 14px;
  font-weight: 600;
  line-height: 64px;
  text-align: center;
  min-width: 10vw;
  :hover {
    background: rgba(0, 0, 0, 0.3);
    height: 100%;
  }
  img {
    width: 24px;
    height: 24px;
    border-radius: 200px;
    vertical-align: middle;
    margin-right: 8px;
  }
`;

export default Header;
