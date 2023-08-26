const apikey = "GTAAE8MSMI449RJKDIBA9YCI8EDAW95JP3";
const endpoint = "https://api-rinkeby.etherscan.io/api";

const apicall = async (address) => {
  const result = await fetch(
    `${endpoint}?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${apikey}`
  );

  const resultJSON = await result.json();
  const result2 = await resultJSON.result;
  const tokens = [];

  for (let i = 0; i < result2.length; i++) {
    tokens.push([
      result2[i].tokenName,
      result2[i].tokenSymbol,
      result2[i].tokenID,
      result2[i].contractAddress,
    ]);
  }
  return tokens;
};

export default apicall;
