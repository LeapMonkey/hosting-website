import { useLocation } from "react-router-dom";
import { Column } from "../Element";
import Footer from "./footer";
import Header from "./header";
const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <Column>
      {location.pathname !== "/login" && <Header />}
      {children}
      <Footer />
    </Column>
  );
};

export default Layout;
