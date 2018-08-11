"use strict";

const path = require('path')
  , rootPrefix = ".."
;



function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

define('OST_UTILITY_GETH_WS_PROVIDER', 'wss://ropsten.infura.io/ws/60efce1f07d74c0eab6163d7c86ed517');

define('PROOF_VERIFIER_PRIVATE_KEY', 'c09ef4ab4369aa929c62082cd94a612a612bf5e68e62e9480c9440119bc3063d');
