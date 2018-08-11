// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
// Utility Chain: Voting Contract
//
// http://www.proofprotocol.org/
//
// ----------------------------------------------------------------------------

pragma solidity ^0.4.23;

/**
 *  @title Voting contract.
 *
 *  @notice Implements proof of stake and proof verifiers logic
 *
 */
contract ProofOfStake {

    event ProofVerificationStarted(bytes32 _requestId, uint256 _startBlockTime, uint256 _endBlockTime);
    event ProofVerifierRegistered(address _proofVerifier, bytes32 _requestId);
    event ProofVerificationDone(address _proofVerifier, bool _isProven);

    uint256 proofVerificationStartingBlockNumber;
    uint256 proofVerificationEndingBlockNumber;
    uint256 voteWaitTimeInBlocks;
    address proofFacilitator;
    bool hasProofVerificationStarted;
    bytes32 requestId;

    struct ProofVerifier {
        address proofVerifier;
        bool hasVoted;
        bool isProven; // Proof verification is true/false
    }

    mapping(address => ProofVerifier) proofVerifiedBy;
    address[] proofVerifiers;


    modifier onlyProofVerifiers(){
        _;
    }

    constructor(
        bytes32 _requestId,
        uint256 _voteWaitTimeInBlocks)
    {
        requestId = _requestId;
        voteWaitTimeInBlocks = _voteWaitTimeInBlocks;
    }

    function startVoting()
        external
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == false, "Voting has already started!");
        hasProofVerificationStarted = true;
        proofVerificationStartingBlockNumber = block.number;
        proofVerificationEndingBlockNumber = proofVerificationStartingBlockNumber + voteWaitTimeInBlocks;

        emit ProofVerificationStarted(requestId, proofVerificationStartingBlockNumber, proofVerificationEndingBlockNumber);
    }

    // TODO Move to registered contract
    function registerToVote()
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting should already be started!");
        require(block.number <= proofVerificationEndingBlockNumber, "registration is expired!");
        require(proofVerifiedBy[msg.sender].proofVerifier == address(0), "You have already registered!");
        require(msg.value > 0);

        proofVerifiers.push(msg.sender);
        proofVerifiedBy[msg.sender] =  ProofVerifier(msg.sender, false, false);
        emit ProofVerifierRegistered(msg.sender, requestId);
    }

    function performVerification(
        bool isProven)
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting is not started yet!");
        require(block.number <= proofVerificationEndingBlockNumber, "Voting is expired!");
        require(proofVerifiedBy[msg.sender].hasVoted == false, "msg.sender has already voted!");
        proofVerifiedBy[msg.sender].isProven = isProven;

        ProofVerificationDone(msg.sender, isProven);
    }

    // TODO
    function finalize()
        onlyProofVerifiers
    {

        require(hasProofVerificationStarted == true);
        require(block.number > proofVerificationEndingBlockNumber);

        //logic to return stakedAmount, claim stakedAmount , distribute reward

    }
}