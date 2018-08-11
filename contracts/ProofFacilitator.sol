pragma solidity ^0.4.23;

import "./ProofOfStake.sol";

contract ProofFacilitator {

    /* events */
    event Registered(bytes32 _uuid,
        bytes _name,
        bytes _chainId);

    event ProofRequestedEvent(bytes32 _uuid,
        bytes32 _requestId,
        address _contractAddress,
        bytes _position,
        address proofOfStake,
        bytes data);

    struct Registration {
        bytes name;
        bytes chainId;
    }

    struct ProofRequest {
        bytes32 uuid;
        address contractAddress;
        bytes position;
        bytes data;
        uint256 amount;
        address proofOfStake;
    }
    address owner;

    mapping(address => uint) nonces;
    mapping(bytes32 => ProofRequest) requests;
    mapping(bytes32 => Registration) registrations;
    uint256 voteWaitingTimeInBlocks = 100;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor()
        public
    {
        owner = msg.sender;
    }

    function register(
        bytes name,
        bytes chainId)
        public
        returns (bytes32 client){

        require(name.length != 0);
        require(chainId.length != 0);

        bytes32 uuid = keccak256(abi.encodePacked(name, chainId));

        require(registrations[uuid].name.length == 0);

        registrations[uuid] = Registration(name, chainId);
        emit Registered(uuid, name, chainId);

        return uuid;
    }

    function requestProof(
        bytes32 uuid,
        address contractAddress,
        bytes position,
        bytes data)
        public
        payable
    {
        require(uuid != bytes32(0));
        require(contractAddress != address(0));

        uint256 fee = msg.value;

        uint256 nonce = nonces[msg.sender];

        nonces[msg.sender] = nonce + 1;

        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, nonces[msg.sender]));

        ProofOfStake pos = new ProofOfStake(requestId, voteWaitingTimeInBlocks);
        //todo send ether to pos

        requests[requestId] = ProofRequest(uuid, contractAddress, position, data, fee, pos);

        emit ProofRequestedEvent(uuid, requestId, contractAddress, position, pos, data);
    }

}