import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  currentBlock,
  getAppSpecification,
  getExpire,
  getFluxAuth,
  getIpaddress,
  handleHardRedeployClick,
  handleRedeployClick,
  handleReinstallClick,
  handleRestartClick,
  handleStartClick,
  handleStopClick,
  handleUpdateServer,
} from "../utills/manager";
import Input from "../components/Element/input";
import { getServiceApi, updateUserService } from "../action/action";
import { toast } from "react-toastify";
import Button from "../components/Element/button";

const ServerInfo = () => {
  const location = useLocation();
  const [environment, setEnvironment] = useState();
  const [ipData, setIpData] = useState();
  const getIpData = async () => {
    const ipdata = await getIpaddress(location.state.data.servername);
    setIpData(ipdata);
  };
  const updateExpireData = async () => {
    const olddata = await getAppSpecification(location.state.data.servername);
    console.log(olddata);
    const expire = await getExpire(location.state.data.servername);
    console.log(expire, "expire");
    const currentBlockData = await currentBlock();
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const data = {
      type: "fluxappupdate",
      version: 1,
      appSpecification: {
        version: 6,
        name: olddata.name,
        description: olddata.description,
        owner: olddata.owner,
        compose: [
          {
            name: olddata.compose[0].name,
            description: olddata.compose[0].description,
            repotag: olddata.compose[0].repotag,
            ports: olddata.compose[0].ports,
            domains: olddata.compose[0].domains,
            environmentParameters: olddata.compose[0].environmentParameters,
            commands: [],
            containerPorts: olddata.compose[0].containerPorts,
            containerData: olddata.compose[0].containerData,
            cpu: 0.2,
            ram: 200,
            hdd: 1,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: ["acNA"],
        expire: expire + 22000,
      },
      timestamp: new Date().getTime(),
    };
    console.log(data, "updated data");

    const transaction = await handleUpdateServer(data);
    toast.success(transaction);
    console.log(transaction, "transaction");
    if (transaction) {
      const service = await getServiceApi();
      console.log(service, "filter");

      const filterdata = service.serviceData.filter(
        (data) =>
          data.userid === authdata.user._id &&
          data.servername === location.state.data.servername
      );
      const serviceData = {
        serverid: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.title,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.servername,
        port: location.state.data.port,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("Updated")
      );
    }
  };
  const updateEnvironmentData = async () => {
    if (!environment) {
      return toast.error("Please input Environment");
    }
    const olddata = await getAppSpecification(location.state.data.servername);
    const expire = await getExpire(location.state.data.servername);
    const currentBlockData = await currentBlock();
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const data = {
      type: "fluxappupdate",
      version: 1,
      appSpecification: {
        version: 6,
        name: olddata.name,
        description: olddata.description,
        owner: olddata.owner,
        compose: [
          {
            name: olddata.compose[0].name,
            description: olddata.compose[0].description,
            repotag: olddata.compose[0].repotag,
            ports: olddata.compose[0].ports,
            domains: olddata.compose[0].domains,
            environmentParameters: JSON.parse(environment),
            commands: [],
            containerPorts: olddata.compose[0].containerPorts,
            containerData: olddata.compose[0].containerData,
            cpu: 0.2,
            ram: 200,
            hdd: 1,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: ["acNA"],
        expire: expire,
      },
      timestamp: new Date().getTime(),
    };
    console.log(data);

    const transaction = await handleUpdateServer(data);
    toast.success(transaction);
    console.log(transaction, "transaction");
    if (transaction) {
      const service = await getServiceApi();
      console.log(service, "filter");

      const filterdata = service.serviceData.filter(
        (data) =>
          data.userid === authdata.user._id &&
          data.servername === location.state.data.servername
      );
      const serviceData = {
        serverid: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.title,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.servername,
        port: location.state.data.port,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("Updated")
      );
    }
  };
  useEffect(() => {
    getFluxAuth();
    getIpData();
  }, []);

  return (
    <Wrapper>
      <WrapperContainer>
        <ServerInfoPart>
          <Title>Server Information</Title>
          <Row>name - {location.state.data.name}</Row>
          {ipData?.map((item, key) => (
            <Row key={key}>
              IPv4 - {item.ip.split(":")[0]} - PORT -{" "}
              {location.state.data?.port}
            </Row>
          ))}
        </ServerInfoPart>
        <ButtonGroup>
          <ColumnButton>
            <Title> Control</Title>
            <Button
              text="START"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() => handleStartClick(location.state.data.servername)}
            />
            <Button
              text="STOP"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() => handleStopClick(location.state.data.servername)}
            />
            <Button
              text="RESTART"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() => handleRestartClick(location.state.data.servername)}
            />
          </ColumnButton>
          <ColumnButton>
            <Title> Deployment Control </Title>
            <Button
              text="Reinstall"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() =>
                handleReinstallClick(location.state.data.servername)
              }
            />

            <Button
              text="Move Server"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() =>
                handleRedeployClick(location.state.data.servername)
              }
            />
          </ColumnButton>
          <ColumnButton>
            <Title>Data Control</Title>
            {/* <Button>Load Backup</Button> */}
            <Button
              text=" Clean SSD"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() =>
                handleHardRedeployClick(location.state.data.servername)
              }
            />
          </ColumnButton>
        </ButtonGroup>
        <Title>Update</Title>
        <ButtonGroup2>
          <Button
            onClick={updateExpireData}
            text="Extend Rental"
            width="100%"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
          />
          <Input
            placeholder="[`Admin`]"
            onChange={(e) => setEnvironment(e.target.value)}
          />
          <Button
            text="Update Environment"
            width="100%"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={updateEnvironmentData}
          />
        </ButtonGroup2>

        <ApplyMod>
          <Row>Mods</Row>
          <Row>Current Mod - FTB-stoneblock3.1.6.1</Row>
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
  width: 100%;
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

export default ServerInfo;
