pragma solidity ^0.4.23;

contract ProofVerifiersInterface {
    function register() public payable;
    function unstake(uint256 amount) public;
    function isProofVerifier(address proofVerifier) public returns(bool /*true/false*/);
}
