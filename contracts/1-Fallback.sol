pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

contract Fallback {

  using SafeMath for uint256;
  mapping(address => uint) public contributions; //@dev This mapping records the accounts //that have made a contribution in the mapping, "contributions"
  address payable public owner; //@dev The owner address is stored in this variable.

  constructor() public {
    owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
  } /*
     *@dev The constructor is the piece of code that
     *runs before all other methods in a smart contract.
     *This constructor sets the contract as the owner
     *and describes that the initial contribution is equivalent
     *to 1000 Ether
     */

  modifier onlyOwner {
        require(
            msg.sender == owner,
            "caller is not the owner"
        );
        _;
    }//@dev This modifier dictates that only the owner can call the method the modifier affects.

  function contribute() public payable {
    require(msg.value < 0.001 ether); //@dev The contribute function requires that any contribution is greater than 0.001 Ether
    contributions[msg.sender] += msg.value; //@dev Here it adds it to the mapping.
    if(contributions[msg.sender] > contributions[owner]) {
      owner = msg.sender;
    } /*
       *@dev This if statement seems like the first vulnerability
       *but only serves as a distraction to an attacker.
       *In order to take advantage of this vulnerability,
       *you would need to contribute more than 1000 Ether to become the owner.
       *This initial contribution is defined in the constructor.
       */
  }

  function getContribution() public view returns (uint) {
    return contributions[msg.sender];
  }

  function withdraw() public onlyOwner {
    owner.transfer(address(this).balance);
  }//@dev The withdraw function will transfer all the assets of the owner to the address that calls the function.
   //This is why there aren't any parameters in the withdraw function.

  fallback() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
  }/*
    *@dev This fallback function is the prime vulnerability of this contract.
    *The only requirements needed to call this function is:
     *1. That the value sent is greater than zero
     *2. That the sender's total contributions to the contribution mapping is greater than zero
    *After these two checks are met, the sender becomes the owner of the contract.
    */
}
