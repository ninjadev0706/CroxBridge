import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { injected, bsc } from '../utils/connector'

export const useEagerConnect = () => {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized && localStorage.getItem("wallet") === "Metamask") {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
    bsc.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized && localStorage.getItem("wallet") === "Binance Chain") {
        activate(bsc, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
    // walletconnect.getChainId().then((getChainId: number | string) => {
    //   if (getChainId && localStorage.getItem("wallet") === "WalletConnect") {
    //     activate(walletconnect, undefined, true).catch(() => {
    //       setTried(true)
    //     })
    //   } else {
    //     setTried(true)
    //   }
    // })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
};

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
      const { ethereum } = window as any;
      if (ethereum && ethereum.on && !active && !error && !suppress) {
          const handleChainChanged = (chainId) => {
              activate(injected);
          };

          const handleAccountsChanged = (accounts) => {
              if (accounts.length > 0) {
                  activate(injected);
              }
          };

          const handleNetworkChanged = (networkId) => {
              activate(injected);
          };

          ethereum.on("chainChanged", handleChainChanged);
          ethereum.on("accountsChanged", handleAccountsChanged);
          ethereum.on("networkChanged", handleNetworkChanged);

          return () => {
              if (ethereum.removeListener) {
                  ethereum.removeListener("chainChanged", handleChainChanged);
                  ethereum.removeListener(
                      "accountsChanged",
                      handleAccountsChanged
                  );
                  ethereum.removeListener(
                      "networkChanged",
                      handleNetworkChanged
                  );
              }
          };
      }

      return () => {""};
  }, [active, error, suppress, activate]);
}