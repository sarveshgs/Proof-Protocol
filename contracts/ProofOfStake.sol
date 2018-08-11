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

import "./SafeMath.sol";
import "./ProofFacilitatorsInterface.sol";

/**
 *  @title Voting contract.
 *
 *  @notice Implements proof of stake and proof verifiers logic
 *
 */
contract ProofOfStake {

    using SafeMath for uint256;

    event ProofVerificationStarted(bytes32 _requestId, uint256 _startBlockTime, uint256 _endBlockTime);
    event ProofVerifierRegistered(address _proofVerifier, bytes32 _requestId);
    event ProofVerificationDone(address _proofVerifier, bool _isProven);

    uint256 public proofVerificationStartingBlockNumber;
    uint256 public proofVerificationEndingBlockNumber;
    uint256 public voteWaitTimeInBlocks;
    address public proofFacilitator;
    bool public hasProofVerificationStarted;
    bytes32 public requestId;
    address proofFacilitators;

    struct ProofVerifier {
        address proofVerifier;
        bool hasVoted;
        bool isProven; /** Proof verification is true/false */
    }

    mapping(address => ProofVerifier) public proofVerifiedBy;
    address[] public proofVerifiers;


    modifier onlyProofVerifiers(){
        require(ProofFacilitatorsInterface(proofFacilitators).isProofVerifier(msg.sender));
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
        public
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == false, "Voting has already started!");
        hasProofVerificationStarted = true;
        proofVerificationStartingBlockNumber = block.number;
        proofVerificationEndingBlockNumber = proofVerificationStartingBlockNumber.add(voteWaitTimeInBlocks);
        register(msg.sender);

        emit ProofVerificationStarted(requestId, proofVerificationStartingBlockNumber, proofVerificationEndingBlockNumber);
    }

    // TODO Move to registered contract
    function registerToVote()
        public
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting should already be started!");
        require(block.number <= proofVerificationEndingBlockNumber, "registration is expired!");
        require(proofVerifiedBy[msg.sender].proofVerifier == address(0), "You have already registered!");
        register(msg.sender);
        emit ProofVerifierRegistered(msg.sender, requestId);
    }

    function performVerification(
        bool isProven)
        public
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting is not started yet!");
        require(block.number <= proofVerificationEndingBlockNumber, "Voting is expired!");
        require(proofVerifiedBy[msg.sender].hasVoted == false, "msg.sender has already voted!");
        proofVerifiedBy[msg.sender].isProven = isProven;

        ProofVerificationDone(msg.sender, isProven);
    }

    // TODO Discuss
    function finalize()
        public
        onlyProofVerifiers
    {

        require(hasProofVerificationStarted == true);
        require(block.number > proofVerificationEndingBlockNumber);

        //logic to return stakedAmount, claim stakedAmount , distribute reward

    }

    function register(
        address _proofVerifier)
        private
    {
        proofVerifiers.push(_proofVerifier);
        proofVerifiedBy[_proofVerifier] =  ProofVerifier(_proofVerifier, false, false);
    }


}