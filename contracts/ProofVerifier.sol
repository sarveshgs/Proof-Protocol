pragma solidity ^0.4.23;

contract ProofVerifier {

    event ProofVerifierRegistered(address _verifier, uint256 _stakeAmount);
    event Unstaked(address _verifier, uint256 _unstakeAmount);

    mapping(address => uint256 /*stake*/) verifiers;

    function register()
        payable
    {
        uint256 stakeAmount = msg.value;

        require(verifiers[msg.sender] == 0);

        verifiers[msg.sender] = stakeAmount;
    }

    function unstake(
        uint256 amount)
    {
        require(verifiers[msg.sender] != 0);
        require(verifiers[msg.sender] > amount);

        verifiers[msg.sender] = verifiers[msg.sender] - amount;

        emit Unstaked(msg.sender, amount);
    }

    function isProofVerifier(
        address proofVerifier)
        returns(bool /*true/false*/)
    {
        return verifiers[proofVerifier] > 0 ? true : false;
    }
}
