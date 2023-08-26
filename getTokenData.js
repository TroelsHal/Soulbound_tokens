const GetTokenData = async (event) => {
  event.preventDefault();
  SetErrorMessageGetUserAddress("");
  SetErrorMessageFindTokens("");
  SetResultMessage("");
  SetTokens([]);
  SetStatusMessage("Please wait. Calling API to find tokens...");

  try {
    if (!SoulAddress) {
      throw { message: "Please choose address" };
    }
    const tokensReturnedFromAPI = await apicall(SoulAddress);
    SetStatusMessage(
      "Received data from API. Please wait while reading data from blockchain..."
    );

    const tokenData = [];
    for (const tokenFromAPI of tokensReturnedFromAPI) {
      try {
        const contractAddress = tokenFromAPI[3];
        const contractInstance = ISoulbound(contractAddress);
        const supportsInterface = await contractInstance.methods
          .supportsInterface("0x980c7459")
          .call();
        if (!supportsInterface) {
          throw { message: "Does not support interface" };
        }

        const tokenID = tokenFromAPI[2];
        const holder = await contractInstance.methods.holderOf(tokenID).call();
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
        ]);
      } catch (error) {
        console.log("ERROR READING DATA FOR:");
        console.log(
          tokenFromAPI[0],
          tokenFromAPI[1],
          tokenFromAPI[2],
          tokenFromAPI[3]
        );
        console.log(error.message);
      }
    }
    SetTokens(tokenData);
    SetStatusMessage("");
    SetResultMessage(
      `Found ${tokenData.length} SOULBOUND token${
        tokenData.length == 1 ? "" : "s"
      } belonging to SOUL address ${SoulAddress}`
    );
  } catch (err) {
    SetErrorMessageFindTokens(err.message);
    SetStatusMessage("");
  }
};

//export default GetTokenData;
