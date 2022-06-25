import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string,
  56: process.env.RPC_URL_56 as string,
}

const chainIds = [1, 4, 5, 56, 137, 250];

export const injected = new InjectedConnector({ supportedChainIds: chainIds })

export const walletconnect = new WalletConnectConnector({
  rpc: { 
    1: RPC_URLS[1],
    4: RPC_URLS[4],
    5: RPC_URLS[5],
    56: RPC_URLS[56],
    137: RPC_URLS[137],
    250: RPC_URLS[250]
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
})

export const bsc = new BscConnector({ supportedChainIds: chainIds })
