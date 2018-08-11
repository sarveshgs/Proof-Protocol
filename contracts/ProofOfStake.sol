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

    event ProofVerificationStarted(bytes32 _requestId, address _contractAddress, bytes _position, uint256 _startBlockTime, uint256 _endBlockTime);
    event ProofVerifierRegistered(address ProofVerifier, bytes _bounty);
    event ProofVerificationDone(address ProofVerifier, bool _isProven);

    uint256 proofVerificationStartingBlockNumber;
    uint256 proofVerificationEndingBlockNumber;
    address contractAddress;
    address proofFacilitator;
    bool hasProofVerificationStarted;
    bytes requestId;

    struct ProofVerifier {
        address proofVerifier;
        uint256 stakedAmount;
        bool hasVoted;
        bool isProven; // proof is true/false
    }

    mapping(address => ProofVerifier) vote;
    address[] proofVerifiers;

    constructor(
        bytes32 _requestId,
        address _contractAddress,
        uint256 _voteWaitingTimeInBlocks,
        uint256 _stakedAmount)
    {
        requestId = _requestId;
        contractAddress = _contractAddress;
        voteWaitTimeInBlocks = _voteWaitTimeInBlocks;
        stakedAmount = _stakedAmount;
    }

    function startVoting()
        external
        onlyWorker
    {
        require(hasProofVerificationStarted == false, "Voting has already started!");
        hasProofVerificationStarted = true;
        proofVerificationStartingBlockNumber = block.number;
        proofVerificationEndingBlockNumber = proofVerificationStartingBlockNumber + voteWaitTimeInBlocks;

        emit ProofVerificationStarted(requestId, contractAddress, position, proofVerificationStartingBlockNumber, proofVerificationEndingBlockNumber);
    }

    // Move to registered contract
    function registerToVote()
        payable
    {

        require(hasProofVerificationStarted == true, "Voting should already be started!");
        require(block.number <= proofVerificationEndingBlockNumber, "registration is expired!");
        require(vote[msg.sender] == 0);
        require(msg.value >= stakedAmount);

        proofVerifiers.push(msg.sender);
        vote[msg.sender] = new ProofVerifier(msg.sender, stakedAmount, false);

        emit ProofVerifierRegistered(msg.sender, msg.value);
    }

    function vote(
        bool isProven)
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting is not started yet!");
        require(block <= proofVerificationEndingBlockNumber, "Voting is expired!");
        require(vote[msg.sender].hasVoted == false, "msg.sender has already voted!");
        vote[msg.sender].isProven = isProven;

        ProofVerificationDone(msg.sender, isProven);
    }

    // TODO
    function concludeVoting(){

        require(hasProofVerificationStarted == true);
        require(block > proofVerificationEndingBlockNumber);

        //logic to return stakedAmount, claim stakedAmount , distribute reward

    }
}