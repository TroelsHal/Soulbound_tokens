import React, { useState } from "react";
import FactoryLayout from "../../components/factoryLayout";
import ISoulbound from "../../ISoulboundABI";
import web3 from "../../web3";

const Revoke = () => {
  const [ContractAddress, SetContractAddress] = useState("");
  const [TokenID, SetTokenID] = useState("");

  const [StatusMessageContract, SetStatusMessageContract] = useState("");
  const [ErrorMessageContract, SetErrorMessageContract] = useState("");
  const [ContractFound, SetContractFound] = useState(false);
  const [TokenName, SetTokenName] = useState("");
  const [TokenSymbol, SetTokenSymbol] = useState("");

  const [StatusMessageToken, SetStatusMessageToken] = useState("");
  const [ErrorMessageToken, SetErrorMessageToken] = useState("");
  const [TokenFound, SetTokenFound] = useState(false);
  const [Revokable, SetRevokable] = useState(false);
  const [TokenData, SetTokenData] = useState([]);

  const [StatusMessageRevoke, SetStatusMessageRevoke] = useState("");
  const [ErrorMessageRevoke, SetErrorMessageRevoke] = useState("");
  const [ResultMessageRevoke, SetResultMessageRevoke] = useState("");

  const ClearAllStateContract = () => {
    SetStatusMessageContract("");
    SetErrorMessageContract("");
    SetContractFound(false);
    SetTokenName("");
    SetTokenSymbol("");
  };

  const ClearAllStateToken = () => {
    SetStatusMessageToken("");
    SetErrorMessageToken("");
    SetTokenFound(false);
    SetRevokable(false);
    SetTokenData([]);
  };

  const ClearAllStateRevoke = () => {
    SetStatusMessageRevoke("");
    SetErrorMessageRevoke("");
    SetResultMessageRevoke("");
  };

  const handleSubmitFindContract = async (event) => {
    event.preventDefault();
    ClearAllStateContract();
    ClearAllStateToken();
    ClearAllStateRevoke();
    SetTokenID("");

    try {
      SetStatusMessageContract(
        "Please wait. Submitting your transaction to the blockchain..."
      );
      const contractInstance = ISoulbound(ContractAddress.trim());
      const supportsInterface = await contractInstance.methods
        .supportsInterface("0x62f5c759")
        .call();
      if (!supportsInterface) {
        throw {
          message: "This Contract does not support ISoulbound interface",
        };
      }

      const accounts = await web3.eth.getAccounts();
      const useraddress = accounts[0];
      if (!useraddress) {
        throw {
          message: "User address not found. Maybe MetaMask is not connected.",
        };
      }

      const contractOwner = await contractInstance.methods
        .getContractOwner()
        .call();
      const _tokenName = await contractInstance.methods.name().call();
      const _tokenSymbol = await contractInstance.methods.symbol().call();
      if (parseInt(useraddress) != parseInt(contractOwner)) {
        throw {
          message: `We found this SOULBOUND contract: ${_tokenName}. But it seems you are not the owner, and you can not revoke tokens.`,
        };
      }

      SetStatusMessageContract("");
      SetTokenName(_tokenName);
      SetTokenSymbol(_tokenSymbol);
      SetContractFound(true);
    } catch (err) {
      SetStatusMessageContract("");
      SetErrorMessageContract(err.message);
      SetContractFound(false);
    }
  };

  const handleSubmitFindToken = async (event) => {
    event.preventDefault();
    ClearAllStateToken();
    ClearAllStateRevoke();

    try {
      SetStatusMessageToken(
        "Please wait. Submitting your transaction to the blockchain..."
      );
      const contractInstance = ISoulbound(ContractAddress.trim());

      const holder = await contractInstance.methods.holderOf(TokenID).call();
      if (!parseInt(holder)) {
        throw {
          message:
            "This token does not exist. It might not have been created yet, it might have already been revoked, or it might have been discarded by the holder",
        };
      }

      const data = await contractInstance.methods.getData(TokenID).call();
      const _tokenData = [];
      _tokenData.push(holder, data[0], data[1]);

      const _revokable = await contractInstance.methods
        .isRevokable(TokenID)
        .call();

      SetStatusMessageToken("");
      SetTokenFound(true);
      SetTokenData(_tokenData);
      if (!_revokable) {
        throw {
          message: "This token can not be revoked",
        };
      }
      SetRevokable(true);
    } catch (err) {
      SetStatusMessageToken("");
      SetErrorMessageToken(err.message);
    }
  };

  const handleRevokeToken = async (event) => {
    event.preventDefault();
    ClearAllStateRevoke();
    try {
      SetStatusMessageRevoke(
        "Please wait. Submitting your transaction to the blockchain..."
      );
      const contractInstance = ISoulbound(ContractAddress.trim());
      const accounts = await web3.eth.getAccounts();
      await contractInstance.methods
        .revoke(TokenID)
        .send({ from: accounts[0] });
      SetStatusMessageRevoke("");
      SetResultMessageRevoke("Token has succesfully been revoked.");
    } catch (err) {
      SetStatusMessageRevoke("");
      SetErrorMessageRevoke(err.message);
    }
  };

  return (
    <FactoryLayout>
      <div>
        <h2>Revoke a token</h2>

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
          onSubmit={handleSubmitFindToken}
          style={{
            display: ContractFound ? "block" : "none",
          }}
        >
          <div className="form-group">
            <label htmlFor="inputTokenID">Token ID</label>
            <input
              type="text"
              className="form-control"
              id="inputTokenID"
              placeholder="Enter token ID number"
              value={TokenID}
              onChange={(event) => SetTokenID(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-dark"
            style={{
              display: !StatusMessageToken ? "" : "none",
            }}
          >
            Find token
          </button>
          <button
            disabled
            type="submit"
            className="btn btn-dark"
            style={{
              display: StatusMessageToken ? "" : "none",
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
            display: StatusMessageToken ? "block" : "none",
          }}
        >
          {StatusMessageToken}
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            display: TokenFound ? "block" : "none",
          }}
        >
          {" "}
          We found this SOULBOUND token:
          <br />
          <br />
          SOUL: {TokenData[0]}
          <br />
          Title: {TokenData[1]}
          <br />
          Description: {TokenData[2]}
        </div>
        <div
          className="alert alert-danger"
          role="alert"
          style={{
            display: ErrorMessageToken ? "block" : "none",
          }}
        >
          {ErrorMessageToken}
        </div>

        <button
          type="submit"
          className="btn btn-dark"
          style={{
            display: Revokable && !StatusMessageRevoke ? "" : "none",
          }}
          onClick={handleRevokeToken}
        >
          Revoke Token
        </button>

        <button
          disabled
          type="submit"
          className="btn btn-dark"
          style={{
            display: Revokable && StatusMessageRevoke ? "" : "none",
          }}
        >
          <div
            type="submit"
            className="spinner-border spinner-border-sm"
            disabled
          ></div>
          <div></div>
        </button>

        <div
          className="alert alert-secondary"
          role="alert"
          style={{
            display: StatusMessageRevoke ? "block" : "none",
          }}
        >
          {StatusMessageRevoke}
        </div>

        <div
          className="alert alert-danger"
          role="alert"
          style={{
            display: ErrorMessageRevoke ? "block" : "none",
          }}
        >
          There seems to be an error:
          <br />
          {ErrorMessageRevoke}
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            display: ResultMessageRevoke ? "block" : "none",
          }}
        >
          {ResultMessageRevoke}
        </div>
      </div>
    </FactoryLayout>
  );
};

export default Revoke;
