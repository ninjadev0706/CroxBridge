import React, { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Flex } from 'crox-new-uikit'
import { ethers } from 'ethers';
import { NxtpSdkEvents, NxtpSdk, HistoricalTransactionStatus } from "@connext/nxtp-sdk";
import { getChainData, ChainData } from '@connext/nxtp-utils';
import Page from '../../components/layout/Page'
import { chainConfig, swapConfig } from '../../config/chainConfig';
import TxTable from './TxTable';
import "./explorer.css"

interface IBridgeTransaction {
    transactionId: string;
    fromChainId: number;
    fromTokenAddress?: string;
    fromAmount: string;
    toChainId: number;
    toTokenAddress?: string;
    toAmount: string;
    preparedAt: number;
    status: string;
    expiry?: number;
    fulfilledTxHash?: string;
    action: any;
}

const columns = [
    {
        title: 'From',
        key: 'from',
    },
    {
        title: 'To',
        key: 'to',
    },
    {
        title: 'Source Token',
        key: 'sendingtoken',
    },
    {
        title: 'Destination Token',
        key: 'receivngtoken',
    },
    {
        title: 'Status',
        key: 'status',
    },
    {
        title: 'Time',
        key: 'time',
    },
];

const Explorer = () => {

    const [chainData, setChainData] = useState<Map<string, ChainData>>();
    const [transactions, setTransactions] = useState<IBridgeTransaction[]>([]);

    const { chainId, library } = useWeb3React();

    const getAsset = (_chainId: number, _address: string) => {
        const assetId = chainData.get(_chainId.toString())?.assetId;
        if (assetId) {
            const key = Object.keys(assetId).find(
                (id) => id.toLowerCase() === _address.toLowerCase(),
            );
            if (key) {
                return assetId[key];
            }
        }
        return null;
    };

    const parseTx = (tx: any): IBridgeTransaction => {
        const { crosschainTx, status, preparedTimestamp, fulfilledTxHash } = tx;
        const { receiving, sending, invariant } = crosschainTx;
        const variant = receiving ?? sending;
        const { sendingChainId, sendingAssetId } = invariant;
        const _sendingAsset = getAsset(sendingChainId, sendingAssetId);
        const sentAmount = ethers.utils.formatUnits(
            sending?.amount ?? '0',
            _sendingAsset?.decimals ?? '18',
        );
        const { receivingChainId, receivingAssetId } = invariant;

        const _receivingAsset = getAsset(receivingChainId, receivingAssetId);
        let sendingSelectToken;
        if (_sendingAsset === null) {
            swapConfig.map((each) => {
                const lowerAsset = each.assets[sendingChainId];
                if (lowerAsset && lowerAsset.toLocaleLowerCase() === sendingAssetId.toString()) {
                    sendingSelectToken = each;
                }
                return null;
            })
        }
        let receivingSelectToken;
        if (_receivingAsset === null) {
            swapConfig.map((each) => {
                const lowerAsset = each.assets[receivingChainId];
                if (lowerAsset && lowerAsset.toLocaleLowerCase() === receivingAssetId.toString()) {
                    receivingSelectToken = each;
                }
                return null;
            })
        }
        const _receivedAmount = ethers.utils.formatUnits(
            receiving?.amount ?? '0',
            _receivingAsset?.decimals ?? '18',
        );
        const { transactionId } = invariant;

        return {
            transactionId,
            fromChainId: sendingChainId,
            fromTokenAddress: _sendingAsset?.mainnetEquivalent,
            fromAmount: `${+(+sentAmount).toFixed(6)} ${_sendingAsset?.symbol ?? sendingSelectToken.name}`,
            toChainId: receivingChainId,
            toTokenAddress: _receivingAsset?.mainnetEquivalent,
            toAmount: `${+(+_receivedAmount).toFixed(6)} ${_receivingAsset?.symbol ?? receivingSelectToken.name}`,
            preparedAt: preparedTimestamp,
            status,
            expiry: variant.expiry,
            fulfilledTxHash,
            action: tx,
        };
    };

    const parseTxs = (txs: any[]): IBridgeTransaction[] =>
        txs.map((tx) => parseTx(tx));

    useEffect(() => {
        const init = async () => {
            const data = await getChainData();
            setChainData(data);
        };
        init();
    }, []);

    useEffect(() => {
        const { ethereum } = window as any
        const init = async () => {
            if ((!ethereum || !library)) {
                return;
            }
            const _provider: Web3Provider = library || new Web3Provider(ethereum);

            const _signer = _provider.getSigner();

            try {
                const _sdk = await NxtpSdk.create({
                    chainConfig,
                    signer: _signer,
                });

                const activeTxs = await _sdk.getActiveTransactions();
                const historicalTxs = await _sdk.getHistoricalTransactions();
                setTransactions(parseTxs([...activeTxs, ...historicalTxs]));

                _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
                    const { amount, expiry, preparedBlockNumber, ...invariant } =
                        data.txData;
                    const tx = {
                        crosschainTx: {
                            invariant,
                            sending: { amount, expiry, preparedBlockNumber },
                        },
                        preparedTimestamp: Math.floor(Date.now() / 1000),
                        bidSignature: data.bidSignature,
                        encodedBid: data.encodedBid,
                        encryptedCallData: data.encryptedCallData,
                        status: NxtpSdkEvents.SenderTransactionPrepared,
                    };
                    setTransactions([parseTx(tx), ...transactions]);
                });

                _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
                    const { amount, expiry, preparedBlockNumber, ...invariant } =
                        data.txData;
                    const index = transactions.findIndex(
                        (t) => t.transactionId === invariant.transactionId,
                    );

                    if (index === -1) {
                        const tx = {
                            preparedTimestamp: Math.floor(Date.now() / 1000),
                            crosschainTx: {
                                invariant,
                                sending: {} as any, // Find to do this, since it defaults to receiver side info
                                receiving: { amount, expiry, preparedBlockNumber },
                            },
                            bidSignature: data.bidSignature,
                            encodedBid: data.encodedBid,
                            encryptedCallData: data.encryptedCallData,
                            status: NxtpSdkEvents.ReceiverTransactionPrepared,
                        };
                        setTransactions([parseTx(tx), ...transactions]);
                    } else {
                        const txs = [...transactions];
                        const tx = { ...txs[index] };
                        txs[index] = {
                            ...tx,
                            status: NxtpSdkEvents.ReceiverTransactionPrepared,
                        };
                        setTransactions(txs);
                    }
                });

                _sdk.attach(
                    NxtpSdkEvents.ReceiverTransactionFulfilled,
                    async (data) => {
                        const { transactionHash, txData } = data;
                        const index = transactions.findIndex(
                            (t) => t.transactionId === txData.transactionId,
                        );
                        if (index >= 0) {
                            const txs = [...transactions];
                            const tx = { ...txs[index] };
                            txs[index] = {
                                ...tx,
                                status: HistoricalTransactionStatus.FULFILLED,
                                fulfilledTxHash: transactionHash,
                                expiry: undefined,
                            };
                            setTransactions(txs);
                        }
                    },
                );

                _sdk.attach(
                    NxtpSdkEvents.ReceiverTransactionCancelled,
                    async (data) => {
                        const index = transactions.findIndex(
                            (t) => t.transactionId === data.txData.transactionId,
                        );
                        if (index >= 0) {
                            const txs = [...transactions];
                            const tx = { ...txs[index] };
                            txs[index] = {
                                ...tx,
                                status: HistoricalTransactionStatus.CANCELLED,
                                fulfilledTxHash: undefined,
                                expiry: undefined,
                            };
                            setTransactions(txs);
                        }
                    },
                );
            } catch (err) {
                // console.log(err);
            }
        };
        if (chainId && ethereum && chainData) {
            init();
        }
    }, [chainId, chainData]);

    return (
        <Page>
            <Flex style={{ justifyContent: "center", fontSize: '40px', color: 'white', fontWeight: '500', paddingTop: '20px' }}>
                Bridge Explorer
            </Flex>
            <TxTable columns={columns} transactions={transactions} />
        </Page>
    )
}

export default Explorer;
