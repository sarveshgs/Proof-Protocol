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
    event ProofFinalized(bytes32 _requestId, bool status, uint256 totalVotes, uint256 majorityVotes);

    uint256 constant majorityThreshold = 67;
    uint256 public proofVerificationStartingBlockNumber;
    uint256 public proofVerificationEndingBlockNumber;
    uint256 public voteWaitTimeInBlocks;
    bool public hasProofVerificationStarted;
    bytes32 public requestId;
    address public proofVerifier;

    struct ProofVerifier {
        address proofVerifier;
        bool hasVoted;
        bool isProven; /** Proof verification is true/false */
    }

    mapping(address => ProofVerifier) public proofVerifiedData;
    address[] public proofVerifiers;


    modifier onlyProofVerifiers(){
        require(ProofVerifiersInterface(proofVerifier).isProofVerifier(msg.sender));
        _;
    }

    constructor(
        address _proofVerifier,
        bytes32 _requestId,
        uint256 _voteWaitTimeInBlocks)
        public
    {
        proofVerifier = _proofVerifier;
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

        emit ProofVerificationStarted(requestId, proofVerificationStartingBlockNumber, proofVerificationEndingBlockNumber);
    }

    function performVerification(
        bool isProven)
        public
        onlyProofVerifiers
    {
        require(hasProofVerificationStarted == true, "Voting is not started yet!");
        require(block.number <= proofVerificationEndingBlockNumber, "Voting is expired!");
        register(msg.sender);
        require(proofVerifiedData[msg.sender].hasVoted == false, "msg.sender has already voted!");

        proofVerifiedData[msg.sender].isProven = isProven;

        emit ProofVerificationDone(msg.sender, isProven);
    }

    // TODO Discuss and refine reward
    function finalize()
        public
        onlyProofVerifiers
        returns (bool)
    {
        require(hasProofVerificationStarted == true);
        /** TODO uncomment below line after ethindia winning presentation */
        //require(block.number > proofVerificationEndingBlockNumber);

        uint256 totalVotes = proofVerifiers.length;
        uint256 positiveVotes = 0;
        uint256 negativeVotes = 0;
        for (uint256 i=0; i<totalVotes; i++) {
            address pvAddress = proofVerifiers[i];
            ProofVerifier storage proofData = proofVerifiedData[pvAddress];
            if (proofData.hasVoted) {
                if (proofData.isProven){
                    positiveVotes++ ;
                } else {
                    negativeVotes++;
                }
            }
        }

        if (positiveVotes>negativeVotes){
            emit ProofFinalized(requestId, true, totalVotes, positiveVotes);
            return true;
        } else {
            emit ProofFinalized(requestId, false, totalVotes, negativeVotes);
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