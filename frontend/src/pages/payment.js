import styled from "styled-components";
import { Column, Row } from "../components/Element";
import Button from "../components/Element/button";
import Paypal from "../components/Paypal";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import getHash from "../utills/gethash";
import { gameitems } from "../assets/json/gamedata";
import {
  getServiceApi,
  getUserService,
  serviceApi,
  updateUserService,
} from "../action/action";

const ServerInfo = () => {
  const location = useLocation();
  const total = (
    location.state.data.resources.slider1 * 3.62 +
    (location.state.data.resources.slider2 * 0.19) / 1000 +
    location.state.data.resources.slider3 * 0.1
  ).toFixed(2);
  console.log(location.state.data);
  const [signature, setSignature] = useState("");
  const zelID = "1GLMJwdJEHySNwSqkC4iKpoBU215m7BkDk";
  const zelIDPrivatekey =
    "L3yGy6krc9VywytHCNEQfuMdpKrPzCfqW9knYAqCyGkKFxLnoXCE";
  const [logininfo, setLoginInfo] = useState("");
  const [transactiondata, setTransactiondata] = useState("");
  const [registerhash, setRegisterhash] = useState("");
  const [updatehash, setUpdatehash] = useState("");

  useEffect(() => {
    getLoginData();
  }, []);

  const getLoginData = async () => {
    const logininfo = await fetch("https://api.runonflux.io/id/loginphrase", {
      method: "get",
    })
      .then((res) => res.json())
      .then((response) => response.data);

    setLoginInfo(logininfo);
    const signatureData = getSignature(logininfo);
    setSignature(Buffer.from(signatureData).toString("base64"));
  };

  const getSignature = (logininfo) => {
    const keyPair = bitcoin.ECPair.fromWIF(zelIDPrivatekey);
    const privateKey = keyPair.d.toBuffer(32);
    // const privateKey = keyPair.privateKey;
    const message = logininfo;
    const signature = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    return signature;
  };
  // const logoutdata = async () => {
  //   await fetch("https://api.runonflux.io/zelid/logoutcurrentsession", {
  //     method: "get",
  //     headers: {
  //       zelidauth: {
  //         zelid: zelID,
  //         signature: signature,
  //         loginPhrase: logininfo,
  //       },
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((response) => console.log(response.data))
  //     .catch((err) => console.log(err));
  // };
  const handleStartClick = async () => {
    await fetch("https://api.runonflux.io/apps/appstart/whitebirds/true", {
      method: "get",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
    })
      .then((res) => res.json())
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };
  const handleStopClick = async () => {
    await fetch("https://api.runonflux.io/apps/appstop/whitebirds/true", {
      method: "get",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
    })
      .then((res) => res.json())
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };
  const handleReinstallClick = async () => {
    await fetch("https://api.runonflux.io/apps/appremove/whitebirds/true", {
      method: "get",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
    })
      .then((res) => res.text())
      .then((response) => {
        const jsonArray = `[${response.replace(/}{/g, "},{")}]`;
        JSON.parse(jsonArray).map((item) => {
          console.log(item.status);
        });
      })
      .catch((err) => console.log(err));
  };
  const handleRedeployClick = async () => {
    await fetch(
      "https://api.runonflux.io/apps/redeploy/whitebirds/false/true",
      {
        method: "get",
        headers: {
          zelidauth: JSON.stringify({
            zelid: zelID,
            signature: signature,
            loginPhrase: logininfo,
          }),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };
  const handleHardRedeployClick = async () => {
    await fetch("https://api.runonflux.io/apps/redeploy/whitebirds/true/true", {
      method: "get",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
    })
      .then((res) => res.json())
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };

  const handleRestartClick = async () => {
    await fetch("https://api.runonflux.io/apps/apprestart/whitebirds/true", {
      method: "get",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
    })
      .then((res) => res.json())
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };
  console.log(location.state.data);

  const handleButtonClick = async () => {
    const data = {
      type: "fluxappregister",
      version: 1,
      appSpecification: {
        version: 6,
        name: location.state.data.myserver,
        description: gameitems[location.state.data.server].title,
        owner: zelID,
        compose: [
          {
            name: "wickedsensation",
            description: gameitems[location.state.data.server].title,
            repotag: "wickedsensation/stoneblock3:1.6.1",
            ports: [39097, 39098],
            domains: ["", ""],
            environmentParameters: [],
            commands: [],
            containerPorts: [25565, 22],
            containerData: "/data/world  s:/data/backups",
            cpu: 0.1,
            ram: 100,
            hdd: 1,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: [],
        expire: 22000,
      },
      timestamp: new Date().getTime(),
    };

    await fetch("https://api.runonflux.io/id/verifylogin", {
      method: "post",
      body: JSON.stringify({
        zelid: zelID,
        signature: signature,
        loginPhrase: logininfo,
      }),
    })
      .then((res) => res.json())
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));

    const signatureinfo =
      data.type +
      data.version +
      JSON.stringify(data.appSpecification) +
      data.timestamp;
    const signatureData = getSignature(signatureinfo);
    console.log(signatureinfo);
    data.signature = Buffer.from(signatureData).toString("base64");
    const registerhash = await fetch(
      "https://api.runonflux.io/apps/appregister",
      {
        method: "post",
        headers: {
          zelidauth: JSON.stringify({
            zelid: zelID,
            signature: signature,
            loginPhrase: logininfo,
          }),
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setRegisterhash(response.data);
        return response.data;
      })
      .catch((err) => console.log(err));

    const paidaddress = await fetch(
      `https://api.runonflux.io/apps/deploymentinformation`,
      {
        method: "get",
        headers: {
          zelidauth: JSON.stringify({
            zelid: zelID,
            signature: signature,
            loginPhrase: logininfo,
          }),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => response.data.address)
      .catch((err) => console.log(err));

    const data2 = {
      version: 6,
      name: location.state.data.myserver,
      description: "server",
      owner: zelID,
      compose: [
        {
          name: "wickedsensation",
          description: "server",
          repotag: "wickedsensation/stoneblock3:1.6.1",
          ports: [39097, 39098],
          domains: ["", ""],
          environmentParameters: [],
          commands: [],
          containerPorts: [25565, 22],
          containerData: "/data/world  s:/data/backups",
          cpu: 0.1,
          ram: 100,
          hdd: 1,
          tiered: false,
        },
      ],
      instances: 3,
      contacts: [],
      geolocation: [],
      expire: 22000,
    };

    const amount = await fetch(`https://api.runonflux.io/apps/calculateprice`, {
      method: "post",
      body: JSON.stringify(data2),
    })
      .then((res) => res.json())
      .then((response) => response.data)
      .catch((err) => console.log(err));

    const hashdata = await getHash(registerhash, amount, paidaddress);

    await fetch(`https://api.runonflux.io/daemon/sendrawtransaction`, {
      method: "post",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
      body: JSON.stringify({
        hexstring: hashdata,
        allowhighfees: false,
      }),
    })
      .then((res) => res.json())
      .then((response) => setTransactiondata(response.data))
      .catch((err) => console.log(err));

    const authdata = JSON.parse(localStorage.getItem("auth"));
    // eslint-disable-next-line no-use-before-define
    const currentBlockData = await currentBlock();
    const serviceData = {
      userid: authdata.user._id,
      name: location.state.data.myserver,
      currentBlockData: currentBlockData + 22000,
    };
    await serviceApi(serviceData);
  };

  const currentBlock = async () => {
    return await fetch(`https://api.runonflux.io/daemon/getblockcount`, {
      method: "get",
    })
      .then((res) => res.json())
      .then((response) => response.data)
      .catch((err) => console.log(err));
  };
  const handleUpdateServer = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const resdata = await getUserService({
      userid: authdata.user._id,
      name: location.state.data.myserver,
    });
    const currentBlockData = await currentBlock();
    const expire =
      Math.round(
        (resdata?.filterdata[0]?.currentBlockData - currentBlockData) / 1000
      ) * 1000;

    console.log(expire, "block");
    const data = {
      type: "fluxappupdate",
      version: 1,
      appSpecification: {
        version: 6,
        name: location.state.data.myserver,
        description: gameitems[location.state.data.server].title,
        owner: zelID,
        compose: [
          {
            name: "wickedsensation",
            description: gameitems[location.state.data.server].title,
            repotag: "wickedsensation/stoneblock3:1.6.1",
            ports: [39097, 39098],
            domains: ["", ""],
            environmentParameters: [],
            commands: [],
            containerPorts: [25565, 22],
            containerData: "/data/world  s:/data/backups",
            cpu: 0.2,
            ram: 200,
            hdd: 1,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: [],
        expire: expire,
      },
      timestamp: new Date().getTime(),
    };
    const signatureinfo =
      data.type +
      data.version +
      JSON.stringify(data.appSpecification) +
      data.timestamp;
    const signatureData = getSignature(signatureinfo);
    console.log(signatureinfo);
    data.signature = Buffer.from(signatureData).toString("base64");
    const updatehash = await fetch("https://api.runonflux.io/apps/appupdate", {
      method: "post",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        setUpdatehash(response.data);
        return response.data;
      })
      .catch((err) => console.log(err));
    const paidaddress = await fetch(
      `https://api.runonflux.io/apps/deploymentinformation`,
      {
        method: "get",
        headers: {
          zelidauth: JSON.stringify({
            zelid: zelID,
            signature: signature,
            loginPhrase: logininfo,
          }),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => response.data.address)
      .catch((err) => console.log(err));
    const data2 = {
      version: 6,
      name: location.state.data.myserver,
      description: "server",
      owner: zelID,
      compose: [
        {
          name: "wickedsensation",
          description: "server",
          repotag: "wickedsensation/stoneblock3:1.6.1",
          ports: [39097, 39098],
          domains: ["", ""],
          environmentParameters: [],
          commands: [],
          containerPorts: [25565, 22],
          containerData: "/data/world  s:/data/backups",
          cpu: 0.1,
          ram: 200,
          hdd: 1,
          tiered: false,
        },
      ],
      instances: 3,
      contacts: [],
      geolocation: [],
      expire: 22000,
    };

    const amount = await fetch(`https://api.runonflux.io/apps/calculateprice`, {
      method: "post",
      body: JSON.stringify(data2),
    })
      .then((res) => res.json())
      .then((response) => response.data)
      .catch((err) => console.log(err));

    const hashdata = await getHash(updatehash, amount, paidaddress);

    await fetch(`https://api.runonflux.io/daemon/sendrawtransaction`, {
      method: "post",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
      body: JSON.stringify({
        hexstring: hashdata,
        allowhighfees: false,
      }),
    })
      .then((res) => res.json())
      .then((response) => setTransactiondata(response.data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line no-use-before-define
    const service = await getServiceApi();
    console.log(service, "filter");

    const filterdata = service.serviceData.filter(
      (data) =>
        data.userid === authdata.user._id &&
        data.name === location.state.data.myserver
    );
    const serviceData = {
      serverid: filterdata[0]._id,
      userid: authdata.user._id,
      name: location.state.data.myserver,
      currentBlockData: expire + currentBlockData,
    };
    await updateUserService(serviceData);
  };

  return (
    <Wrapper>
      <PaymentPart>
        <Title>Billing</Title>
        <PriceDetail>
          <PriceDetailWrapper>
            <Row>Threads</Row>
            <Row>RAM</Row>
            <Row>Storage</Row>
          </PriceDetailWrapper>
          <PriceDetailWrapper>
            <Row>
              <BoldTitle>{location.state.data.resources.slider1}</BoldTitle>
              Threads
            </Row>
            <Row>
              <BoldTitle>
                {location.state.data.resources.slider2 / 1000}
              </BoldTitle>{" "}
              RAM
            </Row>
            <Row>
              <BoldTitle>{location.state.data.resources.slider3}</BoldTitle>{" "}
              Storage
            </Row>
          </PriceDetailWrapper>
          <PriceDetailWrapper>
            <Row>
              <BoldTitle>
                {location.state.data.resources.slider1 * 3.62}
              </BoldTitle>
              Threads Cost USD
            </Row>
            <Row>
              <BoldTitle>
                {(location.state.data.resources.slider2 * 0.19) / 1000}
              </BoldTitle>
              RAM Cost USD
            </Row>
            <Row>
              <BoldTitle>
                {location.state.data.resources.slider3 * 0.1}
              </BoldTitle>
              Storage Cost USD
            </Row>
          </PriceDetailWrapper>
        </PriceDetail>
        <CostDetail>
          <Title>Total Cost</Title>
          <BoldTitle>{total}</BoldTitle>
        </CostDetail>
        <Paypal cost={total} />
        <CoinbaseCommerceButton
          styled
          checkoutId="8e24d5a1-d361-44ca-a5e7-fbe1ce9f5202"
          // chargeId="CWL2LG2J"
          onChargeSuccess={(data) => {
            console.log(data);
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
        <ButtonWrapper>
          {registerhash ? (
            registerhash.message ? (
              <Column>
                <Button
                  text="Complete Purchase"
                  width="180px"
                  radius="6px"
                  fweight="500"
                  color="black"
                  fsize="16px"
                  padding="15px"
                  onClick={handleButtonClick}
                />
                {registerhash.message}
              </Column>
            ) : (
              <Button
                text={<>Please check {transactiondata} link</>}
                width="100%"
                radius="6px"
                fweight="500"
                color="black"
                fsize="16px"
                padding="15px"
              />
            )
          ) : (
            <Button
              text="Complete Purchase"
              width="180px"
              radius="6px"
              fweight="500"
              color="black"
              fsize="16px"
              padding="15px"
              onClick={handleButtonClick}
            />
          )}
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            text="Start"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleStartClick}
          />
          <Button
            text="Stop"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleStopClick}
          />
          <Button
            text="Restart"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleRestartClick}
          />
          <Button
            text="Reinstall App"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleReinstallClick}
          />

          <Button
            text="Clean SSD"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleHardRedeployClick}
          />
          <Button
            text="Move Server"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleRedeployClick}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            text="Update Server"
            width="180px"
            radius="6px"
            fweight="500"
            color="black"
            fsize="16px"
            padding="15px"
            onClick={handleUpdateServer}
          />
        </ButtonWrapper>
      </PaymentPart>
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
const PaymentPart = styled(Column)`
  gap: 30px;
  margin-top: 100px;
  max-width: 1000px;
  align-items: flex-start;
  width: 100%;
`;

const PriceDetail = styled(Row)`
  gap: 20px;
  width: 100%;
  justify-content: center;
`;
const CostDetail = styled(Row)`
  gap: 20px;
`;
const PriceDetailWrapper = styled(Column)`
  width: 100%;
  gap: 20px;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 20px;
`;
const BoldTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-right: 10px;
`;
const ButtonWrapper = styled(Row)`
  justify-content: center;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
`;
export default ServerInfo;
