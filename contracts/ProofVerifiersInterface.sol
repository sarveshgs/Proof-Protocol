pragma solidity ^0.4.23;

contract ProofVerifiersInterface {
    function register() payable;
    function unstake(uint256 amount);
    function isProofVerifier(address proofVerifier) returns(bool /*true/false*/);
}
