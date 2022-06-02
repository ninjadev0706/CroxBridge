import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
// import getNodeUrl from './getRpcUrl'


// export const injected = new InjectedConnector({
//   supportedChainIds: [1, 2, 3, 4, 5, 56, 97],
// });

// export const walletconnect = new WalletConnectConnector({
//   rpc: { 1: "https://mainnet.infura.io/v3/1c3acca035dd41dfbf400abac71e59a7" },
//   bridge: "https://bridge.walletconnect.org",
//   qrcode: true,
//   pollingInterval: 8000,
// });
const POLLING_INTERVAL = 12000
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
const chainIds = [1, 4, 5, 56, 137, 250];
// const rpcUrl = getNodeUrl()

export const injected = new InjectedConnector({ supportedChainIds: chainIds })

// export const walletconnect = new WalletConnectConnector({
//   rpc: { [chainId]: rpcUrl },
//   bridge: "https://bridge.walletconnect.org",
//   qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
// })

export const bsc = new BscConnector({ supportedChainIds: chainIds })
