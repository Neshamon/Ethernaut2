import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

const abi = [
  {
    inputs: [{ internalType: "string", name: "_password", type: "string" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "string", name: "passkey", type: "string" }],
    name: "authenticate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xaa613b29",
  },
  {
    inputs: [],
    name: "getCleared",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x3c848d78",
  },
  {
    inputs: [],
    name: "info",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x370158ea",
  },
  {
    inputs: [],
    name: "info1",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0xd4c3cf44",
  },
  {
    inputs: [{ internalType: "string", name: "param", type: "string" }],
    name: "info2",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x2133b6a9",
  },
  {
    inputs: [],
    name: "info42",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x2cbd79a5",
  },
  {
    inputs: [],
    name: "infoNum",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xc253aebe",
  },
  {
    inputs: [],
    name: "method7123949",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0xf0bc7081",
  },
  {
    inputs: [],
    name: "password",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x224b610b",
  },
  {
    inputs: [],
    name: "theMethodName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xf157a1e3",
  },
];

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeAddress = await createChallenge(`0x4E73b858fD5D7A5fc1c3455061dE52a53F35d966`)
  challenge = await ethers.getContractAt(
    abi,
    challengeAddress,
  );
});

it("solves the challenge", async function () {
  const solutions = await Promise.all([
    challenge.info(),
    challenge.info1(),
    challenge.info2("hello"),
    challenge.infoNum(),
    challenge.info42(),
    challenge.theMethodName(),
    challenge.method7123949(),
    challenge.password()
  ])
  console.log(solutions.join(`\n`));
  console.log(`Password: ${await challenge.password()}`)

  tx = await challenge.authenticate(challenge.password())
  await tx.wait()
})

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
