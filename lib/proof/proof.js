const rootPrefix = "../.."
  , ethUtils = require('ethereumjs-util')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;


function Proof() {

}


Proof.prototype = {
  /**
   * Generate Account proof for give address in merkel patricia tree
   * @param address
   * @param trie
   * @return {Promise<proof>}
   */
  accountProof: function (address, trie) {


    let path = Buffer.from(ethUtils.sha3(Buffer.from(address, 'hex')), 'hex');

  logger.info('Generating account proof');
  return new Promise(function (resolve, reject) {

    return trie.findPath(path, function (error, accountNode, keyRemainder, rootToLeafPath) {
      if (error || !accountNode || keyRemainder.length > 0) {
        return reject(false);
      }
      let parentNodes = rootToLeafPath.map(node => node.raw)
        , proof = {
        address: address,
        parentNodes: ethUtils.rlp.encode(parentNodes).toString('hex'),
        value: accountNode.value.toString('hex')
      };
      return resolve(proof);
    });
  });
  },

  /**
   * Generate Storage proof for give storagePath in merkel patricia tree
   * @param storagePath
   * @param trie
   * @return {Promise<proof>}
   */
  storageProof: function (storagePath, trie) {


  return new Promise(function (resolve, reject) {
    return trie.findPath(storagePath, function (error, storageNode, keyRemainder, rootToLeafPath) {

      if (error || !storageNode || keyRemainder.length > 0) {

        return reject(error);
      }
      let parentNodes = rootToLeafPath.map(node => node.raw)
        , proof = {
        parentNodes: ethUtils.rlp.encode(parentNodes).toString('hex'),
        value: storageNode.value.toString('hex')
      };
      return resolve((proof));
    })
  });
  }

};

module.exports = new Proof();

