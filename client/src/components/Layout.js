import { Outlet } from "react-router-dom";
import Nav from "./nav-component";
import Footer from "./footer-component";
import React from "react";

const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
