const rootPrefix = "../.."
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , AccountProof = require(rootPrefix + '/lib/proof/account_proof')
  , StorageProof = require(rootPrefix + '/lib/proof/storage_proof')
  , dbFactory = require(rootPrefix + '/lib/db/leveldb')
  , helper = require(rootPrefix + '/lib/proof/helper')
;

/**
 * @param stateRoot
 * @param chainDataPath
 * @constructor
 */
function ProofGenerator(stateRoot, chainDataPath) {
  const oThis = this;

  oThis.db = dbFactory.getInstance(chainDataPath);
  oThis.stateRoot = stateRoot;
}

ProofGenerator.prototype = {

  /**
   *Build account proof
   * @param address for which account proof is needed
   * @return Promise<accountProof>
   */
  buildAccountProof: function (address) {
    const oThis = this;

    let accountProof = new AccountProof(oThis.stateRoot, oThis.db);
    return accountProof.perform(address);
  },

  /**
   * @param contractAddress
   * @param storageIndex Position of variable in the contract
   * @param mappingKeys array of keys of mapping variable in the contract
   * @Optional param  key for mapping variable type
   * @return {*|Promise<map<key,proof>} in batch mode and Promise<proof> in non batch mode i.e. single non-mapping type variable
   */


  buildStorageProof: async function (contractAddress, storageIndex, mappingKeys) {
    const oThis = this;
    let keyProofMap = {};


    await oThis._validate(mappingKeys);

    logger.info(`Building storage proof for address the ${contractAddress} and storage Index ${storageIndex}`);
    let storageRoot = await helper.fetchStorageRoot(oThis.stateRoot, contractAddress, oThis.db)
      , storageProof = new StorageProof(storageRoot, contractAddress, oThis.db);

    if (mappingKeys === undefined || mappingKeys.length === 0) {
      let proof = await storageProof.perform(storageIndex);
      return Promise.resolve(proof);
    }
    for (let i = 0; i < mappingKeys.length; i++) {
      keyProofMap[mappingKeys[i]] = await storageProof.perform(storageIndex, mappingKeys[i]);
    }

    return keyProofMap;
  };

module.exports = ProofGenerator;


