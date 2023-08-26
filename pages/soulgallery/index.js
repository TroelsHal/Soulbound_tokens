import React, { useState } from "react";
import apicall from "../../apicall";
import ISoulbound from "../../ISoulboundABI";
import ReadTimeStamp from "../../timeFromBlockchain";
import web3 from "../../web3";
import SouledinLayout from "../../components/galleryLayout";

const SouledIn = () => {
  const [ErrorMessageUserAddress, SetErrorMessageUserAddress] = useState("");
  const [ErrorMessageTokens, SetErrorMessageTokens] = useState("");

  const [StatusMessageFindTokens, SetStatusMessageFindTokens] = useState("");
  const [ResultMessage, SetResultMessage] = useState("");

  const [StatusMessageDiscard, SetStatusMessageDiscard] = useState("");
  const [DiscardingIndex, SetDiscardingIndex] = useState(-1);
  const [AlreadyDiscarded, SetAlreadyDiscarded] = useState([]);

  const [Tokens, SetTokens] = useState([]);
  const [SoulAddress, SetSoulAddress] = useState("");

  const [UserIsSoul, SetUserIsSoul] = useState(false);

  const GetUserAddress = async () => {
    SetSoulAddress("");
    SetTokens([]);
    SetResultMessage("");
    try {
      SetErrorMessageUserAddress("");
      const accounts = await web3.eth.getAccounts();
      const useraddress = accounts[0];
      if (useraddress) {
        SetSoulAddress(useraddress);
      } else {
        throw {
          message: "User address not found. Maybe MetaMask is not connected.",
        };
      }
    } catch (err) {
      SetErrorMessageUserAddress(err.message);
    }
  };

  const GetTokenData = async (event) => {
    event.preventDefault();
    SetErrorMessageUserAddress("");
    SetErrorMessageTokens("");
    SetResultMessage("");
    SetTokens([]);
    SetAlreadyDiscarded([]);
    SetStatusMessageFindTokens("Please wait. Calling API to find tokens...");

    try {
      if (!SoulAddress) {
        throw { message: "Please choose address" };
      }
      const tokensReturnedFromAPI = await apicall(SoulAddress);
      SetStatusMessageFindTokens(
        "Received data from API. Please wait while reading data from blockchain..."
      );

      const tokenData = [];
      for (const tokenFromAPI of tokensReturnedFromAPI) {
        try {
          const contractAddress = tokenFromAPI[3];
          const contractInstance = ISoulbound(contractAddress.trim());
          const supportsInterface = await contractInstance.methods
            .supportsInterface("0x62f5c759")
            .call();
          if (!supportsInterface) {
            throw { message: "Contract does not support ISoulbound interface" };
          }

          const tokenID = tokenFromAPI[2];
          const holder = await contractInstance.methods
            .holderOf(tokenID)
            .call();
          if (holder != SoulAddress) {
            throw { message: "Soul is not the holder of this token" };
          }

          const name = await contractInstance.methods.name().call();
          const symbol = await contractInstance.methods.symbol().call();
          const data = await contractInstance.methods.getData(tokenID).call();
          tokenData.push([
            name,
            symbol,
            data[0],
            data[1],
            ReadTimeStamp(data[2]),
            ReadTimeStamp(data[3]),
            contractAddress,
            tokenID,
          ]);
        } catch (error) {
          console.log("ERROR READING DATA FOR:");
          console.log(tokenFromAPI[2], tokenFromAPI[3]);
          console.log(error.message);
        }
      }
      try {
        SetUserIsSoul(false);
        const accounts = await web3.eth.getAccounts();
        const useraddress = accounts[0];
        if (!useraddress) {
          throw {};
        }
        if (useraddress != SoulAddress) {
          throw {};
        }
        SetUserIsSoul(true);
      } catch (err) {
        err;
      }

      SetTokens(tokenData);
      SetStatusMessageFindTokens("");
      SetResultMessage(
        `Found ${tokenData.length} SOULBOUND token${
          tokenData.length == 1 ? "" : "s"
        } belonging to SOUL address ${SoulAddress}`
      );
    } catch (err) {
      SetErrorMessageTokens(err.message);
      SetStatusMessageFindTokens("");
    }
  };

  const Discard = async (contractAddress, tokenID, index) => {
    try {
      SetErrorMessageTokens("");
      SetResultMessage("");
      SetStatusMessageDiscard(
        "Discarding token. Please wait while writing to blockchain..."
      );
      SetDiscardingIndex(index);
      const accounts = await web3.eth.getAccounts();
      const useraddress = accounts[0];
      if (!useraddress) {
        throw {
          message: "User address not found. Maybe MetaMask is not connected.",
        };
      }
      const contractInstance = ISoulbound(contractAddress.trim());
      await contractInstance.methods
        .discard(tokenID)
        .send({ from: useraddress });
      SetStatusMessageDiscard("");
      SetResultMessage(
        "Token succesfully discarded. Use button 'Find SOULBOUND tokens' to update this page."
      );
      SetDiscardingIndex(-1);
      SetAlreadyDiscarded(AlreadyDiscarded.concat(index));
    } catch (err) {
      SetDiscardingIndex(-1);
      console.log(AlreadyDiscarded);
      SetErrorMessageTokens(err.message);
      SetStatusMessageDiscard("");
    }
  };

  const RenderTokens = () => {
    return (
      <div>
        <div className="d-flex flex-wrap">
          {Tokens.map((token, index) => (
            <div
              key={index}
              className="card mb-3 me-3 border border-3 p-1"
              style={{ width: "26rem" }}
            >
              <h5 className="card-title">{token[2]}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{token[0]}</h6>
              <p className="card-text">{token[3]}</p>

              <hr className="mt-0"></hr>
              <p className="card-text">
                <small>Created: </small>
                <small className="text-muted">{token[4]}</small>
                <br />
                <small>Expires: </small>
                <small className="text-muted">{token[5]}</small>
                <br />
                <small>ContractAddress:</small>
                <small className="text-muted"> {token[6]}</small>
                <br />
                <small>TokenID:</small>
                <small className="text-muted"> {token[7]}</small>
              </p>

              <div className=""></div>

              <button
                disabled={
                  DiscardingIndex >= 0 || AlreadyDiscarded.includes(index)
                }
                type="button"
                className="btn btn-secondary"
                onClick={(event) => {
                  event.preventDefault();
                  Discard(token[6], token[7], index);
                }}
                style={{
                  display: UserIsSoul && DiscardingIndex != index ? "" : "none",
                }}
              >
                Discard
              </button>
              <button
                disabled
                type="submit"
                className="btn btn-secondary"
                style={{
                  display: UserIsSoul && DiscardingIndex == index ? "" : "none",
                }}
              >
                <div
                  type="submit"
                  className="spinner-border spinner-border-sm"
                  disabled
                ></div>
                <div></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SouledinLayout>
      <div>
        <form onSubmit={GetTokenData}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={GetUserAddress}
          >
            Click to use your own SOUL address...
          </button>

          <br />
          <br />
          <label htmlFor="inputTokenIssuer">
            ...or enter any SOUL address:
          </label>
          <input
            type="text"
            className="form-control"
            id="SoulAddress"
            placeholder="Soul address"
            value={SoulAddress}
            onChange={(event) => SetSoulAddress(event.target.value)}
          />

          <div
            className="alert alert-danger"
            role="alert"
            style={{
              visibility: ErrorMessageUserAddress ? "" : "hidden",
            }}
          >
            {ErrorMessageUserAddress}
          </div>

          <button
            type="submit"
            className="btn btn-primary mb-2"
            style={{
              display: SoulAddress && !StatusMessageFindTokens ? "" : "none",
            }}
          >
            Find SOULBOUND tokens
          </button>
          <button
            disabled
            type="submit"
            className="btn btn-primary  mb-2"
            style={{
              display: SoulAddress && StatusMessageFindTokens ? "" : "none",
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
            display: ErrorMessageTokens ? "block" : "none",
          }}
        >
          {ErrorMessageTokens}
        </div>

        <div
          className="alert alert-secondary"
          role="alert"
          style={{
            display: StatusMessageFindTokens ? "block" : "none",
          }}
        >
          {StatusMessageFindTokens}
        </div>
        <div
          className="alert alert-secondary"
          role="alert"
          style={{
            display: StatusMessageDiscard ? "block" : "none",
          }}
        >
          {StatusMessageDiscard}
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            display: ResultMessage ? "block" : "none",
          }}
        >
          {ResultMessage}
        </div>

        {RenderTokens()}
      </div>
    </SouledinLayout>
  );
};

export default SouledIn;
