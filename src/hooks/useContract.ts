import { useEffect, useState } from "react";
import { AbiItem } from "web3-utils";
import { ContractOptions } from "web3-eth-contract";
import useWeb3 from "hooks/useWeb3";
import {
  getMasterChefAddress,
  getCakeAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getPrevMasterChefAddress, 
  getBridgeFeeAddress, 
  getBridgeTokenAddress, 
  getCroxAddress
} from "utils/addressHelpers";
import { poolsConfig } from "config/constants";
import ifo from "config/abi/ifo.json";
import erc20 from "config/abi/erc20.json";
import rabbitmintingfarm from "config/abi/rabbitmintingfarm.json";
import pancakeRabbits from "config/abi/pancakeRabbits.json";
import lottery from "config/abi/lottery.json";
import lotteryTicket from "config/abi/lotteryNft.json";
import masterChef from "config/abi/masterchef.json";
import prevMasterChef from "config/abi/prevmasterchef.json";
import sousChef from "config/abi/sousChef.json";
import feeAbi from "config/abi/fee.json";
import router from "config/abi/anyRouter.json";

const useContract = (
  abi: AbiItem,
  address: string,
  contractOptions?: ContractOptions
) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(
    new web3.eth.Contract(abi, address, contractOptions)
  );

  useEffect(() => {
    if(address) { 
      setContract(new web3.eth.Contract(abi, address, contractOptions));
    }
  }, [abi, address, contractOptions, web3]);

  return contract;
};

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem;
  return useContract(ifoAbi, address);
};

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem;
  return useContract(erc20Abi, address);
};

export const useCake = () => {
  return useERC20(getCakeAddress());
};

export const useRabbitMintingFarm = (address: string) => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem;
  return useContract(rabbitMintingFarmAbi, address);
};

export const usePancakeRabbits = (address: string) => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem;
  return useContract(pancakeRabbitsAbi, address);
};

export const useLottery = () => {
  const abi = (lottery as unknown) as AbiItem;
  return useContract(abi, getLotteryAddress());
};

export const useLotteryTicket = () => {
  const abi = (lotteryTicket as unknown) as AbiItem;
  return useContract(abi, getLotteryTicketAddress());
};

export const useMasterchef = () => {
  const abi = (masterChef as unknown) as AbiItem;
  return useContract(abi, getMasterChefAddress());
};

export const usePrevMasterchef = () => {
  const abi = (prevMasterChef as unknown) as AbiItem;
  return useContract(abi, getPrevMasterChefAddress());
};

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.pid === id);
  const rawAbi = sousChef;
  const abi = (rawAbi as unknown) as AbiItem;
  return useContract(abi, config.lpAddresses[process.env.REACT_APP_CHAIN_ID]);
};

export const useFeeContract = (chainID) => {
  const abi = (feeAbi as unknown) as AbiItem;
  return useContract(abi, getBridgeFeeAddress(chainID));
}

export const useERC20Contract = (chainID) => {
  const erc20Abi = (erc20 as unknown) as AbiItem;
  return useContract(erc20Abi, getBridgeTokenAddress(chainID));
};

export const useERCContract = (chainID) => {
  const erc20Abi = (erc20 as unknown) as AbiItem;
  return useContract(erc20Abi, getCroxAddress(chainID));
};

export const useAnyRouterContract = (routerAddress) => {
  const routerAbi = (router as unknown) as AbiItem;
  return useContract(routerAbi, routerAddress);
};

export default useContract;