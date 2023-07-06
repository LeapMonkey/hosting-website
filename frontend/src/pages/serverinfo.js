import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CoinbaseCommerceButton from "react-coinbase-commerce";
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
import Select, { createFilter } from "react-select";
import {
  continentsOptions,
  countriesOptions,
  regionsOptions,
} from "../utills/getlocation";
import Paypal from "../components/Paypal";
import { gameitems } from "../assets/json/gamedata";

const ServerInfo = () => {
  const location = useLocation();
  const [environment, setEnvironment] = useState();
  const [servername, setServername] = useState();
  const [ipData, setIpData] = useState();
  const [possibleLocations, setPossibleLocations] = useState();
  const [continent, setContinent] = useState();
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  const [geolocationData, setGeolocationData] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(null);
  const [flag, setFlag] = useState(0);
  const [clickCheck, setClickCheck] = useState(false);
  const [priceData, setPriceData] = useState();
  console.log(isButtonDisabled, "isButtonDisabled");
  const getIpData = async () => {
    const ipdata = await getIpaddress(location.state.data.name);
    setIpData(ipdata);
  };

  const updateExpireData = async () => {
    if (flag === 1) {
      setClickCheck(false);
      setIsButtonDisabled(true);
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
          _id: filterdata[0]._id,
          userid: authdata.user._id,
          name: location.state.data.description,
          currentBlockData: expire + currentBlockData + 22000,
          servername: location.state.data.name,
        };

        await updateUserService(serviceData).then((res) =>
          toast.success("Updated")
        );
        // Start the timer
        const timerId = setTimeout(() => {
          setIsButtonDisabled(false);
        }, 10000);
        setTimer(timerId);
      }
    } else {
      toast.error("Please try with payment");
      setClickCheck(true);
    }
  };
  console.log(location.state.data);
  const updateEnvironmentData = async () => {
    if (!environment) {
      return toast.error("Please input Environment");
    }
    setIsButtonDisabled(true);
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
        _id: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("Updated")
      );
      setFlag(0);
      // Start the timer
      const timerId = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);
      setTimer(timerId);
    }
  };

  const updateGeolocationData = async () => {
    if (!geolocationData) {
      return toast.error("Please fill out geolocation Data");
    }
    setIsButtonDisabled(true);
    console.log(geolocationData);
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
        _id: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("GeoLocation Updated")
      );
      // Start the timer
      const timerId = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);
      setTimer(timerId);
    }
  };

  const updateServerName = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const service = await getServiceApi();
    console.log(service, "filter");

    const filterdata = service.serviceData.filter(
      (data) =>
        data.userid === authdata.user._id &&
        data.servername === location.state.data.name
    );
    console.log(filterdata[0]._id);
    const serviceData = {
      _id: filterdata[0]._id,
      changedname: servername,
    };

    await updateUserService(serviceData).then((res) =>
      toast.success("Server Name Updated")
    );
  };

  useEffect(() => {
    getFluxAuth();
    getIpData();
    getPossibleLocation();
    const pricedata = gameitems.filter(
      (item) => item.title === location.state.data.description
    );
    const suitabledata =
      pricedata[0].cpu1 === location.state.data.components[0].cpu
        ? pricedata[0].price1
        : pricedata[0].price2;
    setPriceData(suitabledata);
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
        text = "ac" + text + continent.value;
      }
      if (country) {
        text = text + "_" + country.value;
      }
      if (region) {
        text = text + "_" + region.value;
      }
    } else {
      text = "";
    }
    // country && text =  text+country + "_";
    // region && text = text+ region;
    setGeolocationData([text], "Adsf");
  }, [continent, country, region]);

  console.log(geolocationData);
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);
  return (
    <Wrapper>
      <WrapperContainer>
        <ServerInfoPart>
          <Title>Server Information</Title>
          <Row>Server Name - {location.state.data.name}</Row>
          <Row>Description - {location.state.data.description}</Row>
          IPv4 - {ipData && ipData[0].ip.split(":")[0]}
          {/* {ipData?.map((item, key) => (
            <Row key={key}>
               - PORT -{" "}
              {location.state.data.components[0].ports}
            </Row>
          ))} */}
          {/* <Row>IPv4 - {ipData?.ipaddress}</Row> */}
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
            placeholder=""
            onChange={(e) => setServername(e.target.value)}
          />
          <Button
            text="Server name"
            width="100%"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={updateServerName}
          />
        </ButtonGroup2>
        <ButtonGroup2>
          <Input
            placeholder="[`Admin`]"
            onChange={(e) => setEnvironment(e.target.value)}
          />
          <Button
            text="Settings"
            width="100%"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={!isButtonDisabled ? updateEnvironmentData : undefined}
            bgcolor={isButtonDisabled === true && "rgb(255,255,255,0.3)"}
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
          {possibleLocations && (
            <Button
              text="Geolocation"
              width="100%"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={!isButtonDisabled ? updateGeolocationData : undefined}
              bgcolor={isButtonDisabled === true && "rgb(255,255,255,0.3)"}
            />
          )}
          <Button
            onClick={!isButtonDisabled ? updateExpireData : undefined}
            bgcolor={isButtonDisabled === true && "rgb(255,255,255,0.3)"}
            text="Extend Rental"
            width="100%"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
          />
        </ButtonGroup2>
        {clickCheck && (
          <>
            <Paypal cost="1" setFlag={setFlag} />
            <CoinbaseCommerceButton
              styled
              checkoutId="c632fe45-0566-48e8-9fdc-59c35b7234ca"
              // checkoutId={checkout}
              // chargeId="CWL2LG2J"
              onChargeSuccess={(data) => {
                console.log(data);
                setFlag(1);
              }}
              onChargeFailure={(data) => {
                console.log(data);
              }}
              onPaymentDetected={(data) => {
                console.log(data);
              }}
              onModalClosed={() => {
                console.log("Payment Cancelled");
              }}
            />
          </>
        )}
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
  min-height: 100vh;
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

export default ServerInfo;
