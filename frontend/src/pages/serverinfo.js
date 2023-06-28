import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  currentBlock,
  getAppSpecification,
  getbenchmarks,
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
import Select from "react-select";
import {
  continentsOptions,
  countriesOptions,
  regionsOptions,
} from "../utills/getlocation";

const ServerInfo = () => {
  const location = useLocation();
  const [environment, setEnvironment] = useState();
  const [ipData, setIpData] = useState();
  const [possibleLocations, setPossibleLocations] = useState();
  const [continent, setContinent] = useState();
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  const [geolocationData, setGeolocationData] = useState();
  const getIpData = async () => {
    const ipdata = await getbenchmarks(location.state.data.name);
    console.log(ipdata, "sdf");
    console.log(ipdata.ipaddress);
    setIpData(ipdata);
  };
  const updateExpireData = async () => {
    const olddata = await getAppSpecification(location.state.data.name);
    console.log(olddata);
    const expire = await getExpire(location.state.data.name);
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
          data.servername === location.state.data.name
      );
      const serviceData = {
        serverid: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
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
    const olddata = await getAppSpecification(location.state.data.name);
    const expire = await getExpire(location.state.data.name);
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
          data.servername === location.state.data.name
      );
      const serviceData = {
        serverid: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("Updated")
      );
    }
  };
  const updateGeolocationData = async () => {
    if (!geolocationData) {
      return toast.error("Please fill out geolocation Data");
    }
    const olddata = await getAppSpecification(location.state.data.name);
    const expire = await getExpire(location.state.data.name);
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
        geolocation: geolocationData,
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
          data.servername === location.state.data.name
      );
      const serviceData = {
        serverid: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("Updated")
      );
    }
  };
  useEffect(() => {
    getFluxAuth();
    getIpData();
    getPossibleLocation();
  }, []);

  const getPossibleLocation = async () => {
    let possibleLocations = [];

    const response = await fetch(
      "https://stats.runonflux.io/fluxinfo?projection=geolocation"
    ).then((res) => res.json());

    if (response.status === "success") {
      const geoData = response.data;
      if (geoData.length > 5000) {
        // all went well
        geoData.forEach((flux) => {
          if (
            flux.geolocation &&
            flux.geolocation.continentCode &&
            flux.geolocation.regionName &&
            flux.geolocation.countryCode
          ) {
            const continentLocation = flux.geolocation.continentCode;
            const countryLocation = `${continentLocation}_${flux.geolocation.countryCode}`;
            const regionLocation = `${countryLocation}_${flux.geolocation.regionName}`;
            const continentLocationExists = possibleLocations.find(
              (location) => location.value === continentLocation
            );
            if (continentLocationExists) {
              continentLocationExists.instances += 1;
            } else {
              possibleLocations.push({
                value: continentLocation,
                instances: 1,
              });
            }
            const countryLocationExists = possibleLocations.find(
              (location) => location.value === countryLocation
            );
            if (countryLocationExists) {
              countryLocationExists.instances += 1;
            } else {
              possibleLocations.push({
                value: countryLocation,
                instances: 1,
              });
            }
            const regionLocationExists = possibleLocations.find(
              (location) => location.value === regionLocation
            );
            if (regionLocationExists) {
              regionLocationExists.instances += 1;
            } else {
              possibleLocations.push({
                value: regionLocation,
                instances: 1,
              });
            }
          }
        });
        setPossibleLocations(possibleLocations);
      }
    }
  };
  useEffect(() => {
    let text = "";
    if (continent !== "ALL") {
      if (continent) {
        text = "ac" + text + continent;
      }
      if (country) {
        text = text + "_" + country;
      }
      if (region) {
        text = text + "_" + region;
      }
    } else {
      text = "";
    }
    // country && text =  text+country + "_";
    // region && text = text+ region;
    setGeolocationData([text]);
  }, [continent, country, region]);

  console.log(geolocationData);
  return (
    <Wrapper>
      <WrapperContainer>
        <ServerInfoPart>
          <Title>Server Information</Title>
          <Row>name - {location.state.data.description}</Row>
          {/* {ipData?.map((item, key) => (
            <Row key={key}>
              IPv4 - {item.ip.split(":")[0]}
               - PORT -{" "}
              {location.state.data.components[0].ports}
            </Row>
          ))} */}
          <Row>IPv4 - {ipData?.ipaddress}</Row>
          <Row>Port - {location.state.data.components[0].ports}</Row>
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
              onClick={() => handleStartClick(location.state.data.name)}
            />
            <Button
              text="STOP"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() => handleStopClick(location.state.data.name)}
            />
            <Button
              text="RESTART"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() => handleRestartClick(location.state.data.name)}
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
              onClick={() => handleReinstallClick(location.state.data.name)}
            />

            <Button
              text="Move Server"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={() => handleRedeployClick(location.state.data.name)}
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
              onClick={() => handleHardRedeployClick(location.state.data.name)}
            />
          </ColumnButton>
        </ButtonGroup>
        <Title>Update</Title>
        <ButtonGroup2>
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
        <ButtonGroup2>
          {possibleLocations && (
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable="true"
              options={continentsOptions("false", possibleLocations)}
              onChange={(e) => {
                setContinent(e);
                setCountry("");
                setRegion("");
              }}
            />
          )}
          {continent ? (
            <Select
              onChange={(e) => {
                setCountry(e);
                setRegion("");
              }}
              className="basic-single"
              classNamePrefix="select"
              isSearchable="true"
              value={[country]}
              options={countriesOptions(
                continent.value,
                "false",
                possibleLocations
              )}
            />
          ) : (
            <></>
          )}
          {continent && country && (
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable="true"
              value={[region]}
              options={regionsOptions(
                continent.value,
                country.value,
                "false",
                possibleLocations
              )}
              onChange={(e) => {
                setRegion(e);
              }}
            />
          )}
        </ButtonGroup2>
        <ButtonGroup2>
          <Button
            text="Update Geolocation"
            width="100%"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={updateGeolocationData}
          />
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
