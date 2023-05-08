import { Route, Routes } from "react-router-dom";
import Landing from "../pages";
import Layout from "../components/Layout";
import Contact from "../pages/contact";
import Login from "../pages/Auth/login";

const Router = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/services" element={<Landing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
};

export default Router;
