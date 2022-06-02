import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BsArrowLeftRight, BsPatchQuestion, BsChevronDown } from 'react-icons/bs';
import ReactModal from 'react-modal';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from "@mui/material/useMediaQuery";
import { NxtpSdkEvents, NxtpSdk, GetTransferQuote, HistoricalTransactionStatus } from "@connext/nxtp-sdk";
import { AuctionResponse, getChainData, ChainData } from '@connext/nxtp-utils';
import { Text, Card, Button, useWalletModal, ConnectorId, Flex, Input } from 'crox-new-uikit';
import ReactTooltip from 'react-tooltip';
import styled from "styled-components";
import useWave from 'use-wave';
import Explorer from 'views/Explorer';
// import { AnimateGroup, AnimateKeyframes } from 'react-simple-animate';
// import { css } from "@emotion/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import CircleLoader from "react-spinners/CircleLoader";
import Page from '../../components/layout/Page';
import NetworkSelectModal from './NetworkSelectModal';
import TokenSelectModal from './TokenSelectModal';
import { injected, bsc } from "../../utils/connector";
import WalletConnector from '../../hooks/useWalletConnector';
// import { useBridgeApprove } from '../../hooks/useApprove';
import { chainConfig, swapConfig } from '../../config/chainConfig';
import networkList from './NetworkList';
import { getBalanceNumber } from '../../utils/formatBalance';
import useTokenBalance, { useToTokenBalance } from '../../hooks/useTokenBalance';
import ConfirmModal from './components/ConfirmModal';
import SignModal from './components/SignModal';
import { getCharge, getFeePro } from '../../utils/callHelpers';
import './walletButton.scss';

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

const Bridge: React.FC = () => {

  const InputSelectorButton = styled(Button)`
    display: flex;
    padding: 10px;
    background-color: transparent;
    border: none;
    width: 180px;
    box-shadow: none;
    align-items: center;
    @media screen and (max-width: 800px) {
      padding: 3px 12px;
    }
    &:hover:not(:disabled):not(.button--disabled):not(:active) {
      background-color: transparent;
      border: none;
    }
    &:active {
      background-color: transparent;
      box-shadow: none;
    }
    &:focus:not(:active) {
      box-shadow: none;
    }
  `

  const InputNetworkSelectorButton = styled(Button)`
    display: flex;
    padding: 10px;
    background-color: transparent;
    border: none;
    box-shadow: none;
    align-items: center;
    @media screen and (max-width: 500px) {
      display: contents;
      .networkname {
        text-align: center !important;
      }
    }
    &:hover:not(:disabled):not(.button--disabled):not(:active) {
      background-color: transparent;
      border: none;
    }
    &:active {
      background-color: transparent;
      box-shadow: none;
    }
    &:focus:not(:active) {
      box-shadow: none;
    }
  `

  const InputBalance = styled.input`
    font-size: 20px;
    color: #ced0f9;
    font-weight: 400;
    border: none;
    outline: none;
    width: 356px;
    text-align: right;
    background-color: transparent;
    padding: 0 15px;
    @media screen and (max-width: 600px) {
      padding: 0 10px;
      width: 67%;
    }
  `

  const MaxButton = styled.button`
    display: flex;
    color: white;
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    background-color: #2d74c4;
    margin: auto 0;
    border: none;
    border-radius: 10px;
    transition: .5s all;
    &:hover {
      opacity: 0.8;
    }
  `

  const BinanceButton = styled.div`
    background-color: transparent;
    border: none;
  `

  const PolygonButton = styled.div`
    background-color: transparent;
    border: none;
  `

  const Tooltip = styled.p<{ isTooltipDisplayed: boolean }>`
    display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "block" : "none")};
    bottom: -22px;
    right: 0;
    left: 0;
    text-align: center;
    background-color: #3b3c4e;
    color: white;
    border-radius: 16px;
    opacity: 0.7;
    padding-top: 4px;
    position: absolute;
  `;

  const ActiveTx = styled.div`
    padding: 10px;
    background-color: #23242F;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    transition: all ease 200ms;
    @media screen and (max-width: 1000px) {
      max-width: 500px;
      width: 90%;
      margin: auto;
    }
  `

  const customStyles = {
    body: {
      overflow: 'hidden'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "transparent",
      border: 'none',
      overflow: 'hidden'
    },
  };

  // const override = css`
  //   margin: auto 10px;
  // `;

  ReactModal.defaultStyles.overlay.backgroundColor = 'rgb(0 0 0 / 70%)';
  ReactModal.defaultStyles.overlay.zIndex = '15';

  // const isMobile = useMediaQuery("(max-width: 1250px)");
  const isSmMobile = useMediaQuery("(max-width: 800px)");

  // const loadingBridge = true;

  const [isSelect, setSelectTab] = useState(false);
  const [sdk, setSdk] = useState<NxtpSdk>();
  const [chainData, setChainData] = useState<Map<string, ChainData>>();
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();
  const [transactions, setTransactions] = useState<IBridgeTransaction[]>([]);
  const [isChangeChain, setFromChain] = useState(false);
  const [fromChain, selectFromNetwork] = useState(null)
  const [toChain, selectToNetwork] = useState(null)
  const [sendAmount, setAmount] = useState('');
  const [curTx, setTx] = useState(null);
  const [receivedAddress, setReceivedAddress] = useState('');
  const [routerAddress, setRouterAddress] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [gasFeeAmount, setGasFeeAmount] = useState('');
  const [relayerFee, setRelayerFee] = useState('');
  const [routerFees, setRouterFee] = useState('');
  const [isTokenSelectModal, setIsTokenSelectModal] = useState(false)
  const [sendingToken, setSendToken] = useState(null)
  const [receivingToken, setReceiveToken] = useState(null)
  const [sendingAsset, setSendAsset] = useState('')
  const [receivingAsset, setReceiveAsset] = useState('')
  const [curFromTokenAddress, setCurFromTokenAddr] = useState('')
  const [curToTokenAddress, setCurToTokenAddr] = useState('')
  const [currentFromTokenBalance, setFromTokenBalance] = useState(0)
  const [currentToTokenBalance, setToTokenBalance] = useState(0)
  const [loading, setLoading] = useState<boolean>(false);
  // const [bridgeStep, setStep] = useState(0);
  const [rpcs, setRpcs] = useState(null);
  const [isError, setError] = useState('');
  const [isWarning, setWarning] = useState('');
  const [openConfirm, setConfirmModal] = useState(false);
  const [openSign, setSignModal] = useState(false);
  const [transfer, setTransfer] = useState(null);
  const [prepared, setPrepare] = useState(null);
  const [sendPrepare, setSendPrepare] = useState(false);
  const [isWait, setWait] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isTxTooltipDisplayed, setTxTooltipDisplayed] = useState(false);
  const [isActiveTx, setActiveTx] = useState(false);
  const [isProcess, setProcess] = useState(false);

  const [isNetworkSelectModalOpen, setIsNetworkSelectModalOpen] = useState({ show: false, from: false, to: false });

  const { chainId, library, deactivate, activate, account } = useWeb3React();
  const walletconnect = WalletConnector();

  // const isApproved = account && allowance && allowance.isGreaterThan(0);

  const handleLogin = (connectorId: ConnectorId) => {
    if (connectorId === "walletconnect") {
      return activate(walletconnect);
    }
    if (connectorId === "bsc") {
      return activate(bsc);
    }
    return activate(injected);
  };
  const { onPresentNewConnectModal } = useWalletModal(
    handleLogin,
    deactivate,
    account as string
  );

  function closeModal() {
    setIsNetworkSelectModalOpen({ ...isNetworkSelectModalOpen, show: false });
  }

  function closeTokenModal() {
    setIsTokenSelectModal(false)
  }

  function closeConfirmModal() {
    setConfirmModal(false);
  }

  function closeSignModal() {
    setSignModal(false);
  }

  const selectToken = (tokenIndex) => {
    const selectedToken = swapConfig.find((token) => token.index === tokenIndex);
    setSendToken(selectedToken);
    setReceiveToken(selectedToken);
    setIsTokenSelectModal(false);
  }

  useEffect(() => {
    const init = async () => {
      const data = await getChainData();
      setChainData(data);
    };
    init();
  }, []);

  useEffect(() => {
    if (account) {
      setReceivedAddress(account)
    }
  }, [account])

  useEffect(() => {
    let tokenAddress;
    let totokenAddress;
    if (sendingToken) {
      tokenAddress = sendingToken.assets[fromChain.chainID];
    }
    if (receivingToken) {
      totokenAddress = receivingToken.assets[toChain.chainID]
    }
    setCurFromTokenAddr(tokenAddress)
    setCurToTokenAddr(totokenAddress)
  }, [setCurFromTokenAddr, setCurToTokenAddr, fromChain, toChain, sendingToken, receivingToken])

  useEffect(() => {
    const fromchain = 56;
    const tochain = 137;
    networkList.map((entry1) => {
      if (entry1.chainID === fromchain) {
        selectFromNetwork(entry1);
      }
      if (entry1.chainID === tochain) {
        selectToNetwork(entry1);
      }
      return {}
    })
  }, [])

  useEffect(() => {
    setFromChain(true);
  }, [fromChain])

  useEffect(() => {
    if (sendingToken) {
      setSendAsset(sendingToken.assets[fromChain.chainID])
    }
    if (receivingToken) {
      setReceiveAsset(receivingToken.assets[toChain.chainID])
    }
  }, [receivingToken, sendingToken, fromChain, toChain])

  useEffect(() => {
    if (!account) {
      setWarning("Connect Wallet")
    } else if (!sendingToken && !receivingToken) {
      setWarning("Select Token")
    } else if (sendAmount === '') {
      setWarning("Enter an amount")
    } else if (receivedAddress === '') {
      setWarning("Enter an address")
    } else {
      setWarning(null)
    }
    if (Number(sendAmount) > currentFromTokenBalance) {
      setError("Insufficient Balance")
    }
  }, [sendAmount, receivedAddress, isChangeChain, account, sendingToken, receivingToken])

  const availableTokenBal = getBalanceNumber(useTokenBalance(curFromTokenAddress))
  const availableToTokenBal = getBalanceNumber(useToTokenBalance(curToTokenAddress, rpcs));

  useEffect(() => {
    if (chainData && receivingToken) {
      const rpc = chainData.get(toChain.chainID.toString()).rpc;
      console.log("rpc => ", rpc)
      setRpcs(rpc)
    }
  }, [chainData, receivingToken])

  useEffect(() => {
    setFromTokenBalance(availableTokenBal);
    setToTokenBalance(availableToTokenBal);
  }, [availableTokenBal, availableToTokenBal])

  const changeChain = () => {
    if (fromChain && toChain) {
      selectFromNetwork(toChain);
      selectToNetwork(fromChain);
    }
  }

  const selectNetwork = (chainID = 56, isfrom = null) => {
    networkList.map((entry) => {
      if (entry.chainID === chainID && isfrom) {
        if (isfrom.from) {
          selectFromNetwork(entry);
          setIsNetworkSelectModalOpen({ ...isNetworkSelectModalOpen, show: false, from: false })
        }
        if (isfrom.to) {
          selectToNetwork(entry);
          setIsNetworkSelectModalOpen({ ...isNetworkSelectModalOpen, show: false, to: false })
        }
      }
      return {};
    })
  }

  const selectMaxBal = () => {
    setAmount((currentFromTokenBalance as any).toString());
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.currentTarget.value === '') {
        setError("Enter an address");
      }
      setError('');
      setReceivedAddress(e.currentTarget.value);
    },
    [setReceivedAddress, setError],
  )

  const handleChangeAmount = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const RE = /^\d*\.?\d{0,18}$/
      e.preventDefault();
      if (RE.test(e.currentTarget.value)) {
        setAuctionResponse(undefined);
        setReceivedAmount('');
        setGasFeeAmount('');
        setRelayerFee('');
        setRouterFee('');
        setAmount(e.currentTarget.value);
        setError('');
      }
    },
    [setAmount, setError],
  )

  const switchChain = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      let chainID = ethers.utils.hexlify(fromChain.chainID).toString();
      if (chainID === '0x01') {
        chainID = '0x1';
      }
      if (chainID === '0x04') {
        chainID = '0x4';
      }
      if (chainID === '0x05') {
        chainID = '0x5';
      }
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `${chainID}` }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `${chainID}`,
                  chainName: `${fromChain.title}`,
                  nativeCurrency: {
                    name: `${chainData.get(fromChain.chainID.toString()).nativeCurrency.name}`,
                    symbol: `${chainData.get(fromChain.chainID.toString()).nativeCurrency.symbol}`,
                    decimals: 18,
                  },
                  rpcUrls: [`${chainData.get(fromChain.chainID.toString()).rpc}`],
                  blockExplorerUrls: [`${chainData.get(fromChain.chainID.toString()).explorers[0].url}`],
                },
              ],
            });
          } catch (addError: any) {
            console.error(addError);
          }
        }
      }
      setFromChain(false)
    }
  }

  const getTransferQuote = async (): Promise<GetTransferQuote | undefined> => {
    if (!sdk || loading) {
      return;
    }
    setError('')
    setLoading(true);
    try {
      if (sendingAsset && receivingAsset && !loading) {
        let response;
        try {
          response = await sdk.getTransferQuote({
            sendingAssetId: sendingAsset,
            sendingChainId: fromChain.chainID,
            receivingAssetId: receivingAsset,
            receivingChainId: toChain.chainID,
            // preferredRouters: ["0x9d166026c09edf25bf67770d52a2cb7ddd4008b4"],
            receivingAddress: receivedAddress,
            amount: ethers.utils
              .parseUnits(sendAmount, 18)
              .toString(),
            expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
          });
        } catch (err: any) {
          if (err.toString() !== 'Error: invalid decimal value (arg="value", value="", version=4.0.47)') {
            setError(err)
          }
        }

        const receivedAmounts = ethers.utils.formatUnits(
          response?.bid.amountReceived ?? ethers.constants.Zero,
          18,
        );

        // const gasFeeAmounts = ethers.utils.formatUnits(
        //   response?.gasFeeInReceivingToken ?? ethers.constants.Zero,
        //   18,
        // );

        const relayerFees = ethers.utils.formatUnits(
          response?.metaTxRelayerFee ?? ethers.constants.Zero,
          18,
        );

        const routerFee = ethers.utils.formatUnits(
          response?.routerFee ?? ethers.constants.Zero,
          18,
        );

        const routerAddr = response?.bid.router;

        const txID = response?.bid.transactionId;

        const gasFeeAmounts = await getFeePro(library, sendingToken.index, fromChain.chainID);
        const fee = (Number(gasFeeAmounts.feePercent) * Number(sendAmount) / 100).toString();

        console.log("gasFeeAmounts => ", gasFeeAmounts);

        setRouterAddress(routerAddr);
        setReceivedAmount(receivedAmounts);
        setGasFeeAmount(fee);
        setRelayerFee(relayerFees);
        setRouterFee(routerFee);
        setTx(txID);
        setAuctionResponse(response);
      }
    } catch (err: any) {
      // setError(err)
    }
    setLoading(false);
  };

  // const onApprove = useBridgeApprove(fromChain.chainID, ethers.utils.parseUnits(sendAmount, 18).toString())

  const handleBridge = async () => {
    if (!sdk || !auctionResponse) {
      return;
    }

    setLoading(true);
    setProcess(true);

    try {
      const trans = await sdk.prepareTransfer(auctionResponse, true);
      getCharge(library, sendingToken.index, sendAmount, fromChain.chainID);
      setTransfer(trans);
      setSignModal(true);
      setSendPrepare(true);
    } catch (err: any) {
      setError("User denied transaction signature");
      // onDismiss();
      setProcess(false)
    }
    closeConfirmModal();
    setLoading(false);
    // onDismiss();
  }

  const WaitRouter = async () => {
    if (!sdk || !auctionResponse) {
      return;
    }
    setActiveTx(true);
    setWait(true);
    let prepare;
    try {
      prepare = await sdk.waitFor(
        NxtpSdkEvents.ReceiverTransactionPrepared,
        700_000,
        (data) => data.txData.transactionId === transfer.transactionId // filter function
      );
      setPrepare(prepare)
    } catch (err: any) {
      setError(err)
    }
    setWait(false)
  }

  const signToClaim = async () => {
    if (!sdk || !auctionResponse) {
      return;
    }

    setLoading(true);

    try {
      await sdk.fulfillTransfer(prepared, true);
    } catch (err: any) {
      // setError("User denied transaction signature");
      // setStep(0)
      // setLoading(false);
    }

    try {
      await sdk.waitFor(
        NxtpSdkEvents.ReceiverTransactionFulfilled,
        700_000,
        (data) => data.txData.transactionId === transfer.transactionId // filter function
      );
      setActiveTx(false);
      setSuccess(true);
      // switchtoChain();
    } catch (err: any) {
      setError(err)
    }
    setProcess(false);

    setLoading(false);

    setReceivedAmount('');
    setGasFeeAmount('');
    setRelayerFee('');
    setRouterFee('');
    setAuctionResponse(undefined);
  }

  const openConfirmModal = () => {
    setConfirmModal(true);
  }

  const wave = useWave({
    color: 'white',
  })

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

        setSdk(_sdk);
      } catch (err) {
        // console.log(err);
      }
    };
    if (chainId && ethereum && chainData) {
      init();
    }
  }, [chainId, chainData]);


  // const animationGroup = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
  // const mobileAnimationGroup = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']

  useEffect(() => {
    if (sendingToken || receivingToken) {
      setAmount('');
      setAuctionResponse(undefined);
      setReceivedAmount('');
      setGasFeeAmount('');
      setRelayerFee('');
      setRouterFee('');
      setError('');
      setFromTokenBalance(0);
      setToTokenBalance(0);
      setLoading(false);
    }
  }, [sendingToken, receivingToken])

  useEffect(() => {
    if (fromChain || toChain) {
      setAmount('');
      setAuctionResponse(undefined);
      setReceivedAmount('');
      setGasFeeAmount('');
      setRelayerFee('');
      setRouterFee('');
      setFromTokenBalance(0);
      setToTokenBalance(0);
      setError('');
      setLoading(false);
    }
  }, [fromChain, toChain])

  return (
    <>
      {
        !isSelect ?
          <Page>
            <Flex style={{ justifyContent: "center" }}>
              <Button color="white" mb="10px" style={{
                textAlign: 'center', fontSize: '30px', padding: "10px 22px",
                background: "#3b3c4e", cursor: 'pointer', borderRadius: '0'
              }} onClick={() => setSelectTab(false)}>
                BRIDGE
              </Button>
              <Button color="white" mb="10px" style={{
                textAlign: 'center', fontSize: '30px', padding: "10px 22px",
                background: "#22232d", cursor: 'pointer', borderRadius: '0'
              }} onClick={() => setSelectTab(true)}>
                View Txns
              </Button>
            </Flex>
            <div>
              <Text fontSize="14px" color="#8B8CA7" style={{ textAlign: 'center' }} >(Launching Soon)</Text>
              <Text fontSize="14px" color="#8B8CA7" style={{ textAlign: 'center' }} >You can bridge your assets faster & cheaper across blockchains using CROX Bridge</Text>
            </div>
            <Flex className='bridge-container'>
              <div className='bridge-content'>
                <Card style={isSmMobile ? { padding: '20px 10px', backgroundColor: '#2C2D3A' } : { padding: '45px 35px 35px 35px', backgroundColor: '#2C2D3A' }}>

                  <Flex alignItems='center' justifyContent='space-between' mb='20px' style={{ width: '100%' }}>
                    <div style={{ width: "43%" }}>
                      <Text color="#8B8CA7">From</Text>
                      <div ref={wave}>
                        <Card style={{ display: 'flex', background: "#3b3c4e", border: '1px solid #3B3C4E', borderRadius: '10px', justifyContent: 'center', boxShadow: 'none' }}>
                          <BinanceButton>
                            <InputNetworkSelectorButton onClick={() => setIsNetworkSelectModalOpen({ ...isNetworkSelectModalOpen, show: true, from: true, to: false })}>
                              {isSmMobile && <Flex mt='5px' />}
                              {fromChain && <Flex style={{ justifyContent: isSmMobile && 'center' }}>
                                <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} style={{ width: '25px' }} />
                              </Flex>
                              }
                              <Text fontSize={isSmMobile ? "16px" : "18px"} className="networkname" color="#ced0f9" style={{ textAlign: 'left', margin: '0 5px' }}>{fromChain && fromChain.title}</Text>
                              <BsChevronDown fontSize='12px' style={{ width: isSmMobile && '100%' }} />
                            </InputNetworkSelectorButton>
                          </BinanceButton>
                        </Card>
                      </div>
                    </div>

                    <BsArrowLeftRight style={{ marginTop: 20, cursor: "pointer" }} onClick={changeChain} />

                    <div style={{ width: "43%" }}>
                      <Text color="#8B8CA7">To</Text>
                      <div ref={wave}>
                        <Card style={{ display: 'flex', background: "#3b3c4e", border: '1px solid #3B3C4E', borderRadius: '10px', justifyContent: 'center', boxShadow: 'none' }}>
                          <PolygonButton>
                            <InputNetworkSelectorButton onClick={() => setIsNetworkSelectModalOpen({ ...isNetworkSelectModalOpen, show: true, from: false, to: true })}>
                              {isSmMobile && <Flex mt='5px' />}
                              {toChain && <Flex style={{ justifyContent: isSmMobile && 'center' }}><img src={`images/network/${toChain.img}_net.png`} alt={`${toChain.title} icon`} style={{ width: '25px' }} /></Flex>}
                              <Text fontSize={isSmMobile ? "16px" : "18px"} className="networkname" color="#ced0f9" m="0 5px" style={{ textAlign: 'left' }}>{toChain && toChain.title}</Text>
                              <BsChevronDown fontSize='12px' style={{ width: isSmMobile && '100%' }} />
                            </InputNetworkSelectorButton>
                          </PolygonButton>
                        </Card>
                      </div>
                    </div>
                  </Flex>

                  <Card m='8px 0' style={{ background: "#00000038", border: '1px solid #3B3C4E', borderRadius: '10px', boxShadow: 'none' }}>
                    <div className='sendbox'>
                      <Text color="#8B8CA7">You send</Text>
                      <Text color="#8B8CA7">Balance: {currentFromTokenBalance.toFixed(2)}</Text>

                    </div>
                    <Flex style={isSmMobile ? { marginBottom: "3px" } : { marginBottom: "7.5px" }}>
                      <InputSelectorButton onClick={() => setIsTokenSelectModal(true)}>
                        {sendingToken && <img src={`images/coins/${sendingToken && sendingToken.name}.png`} alt={sendingToken && sendingToken.name} style={{ width: '24px' }} />}
                        <Text fontSize={isSmMobile ? "15px" : "18px"} m='0 5px' color="#ced0f9" >{sendingToken ? sendingToken.name : 'Select Token'}</Text>
                        <BsChevronDown fontSize='12px' />
                      </InputSelectorButton>
                      <MaxButton onClick={selectMaxBal}>Max</MaxButton>
                      <input className="bridge-input" type="text" placeholder="0.0" value={sendAmount} onChange={handleChangeAmount} />
                    </Flex>
                  </Card>

                  <div>
                    <Card m='8px 0' style={{ background: "#00000038", border: '1px solid #3B3C4E', borderRadius: '10px', boxShadow: 'none' }}>
                      <div className='sendbox'>
                        <Text color="#8B8CA7" style={isSmMobile ? { margin: '0px' } : { margin: '0', marginBottom: "0" }} >Receive Amount</Text>
                        <Text color="#8B8CA7">Balance: {currentToTokenBalance.toFixed(2)}</Text>
                      </div>
                      <Flex style={isSmMobile ? { marginBottom: "3px" } : { marginBottom: "7.5px" }}>
                        <InputSelectorButton onClick={() => setIsTokenSelectModal(true)}>
                          {receivingToken && <img src={`images/coins/${receivingToken && receivingToken.name}.png`} alt={receivingToken && receivingToken.name} style={{ width: '24px' }} />}
                          <Text fontSize={isSmMobile ? "15px" : "18px"} m='0 5px' color="#ced0f9" >{receivingToken ? receivingToken.name : 'Select Token'}</Text>
                          <BsChevronDown fontSize='12px' />
                        </InputSelectorButton>
                        <InputBalance placeholder="0" style={{ width: '80%' }} type="text" value={receivedAmount} readOnly />
                      </Flex>
                    </Card>
                  </div>

                  <div>
                    <Text fontSize="16px" color="#8B8CA7" >Receiver Address</Text>
                    <Input placeholder="Enter correct 0x address" style={{ borderRadius: '10px', backgroundColor: '#22232d', outline: 'none', border: '1px solid #3B3C4E', padding: '23px 15px', fontSize: '15px', marginTop: '3px', boxShadow: 'none', color: "#8B8CA7" }} value={receivedAddress} onChange={handleChange} />
                  </div>

                  <div style={{ width: "100%", textAlign: "center", marginTop: '20px' }}>
                    {!account ? (
                      <Button style={{ width: "100%", margin: "auto", borderRadius: '5px', padding: '28px 0', fontSize: '18px', fontWeight: '400' }} onClick={onPresentNewConnectModal}>Connect Wallet</Button>
                    ) :
                      (
                        <div ref={wave}>
                          {
                            isChangeChain && fromChain && fromChain.chainID !== chainId ?
                              <Button style={{ width: "100%", margin: "auto", borderRadius: '5px', padding: '28px 0', fontSize: '18px', fontWeight: '400' }} onClick={switchChain}>
                                Switch to <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} style={{ width: '25px', margin: "0 5px" }} /> {fromChain.title}
                              </Button>
                              :
                              <Button
                                className='bridge-btn'
                                style={{ width: "100%", margin: "auto", borderRadius: '5px', padding: '28px 0', fontSize: '16px', fontWeight: 'bold' }}
                                onClick={!auctionResponse ? getTransferQuote : openConfirmModal}
                              // disabled={!auctionResponse && isError !== ''}
                              >
                                {(loading || isProcess) && <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginRight: "10px" }} />}{' '}
                                {
                                  isWarning ?
                                    <>
                                      {isWarning}
                                    </>
                                    :
                                    <>
                                      {!auctionResponse ? 'Get Transfer Quote' :
                                        <>
                                          {isProcess ? 'In Process' : 'Bridge'}
                                        </>
                                      }
                                    </>
                                }
                              </Button>
                          }
                        </div>
                      )
                    }
                  </div>

                  {isError !== '' && <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                    <Text className="buttonBottomText" fontSize="18px" color="rgb(232, 66, 90)" p="10px" mt="12px" style={{ textAlign: 'center', width: '70%', background: "rgba(232, 66, 90, 0.125)" }}>{`${isError}`}</Text>
                  </div>}

                  <Text mt="24px" color="#8B8CA7" style={{ textAlign: 'right' }}>Large amounts take minutes to transfer</Text>
                  <Flex style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Flex alignItems='center'>
                      <Text fontSize="16px" color="#8B8CA7" mr="5px">Router Fees:</Text>
                      <BsPatchQuestion color='#8B8CA7' data-tip data-for='tip1' />
                      <ReactTooltip id='tip1' aria-haspopup='true' place='right' backgroundColor='#1377bf' className='tooltip' >
                        <Text fontSize="14px" color="white">Router Fee</Text>
                      </ReactTooltip>
                    </Flex>
                    <Text color="#8B8CA7" fontSize='16px'>
                      {routerFees ? routerFees : 0}
                    </Text>
                  </Flex>
                  <Flex style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Flex alignItems='center'>
                      <Text fontSize="16px" color="#8B8CA7" mr="5px">Relayer Fees:</Text>
                      <BsPatchQuestion color='#8B8CA7' data-tip data-for='tip1' />
                      <ReactTooltip id='tip1' aria-haspopup='true' place='right' backgroundColor='#1377bf' className='tooltip' >
                        <Text fontSize="14px" color="white">Relayer Fee</Text>
                      </ReactTooltip>
                    </Flex>
                    <Text color="#8B8CA7" fontSize='16px'>
                      {relayerFee ? relayerFee : 0}
                    </Text>
                  </Flex>
                  <Flex style={{ justifyContent: "space-between" }}>
                    <Flex alignItems='center'>
                      <Text fontSize="16px" color="#8B8CA7" mr="5px">Gas Fees :</Text>
                      <BsPatchQuestion color='#8B8CA7' data-tip data-for='tip2' />
                      <ReactTooltip id='tip2' aria-haspopup='true' place='right' backgroundColor='#1377bf' className='tooltip' >
                        <Text fontSize="14px" color="white">Gas Fee</Text>
                      </ReactTooltip>
                    </Flex>
                    <Text color="#8B8CA7" fontSize='16px'>
                      {gasFeeAmount ? gasFeeAmount : 0}
                    </Text>
                  </Flex>
                </Card>
              </div>
              {
                // curTx && fromChain && toChain && sendAmount && sendingToken &&
                isActiveTx &&
                <div>
                  <Text style={{ justifyContent: 'center', textAlign: 'center' }} bold>ACTIVE TRANSACTIONS</Text>
                  <ActiveTx>
                    <Text fontSize='18px' bold>
                      <Flex color='white' style={{ position: 'relative' }}>
                        <Text fontSize='16px' color='#67646c' mr='10px'>TX ID: </Text>
                        {curTx.slice(0, 5)}...{curTx.slice(-5)}
                        <ContentCopyIcon style={{ margin: '4px', fontSize: '18px', color: '#67646c' }} onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(curTx);
                            setTxTooltipDisplayed(true);
                            setTimeout(() => {
                              setTxTooltipDisplayed(false);
                            }, 1000);
                          }
                        }} />
                        <Tooltip isTooltipDisplayed={isTxTooltipDisplayed} style={{ width: "70px", left: "130px" }}>Copied</Tooltip>
                      </Flex>
                    </Text>
                    <Flex justifyContent='center' m='10px 0'>
                      <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} style={{ width: '25px' }} />
                      <BsArrowLeftRight style={{ margin: '3px 20px', cursor: "pointer", color: 'white' }} />
                      <img src={`images/network/${toChain.img}_net.png`} alt={`${toChain.title} icon`} style={{ width: '25px' }} />
                    </Flex>
                    <div style={{ justifyContent: 'center', margin: 'auto' }}>
                      <Flex justifyContent='center' style={{ display: 'flex' }}>
                        <Flex m='5px 0' p='5px 10px' style={{ background: '#00000033', width: 'fit-content', borderRadius: '20px' }}>
                          <img src={`images/coins/${sendingToken && sendingToken.name}.png`} alt={sendingToken && sendingToken.name} style={{ width: '24px' }} />
                          <Text m='0 10px'>{sendAmount}</Text>
                          <Text>{sendingToken.name}</Text>
                        </Flex>
                      </Flex>
                      <Flex justifyContent='center' style={{ margin: '5px 0' }}>
                        {
                          isWait ? (
                            <>
                              <Text>Waiting for Router</Text>
                            </>
                          ) : (
                            <>
                              {
                                loading ?
                                  <>
                                    <Button style={{ fontSize: '22px', borderRadius: '15px', height: '30px' }}>
                                      <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginRight: "10px" }} />
                                      <Text fontSize='20px'>Claiming Funds</Text>
                                    </Button>
                                  </>
                                  :
                                  <Button style={{ fontSize: '18px', borderRadius: '15px', height: '30px' }} onClick={signToClaim}>Ready to Claim</Button>
                              }
                            </>
                          )
                        }
                      </Flex>
                    </div>
                    <Text>Expire in 3 days</Text>
                  </ActiveTx>
                </div>
              }
              {/* {
                !isMobile ?
                  <Flex alignItems='space-between' flexDirection='column' justifyContent='center'>
                    <Flex alignItems='center'>
                      <Flex alignItems='end' mr='10px'>
                        {sendingToken && (
                          <Flex alignItems='center' marginRight='-20px' style={{ zIndex: 1 }}>
                            <Text fontSize='20px'>{sendingToken.name}</Text>
                            <img src={`images/coins/${sendingToken && sendingToken.name}.png`} alt={sendingToken && sendingToken.name} width="30px" style={{ height: '30px' }} />
                          </Flex>
                        )}
                        {fromChain && <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} width="90px" />}
                      </Flex>
                      {
                        bridgeStep === 1 ?
                          <AnimateGroup play>
                            {animationGroup.map((item, index) => {
                              return (
                                <AnimateKeyframes
                                  play
                                  duration={0.2}
                                  iterationCount="infinite"
                                  direction="alternate"
                                  sequenceIndex={index}
                                  key={item}
                                  keyframes={[
                                    { 0: 'transform: scale(1)' },
                                    { 100: 'transform: scale(2)' },
                                  ]}
                                >
                                  <div className='progressObject' />
                                </AnimateKeyframes>
                              )
                            })}
                          </AnimateGroup>
                          :
                          <AnimateGroup play>
                            {animationGroup.map((item, index) => {
                              return (
                                <AnimateKeyframes
                                  play
                                  pause
                                  duration={0.2}
                                  iterationCount="infinite"
                                  direction="alternate"
                                  sequenceIndex={index}
                                  key={item}
                                  keyframes={[
                                    { 0: 'transform: scale(1)' },
                                    { 100: 'transform: scale(2)' },
                                  ]}
                                >
                                  <div className='progressObject' />
                                </AnimateKeyframes>
                              )
                            })}
                          </AnimateGroup>
                      }
                      <CircleLoader color="#2d74c4" loading={loadingBridge} size={150} css={override} />
                      {
                        bridgeStep === 0 ?
                          <div className="loading">
                            <span data-text="R">R</span>
                            <span data-text="E">E</span>
                            <span data-text="A">A</span>
                            <span data-text="D">D</span>
                            <span data-text="Y">Y</span>
                          </div>

                          :
                          <>
                            {
                              bridgeStep === 3 ?
                                <div className="loading completed">
                                  <span data-text="C">C</span>
                                  <span data-text="O">O</span>
                                  <span data-text="M">M</span>
                                  <span data-text="P">P</span>
                                  <span data-text="L">L</span>
                                  <span data-text="E">E</span>
                                  <span data-text="T">T</span>
                                  <span data-text="E">E</span>
                                  <span data-text="D">D</span>
                                </div>
                                :
                                <div className="loading loading07">
                                  <span data-text="B">B</span>
                                  <span data-text="R">R</span>
                                  <span data-text="I">I</span>
                                  <span data-text="D">D</span>
                                  <span data-text="G">G</span>
                                  <span data-text="I">I</span>
                                  <span data-text="N">N</span>
                                  <span data-text="G">G</span>
                                </div>
                            }
                          </>
                      }
                      {
                        bridgeStep === 2 ?
                          <AnimateGroup play>
                            {animationGroup.map((item, index) => {
                              return (
                                <AnimateKeyframes
                                  play
                                  iterationCount="infinite"
                                  duration={0.2}
                                  direction="alternate"
                                  sequenceIndex={index}
                                  key={item}
                                  keyframes={[
                                    { 0: 'transform: scale(1)' },
                                    { 100: 'transform: scale(2)' },
                                  ]}
                                >
                                  <div className='progressObject' />
                                </AnimateKeyframes>
                              )
                            })}
                          </AnimateGroup>
                          :
                          <AnimateGroup play>
                            {animationGroup.map((item, index) => {
                              return (
                                <AnimateKeyframes
                                  play
                                  pause
                                  iterationCount="infinite"
                                  duration={0.2}
                                  direction="alternate"
                                  sequenceIndex={index}
                                  key={item}
                                  keyframes={[
                                    { 0: 'transform: scale(1)' },
                                    { 100: 'transform: scale(2)' },
                                  ]}
                                >
                                  <div className='progressObject' />
                                </AnimateKeyframes>
                              )
                            })}
                          </AnimateGroup>
                      }

                      <Flex alignItems="end" ml='10px'>
                        {toChain && <img src={`images/network/${toChain.img}_net.png`} alt={`${toChain.title} icon`} width="90px" />}
                        {receivingToken && (
                          <Flex alignItems='center' ml='-20px'>
                            <img src={`images/coins/${receivingToken && receivingToken.name}.png`} alt={receivingToken && receivingToken.name} width="30px" style={{ height: '30px' }} />
                            <Text fontSize='20px'>{receivingToken.name}</Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                  :
                  <div className="bridge-tracker">
                    <Flex justifyContent="center" className="mobile-tracker">
                      {
                        bridgeStep !== 0 ? (
                          <Flex alignItems='center'>
                            <CircleLoader color="#2d74c4" loading={loadingBridge} size={150} css={override} />
                            <div className="loading loading07">
                              <span data-text="B">B</span>
                              <span data-text="R">R</span>
                              <span data-text="I">I</span>
                              <span data-text="D">D</span>
                              <span data-text="G">G</span>
                              <span data-text="I">I</span>
                              <span data-text="N">N</span>
                              <span data-text="G">G</span>
                            </div>
                          </Flex>
                        ) : (
                          <Flex justifyContent='space-between' alignItems='center' style={{ width: '100%' }}>
                            <Flex alignItems='end' mr='10px'>
                              {sendingToken && (
                                <Flex alignItems='center' marginRight='-20px' style={{ zIndex: 1 }}>
                                  <Text fontSize='16px'>{sendingToken.name}</Text>
                                  <img src={`images/coins/${sendingToken && sendingToken.name}.png`} alt={sendingToken && sendingToken.name} width="20px" style={{ height: '20px' }} />
                                </Flex>
                              )}
                              {fromChain && <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} width="60px" />}
                            </Flex>
                            {
                              bridgeStep ?
                                <AnimateGroup play>
                                  {mobileAnimationGroup.map((item, index) => {
                                    return (
                                      <AnimateKeyframes
                                        play
                                        duration={0.2}
                                        iterationCount="infinite"
                                        direction="alternate"
                                        sequenceIndex={index}
                                        key={item}
                                        keyframes={[
                                          { 0: 'transform: scale(1)' },
                                          { 100: 'transform: scale(2)' },
                                        ]}
                                      >
                                        <div className='progressObject' />
                                      </AnimateKeyframes>
                                    )
                                  })}
                                </AnimateGroup>
                                :
                                <AnimateGroup play>
                                  {mobileAnimationGroup.map((item, index) => {
                                    return (
                                      <AnimateKeyframes
                                        play
                                        pause
                                        duration={0.2}
                                        iterationCount="infinite"
                                        direction="alternate"
                                        sequenceIndex={index}
                                        key={item}
                                        keyframes={[
                                          { 0: 'transform: scale(1)' },
                                          { 100: 'transform: scale(2)' },
                                        ]}
                                      >
                                        <div className='progressObject' />
                                      </AnimateKeyframes>
                                    )
                                  })}
                                </AnimateGroup>
                            }
                            <Flex alignItems="end" ml='10px'>
                              {toChain && <img src={`images/network/${toChain.img}_net.png`} alt={`${toChain.title} icon`} width="60px" />}
                              {receivingToken && (
                                <Flex alignItems='center' ml='-20px'>
                                  <img src={`images/coins/${receivingToken && receivingToken.name}.png`} alt={receivingToken && receivingToken.name} width="20px" style={{ height: '20px' }} />
                                  <Text fontSize='16px'>{receivingToken.name}</Text>
                                </Flex>
                              )}
                            </Flex>
                          </Flex>
                        )}
                    </Flex>
                  </div>
              } */}

            </Flex>
          </Page>
          :
          <Explorer columns={columns} transactions={transactions} setSelectTab={setSelectTab} />
      }
      <ReactModal isOpen={isNetworkSelectModalOpen.show} onRequestClose={() => closeModal()} style={customStyles} ariaHideApp={false}>
        <NetworkSelectModal isfrom={isNetworkSelectModalOpen} selectNetwork={selectNetwork} onDismiss={() => closeModal()} />
      </ReactModal>
      <ReactModal isOpen={isTokenSelectModal} onRequestClose={() => closeTokenModal()} style={customStyles} ariaHideApp={false}>
        <TokenSelectModal onDismiss={() => closeTokenModal()} swapConfig={swapConfig} selectToken={selectToken} />
      </ReactModal>
      <ReactModal isOpen={openConfirm} onRequestClose={() => closeConfirmModal()} style={customStyles} ariaHideApp={false}>
        <ConfirmModal handleBridge={handleBridge} fromChain={fromChain} toChain={toChain} sendingToken={sendingToken} receivingToken={receivingToken} auctionResponse={auctionResponse} loading={loading} />
      </ReactModal>
      <ReactModal isOpen={openSign} onRequestClose={() => closeSignModal()} style={customStyles} ariaHideApp={false}>
        <SignModal sendPrepare={sendPrepare} txId={curTx} WaitRouter={WaitRouter} signToClaim={signToClaim} fromChain={fromChain} toChain={toChain} receivingToken={receivingToken} loading={loading} isWait={isWait} prepared={prepared} isSuccess={isSuccess} routerAddress={routerAddress} receivedAddress={receivedAddress} sendingAddress={account} relayerFee={relayerFee} />
      </ReactModal>
    </>
  )
}

export default Bridge;
