import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import type { Web3Provider as ProviderType } from '@ethersproject/providers';

export function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export type Provider = ProviderType;