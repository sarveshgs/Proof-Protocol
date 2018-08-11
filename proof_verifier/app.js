const Web3 = require('web3'),
  web3 = new Web3(new Web3.providers.WebsocketProvider(
    'wss://ropsten.infura.io/ws/60efce1f07d74c0eab6163d7c86ed517'
  ));

web3.eth.getBlock('latest').then((data) => {
  console.log(data);
});

const rootPrefix = '../'
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , proofFacilitator = 'proofFacilitator'
  , facilitatorContract = new web3.eth.Contract(coreAddresses.getAbiForContract(proofFacilitator)
  , coreAddresses.getAddressesForContract(proofFacilitator))
;


facilitatorContract.events.ProofRequestedEvent(null, function (error, result) {
  if(error) {
    console.log("error  ", error);
  }
  console.log("result  ", result);
});



