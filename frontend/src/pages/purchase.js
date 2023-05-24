import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { locations } from "../assets/json/location";
import Button from "../components/Element/button";
import SelectSearch from "react-select-search";
import { gameitems } from "../assets/json/gamedata";
import { mopacks } from "../assets/json/mopacks";
import { period } from "../assets/json/period";

const Purchase = () => {
  const location = useLocation();
  const [sliderValue, setSliderValue] = useState({
    slider1: 0,
    slider2: 0,
    slider3: 0,
  });
  const [selectGame, setSelectGame] = useState(location.state.data.id);
  const [selectModpack, setSelectModpack] = useState();
  const [selectContinent, setSelectContinent] = useState();
  const [selectCountry, setSelectCountry] = useState();
  const [selectState, setSelectState] = useState();
  const [selectPeriod, setSelectPeriod] = useState();
  const [inputServer, setInputServer] = useState();
  const navigate = useNavigate();
  const handleSliderChange = (e) => {
    setSliderValue({ ...sliderValue, [e.target.name]: e.target.value });
  };
  const removeDuplicates = (data, key) => {
    return [...new Map(data.map((x) => [key(x), x]))];
  };
  const handleButtonClick = () => {
    const data = {
      server: selectGame,
      mod: selectModpack,
      myserver: inputServer,
      resources: sliderValue,
    };
    navigate("/payment", {
      state: {
        data: data,
      },
    });
  };
  console.log(removeDuplicates(locations, (it) => it.Continent));
  return (
    <Wrapper>
      <OrderPart>
        <SelectPart>
          <LabelTitle>
            GAME
            <SelectSearch
              options={gameitems.map((item) => ({
                value: item.id,
                name: item.title,
              }))}
              value={selectGame}
              onChange={setSelectGame}
              search
            />
          </LabelTitle>
          <LabelTitle>
            MOD PACK
            <SelectSearch
              options={mopacks.map((item, key) => ({
                value: key,
                name: item.modpack,
              }))}
              value={selectModpack}
              onChange={setSelectModpack}
              search
            />
          </LabelTitle>
        </SelectPart>
        <LabelTitle>SEVER LOCATION</LabelTitle>
        <SelectPart>
          <LabelContent>
            Continent
            <SelectSearch
              options={removeDuplicates(locations, (it) => it.Continent).map(
                (item, key) => ({
                  value: key,
                  name: item[0],
                })
              )}
              value={selectContinent}
              onChange={setSelectContinent}
              search
            />
          </LabelContent>
          <LabelContent>
            Country
            <SelectSearch
              options={removeDuplicates(locations, (it) => it.Country).map(
                (item, key) => ({
                  value: key,
                  name: item[0],
                })
              )}
              value={selectCountry}
              onChange={setSelectCountry}
              search
            />
          </LabelContent>
          <LabelContent>
            State/Provinice
            <SelectSearch
              options={removeDuplicates(
                locations,
                (it) => it["State / Province"]
              ).map((item, key) => ({
                value: key,
                name: item[0],
              }))}
              value={selectState}
              onChange={setSelectState}
              search
            />
          </LabelContent>
        </SelectPart>
        <LabelTitle>RESOURCES</LabelTitle>

        <LabelContent2>
          Threads - {sliderValue.slider1}
          <LabelSlider>
            <SliderText>Min -1</SliderText>
            <SliderText>Max - 14</SliderText>
          </LabelSlider>
          <SliderWrapper
            type="range"
            min="1"
            max="14"
            name="slider1"
            value={sliderValue.slider1}
            onChange={handleSliderChange}
          />
        </LabelContent2>

        <LabelContent2>
          RAM - {sliderValue.slider2 / 1000}GB
          <LabelSlider>
            <SliderText>Min - 1</SliderText>
            <SliderText>Max - 56</SliderText>
          </LabelSlider>
          <SliderWrapper
            type="range"
            min="1000"
            max="56000"
            name="slider2"
            step="100"
            value={sliderValue.slider2}
            onChange={handleSliderChange}
          />
        </LabelContent2>
        <LabelContent2>
          Storage - {sliderValue.slider3}GB
          <LabelSlider>
            <SliderText>Min - 5</SliderText>
            <SliderText>Max - 800</SliderText>
          </LabelSlider>
          <SliderWrapper
            type="range"
            min="5"
            max="800"
            name="slider3"
            value={sliderValue.slider3}
            onChange={handleSliderChange}
          />
        </LabelContent2>
        <LabelTitle>
          LENTAL PERIOD
          <SelectSearch
            options={period.map((item) => ({
              value: item.id,
              name: item.period,
            }))}
            value={selectPeriod}
            onChange={setSelectPeriod}
            search
          />
        </LabelTitle>
        <LabelTitle>
          NAME YOUR SERVER
          <SelectInput
            type="text"
            value={inputServer}
            onChange={(e) => setInputServer(e.target.value)}
          />
        </LabelTitle>
        <ButtonWrapper>
          <Button
            text={`$ ${(
              sliderValue.slider1 * 3.62 +
              (sliderValue.slider2 * 0.19) / 1000 +
              sliderValue.slider3 * 0.1
            ).toFixed(2)} USD Purchase`}
            width="150px"
            fsize="18px"
            radius="6px"
            fweight="500"
            color="black"
            onClick={handleButtonClick}
          />
        </ButtonWrapper>
        <LabelTitle>
          RATES
          <LabelContent>1 CPU thread costs $3.62 USD</LabelContent>
          <LabelContent>1 GB RAM costs $1.90 USD</LabelContent>
          <LabelContent>1 Gb storage $.01 USD</LabelContent>
        </LabelTitle>
      </OrderPart>
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  padding: 20px;
  height: 100%;
`;

const OrderPart = styled(Column)`
  gap: 20px;
  margin-top: 100px;
  max-width: 1000px;
  align-items: flex-start;
  width: 100%;
`;
const SelectPart = styled(Row)`
  gap: 20px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    justify-content: center;
  }
`;
const LabelTitle = styled(Column)`
  gap: 5px;
  align-items: flex-start;
  width: 100%;
`;
const LabelContent2 = styled(LabelTitle)`
  font-size: 15px;
`;
const LabelContent = styled(LabelTitle)`
  font-size: 14px;
`;
const SelectInput = styled.input`
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  padding: 0 40px 0 16px;
  height: 48px;
  border: 2px solid #dce0e8;
  max-width: 300px;
  width: 100%;
`;
const SliderWrapper = styled.input`
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
`;
const SliderText = styled.div`
  font-size: 12px;
`;
const LabelSlider = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;
const ButtonWrapper = styled(Row)`
  justify-content: center;
  width: 100%;
`;
export default Purchase;
