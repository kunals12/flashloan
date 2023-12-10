const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const fundToken = async (contract, sender, recepient, amount) => {
  const FUND_AMOUNT = ethers.parseUnits(amount, 18);
  // fund erc20 token to the contract
  const whale = await ethers.getSigner(sender);

  const contractSigner = contract.connect(whale);
  // console.log("contract signer", contractSigner.BaseContract.target);
  await contractSigner.transfer(recepient, FUND_AMOUNT);
};

const fundContract = async (contract, sender, recepient, amount) => {
  await helpers.impersonateAccount(sender);
  // await ethers.getSigner(sender);

  // fund baseToken to the contract
  await fundToken(contract, sender, recepient, amount);
  // await helpers.reset();
};

module.exports = {
  fundContract: fundContract,
};
