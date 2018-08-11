"use strict";

/**
 * This is utility class for contract interacts<br><br>
 *
 * @module lib/contract_interact/helper
 */

const assert = require("assert")
;

const rootPrefix = '../..'
    , basicHelper = require(rootPrefix + '/helpers/basic_helper')
    , Tx = require('ethereumjs-tx')
;

/**
 * contract interact helper constructor
 *
 * @constructor
 */
const ContractInteractHelper = function () {};

ContractInteractHelper.prototype = {

    /**
     * Call methods (execute methods which DO NOT modify state of contracts)
     *
     * @param {object} web3Provider - It could be value chain or utility chain provider
     * @param {String} currContractAddr - current contract address
     * @param {Object} encodeABI - encoded method ABI data
     * @param {Object} [options] - optional params
     * @param {Object} [transactionOutputs] - optional transactionOutputs
     *
     * @return {promise}
     *
     */
    call: async function (web3Provider, currContractAddr, encodeABI, options, transactionOutputs) {
        const params = {
            to: currContractAddr,
            data: encodeABI
        };
        if (options) {
            Object.assign(params, options);
        }

        const response = await web3Provider.eth.call(params);

        if (transactionOutputs) {
            try {
                return Promise.resolve(web3Provider.eth.abi.decodeParameters(transactionOutputs, response));
            }
            catch (err) {
                return Promise.reject(err);
            }
        } else {
            return Promise.resolve(response);
        }
    },

    /**
     * Decode result and typecast it to an Address
     *
     * @param {Web3} web3Provider - It could be value chain or utility chain provider
     * @param {String} result - current contract address
     *
     * @return {Promise}
     *
     */
    toAddress: function (web3Provider, result) {
        return new Promise(function(onResolve, onReject){
            onResolve(web3Provider.eth.abi.decodeParameter('address', result));
        });
    },

    /**
     * Decode result and typecast it to a String
     *
     * @param {Web3} web3Provider - It could be value chain or utility chain provider
     * @param {String} result - current contract address
     *
     * @return {Promise}
     *
     */
    toString: function (web3Provider, result) {
        return new Promise(function(onResolve, onReject){
            onResolve(web3Provider.eth.abi.decodeParameter('bytes32', result));
        });
    },

    /**
     * Decode result and typecast it to a Number
     *
     * @param {Web3} web3Provider - It could be value chain or utility chain provider
     * @param {String} result - current contract address
     *
     * @return {Promise}
     *
     */
    toNumber: function (web3Provider, result) {
        return new Promise(function(onResolve, onReject){
            onResolve(web3Provider.utils.hexToNumber(result));
        });
    },

    /**
     * @ignore
     */
    decodeUint256: function (web3Provider, result) {
        return new Promise(function(onResolve, onReject){
            onResolve(web3Provider.eth.abi.decodeParameter('uint256', result));
        });
    },

    /**
     * @ignore
     */
    assertAddress: function ( address ) {
        assert.ok(/^0x[0-9a-fA-F]{40}$/.test(address), `Invalid blockchain address: ${address}`);
    },

    /**
     * Get transaction receipt
     *
     * @param {Web3} web3Provider - It could be value chain or utility chain provider
     * @param {String} transactionHash - transaction hash
     *
     * @return {Promise}
     *
     */
    getTransactionReceiptFromTrasactionHash: function (web3Provider, transactionHash) {
        return new Promise(function(onResolve, onReject) {
            // number of times it will attempt to fetch
            var maxAttempts = 1000;

            // time interval
            const timeInterval = 2000;

            var getReceipt = async function() {
                if (maxAttempts > 0) {
                    console.debug(`\n====== Attempting to get receipt ======\n`);
                    const receipt = await web3Provider.eth.getTransactionReceipt(transactionHash);
                    console.debug(`\n====== receipt: ${receipt} ======\n`);
                    if (receipt) {
                        console.debug(`\n====== got the receipt ======\n`);
                        return onResolve({receipt: receipt});
                    } else {
                        setTimeout(getReceipt, timeInterval);
                    }
                } else {
                    let errorParams = {
                        internal_error_identifier: 'l_ci_h_pse_gtrfth',
                        api_error_identifier: 'get_receipt_failed',
                        debug_options: {}
                    };
                    console.debug(`\n====== unable to get receipt ======\n`);
                    return onResolve(errorParams);
                }
                maxAttempts--;
            };


            getReceipt();
        });
    },

    performSignedTransaction: function(params, returnType) {
        const oThis = this
        ;

        const transactionObject = params.transactionObject;

        const encodedABI = transactionObject.encodeABI();

        oThis.rawTx = {
            from: params.senderAddress,
            to: params.contractAddress,
            data: encodedABI,
            gasPrice: params.gasPrice,
            gas: params.gasLimit
        };

        const tx = new Tx(oThis.rawTx);

        var privateKey = '';
        if(privateKey.slice(0, 2).toLowerCase() === '0x'){
            privateKey = privateKey.substr(2);
        }

        oThis.privateKeyObj = new Buffer(privateKey, 'hex');

        tx.sign(oThis.privateKeyObj);

        const serializedTx =  tx.serialize();

        const web3Provider = params.web3Provider;

        return web3Provider.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .once('transactionHash', function(txHash){console.log('transaction_hash:', txHash);})
            .once('receipt', function(receipt){console.log('receipt:', receipt);})
            .on('error', function(error){console.log('error:', error);})
            ;
    },

    /**
     * Perform send
     *
     * @param {params} Object - parmaters
     * @param {returnType} string - return type
     * @param {String} senderAddr - address of transaction's sender senderAddr
     *
     * @return {Promise}
     *
     */
    performSend: function (params, returnType) {
        const oThis = this
            , txUUID = ''
        ;

        var isValueReturned = false
            , processReceipt =  1
        ;

        if (params.processReceipt != undefined) {
            processReceipt = params.processReceipt;
        }
        const transactionObject = params.transactionObject;

        const encodedABI = transactionObject.encodeABI();

        //TODO: calculate the gas limit
        const txParams = {
            from: params.senderAddress,
            to: params.contractAddress,
            data: encodedABI,
            gasPrice: params.gasPrice,
            gas: params.gasLimit
        };


        const web3Provider = params.web3Provider;

        const successCallback = params.successCallback;
        const failCallback = params.failCallback;
        var transactionHashRef = null;

        const onTransactionHash = function (transactionHash) {
            const transactionResponseData = {
                transaction_uuid: txUUID,
                transaction_hash: transactionHash,
                transaction_receipt: {}
            };

            if (params.postReceiptProcessParams) {
                transactionResponseData.post_receipt_process_params = params.postReceiptProcessParams;
            }

            return transactionResponseData;
        };
        const onReceiptSuccess = async function (receipt) {
            // call success callback.
            if (successCallback != undefined && successCallback != null) {
                console.debug("======helper.Calling successCallback=======");
                await successCallback(receipt);
            }
            return {
                    transaction_uuid: txUUID,
                    transaction_hash: receipt.transactionHash,
                    transaction_receipt: receipt
                };
        };
        const onReceiptFail = async function (errorCode, errorReason, receipt) {
            // call fail callback
            if (failCallback != undefined && failCallback != null) {
                console.debug("======helper.Calling failCallback=======");
                await failCallback(receipt);
            }

            let errorParams = {
                internal_error_identifier: `${params.errorCode}|${errorCode}`,
                api_error_identifier: 'unhandled_api_error',
                debug_options: {}
            };
            const errorMessage = (errorReason && errorReason.message) ? errorReason.message : `Something went wrong: l_ci_h_pse`;
            console.error(errorMessage);
            return errorParams;

        };
        const onReceipt = function(receipt) {
            console.debug("\n=======receipt========\n");
            console.debug(receipt);

            receipt = receipt || {};

            let parsedIntStatus = parseInt(receipt.status, 16);

            // starting from version 1.0.0-beta.34, web3 returns boolean for txReceipt.status
            if ((isNaN(parsedIntStatus) && (receipt.status !== true)) ||
                (!isNaN(parsedIntStatus) && (parsedIntStatus !== 1))) {
                const errorReason = "Transaction status is 0";
                return onReceiptFail('l_ci_h_pse_status_0', errorReason, receipt);
            } else {
                return onReceiptSuccess(receipt);
            }
        };

        const onCatch = function (reason) {
            if (reason && reason.message && reason.message.includes('not mined within')) {
                oThis.getTransactionReceiptFromTrasactionHash(web3Provider, transactionHashRef).then( function(getReceiptResponse) {
                    if (getReceiptResponse.isSuccess()) {
                        const onReceiptResponse = onReceipt(getReceiptResponse.data.receipt);
                        return onReceiptResponse;
                    } else {
                        const errorReason = "Unable to get receipt";
                        const receiptFailResponse = onReceiptFail('l_ci_h_pse_1', errorReason, {});
                        return receiptFailResponse;
                    }
                });

            } else {
                var errorCode = 'l_ci_h_pse_2';
                if (reason && reason.message && reason.message.includes('insufficient funds for gas * price + value')) {
                    errorCode = 'l_ci_h_pse_gas_low';
                    reason.message = "insufficient gas"
                }
                const receiptFailResponse = onReceiptFail(errorCode, reason, {});
                return receiptFailResponse;
            }
        };

        if (basicHelper.isReturnTypeTxReceipt(returnType) && processReceipt==0){
            const errorCode = 'l_ci_h_pse_3'
                , reason = 'not supported for returnType=txReceipt and processReceipt=0'
                , receiptFailResponse = onReceiptFail(errorCode, reason, {})
            ;
            if (isValueReturned == false) {
                isValueReturned = true;
                return Promise.resolve(receiptFailResponse);
            }
        }

        /* if (processReceipt==0 && !params.postReceiptProcessParams) {
           const errorCode = 'l_ci_h_pse_4'
             , reason = 'post pay params mandatory'
             , receiptFailResponse =onReceiptFail(errorCode, reason, {});
           ;
           if (isValueReturned == false) {
             isValueReturned = true;
             return Promise.resolve(receiptFailResponse);
           }
         }
     */
        const asyncPerform = function () {

            return new Promise(function (onResolve, onReject) {
                // Unlock account
                web3Provider.eth.personal.unlockAccount(
                    params.senderAddress,
                    params.senderPassphrase)
                    .then(function() {
                        if (processReceipt) {
                            web3Provider.eth.sendTransaction(txParams)
                                .on('transactionHash', function(transactionHash) {
                                    console.debug(`\n=======transactionHash received========: ${transactionHash} \n`);
                                    const onTransactionHashResponse = onTransactionHash(transactionHash);
                                    if (basicHelper.isReturnTypeTxHash(returnType)) {
                                        isValueReturned = true;
                                        return onResolve(onTransactionHashResponse);
                                    }
                                })
                                .once('receipt', function(receipt) {
                                    console.debug(`\n=======receipt received========: `,receipt);
                                    const onReceiptResponse = onReceipt(receipt);
                                    if (basicHelper.isReturnTypeTxReceipt(returnType)) {
                                        isValueReturned = true;
                                        return onResolve(onReceiptResponse);
                                    }
                                })
                                .catch( function(reason) {
                                    console.error(`\n=======Exception at location 1========: ${reason} \n`);
                                    if (isValueReturned == false) {
                                        isValueReturned = true;
                                        return onResolve(onCatch(reason));
                                    }
                                });
                        } else {
                            web3Provider.eth.sendTransaction(txParams)
                                .on('transactionHash', function(transactionHash) {
                                    console.debug(`\n=======transactionHash received========: ${transactionHash} \n`);
                                    const onTransactionHashResponse = onTransactionHash(transactionHash);
                                    if (basicHelper.isReturnTypeTxHash(returnType)) {
                                        isValueReturned = true;
                                        return onResolve(onTransactionHashResponse);
                                    }
                                })
                                .catch( function(reason) {
                                    console.error(`\n=======Exception at location 1========: ${reason} \n`);
                                    if (isValueReturned == false) {
                                        isValueReturned = true;
                                        return onResolve(onCatch(reason));
                                    }
                                });
                        }
                    })
                    .catch(function(reason) {
                        console.error(`\n=======Exception at location 2========: ${reason} \n`);
                        const receiptFailResponse =onReceiptFail('l_ci_h_pse_3', reason, {});
                        if (isValueReturned == false) {
                            isValueReturned = true;
                            return onResolve(receiptFailResponse);
                        }
                    });

            });

        };
        if (basicHelper.isReturnTypeUUID(returnType)) {
            isValueReturned = true;
            asyncPerform();
            const transactionResponseData = {
                transaction_uuid: txUUID,
                transaction_hash: "",
                transaction_receipt: {}
            };
            if (params.postReceiptProcessParams) {
                transactionResponseData.post_receipt_process_params = params.postReceiptProcessParams;
            }
            return Promise.resolve(transactionResponseData);
        } else {
            return asyncPerform();
        }
    },

    /**
     * valid currency
     *
     * @param {string} currency - currency
     * @param {bool} allow_blank - true / false, '' if allow_blank is true
     *
     * @return {Bool} - true / false
     */
    isValidCurrency: function(currency, allow_blank){
        if (currency === undefined || currency === null || (currency !== currency.toUpperCase())){
            return false;
        }
        allow_blank = (allow_blank || false);
        if (!allow_blank && (currency === '' || currency.length !== 3)){
            return false;
        }
        return true;
    },

    /** check if return type is true/false
     *
     * @param {Number} num - Number
     *
     * @return {boolean}
     *
     * Note - Don't use for BigNumbers
     */
    isDecimal: function(num) {
        return (num % 1 != 0);
    },
};

module.exports = new ContractInteractHelper();