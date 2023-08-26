import React from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  return (
    <nav className="navbar navbar-light mb-2 border border-primary" style={{}}>
      <div className="container-fluid">
        <a
          className="nav-link active"
          onClick={() => router.push("/soulgallery")}
          style={{ cursor: "pointer" }}
        >
          <h1>
            <span style={{ color: "black" }}>Soul</span>
            <span className="text-primary">gallery</span>
          </h1>
        </a>
      </div>
    </nav>
  );
};

export default Header;
