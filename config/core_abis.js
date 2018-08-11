"use strict";

/*
 * Load all contract abi files
 *
 */

const fs = require('fs'),
  path = require('path');

function parseFile(filePath, options) {
  const absFilePath = path.join(__dirname, '/' + filePath);
  const fileContent = fs.readFileSync(absFilePath, options || "utf8");
  return JSON.parse(fileContent);
}

const rootPrefix = "..";

const coreAbis = {
  proofVerifier: parseFile(rootPrefix + '/contracts/abi/ProofVerifier.abi', "utf8"),
  proofOfStake: parseFile(rootPrefix + '/contracts/abi/ProofOfStake.abi', "utf8"),
  proofFacilitators: parseFile(rootPrefix + '/contracts/abi/ProofFacilitators.abi', "utf8")
};

module.exports = coreAbis;
