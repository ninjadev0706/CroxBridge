import { useEffect, useState } from "react"
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import random from 'lodash/random'
import chainsdetails from '../config/chains.json';

const WalletConnector = () => {
    let { chainId } = useWeb3React();
    if (!chainId) {
        chainId = 56;
    }
    const [walletconnect, setWalletConnect] = useState<WalletConnectConnector>();
    const chainConfig = chainsdetails.find((chainsdetail) => chainsdetail.chain_id === chainId);
    const rpcs = chainConfig.provider_params[0].rpcUrls;
    const randomIndex = random(0, rpcs.length - 1)
    const rpc = rpcs[randomIndex]

    useEffect(() => {
        const wallet = new WalletConnectConnector({
            rpc: { [chainId]: rpc },
            bridge: "https://bridge.walletconnect.org",
            qrcode: true,
            // pollingInterval: POLLING_INTERVAL,
        })
        setWalletConnect(wallet);
    }, [chainId, rpc]);
    return walletconnect;
}

export default WalletConnector;