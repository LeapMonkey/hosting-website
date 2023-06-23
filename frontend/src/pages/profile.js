import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useEffect } from "react";
import { useState } from "react";
import { getServiceApi } from "../action/action";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [serviceData, setServiceData] = useState();
  const navigate = useNavigate();

  const initialData = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    setAuth(authdata.user);
    const response = await getServiceApi();
    setServiceData(
      response.serviceData.filter((item) => item.userid === authdata.user._id)
    );
  };
  useEffect(() => {
    auth && initialData();
    console.log(auth, "auth");
    !auth && alert("please login");
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
        <WrapperContainer>
          <UserInfoGroup>
            {auth?.username}
            <DefaultText>{auth?.email}</DefaultText>
          </UserInfoGroup>
          {serviceData &&
            serviceData.map((item) => (
              <UserServerGroup onClick={() => handleItemClick(item)}>
                <ColumnData>
                  <DefaultTitle>Servers</DefaultTitle>
                  <DefaultText>{item.name}</DefaultText>
                </ColumnData>
                <ColumnData>
                  <DefaultTitle>End Date</DefaultTitle>
                  <DefaultText>9/6/23</DefaultText>
                </ColumnData>
              </UserServerGroup>
            ))}
        </WrapperContainer>
      )}
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
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
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
