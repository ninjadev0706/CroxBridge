import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BsArrowLeftRight, BsPatchQuestion, BsChevronDown } from 'react-icons/bs';
import ReactModal from 'react-modal';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from "@mui/material/useMediaQuery";
import { NxtpSdkEvents, NxtpSdk, GetTransferQuote } from "@connext/nxtp-sdk";
import { AuctionResponse, getChainData, ChainData } from '@connext/nxtp-utils';
import { Text, Card, Button, useWalletModal, ConnectorId, Flex, Input } from 'crox-new-uikit';
import ReactTooltip from 'react-tooltip';
import useWave from 'use-wave';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Page from '../../components/layout/Page';
import NetworkSelectModal from './NetworkSelectModal';
import TokenSelectModal from './TokenSelectModal';
import { injected, bsc, walletconnect } from "../../utils/connector";
import { useBridgeApprove, useAnyApprove } from '../../hooks/useApprove';
import useAllowance, {useAnyAllowance} from '../../hooks/useERC20Allowance';
import useAnyBridge from '../../hooks/useAnyBridge';
import { useAnyBridgeData, useRouterData, useTxStatus } from '../../hooks/api';
import useFeePro, { useCharge } from '../../hooks/useFee';
import { chainConfig, swapConfig } from '../../config/chainConfig';
import { anyConfig } from '../../config/anyConfig';
import { connextConfig } from '../../config/connextConfig';
import networkList from './NetworkList';
import { getBalanceNumber } from '../../utils/formatBalance';
import useTokenBalance, { useToTokenBalance } from '../../hooks/useTokenBalance';
import ConfirmModal from './components/ConfirmModal';
import SignModal from './components/SignModal';
import ConnextBtn from './components/ConnextBtn';
import AnySwapBtn from './components/AnySwapBtn';
import './walletButton.scss';
import {
  SelectBridge,
  BridgeItem,
  ItemWrap,
  InputSelectorButton,
  InputNetworkSelectorButton,
  InputBalance,
  MaxButton,
  BinanceButton,
  PolygonButton,
  ActiveTx,
  customStyles,
  Tooltip,
  Nodata
} from './components/styles';

const Bridge: React.FC = () => {

  ReactModal.defaultStyles.overlay.backgroundColor = 'rgb(0 0 0 / 70%)';
  ReactModal.defaultStyles.overlay.zIndex = '15';

  const isSmMobile = useMediaQuery("(max-width: 800px)");

  const [sdk, setSdk] = useState<NxtpSdk>();
  const [chainData, setChainData] = useState<Map<string, ChainData>>();
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();
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
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [selectedBridge, setSelectBridge] = useState(0);
  const [anyRouter, setAnyRouter] = useState(null);
  const [showConnext, setShowConnext] = useState(false);
  const [showAny, setShowAny] = useState(false);

  const [isNetworkSelectModalOpen, setIsNetworkSelectModalOpen] = useState({ show: false, from: false, to: false });

  const { chainId, library, account, deactivate, activate } = useWeb3React();

  const { onApprove } = useBridgeApprove();
  const { onAnyApprove } = useAnyApprove();
  const { onBridgeData, anyChaindata } = useAnyBridgeData();
  const { onTxStatus, txStatus } = useTxStatus();
  const { onRouterData, anyRouterInfo } = useRouterData();
  const anyRouterAddress = useMemo(() => {
    if (sendingToken && anyRouterInfo) {
      return anyRouterInfo.router;
    }
    return null;
  }, [anyRouterInfo, selectedBridge, sendingToken]);
  const { allowance, onAllowance } = useAllowance();
  const { anyAllowance, onAnyAllowance } = useAnyAllowance();
  const { onFeePro, feeAmount } = useFeePro();
  const { onChargeFee } = useCharge();

  const { onAnyBridge, txHaxhId } = useAnyBridge(anyRouterAddress);
  const isApproved = account && allowance && new BigNumber(allowance).isGreaterThan(0);
  const isAnyApprove = account && anyAllowance && new BigNumber(anyAllowance).isGreaterThan(0);

  console.log("txHaxhId => ", txHaxhId);

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
    } else if (selectedBridge === 0) {
      setWarning("Select Bridge")
    } else {
      setWarning(null)
    }
    if (Number(sendAmount) > currentFromTokenBalance) {
      setError("Insufficient Balance")
    }
  }, [sendAmount, receivedAddress, isChangeChain, account, sendingToken, receivingToken, selectedBridge])

  const availableTokenBal = getBalanceNumber(useTokenBalance(curFromTokenAddress))
  const availableToTokenBal = getBalanceNumber(useToTokenBalance(curToTokenAddress, rpcs));

  useEffect(() => {
    if (chainData && receivingToken) {
      const rpc = chainData.get(toChain.chainID.toString()).rpc;
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

  const ConfirmButton = async () => {
    if (!auctionResponse) {
      getTransferQuote();
    } else if (isApproved) {
      openConfirmModal();
    } else {
      setRequestedApproval(true);
      await onApprove(sendingToken.assets[fromChain.chainID],
        ethers.utils.parseUnits(sendAmount, 18).toString());
      setRequestedApproval(false);
      onAllowance(sendingToken.assets[fromChain.chainID]);
    }
  }

  const AnyConfirm = async () => {
    if (anyRouterAddress) {
      console.log("anyRouterAddress => ", anyRouterAddress);
      if (!isAnyApprove) {
        setRequestedApproval(true);
        await onAnyApprove(anyRouterAddress, ethers.utils.parseUnits(sendAmount, sendingToken.tokenDecimal).toString());
        setRequestedApproval(false);
        onAnyAllowance(anyRouterAddress)
      } else {
        await onAnyBridge(anyRouterInfo.anyToken.address, receivedAddress, ethers.utils.parseUnits(sendAmount, 18).toString(), toChain.chainID)
      }
    }
  }

  useEffect(() => {
    if (sendingToken) {
      onFeePro(sendingToken.index);
    }
  }, [sendingToken])

  const getTransferQuote = async (): Promise<GetTransferQuote | undefined> => {
    if (!sdk || loading) {
      return;
    }
    setError('')
    setLoading(true);
    const fee = (Number(feeAmount) * Number(sendAmount) / 100).toString();
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
              .parseUnits((Number(sendAmount) - Number(fee)).toString(), 18)
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

        const gasFeeAmounts = ethers.utils.formatUnits(
          response?.gasFeeInReceivingToken ?? ethers.constants.Zero,
          18,
        );

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

        setRouterAddress(routerAddr);
        setReceivedAmount(receivedAmounts);
        // setGasFeeAmount(fee);
        setGasFeeAmount(gasFeeAmounts);
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

  const handleBridge = async () => {
    if (!sdk || !auctionResponse) {
      return;
    }

    setLoading(true);
    setProcess(true);

    try {
      const trans = await sdk.prepareTransfer(auctionResponse, true);
      onChargeFee(sendingToken.index, sendAmount);
      setTransfer(trans);
      setSignModal(true);
      setSendPrepare(true);
    } catch (err: any) {
      setError("User denied transaction signature");
      setProcess(false)
    }
    closeConfirmModal();
    setLoading(false);
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
      console.log(err)
    }

    try {
      await sdk.waitFor(
        NxtpSdkEvents.ReceiverTransactionFulfilled,
        700_000,
        (data) => data.txData.transactionId === transfer.transactionId // filter function
      );
      setActiveTx(false);
      setSuccess(true);
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

  useEffect(() => {
    (async () => {
      const { ethereum } = window as any
      if ((!ethereum || !library || selectedBridge !== 1)) {
        return;
      }
      const _provider: Web3Provider = library || new Web3Provider(ethereum);

      const _signer = _provider.getSigner();

      const _sdk = await NxtpSdk.create({
        chainConfig,
        signer: _signer,
      });

      setSdk(_sdk);
    })();
  }, [account, chainId, library])

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

  useEffect(() => {
    if (fromChain && sendingToken) {
      onRouterData(fromChain.chainID, sendingToken.assets[fromChain.chainID]);
    }
  }, [fromChain, sendingToken])


  useEffect(() => {
    if (selectedBridge === 2 && fromChain && sendingToken) {
      onBridgeData(fromChain.chainID);
    }
  }, [selectedBridge])

  useEffect(() => {
    if (anyRouterInfo) {
      setAnyRouter(anyRouterInfo);
    }
  }, [anyRouterInfo])

  useEffect(() => {
    const txInterval = setInterval(() => {
      if (txHaxhId && selectedBridge === 2) {
        onTxStatus(txHaxhId);
      }
    }, 5000)
    return () => {
      clearInterval(txInterval);
    }
  }, [txHaxhId, selectedBridge])

  useEffect(() => {
    if (selectedBridge === 2) {
      console.log("txStatus => ", txStatus);
    }
  }, [txStatus])

  useEffect(() => {
    if (sendingAsset && fromChain) {
      if (connextConfig.find(connext => sendingAsset === connext.assets[fromChain.chainID])) {
        setShowConnext(true);
      }
      if (anyConfig.find(any => sendingAsset === any.assets[fromChain.chainID])) {
        setShowAny(true);
      }
    }
  }, [sendingAsset, fromChain])

  return (
    <>
      <Page>
        <Flex style={{ justifyContent: "center", fontSize: '40px', color: 'white', fontWeight: '500', paddingTop: '20px' }}>
          CROX BRIDGE
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

              <SelectBridge>
                <Text fontSize="16px" color="#8B8CA7" >Select Bridge</Text>
                {
                  sendingToken || receivingToken ?
                    <ItemWrap>
                      {showConnext && <BridgeItem
                        style={{ background: selectedBridge === 1 && '#19191e' }}
                        onClick={() => setSelectBridge(1)}
                      >
                        Connext
                      </BridgeItem>}
                      {showAny && <BridgeItem
                        style={{ background: selectedBridge === 2 && '#19191e' }}
                        onClick={() => setSelectBridge(2)}
                      >
                        AnySwap
                      </BridgeItem>}
                    </ItemWrap>
                    :
                    <Nodata>No data yet</Nodata>
                }
              </SelectBridge>

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
                          <>
                            {
                              selectedBridge === 1 ?
                                <ConnextBtn
                                  selectedBridge={selectedBridge}
                                  ConfirmButton={ConfirmButton}
                                  loading={loading}
                                  isProcess={isProcess}
                                  requestedApproval={requestedApproval}
                                  isWarning={isWarning}
                                  auctionResponse={auctionResponse}
                                  isApproved={isApproved}
                                  sendingToken={sendingToken}
                                />
                                :
                                <AnySwapBtn
                                  requestedApproval={requestedApproval}
                                  sendingToken={sendingToken}
                                  selectedBridge={selectedBridge}
                                  isWarning={isWarning}
                                  loading={loading}
                                  isAnyApprove={isAnyApprove}
                                  AnyConfirm={AnyConfirm}
                                />
                            }
                          </>

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
        </Flex>
      </Page >
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
