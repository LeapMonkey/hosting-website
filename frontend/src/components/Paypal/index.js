import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ButtonWrapper from "./PayButtons";

const currency = "USD";

// Custom component to wrap the PayPalButtons and handle currency changes

const Paypal = (props) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AU3lEj-LdGgb_mwzfHPBOIkCQxuHw4VNUKoEQCud5nuj6Sw5sjXLhLqOj41Leaafu-pyNLwRvkz1Hf9-",
        components: "buttons",
      }}
    >
      <ButtonWrapper
        currency={currency}
        showSpinner={false}
        cost={props.cost}
        setFlag={props.setFlag}
      />
    </PayPalScriptProvider>
  );
};

export default Paypal;
