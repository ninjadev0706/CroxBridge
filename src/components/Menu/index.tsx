import React, { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/hooks'
import { injected, bsc } from "../../utils/connector";
import WalletConnector from '../../hooks/useWalletConnector'
import { Menu as UikitMenu, ConnectorId } from 'crox-new-uikit'
import config from './config'

const Menu = (props) => {
  const { account, activate, deactivate } = useWeb3React()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  // const walletconnect = WalletConnector();
  const handleLogin = (connectorId: ConnectorId) => {
    // if (connectorId === "walletconnect") {
    //   return activate(walletconnect);
    // }
    if (connectorId === "bsc") {
      return activate(bsc);
    }
    return activate(injected);
  };

  return (
    <UikitMenu
      account={account}
      login={handleLogin}
      logout={deactivate}
      isDark={false}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config}
      priceLink=" "
      {...props}
    />
  )
}

export default Menu
