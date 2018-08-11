"use strict";

/**
 * List of all addresses and there respective abi, bin, passphrase
 * required for platform.
 *
 * And helper methods to access this information using human readable
 * names.
 *
 */

const rootPrefix = ".."
  , coreAbis = require(rootPrefix + '/config/core_abis')
  , coreBins = require(rootPrefix + '/config/core_bins')
;

const allAddresses = {
  users: {
    proofVerifier: {
      address: '0xda932fc0d5bd5AC06fB2CeCF72Ab05b9CFEE7808',
      passphrase: 'sweethome'
    }
  },

  contracts: {
    proofFacilitator: {
      abi: coreAbis.proofFacilitator,
      bin: coreBins.proofFacilitator,
      address: '0x21b8ae5704F69DF3674A2A05585bf73206E01624'
    }
    proofVerifier: {
      abi: coreAbis.proofVerifier,
      bin: coreBins.proofVerifier
    },
    proofOfStake: {
      abi: coreAbis.proofOfStake,
      bin: coreBins.proofOfStake
    }
  }
};

// generate a contract address to name map for reverse lookup
const addrToContractNameMap = {};
for (var contractName in allAddresses.contracts) {
  var addr = allAddresses.contracts[contractName].address;

  if ( Array.isArray(addr) ) {
    for (var i = 0; i < addr.length; i++) {
      addrToContractNameMap[addr[i].toLowerCase()] = contractName;
    }
  } else if ( addr !== null && typeof addr !== "undefined") {
    addrToContractNameMap[addr.toLowerCase()] = contractName;
  }
}

// helper methods to access difference addresses and their respective details
const coreAddresses = {
  getAddressForUser: function(userName) {
    return allAddresses.users[userName].address;
  },

  getPassphraseForUser: function(userName) {
    return allAddresses.users[userName].passphrase;
  },

  getAddressForContract: function(contractName) {
    var contractAddress = allAddresses.contracts[contractName].address;
    if (Array.isArray(contractAddress)) {
      throw "Please pass valid contractName to get contract address for: "+contractName;
    }
    return contractAddress;
  },

  // This must return array of addresses.
  getAddressesForContract: function(contractName) {
    var contractAddresses = allAddresses.contracts[contractName].address;
    if (!contractAddresses || !Array.isArray(contractAddresses) || contractAddresses.length===0) {
      throw "Please pass valid contractName to get contract address for: "+contractName;
    }
    return contractAddresses;
  },

  getContractNameFor: function(contractAddr) {
    return addrToContractNameMap[(contractAddr || '').toLowerCase()];
  },

  getAbiForContract: function(contractName) {
    return allAddresses.contracts[contractName].abi;
  },

  getBinForContract: function(contractName) {
    return allAddresses.contracts[contractName].bin;
  }
};

module.exports = coreAddresses;

