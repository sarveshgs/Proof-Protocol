pragma solidity ^0.4.23;

contract ProofVerifiers {

    event ProofVerifierRegistered(address _verifier, uint256 _stakeAmount);
    event UnStaked(address _verifier, uint256 _unstakeAmount);

    mapping(address => uint256 /*stake*/) public verifiers;

    function register()
        public
        payable
    {
        uint256 stakeAmount = msg.value;

        require(verifiers[msg.sender] == 0);

        verifiers[msg.sender] += stakeAmount;

        emit ProofVerifierRegistered(msg.sender, stakeAmount);
    }

    function unstake(
        uint256 amount)
        public
    {
        require(verifiers[msg.sender] != 0);
        require(verifiers[msg.sender] > amount);

        verifiers[msg.sender] = verifiers[msg.sender] - amount;

        emit UnStaked(msg.sender, amount);
    }

    function isProofVerifier(
        address proofVerifier)
        public
        returns(bool /*true/false*/)
    {
        return verifiers[proofVerifier] > 0 ? true : false;
    }

}
