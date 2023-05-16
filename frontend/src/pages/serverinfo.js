import styled from "styled-components";
import { Column, Row } from "../components/Element";
import SelectSearch from "react-select-search";
import { gameitems } from "../assets/json/gamedata";
import { useState } from "react";

const ServerInfo = () => {
  const [selectData, setSelectData] = useState("");
  return (
    <Wrapper>
      <WrapperContainer>
        <ServerInfoPart>
          <Title>Server Information</Title>
          <Row>name - my minecraft server</Row>
          <Row>IPv4 - 198.356.10.3</Row>
          <Row>PORT - 34001</Row>
        </ServerInfoPart>
        <ButtonGroup>
          <ColumnButton>
            <Title> Control</Title>
            <Button>Start</Button>
            <Button>Stop</Button>
            <Button>Restart</Button>
          </ColumnButton>
          <ColumnButton>
            <Title> Deployment Control </Title>
            <Button>Reinstall Files</Button>
            <Button>Move Server</Button>
          </ColumnButton>
          <ColumnButton>
            <Title>Data Control</Title>
            <Button>Load Backup</Button>
            <Button>Clean SSD</Button>
          </ColumnButton>
        </ButtonGroup>
        <ColumnButton>
          <Title>General</Title>
          <Button>Add Resources</Button>
          <Button>Extend Rental</Button>
        </ColumnButton>
        <ApplyMod>
          <Row>Mods</Row>
          <Row>Current Mod - FTB-stoneblock3.1.6.1</Row>
          <ButtonGroup2>
            <SelectSearch
              options={gameitems.map((item) => ({
                value: item.id,
                name: item.title,
              }))}
              value={selectData}
              onChange={setSelectData}
              search
            />
            <SelectSearch
              options={gameitems.map((item) => ({
                value: item.id,
                name: item.title,
              }))}
              value={selectData}
              onChange={setSelectData}
              search
            />
          </ButtonGroup2>
        </ApplyMod>
        <Title>Advance ssh </Title>
        <ButtonGroup>
          <Title>Definition</Title>
          <Row>Reinstalls: Devices and reinstalls all </Row>
        </ButtonGroup>
      </WrapperContainer>
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  padding: 20px;
  gap: 20px;
`;
const WrapperContainer = styled(Column)`
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  max-width: 900px;
  width: 100%;
  margin-top: 100px;
`;

const ServerInfoPart = styled(Column)`
  gap: 5px;
  align-items: flex-start;
`;
const Title = styled.div`
  font: 20px;
  margin-bottom: 5px;
`;
const ButtonGroup = styled(Row)`
  gap: 10px;
  align-items: flex-start;
  flex-wrap: wrap;
`;
const ButtonGroup2 = styled(ButtonGroup)`
  gap: 10px;
  align-items: flex-start;
  flex-wrap: nowrap;
`;
const ColumnButton = styled(Column)`
  gap: 5px;
  width: 250px;
`;
const ApplyMod = styled(Column)`
  gap: 10px;
  width: 100%;
`;
const Button = styled.button`
  width: 100%;
  border-radius: 5px;
  padding: 20px;
  font-size: 18px;
  :hover {
    background-color: #00cfc8;
  }
`;
export default ServerInfo;
