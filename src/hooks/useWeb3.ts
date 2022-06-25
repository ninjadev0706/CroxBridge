import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { HttpProviderOptions } from 'web3-core-helpers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
// const simpleRpcProvider = new Web3Provider((window as any).ethereum);

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the ethereum provider change
 */
const useWeb3 = () => {
  const { library } = useWeb3React()
  // const refEth = useRef(library)
  const [web3, setweb3] = useState(new Web3(httpProvider))

  useEffect(() => {
    if (library) {
      setweb3(new Web3(library.provider))
    } else {
      setweb3(new Web3(httpProvider))
    }
  }, [library])

  return web3
}

export default useWeb3
