import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useEffect } from "react";
import { useState } from "react";
import { getServiceApi } from "../action/action";

const Profile = () => {
  const [auth, setAuth] = useState();
  const [serviceData, setServiceData] = useState();
  const initialData = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    setAuth(authdata.user);
    const response = await getServiceApi();
    setServiceData(
      response.serviceData.filter((item) => item.userid === authdata.user._id)
    );
  };
  useEffect(() => {
    initialData();
  }, []);

  return (
    <Wrapper>
      <WrapperContainer>
        <UserInfoGroup>
          {auth?.username}
          <DefaultText>{auth?.email}</DefaultText>
        </UserInfoGroup>
        <UserServerGroup>
          <ColumnData>
            <DefaultTitle>Servers</DefaultTitle>
            {serviceData &&
              serviceData.map((item) => <DefaultText>{item.name}</DefaultText>)}
          </ColumnData>

          <ColumnData>
            <DefaultTitle>End Date</DefaultTitle>
            <DefaultText>9/6/23</DefaultText>
            <DefaultText>Researching</DefaultText>
            <DefaultText>Researching</DefaultText>
          </ColumnData>
        </UserServerGroup>
      </WrapperContainer>
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  justify-content: center;
  color: white;
  padding: 20px;
  height: 100vh;
`;
const WrapperContainer = styled(Column)`
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  max-width: 900px;
  width: 100%;
`;
const UserInfoGroup = styled(Column)`
  border-radius: 10px;
  font-size: 36px;
  font-weight: 600;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  background-color: #00000066;
  width: 100%;
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
export default Profile;
