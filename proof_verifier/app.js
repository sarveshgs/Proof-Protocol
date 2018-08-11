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
  , proofFacilitatorAbi = coreAddresses.getAbiForContract(proofFacilitator)
  , proofFacilitatorAddress = coreAddresses.getAddressesForContract(proofFacilitator)
  , proofVerifier = 'proofVerifier'
  , proofVerifierAddress = coreAddresses.getAddressForUser(proofVerifier)
  , proofVerifierPassphrase = coreAddresses.getPassphraseForUser(proofVerifier)
  , facilitatorContract = new web3.eth.Contract(proofFacilitatorAbi, proofFacilitatorAddress)
  , proofOfStake = require(rootPrefix + '/lib/contract_interact/proof_of_stake')
  , gasPrice = 0x12A05F200
  , returnTypes = require(rootPrefix + 'lib/contract_interact/return_types')
;


facilitatorContract.events.ProofRequestedEvent(null, function (error, ProofRequestedResult) {
  if(error) {
    console.log("error  ", error);
  }
  console.log("ProofRequestedEvent result  ", ProofRequestedResult);

  execute(ProofRequestedResult.returnValues.Result._ProofOfStake);
});

async function execute(proofOfStakeAddress) {

    let proofOfStakeObject =  new proofOfStake(proofOfStakeAddress);

    let startVotingResult = await proofOfStakeObject.startVoting(proofVerifierAddress, proofVerifierPassphrase,
        gasPrice, {returnType: returnTypes.transactionReceipt()});

    console.log("startVoting Result  ", startVotingResult);

    let registerToVoteResult = await proofOfStakeObject.registerToVote(proofVerifierAddress, proofVerifierPassphrase,
        gasPrice, {returnType: returnTypes.transactionReceipt()});
    console.log("registerToVote Result  ", registerToVoteResult);

    let performVerificationResult = await proofOfStakeObject.performVerification(proofVerifierAddress, proofVerifierPassphrase, true,
        gasPrice, {returnType: returnTypes.transactionReceipt()});
    console.log("performVerification Result  ", performVerificationResult);

    let finalizeResult = await proofOfStakeObject.finalize(proofVerifierAddress, proofVerifierPassphrase,
        gasPrice, {returnType: returnTypes.transactionReceipt()});
    console.log("finalize Result  ", finalizeResult);

}



