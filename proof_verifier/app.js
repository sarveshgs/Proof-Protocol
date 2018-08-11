const Web3 = require('web3'),
  web3 = new Web3(new Web3.providers.WebsocketProvider(
    'wss://ropsten.infura.io/ws/60efce1f07d74c0eab6163d7c86ed517'
  ));
console.log("Test");
web3.eth.getBlock('latest').then((data) => {
  console.log(data);
});


const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "name",
        "type": "bytes"
      },
      {
        "name": "chainId",
        "type": "bytes"
      }
    ],
    "name": "register",
    "outputs": [
      {
        "name": "client",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_uuid",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "_name",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_chainId",
        "type": "bytes"
      }
    ],
    "name": "Registered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_uuid",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "_requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "_contractAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_position",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "proofOfStake",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "ProofRequestedEvent",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "uuid",
        "type": "bytes32"
      },
      {
        "name": "contractAddress",
        "type": "address"
      },
      {
        "name": "position",
        "type": "bytes"
      },
      {
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "requestProof",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
]

const contractAddress = '0x21b8ae5704F69DF3674A2A05585bf73206E01624';
const facilitatorContract = new web3.eth.Contract(abi, contractAddress);

facilitatorContract.events.ProofRequestedEvent(null, function (error, result) {
  if(error) {
    console.log("error  ", error);
  }
  console.log("result  ", result);
});



