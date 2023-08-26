import React from "react";
import Header from "./factoryHeader";

const Layout = (props) => {
  return (
    <div className="container text-center">
      <Header />
      {props.children}
    </div>
  );
};

export default Layout;
