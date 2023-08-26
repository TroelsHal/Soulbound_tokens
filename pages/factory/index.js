import React from "react";
import { useRouter } from "next/router";
import FactoryLayout from "../../components/factoryLayout";

const FactoryFrontpage = () => {
  const router = useRouter();
  return (
    <FactoryLayout>
      <div className="container text-center">
        <div className="d-flex justify-content-center pt-5">
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">Create SOULBOUND token collection</h5>
              <p className="card-text">
                Your institution or company can use the factory to create a new
                token collection and deploy the contract to the blockchain.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/factory/createnew/")}
              >
                Create
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pt-5">
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">Send</h5>
              <p className="card-text">
                After creating a token collection , you can send a token to a
                SOUL.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/factory/send")}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pt-5">
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">Revoke</h5>
              <p className="card-text">
                You can revoke a token that is already sent, if it is revokable.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/factory/revoke")}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </FactoryLayout>
  );
};

export default FactoryFrontpage;
