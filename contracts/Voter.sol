pragma solidity ^0.4.23;

contract Vote {
    event VotingStarted(bytes32 requestId, address contractAddress, bytes position, uint256 startBlockTime, uint256 endBlockTime);
    event VoterRegistered(address voter, bytes bounty);

    uint256 constant bounty = 10000;
    address proofFacilitator;
    mapping(address => Voter) vote;
    address[] voters;


    uint256 voteTimeInBlocks = 100;
    uint256 voteStartingBlockNumber;
    uint256 voteEndingBlockNumber;
    bool hasVotingStarted;


    bytes requestId;
    address contractAddress;
    bytes position;

    constructor(bytes32 _requestId, address _contractAddress, bytes _position){
        requestId = _requestId;
        contractAddress = _contractAddress;
        position = _position;
    }
    struct Voter {
        address voterAddress;
        uint256 bounty;
        bool hasVoted;
        bool isProven;// vote
    }

    function startVoting(){

        require(hasVotingStarted == false);
        hasVotingStarted = true;
        voteStartingBlockNumber = block;
        voteEndingBlockNumber = voteStartingBlockNumber + voteTimeInBlocks;
        emit VotingStarted(requestId, contractAddress, position, voteStartingBlockNumber, voteEndingBlockNumber);
    }

    function registerToVote() payable {

        require(hasVotingStarted == true);
        require(block < voteEndingBlockNumber);
        require(vote[msg.sender] == 0);
        require(msg.value > bounty);
        require(hasVotingStarted == true);

        voters.push(msg.sender);

        vote[msg.sender] = new Voter(msg.sender, bounty, false);

        emit VoterRegistered(msg.sender, msg.value);
    }

    function vote(bool isProven){

        require(hasVotingStarted == true);
        require(block < voteEndingBlockNumber);
        require(vote[msg.sender] != 0);
        require(vote[msg.sender].hasVoted == false);
        vote[msg.sender].isProven = isProven;
    }


    function concludeVoting(){

        require(hasVotingStarted == true);
        require(block > voteEndingBlockNumber);

        //logic to return bounty, claim bounty , distribute reward

    }
}