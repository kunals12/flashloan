const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
// const { fundContract } = require("../utils/utilities");
const {
  abi,
} = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const { fundContract } = require("../utils/utilities");
const provider = ethers.getDefaultProvider();

describe("Flashloan Contract", () => {
  let FLASHLOAN, BORROW_AMOUNT, FUND_AMOUNT, initialFundingHuman, txArbitrage;
  const DECIMALS = 18;

  const BUSD_WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  // const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
  const CROX = "0x2c094F5A7D1146BB93850f629501eB749f6Ed491";
  const CAKE = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";

  const busdInstance = new ethers.Contract(BUSD, abi, provider);

  beforeEach(async () => {
    const whaleBalance = await ethers.provider.getBalance(BUSD_WHALE);
    // console.log("whale Balance", whaleBalance);
    expect(whaleBalance).not.equal("0");

    // Deploy smart contract
    FLASHLOAN = await ethers.getContractFactory("FlashLoan");
    FLASHLOAN = await FLASHLOAN.deploy();

    // await FlashLoan.deployed();
    const contractAddress = await FLASHLOAN.getAddress();
    // console.log(contractAddress);

    initialFundingHuman = "100";
    BORROW_AMOUNT = ethers.parseUnits(initialFundingHuman, DECIMALS);
    // console.log("Borrowed amount", BORROW_AMOUNT);
    await fundContract(
      busdInstance,
      BUSD_WHALE,
      contractAddress,
      initialFundingHuman
    );
  });

  describe("Arbitrage Execution", () => {
    it("ensures the contract is funded", async () => {
      const flashLoanBalance = await FLASHLOAN.getBalanceOfToken(BUSD);
      const balanceReadable = ethers.formatUnits(flashLoanBalance, DECIMALS);
      console.log(balanceReadable);
      expect(Number(balanceReadable)).equal(Number(initialFundingHuman));
    });
  });

  it("execute the arbitrage", async () => {
    txArbitrage = await FLASHLOAN.initateArbitrage(BUSD, BORROW_AMOUNT);
  });
});
