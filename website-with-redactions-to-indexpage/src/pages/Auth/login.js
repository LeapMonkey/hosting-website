import styled from "styled-components";
import { Column, DefaultImage, GreenText } from "../../components/Element";
import Input from "../../components/Element/input";
import Button from "../../components/Element/button";
import { useState } from "react";

const Login = () => {
  const [logininfo, setLoginInfo] = useState({
    userinfo: "",
    password: "",
  });
  const handleChange = (e) => {
    setLoginInfo({ ...logininfo, [e.target.name]: e.target.value });
  };
  const handleClick = () => {
    console.log(logininfo);
  };
  return (
    <Wrapper>
      <Title>Logo</Title>
      <Container>
        <Title>Sign In</Title>
        <Input
          name="userinfo"
          placeholder="Email or Username"
          fsize="18px"
          onChange={handleChange}
        />
        <Input
          name="password"
          placeholder="Password"
          fsize="18px"
          onChange={handleChange}
        />
        <Button
          fsize="28px"
          text="SIGN IN"
          fweight="400"
          bgcolor="linear-gradient(270deg, #06c200, #035c00)"
          onClick={handleClick}
        />
        <GreenText>Forgot your password</GreenText>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  gap: 30px;
  height: 93.9vh;
  background-color: #313131;
  justify-content: center;
  width: 100%;
  padding: 10px;
`;
const Container = styled(Column)`
  gap: 30px;
  color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  border: 1px px double transparent;
  font-size: 14px;
  max-width: 400px;
  width: 100%;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 500;
`;

export default Login;
