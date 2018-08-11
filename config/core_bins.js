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
  proofOfStake: readFile(rootPrefix + '/contracts/bin/ProofOfStake.bin', "utf8"),
  proofFacilitator: readFile(rootPrefix + '/contracts/bin/ProofFacilitator.bin', "utf8")
};

module.exports = coreBins;
