import React from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  return (
    <nav
      className="navbar navbar-expand-sm navbar-dark bg-dark mb-2"
      style={{ background: "#e3f2fd" }}
    >
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link active"
              onClick={() => router.push("/factory")}
              style={{ cursor: "pointer" }}
            >
              SOULBOUND FACTORY
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link active"
              onClick={() => router.push("/factory/createnew")}
              style={{ cursor: "pointer" }}
            >
              Create new token collection
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link active"
              onClick={() => router.push("/factory/send")}
              style={{ cursor: "pointer" }}
            >
              Send token to SOUL
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link active"
              onClick={() => router.push("/factory/revoke")}
              style={{ cursor: "pointer" }}
            >
              Revoke token
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
