const Trie = require('merkle-patricia-tree');

const rootPrefix = '../..'
  , proof = require(rootPrefix + "/lib/proof/proof")
  , helper = require(rootPrefix + '/lib/proof/helper')
;
/**
 * @constructor
 * @param storageRoot
 * @param contractAddress
 * @param db leveldb Instance
 */
function StorageProof(storageRoot, contractAddress, db) {
  const oThis = this;

  oThis.stateRoot = storageRoot;
  oThis.contractAddress = contractAddress;
  oThis.db = db;
  oThis.trie = new Trie(db, storageRoot);
}

StorageProof.prototype = {

  /**
   * @param storageIndex
   * @param optional argument mapping key of key-value pair storage
   * @return {Promise<proof>}
   */
  perform: async function (storageIndex) {
    const oThis = this;

    let mapping = Array.prototype.slice.call(arguments, 1);

    let storagePath = helper.storagePath(storageIndex, mapping);
    return  oThis._build(storagePath);
  },

  /**
   * @param storagePath
   * @return {Promise<proof>}
   */
  _build: async function (storagePath) {
    const oThis = this;
    return  proof.storageProof(storagePath, oThis.trie);
  }

};

module.exports = StorageProof;

