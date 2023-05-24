import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ButtonWrapper from "./PayButtons";

const currency = "USD";

// Custom component to wrap the PayPalButtons and handle currency changes

const Paypal = (props) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "test",
        components: "buttons",
      }}
    >
      <ButtonWrapper
        currency={currency}
        showSpinner={false}
        cost={props.cost}
      />
    </PayPalScriptProvider>
  );
};

export default Paypal;
