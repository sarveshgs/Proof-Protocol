"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Workers contract.<br><br>
 *
 * @module lib/contract_interact/proof_verifiers
 *
 */

const rootPrefix = '../..'
    , basicHelper = require(rootPrefix + '/helpers/basic_helper')
    , coreAddresses = require(rootPrefix + '/config/core_addresses')
    , helper = require(rootPrefix + '/lib/contract_interact/helper')
    , web3Provider = require(rootPrefix + '/lib/web3/providers/ws')
    , gasLimitGlobalConstant = require(rootPrefix + '/lib/global_constant/gas_limit')
;

const contractName = 'proofVerifier'
    , contractAbi = coreAddresses.getAbiForContract(contractName)
    , currContract = new web3Provider.eth.Contract(contractAbi)
;

const ProofVerifier = module.exports = function (contractAddress, chainId) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
};

ProofVerifier.prototype = {

    /**
     * Contract address
     *
     * @ignore
     * @private
     */
    contractAddress: null,

    register: async function (senderAddress, senderPassphrase, gasPrice, options) {
        const oThis = this
        ;

        try {
            const returnType = basicHelper.getReturnType(options.returnType)
                , transactionObject = currContract.methods.register(senderAddress);

            const params = {
                transactionObject: transactionObject,
                senderAddress: senderAddress,
                senderPassphrase: senderPassphrase,
                contractAddress: oThis.contractAddress,
                gasPrice: gasPrice,
                gasLimit: gasLimitGlobalConstant.default(),
                web3Provider: web3Provider,
                successCallback: null,
                failCallback: null,
                errorCode: "l_ci_pv_register_1"
            };

            return Promise.resolve(helper.performSend(params, returnType));
        } catch(err) {
            let errorParams = {
                internal_error_identifier: 'l_ci_pv_register_2',
                api_error_identifier: 'unhandled_api_error',
                error_config: errorConfig,
                debug_options: {}
            };
            console.error('lib/contract_interact/proof_verifier.js:register inside catch:', err);
            return Promise.resolve(errorParams);
        }
    },
};
