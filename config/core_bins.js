"use strict";

/*
 * Load all contract bin files
 *
 */

const fs = require('fs'),
  path = require('path');

function readFile(filePath, options) {
  const absFilePath = path.join(__dirname, '/' + filePath);
  return fs.readFileSync(absFilePath, options || "utf8");
}

const rootPrefix = "..";

const coreBins = {
  proofVerifier: readFile(rootPrefix + '/contracts/bin/proofVerifier.bin', 'utf8'),
  proofOfStake: parseFile(rootPrefix + '/contracts/abi/ProofOfStake.bin', "utf8"),
  proofFacilitators: parseFile(rootPrefix + '/contracts/abi/ProofFacilitators.bin', "utf8")
};

module.exports = coreBins;
