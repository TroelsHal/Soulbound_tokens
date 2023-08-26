import React, { useState } from "react";
import FactoryLayout from "../../components/factoryLayout";

import ISoulbound from "../../ISoulboundABI";
import web3 from "../../web3";

const Mint = () => {
  const [ContractAddress, SetContractAddress] = useState("");
  const [ErrorMessageContract, SetErrorMessageContract] = useState("");
  const [StatusMessageContract, SetStatusMessageContract] = useState("");
  const [StatusMessageMint, SetStatusMessageMint] = useState("");
  const [ErrorMessageMint, SetErrorMessageMint] = useState("");

  const [TokenName, SetTokenName] = useState("");
  const [TokenSymbol, SetTokenSymbol] = useState("");
  const [ContractFound, SetContractFound] = useState(false);
  const [SoulAddress, SetSoulAddress] = useState("");
  const [Title, SetTitle] = useState("");
  const [Description, SetDescription] = useState("");
  const [Revokable, SetRevokable] = useState(false);
  const [Expires, SetExpires] = useState(false);
  const [Expiration, SetExpiration] = useState("");

  const [TokenID, SetTokenID] = useState("");

  const handleSubmitSendToken = async (event) => {
    event.preventDefault();
    SetErrorMessageMint("");
    SetTokenID("");
    SetStatusMessageMint(
      "Please wait. Submitting your transaction to the blockchain..."
    );
    try {
      const contractInstance = ISoulbound(ContractAddress.trim());
      const accounts = await web3.eth.getAccounts();
      let expirationday;
      if (!Expires) {
        expirationday = "0";
      } else {
        expirationday = (Date.parse(Expiration) / 1000).toString();
      }
      const returnedObject = await contractInstance.methods
        .mint(SoulAddress.trim(), Revokable, Title, Description, expirationday)
        .send({ from: accounts[0] });
      SetTokenID(returnedObject.events.Transfer.returnValues.tokenId);
      SetStatusMessageMint("");
    } catch (err) {
      SetStatusMessageMint("");
      SetErrorMessageMint(err.message);
    }
  };

  const handleSubmitFindContract = async (event) => {
    event.preventDefault();
    SetSoulAddress("");
    SetErrorMessageContract("");
    SetStatusMessageMint("");
    SetErrorMessageMint("");
    SetTitle("");
    SetDescription("");
    SetTokenName("");
    SetTokenID("");
    SetContractFound(false);
    SetStatusMessageContract(
      "Please wait. Submitting your transaction to the blockchain..."
    );
    try {
      const contractInstance = ISoulbound(ContractAddress.trim());
      const tokenName = await contractInstance.methods.name().call();
      const tokenSymbol = await contractInstance.methods.symbol().call();
      SetStatusMessageContract("");
      SetTokenName(tokenName);
      SetTokenSymbol(tokenSymbol);
      SetContractFound(true);
    } catch (err) {
      SetErrorMessageMint(err.message);
      SetStatusMessageContract("");
      SetContractFound(false);
    }
  };

  return (
    <FactoryLayout>
      <div>
        <h2>Send a token to a SOUL</h2>

        <form onSubmit={handleSubmitFindContract}>
          <div className="form-group">
            <label htmlFor="inputContractAddress">Contract address</label>
            <input
              type="text"
              className="form-control"
              id="inputContractAddress"
              placeholder="Enter the address of your SOULBOUND contract"
              value={ContractAddress}
              onChange={(event) => SetContractAddress(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark"
            style={{
              display: !StatusMessageContract ? "" : "none",
            }}
          >
            Find contract
          </button>

          <button
            disabled
            type="submit"
            className="btn btn-dark"
            style={{
              display: StatusMessageContract ? "" : "none",
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
            display: ErrorMessageContract ? "block" : "none",
          }}
        >
          There seems to be an error:
          <br />
          {ErrorMessageContract}
        </div>
        <div
          className="alert alert-secondary"
          role="alert"
          style={{
            display: StatusMessageContract ? "block" : "none",
          }}
        >
          {StatusMessageContract}
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            display: ContractFound ? "block" : "none",
          }}
        >
          {" "}
          We found this SOULBOUND contract
          <br />
          <br />
          Name: {TokenName}, Symbol: {TokenSymbol}
        </div>

        <form
          style={{
            display: ContractFound ? "block" : "none",
          }}
          onSubmit={handleSubmitSendToken}
        >
          <div className="form-group">
            <label htmlFor="inputSoulAddress">Address of receiving SOUL</label>
            <input
              type="text"
              className="form-control"
              id="inputSoulAddress"
              placeholder="Enter address"
              value={SoulAddress}
              onChange={(event) => SetSoulAddress(event.target.value)}
            />
            <label htmlFor="inputTitle">Title of token</label>
            <input
              type="text"
              className="form-control"
              id="InputTitle"
              placeholder="Enter short title, eg. 'Course Diploma'"
              value={Title}
              onChange={(event) => SetTitle(event.target.value)}
            />
            <label htmlFor="inputDescription">Description</label>
            <input
              type="text"
              className="form-control"
              id="InputDescription"
              placeholder="Enter description, eg. '3 weeks English course. Grade: 4.1. / 5'"
              value={Description}
              onChange={(event) => SetDescription(event.target.value)}
            />

            <input
              className="form-check-input"
              type="checkbox"
              onClick={() => SetRevokable(!Revokable)}
              id="InputRevokable"
              checked={Revokable}
            />
            <label className="form-check-label" htmlFor="InputRevokable">
              Token can be revoked
            </label>
            <br />

            <input
              className="form-check-input"
              type="checkbox"
              onClick={() => SetExpires(!Expires)}
              id="InputExpires"
              checked={Expires}
            />
            <label className="form-check-label" htmlFor="InputExpires">
              Token expires
            </label>
            <br />

            <input
              type="date"
              id="expiration"
              name="expiration"
              style={{
                visibility: Expires ? "" : "hidden",
              }}
              onChange={(event) => SetExpiration(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-dark"
            style={{
              display: !StatusMessageMint ? "" : "none",
            }}
          >
            Send token
          </button>
          <button
            disabled
            type="submit"
            className="btn btn-dark"
            style={{
              display: StatusMessageMint ? "" : "none",
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
          className="alert alert-secondary"
          role="alert"
          style={{
            display: StatusMessageMint ? "block" : "none",
          }}
        >
          {StatusMessageMint}
        </div>

        <div
          className="alert alert-danger"
          role="alert"
          style={{
            display: ErrorMessageMint ? "block" : "none",
          }}
        >
          There seems to be an error:
          <br />
          {ErrorMessageMint}
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            display: TokenID ? "block" : "none",
          }}
        >
          {" "}
          Token succesfully send to SOUL.
          <br />
          Token-id: {TokenID}
        </div>
      </div>
    </FactoryLayout>
  );
};

export default Mint;
