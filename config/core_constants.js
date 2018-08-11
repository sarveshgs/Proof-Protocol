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