import styled from "styled-components";
import { Column, Row } from "../components/Element";
import Button from "../components/Element/button";
import Paypal from "../components/Paypal";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import getHash from "../utills/gethash";
import {
  getServiceApi,
  getUserService,
  serviceApi,
  updateUserService,
} from "../action/action";
import {
  currentBlock,
  getAmout,
  getFluxAuth,
  getPaidaddress,
} from "../utills/manager";
import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { getRandomNumber } from "../utills";

const ServerInfo = () => {
  const location = useLocation();
  const total =
    location.state.flag === 1
      ? location.state.data.price1
      : location.state.data.price2;
  const cpu =
    location.state.flag === 1
      ? location.state.data.cpu1
      : location.state.data.cpu2;
  const ram =
    location.state.flag === 1
      ? location.state.data.ram1
      : location.state.data.ram2;
  const hdd =
    location.state.flag === 1
      ? location.state.data.ssd1
      : location.state.data.ssd2;
  const zelID = "1GLMJwdJEHySNwSqkC4iKpoBU215m7BkDk";
  const zelIDPrivatekey =
    "L3yGy6krc9VywytHCNEQfuMdpKrPzCfqW9knYAqCyGkKFxLnoXCE";
  const [transactiondata, setTransactiondata] = useState("");
  const [registerhash, setRegisterhash] = useState("");
  const [updatehash, setUpdatehash] = useState("");
  const [servicenumber, setServiceNumber] = useState();
  const initialData = async () => {
    getFluxAuth();
    const data = await getServiceApi();
    console.log(data.serviceData.length);
    setServiceNumber(data.serviceData.length);
  };

  useEffect(() => {
    initialData();
  }, []);

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
    const data = {
      type: "fluxappregister",
      version: 1,
      appSpecification: {
        version: 6,
        name: `cubehosting${servicenumber}`,
        description: location.state.data.title,
        owner: zelID,
        compose: [
          {
            name: getRandomNumber(),
            description: location.state.data.title,
            repotag: location.state.data.repotag,
            ports: location.state.data.port,
            domains: location.state.data.domains,
            environmentParameters: location.state.data.environmentParameters,
            commands: [],
            containerPorts: location.state.data.containerPorts,
            containerData: location.state.data.containerData,
            cpu: 0.1,
            ram: 100,
            hdd: 1,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: ["acNA"],
        expire: 22000,
      },
      timestamp: new Date().getTime(),
    };

    const signatureinfo =
      data.type +
      data.version +
      JSON.stringify(data.appSpecification) +
      data.timestamp;
    const keyPair = bitcoin.ECPair.fromWIF(zelIDPrivatekey);
    const privateKey = keyPair.d.toBuffer(32);
    const message = signatureinfo;
    const signatureData = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    console.log(signatureinfo);
    data.signature = Buffer.from(signatureData).toString("base64");
    const registerhash = await fetch(
      "https://api.runonflux.io/apps/appregister",
      {
        method: "post",
        headers: {
          zelidauth: localStorage.getItem("fluxauth"),
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

    const paidaddress = await getPaidaddress();

    const amount = await getAmout(0.1, 100, 1, 22000);

    console.log(registerhash, amount, paidaddress, "paidaddress");
    const hashdata = await getHash(registerhash, amount, paidaddress);
    console.log(hashdata);

    const transaction = await fetch(
      `https://api.runonflux.io/daemon/sendrawtransaction`,
      {
        method: "post",
        headers: {
          zelidauth: localStorage.getItem("fluxauth"),
        },
        body: JSON.stringify({
          hexstring: hashdata,
          allowhighfees: false,
        }),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setTransactiondata(response.data);
        return response.data;
      })
      .catch((err) => console.log(err));
    if (transaction) {
      const authdata = JSON.parse(localStorage.getItem("auth"));
      // eslint-disable-next-line no-use-before-define
      const currentBlockData = await currentBlock();
      const serviceData = {
        userid: authdata.user._id,
        name: location.state.data.title,
        currentBlockData: currentBlockData + 22000,
        servername: `cubehosting${servicenumber}`,
        port: location.state.data.port,
      };
      await serviceApi(serviceData);
    }
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
              <BoldTitle>{cpu}</BoldTitle>
              Threads
            </Row>
            <Row>
              <BoldTitle>{ram}</BoldTitle> RAM
            </Row>
            <Row>
              <BoldTitle>{hdd}</BoldTitle> Storage
            </Row>
          </PriceDetailWrapper>
          <PriceDetailWrapper>
            <Row>
              <BoldTitle>{cpu * 3.62}</BoldTitle>
              Threads Cost USD
            </Row>
            <Row>
              <BoldTitle>{(ram * 0.19) / 1000}</BoldTitle>
              RAM Cost USD
            </Row>
            <Row>
              <BoldTitle>{hdd * 0.1}</BoldTitle>
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
