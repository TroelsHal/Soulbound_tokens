import React from "react";
import { useRouter } from "next/router";

const Frontpage = () => {
  const router = useRouter();
  return (
    <div className="container text-center">
      <br />
      <h2>This project consists of two websites:</h2>
      <br />
      <h3 onClick={() => router.push("/factory")} style={{ cursor: "pointer" }}>
        SOULBOUND FACTORY
      </h3>
      <p>
        Institutions can use this website to create their own Soulbound token
        collection and send tokens to receiving souls.
      </p>
      <br />
      <br />
      <h3
        onClick={() => router.push("/soulgallery")}
        style={{ cursor: "pointer" }}
      >
        SOUL GALLERY
      </h3>
      <p>
        Use Soulgallery to see all the Soulbound tokens belonging to a Soul
        address.
      </p>
    </div>
  );
};

export default Frontpage;
