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
import "./ProofVerifiersInterface.sol";

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
    event ProofFinalized(bytes32 _requestId, bool status);

    uint256 constant majorityThreshold = 67;
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

    mapping(address => ProofVerifier) public proofVerifiedData;
    address[] public proofVerifiers;


    modifier onlyProofVerifiers(){
        require(ProofVerifiersInterface(proofFacilitators).isProofVerifier(msg.sender));
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

    function registerToVote()
        public
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting should already be started!");
        require(block.number <= proofVerificationEndingBlockNumber, "registration is expired!");
        require(proofVerifiedData[msg.sender].proofVerifier == address(0), "You have already registered!");
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
        require(proofVerifiedData[msg.sender].hasVoted == false, "msg.sender has already voted!");
        proofVerifiedData[msg.sender].isProven = isProven;

        ProofVerificationDone(msg.sender, isProven);
    }

    // TODO Discuss and refine reward
    function finalize()
        public
        onlyProofVerifiers
        returns (bool)
    {
        require(hasProofVerificationStarted == true);
        require(block.number > proofVerificationEndingBlockNumber);

        uint256 totalVotes = proofVerifiers.length;
        uint256 positiveVotes = 0;
        uint256 negativeVotes = 0;
        for (uint256 i=0; i<totalVotes; i++) {
            address proofVerifier = proofVerifiers[i];
            ProofVerifier storage proofData = proofVerifiedData[proofVerifier];
            if (proofData.hasVoted) {
                if (proofData.isProven){
                    positiveVotes++ ;
                } else {
                    negativeVotes++;
                }
            }
        }

        if (positiveVotes>negativeVotes){
            ProofFinalized(requestId, true);
            return true;
        } else {
            ProofFinalized(requestId, false);
            return false;
        }
    }

    function register(
        address _proofVerifier)
        private
    {
        proofVerifiers.push(_proofVerifier);
        proofVerifiedData[_proofVerifier] =  ProofVerifier(_proofVerifier, false, false);
    }


}