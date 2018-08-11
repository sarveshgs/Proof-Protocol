const rootPrefix = '../'
    , web3Provider = require(rootPrefix + '/lib/web3/providers/ws')
    , coreAddresses = require(rootPrefix + '/config/core_addresses')
    , proofFacilitator = 'proofFacilitator'
    , proofFacilitatorAbi = coreAddresses.getAbiForContract(proofFacilitator)
    , proofFacilitatorAddress = coreAddresses.getAddressesForContract(proofFacilitator)
    , proofVerifier = 'proofVerifier'
    , proofVerifierAddress = coreAddresses.getAddressForUser(proofVerifier)
    , proofVerifierPassphrase = coreAddresses.getPassphraseForUser(proofVerifier)
    , facilitatorContract = new web3Provider.eth.Contract(proofFacilitatorAbi, proofFacilitatorAddress)
    , proofOfStake = require(rootPrefix + '/lib/contract_interact/proof_of_stake')
    , gasPrice = 0x174876E800
    , returnTypes = require(rootPrefix + 'lib/global_constant/return_types')
;


web3Provider.eth.getBlock('latest').then((data) => {
    console.log(data);
});


facilitatorContract.events.ProofRequestedEvent(null, function (error, ProofRequestedResult) {
  if(error) {
    console.log("error  ", error);
  }
  console.log("ProofRequestedEvent result  ", ProofRequestedResult);

  execute(ProofRequestedResult.returnValues._proofOfStake).then(() => {
    console.log("yaayy done!!! book your cab")
  });
});

async function execute(proofOfStakeAddress) {

    console.log("proofOfStakeAddress  ", proofOfStakeAddress);
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



