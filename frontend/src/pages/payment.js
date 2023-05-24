import styled from "styled-components";
import { Column, Row } from "../components/Element";
import Button from "../components/Element/button";
import Paypal from "../components/Paypal";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";

const ServerInfo = () => {
  const location = useLocation();
  console.log(location.state.data);
  const [total, setTotal] = useState(
    (
      location.state.data.resources.slider1 * 3.62 +
      (location.state.data.resources.slider2 * 0.19) / 1000 +
      location.state.data.resources.slider3 * 0.1
    ).toFixed(2)
  );
  const [signature, setSignature] = useState("");
  const zelID = "1NUGNZf7j5KsSzgH79EcgsxyVCQZaW1xyE";
  const zelIDPrivatekey =
    "Kyysm2J6QNRBufym7UsGrTct3WWj5vHWTZar9N6n7uyxjxX2b2p5";
  const [logininfo, setLoginInfo] = useState("");

  useEffect(() => {
    getLoginData();
  }, []);
  const getLoginData = async () => {
    const logininfo = await fetch(
      "https://api.runonflux.io/id/emergencyphrase",
      {
        method: "get",
      }
    )
      .then((res) => res.json())
      .then((response) => response.data);
    const keyPair = bitcoin.ECPair.fromWIF(zelIDPrivatekey);
    const privateKey = keyPair.d.toBuffer(32);
    // const privateKey = keyPair.privateKey;
    const message = logininfo;
    const signature = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    setLoginInfo(logininfo);
    setSignature(signature);
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
  const handleButtonClick = async () => {
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

    await fetch("https://api.runonflux.io/id/providesign", {
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
    // logoutdata();
    // const appStart = await fetch("https://api.runonflux.io/apps/appstart", {
    //   method: "get",
    //   headers: {
    //     zelidauth: {
    //       zelid: zelID,
    //       signature: signature,
    //       loginPhrase: logininfo,
    //     },
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((response) => response.data)
    //   .catch((err) => console.log(err));

    // console.log(appStart, "appStart.data");
    await fetch("https://api.runonflux.io/apps/checkdockerexistance", {
      method: "post",
      headers: {
        zelidauth: JSON.stringify({
          zelid: zelID,
          signature: signature,
          loginPhrase: logininfo,
        }),
      },
      body: JSON.stringify({ repotag: "wickedsensation/stoneblock3:1.6.1" }),
    })
      .then((res) => res.json())
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
    const data = {
      appSpecification: {
        version: 6,
        name: "whitebird",
        description: "server",
        owner: zelID,
        instances: 3,
        contacts: [],
        geolocation: ["acNA_US_Washington"],
        expire: 22000,
        compose: [
          {
            name: "wickedsensation",
            description: "server",
            repotag: "wickedsensation/stoneblock3:1.6.1",
            ports: "[39997]",
            domains: ["https://suoc.io"],
            environmentParameters: [],
            commands: [],
            containerPorts: "[25565]",
            containerData: "/tmp",
            cpu: 0.5,
            ram: 2000,
            hdd: 40,
            tiered: false,
          },
        ],
      },
      timestamp: new Date().getTime(),
      signature: Buffer.from(signature).toString("base64"),
      type: "fluxappregister",
      version: 1,
    };
    console.log(data, "data");
    await fetch("https://api.runonflux.io/apps/appregister", {
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
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
    // logoutdata();
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
  width: 100%;
`;
export default ServerInfo;
