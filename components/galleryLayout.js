import React from "react";
import Header from "./galleryHeader";

const Layout = (props) => {
  return (
    <div className="container">
      <Header />
      {props.children}
    </div>
  );
};

export default Layout;
