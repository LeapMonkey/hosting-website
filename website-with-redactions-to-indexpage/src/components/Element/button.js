import styled from "styled-components";
import { Column, Row } from ".";

const Button = (props) => {
  return (
    <Wrapper
      width={props.width}
      fsize={props.fsize}
      fweight={props.fweight}
      bgcolor={props.bgcolor}
      onClick={props.onClick}
    >
      {props.text}
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background: ${(props) => (props.bgcolor ? props.bgcolor : "#01b032")};
  color: #fff;
  font-weight: ${(props) => (props.fweight ? props.fweight : "800")};
  font-size: ${(props) => (props.fsize ? props.fsize : "12px")};
  border-radius: 100px;
  width: 100%;
  max-width: ${(props) => props.width && props.width};
  padding: 10px;
  :active {
    box-shadow: 0 0 10px -1px rgba(0, 255, 0, 1);
  }
`;

export default Button;
