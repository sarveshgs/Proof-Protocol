pragma solidity ^0.4.23;

contract ProofFacilitator {

    /* events */
    event Registered(bytes32 _uuid, bytes _name, bytes _chainId);
    event ProofRequiredEvent(bytes32 _uuid, bytes32 _requestId, address _contractAddress, bytes _position);

    struct Registration {
        bytes name;
        bytes chainId;
    }

    struct ProofRequest {
        bytes32 uuid;
        address contractAddress;
        bytes position;
        uint256 amount;
    }
    address owner;

    mapping(address => uint) nonces;
    mapping(bytes32 => ProofRequest) requests;
    mapping(bytes32 => Registration) registrations;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    function register(
        bytes name,
        bytes chainId)
    returns (bytes32 client){

        require(name.length != 0);
        require(chainId.length != 0);


        bytes32 uuid = keccak256(name, chainId);

        require(registrations[uuid].name.length == 0);

        registrations[uuid] = Registration(name, chainId);
        emit Registered(uuid, name, chainId);
    }

    function requestProof(
        bytes32 uuid,
        address contractAddress,
        bytes position)
    payable
    {
        require(uuid != bytes32(0));
        require(contractAddress != address(0));

        uint256 fee = msg.value;

        uint256 nonce = nonces[msg.sender];

        nonces[msg.sender] = nonce + 1;

        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, nonces[msg.sender]));

        requests[requestId] = ProofRequest(uuid, contractAddress, position, fee);
        emit ProofRequiredEvent(uuid, requestId, contractAddress, position);
    }


}