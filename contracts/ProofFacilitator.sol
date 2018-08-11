pragma solidity ^0.4.23;

contract ProofFacilitator {

    event Registered(bytes32 clientId);
    event ProofRequiredEvent(bytes32 client, bytes32 requestId, address contractAddress, bytes position);

    struct Registration {
        bytes uuid;
        bytes chainId;
    }

    struct ProofRequest {
        bytes32 client;
        address contractAddress;
        bytes position;
        uint256 amount;
    }


    address owner;
    uint256 constant fees = 10000;

    mapping(address => uint) nonces;
    mapping(bytes32 => ProofRequest) requests;
    mapping(bytes32 => Registration) registrations;

    constructor(){
        msg.sender = owner;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
    }

    //Todo Add more param
    function register(
        bytes uuid,
        bytes chainId)
    returns (bytes32 client){
        require(chainId != '');
        require(uuid != '');
        bytes32 clientId = keccak256(uuid, clientId);
        require(registrations[clientId] == 0);
        registrations[clientId] = new Registration(uuid, clientId);
        emit Registered(clientId);
    }

    function requestProof(
        bytes32 client,
        address contractAddress,
        bytes position)
    payable
    {
        uint256 feeReceived = msg.value;
        require(feeReceived >= fees);
        uint256 nonce = nonces[msg.sender];
        nonces[msg.sender] = nonce + 1;
        bytes32 requestId = hashRequestKey(msg.sender, nonces[msg.sender]);
        requests[requestId] = new Request(client, contractAddress, position, feeReceived);
        emit ProofRequiredEvent(client, requestId, contractAddress, position);
    }


    function changeFee(
        uint256 proposedFee)
    onlyOwner
    {
        require(proposedFee > 0);
        fee = proposedFee;
    }

    function hashRequestKey(
        address _account,
        uint256 _nonce)
    public
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(_account, _nonce));
    }
}