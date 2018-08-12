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
    event ProofVerificationDone(address _proofVerifier, bool _isProven);
    event ProofFinalized(bytes32 _requestId, bool _status, uint256 _totalVotes, uint256 _majorityVotes);

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

    /**
     * - In Proof of stake system, blocks are said to be ‘forged’ or ‘minted’, not mined.
     * - Users who validate transactions and create new blocks in this system are referred to as forgers.
     * - Proof of stake cases, digital currency units are created at the launch of the currency and their number is fixed.
     * - Rather than using cryptocurrency units as reward, the forgers receive transaction fees as rewards.
     * - Stake are being held in an escrow account. if they validate a fraudulent transaction,
     * they lose their holdings, as well as their rights to participate as a forger in the future.
     * - POS don't provide a way to handle the initial distribution of coins at the founding phase of the cryptocurrency,
     * so cryptocurrencies which use this system either begin with an ICO and sell their pre-mined coins, or begin with the proof of work system,
     * and switch over to the proof of stake system later.
     * ‘Randomized Block Selection’ and the ‘Coin Age Based Selection’
     * In the randomized block selection method of selection, a formula which looks for the user with the combination of the lowest hash value and the size of their stake.
     * In Coin age Based selection Users who have staked older and larger sets of coins have a greater chance of being assigned to forge the next block
     * Peercoin is a proof-of-stake system based cryptocurrency which uses the coin age selection process combined with the randomized selection method.
     *
     * Vlad Zamfir is to only partially destroy deposits of validators that get slashed, setting the percentage destroyed to be proportional to the percentage of other
     * validators that have been slashed recently. This ensures that validators lose all of their deposits in the event of an actual attack, but only a small part of their deposits in the event of a one-off mistake
     */
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