import { Web3Provider } from '@ethersproject/providers';

const simpleRpcProvider = new Web3Provider(
  (window as any).ethereum
);

export default simpleRpcProvider;
