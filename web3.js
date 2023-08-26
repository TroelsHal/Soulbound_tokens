import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // In the browser and user has MetaMask
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // On the web server or user does not have MetaMask.
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/1dc2010d439641a38f926f69733be149"
  );
  web3 = new Web3(provider);
}

export default web3;
