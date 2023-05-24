import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./router";
import "react-coinbase-commerce/dist/coinbase-commerce-button.css";
import "react-select-search/style.css";

const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
