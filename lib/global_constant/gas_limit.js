"use strict";

const gasLimit = {

  buffer: function() {
    return 30000;
  },

  default: function() {
    return 1000000;
  },

};

module.exports = gasLimit;