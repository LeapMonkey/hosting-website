import styled from "styled-components";
import { Column, DefaultImage, Row } from "../components/Element";
import { useEffect } from "react";
import { useState } from "react";
import { getServiceApi } from "../action/action";
import { useNavigate } from "react-router-dom";
import { ARK } from "../components/Image";
import { getFluxAllUserData, getFluxAuth } from "../utills/manager";
import { getLocation } from "../utills/getlocation";

const Profile = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [serviceData, setServiceData] = useState();
  const navigate = useNavigate();

  const initialData = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    setAuth(authdata.user);
    const response = await getServiceApi();
    const fluxalluser = await getFluxAllUserData();
    const service = response.serviceData.filter(
      (item) => item.userid === authdata.user._id
    );
    const fluxuserdata = fluxalluser?.filter((flux) =>
      service?.some((item) => flux.name === item.servername)
    );
    console.log(fluxuserdata);
    setServiceData(fluxuserdata);
  };

  useEffect(() => {
    if (auth) {
      initialData();
      getFluxAuth();
    } else {
      alert("please login");
    }
  }, []);
  const handleItemClick = (data) => {
    navigate("/server", {
      state: {
        data: data,
      },
    });
  };

  return (
    <Wrapper>
      {auth && (
        <>
          <Banner>
            <DefaultImage src={ARK} />
            <BannerContainer>
              <BannerTitle>{auth?.username}</BannerTitle>
            </BannerContainer>
          </Banner>
          <WrapperContainer>
            {serviceData &&
              serviceData.map((item) => (
                <UserServerGroup onClick={() => handleItemClick(item)}>
                  <ColumnData>
                    <DefaultTitle>Servers</DefaultTitle>
                    <DefaultText>{item.name}</DefaultText>
                  </ColumnData>
                  <ColumnData>
                    <DefaultTitle>End Date</DefaultTitle>
                    <DefaultText>{item.expires_date}</DefaultText>
                  </ColumnData>
                  <ColumnData>
                    <DefaultTitle>Location</DefaultTitle>
                    <DefaultText>
                      {getLocation(item.geolocation[0])}
                    </DefaultText>
                  </ColumnData>
                </UserServerGroup>
              ))}
          </WrapperContainer>
        </>
      )}
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  height: 100vh;
`;
const WrapperContainer = styled(Column)`
  padding: 20px;
  gap: 20px;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
`;

const DefaultText = styled.div`
  font-size: 16px;
  font-weight: 400;
`;
const DefaultTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
`;
const UserServerGroup = styled(Row)`
  gap: 20px;
  padding: 20px;
  background-color: #00000066;
  width: 100%;
  border-radius: 10px;
`;

const ColumnData = styled(Column)`
  align-items: flex-start;
  gap: 5px;
`;
const Banner = styled(Column)`
  width: 100%;
  position: relative;
  height: 32vh;
  img {
    position: absolute;
    height: 100%;
    mask-image: linear-gradient(#fff, transparent);
    width: 100%;
    object-fit: cover;
  }
`;
const BannerContainer = styled(Row)`
  height: 100%;
  position: relative;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
`;
const BannerTitle = styled.h1`
  font-weight: 600;
  color: #fff;
  text-shadow: 2px 2px 1px #191919;
  z-index: 2;
  font-size: 32px;
  margin-right: 50px;
  margin-bottom: 50px;
`;
export default Profile;
