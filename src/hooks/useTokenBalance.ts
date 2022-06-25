import { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import cakeABI from 'config/abi/cake.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/erc20'
import { getCakeAddress } from 'utils/addressHelpers'
import sample from 'lodash/sample'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string | null) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, library } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(library.provider, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && library && tokenAddress) {
      fetchBalance()
    }
  }, [account, library, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getContract(cakeABI, getCakeAddress())
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const cakeContract = getContract(cakeABI, getCakeAddress())
      const bal = await cakeContract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(bal))
    }

    fetchBalance()
  }, [tokenAddress, slowRefresh])

  return balance
}

export const useToTokenBalance = (tokenAddress: string, rpc) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  
  useEffect(() => {
    const fetchBalance = async () => {
      let rpcUrl = sample(rpc);
      if(rpcUrl.includes("rinkeby")) {
        rpcUrl = "https://rinkeby.infura.io/v3/e92c433ba7214537873fe0025ee0763c";
      }
      if(rpcUrl.includes("goerli")) {
        rpcUrl = 'https://goerli.infura.io/v3/e92c433ba7214537873fe0025ee0763c';
      }
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const signer = provider.getSigner(tokenAddress);
      const tokenContract = new ethers.Contract(tokenAddress, cakeABI, signer);
      const res = await tokenContract.balanceOf(account);
      setBalance(new BigNumber(res))
    }

    if (account && rpc && tokenAddress) {
      fetchBalance()
    }
  }, [account, tokenAddress, fastRefresh, rpc])

  return balance
}

export default useTokenBalance
