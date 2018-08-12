const Trie = require('merkle-patricia-tree');

const rootPrefix = "../.."
  , proof = require(rootPrefix + "/lib/proof/proof")
;

/**
 * @constructor
 * @param stateRoot
 * @param db
 */
function AccountProof(stateRoot, db) {
  const oThis = this;

  oThis.trie = new Trie(db, stateRoot);
}

AccountProof.prototype = {

  /**
   * Validate and _build proof
   * @param address
   * @return {Promise<proof>}
   */
  perform: async function (address) {
    const oThis = this;

    return oThis._build(address);
  },
  /**
   * Delegates call to _build account proof to lib
   * @param address
   * @return {Promise<proof>}
   */
  _build: async function (address) {
    const oThis = this;

    return proof.accountProof(address, oThis.trie);
  },

};

module.exports = AccountProof;

