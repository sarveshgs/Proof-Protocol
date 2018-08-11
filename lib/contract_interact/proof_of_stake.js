"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Workers contract.<br><br>
 *
 * @module lib/contract_interact/proof_of_stake
 *
 */

const rootPrefix = '../..'
    , basicHelper = require(rootPrefix + '/helpers/basic_helper')
    , coreAddresses = require(rootPrefix + '/config/core_addresses')
    , helper = require(rootPrefix + '/lib/contract_interact/helper')
    , web3Provider = require(rootPrefix + '/lib/web3/providers/ws')
    , gasLimitGlobalConstant = require(rootPrefix + '/lib/global_constant/gas_limit')
;


const contractName = 'proofOfStake'
    , contractAbi = coreAddresses.getAbiForContract(contractName)
    , currContract = new web3Provider.eth.Contract(contractAbi)
;

const ProofOfStake = module.exports = function (contractAddress) {
    this.contractAddress = contractAddress;
};

ProofOfStake.prototype = {

    /**
     * Contract address
     *
     * @ignore
     * @private
     */
    contractAddress: null,

    startVoting: async function (senderAddress, senderPassphrase, gasPrice, options) {
        const oThis = this
        ;

        try {
            const returnType = basicHelper.getReturnType(options.returnType)
                , transactionObject = currContract.methods.startVoting();

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
                errorCode: "l_ci_pos_startVoting_1"
            };

            return Promise.resolve(helper.performSend(params, returnType));
        } catch(err) {
            let errorParams = {
                internal_error_identifier: 'l_ci_pos_startVoting_2',
                api_error_identifier: 'unhandled_api_error',
                error_config: errorConfig,
                debug_options: {}
            };
            console.error('lib/contract_interact/pos.js:startVoting inside catch:', err);
            return Promise.resolve(errorParams);
        }
    },

    registerToVote: async function (senderAddress, senderPassphrase, gasPrice, options) {
        const oThis = this
        ;

        try {
            const returnType = basicHelper.getReturnType(options.returnType)
                , transactionObject = currContract.methods.registerToVote();

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
                errorCode: "l_ci_pos_registerToVote_1"
            };

            return Promise.resolve(helper.performSend(params, returnType));
        } catch(err) {
            let errorParams = {
                internal_error_identifier: 'l_ci_pos_registerToVote_2',
                api_error_identifier: 'unhandled_api_error',
                error_config: errorConfig,
                debug_options: {}
            };
            console.error('lib/contract_interact/pos.js:registerToVote inside catch:', err);
            return Promise.resolve(errorParams);
        }
    },

    performVerification: async function (senderAddress, senderPassphrase, isProven, gasPrice, options) {
        const oThis = this
        ;

        try {
            const returnType = basicHelper.getReturnType(options.returnType)
                , transactionObject = currContract.methods.performVerification(isProven);

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
                errorCode: "l_ci_pos_performVerification_1"
            };

            return Promise.resolve(helper.performSend(params, returnType));
        } catch(err) {
            let errorParams = {
                internal_error_identifier: 'l_ci_pos_performVerification_2',
                api_error_identifier: 'unhandled_api_error',
                error_config: errorConfig,
                debug_options: {}
            };
            console.error('lib/contract_interact/pos.js:performVerification inside catch:', err);
            return Promise.resolve(errorParams);
        }
    },

    finalize: async function (senderAddress, senderPassphrase, gasPrice, options) {
        const oThis = this
        ;

        try {
            const returnType = basicHelper.getReturnType(options.returnType)
                , transactionObject = currContract.methods.finalize();

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
                errorCode: "l_ci_pos_performVerification_1"
            };

            return Promise.resolve(helper.performSend(params, returnType));
        } catch(err) {
            let errorParams = {
                internal_error_identifier: 'l_ci_pos_finalize_2',
                api_error_identifier: 'unhandled_api_error',
                error_config: errorConfig,
                debug_options: {}
            };
            console.error('lib/contract_interact/pos.js:finalize inside catch:', err);
            return Promise.resolve(errorParams);
        }
    },
};
