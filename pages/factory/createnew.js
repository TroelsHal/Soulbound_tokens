import React, { useState } from "react";
import FactoryLayout from "../../components/factoryLayout";

import factory from "../../factory";
import web3 from "../../web3";

const CreateNewToken = () => {
  const [ErrorMessage, SetErrorMessage] = useState("");
  const [StatusMessage, SetStatusMessage] = useState("");
  const [ResultMessage, SetResultMessage] = useState("");
  const [Issuer, SetIssuer] = useState("");
  const [Symbol, SetSymbol] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    SetErrorMessage("");
    SetResultMessage("");
    SetStatusMessage(
      "Please wait... We are deploying your contract to the blockchain."
    );
    try {
      const accounts = await web3.eth.getAccounts();
      const useraddress = accounts[0];

      if (!useraddress) {
        throw {
          message: "User address not found. Maybe MetaMask is not connected.",
        };
      }
      await factory.methods
        .createToken(Issuer, Symbol)
        .send({ from: accounts[0] });

      SetStatusMessage(
        "Your contract has been deployed. please wait... We are looking for the address of your contract."
      );
      const returnaddress = await factory.methods.newContractAddress().call();
      SetStatusMessage("");
      SetResultMessage(returnaddress);
    } catch (err) {
      SetErrorMessage(err.message);
      SetStatusMessage("");
    }
  };

  return (
    <FactoryLayout>
      <div>
        <h2>Create a new SOULBOUND token collection</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputTokenIssuer">Token issuer</label>
            <input
              type="text"
              className="form-control"
              id="InputTokenIssuer"
              placeholder="Enter name of issuer, eg. 'Copenhagen Language School'"
              value={Issuer}
              onChange={(event) => SetIssuer(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htlmFor="inputTokenSymbol">Token symbol</label>
            <input
              type="text"
              className="form-control"
              id="inputTokenSymbol"
              placeholder="Enter short token symbol, eg. 'SD'"
              value={Symbol}
              onChange={(event) => SetSymbol(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark"
            style={{
              display: !StatusMessage ? "" : "none",
            }}
          >
            Create
          </button>

          <button
            disabled
            type="submit"
            className="btn btn-dark"
            style={{
              display: StatusMessage ? "" : "none",
            }}
          >
            <div
              type="submit"
              className="spinner-border spinner-border-sm"
              disabled
            ></div>
            <div></div>
          </button>
        </form>
        <div
          className="alert alert-danger"
          role="alert"
          style={{
            display: ErrorMessage ? "block" : "none",
          }}
        >
          There seems to be an error:
          <br />
          {ErrorMessage}
        </div>

        <div
          className="alert alert-secondary"
          role="alert"
          style={{
            display: StatusMessage ? "block" : "none",
          }}
        >
          {StatusMessage}
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            display: ResultMessage ? "block" : "none",
          }}
        >
          New SBT collection succesfully deployed to Ethereum blockchain.
          <br />
          <br />
          Please save the address of your contract:
          <br />
          {ResultMessage}
        </div>
      </div>
    </FactoryLayout>
  );
};

export default CreateNewToken;
