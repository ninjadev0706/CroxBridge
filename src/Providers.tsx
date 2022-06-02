import React from 'react'
import { ModalProvider } from 'crox-new-uikit'
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from 'react-redux'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'
import {getLibrary} from './utils/getLibrary';

const Providers: React.FC = ({ children }) => {

  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <LanguageContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
            <BlockContextProvider>
              <RefreshContextProvider>
                <ModalProvider>{children}</ModalProvider>
              </RefreshContextProvider>
            </BlockContextProvider>
          </Web3ReactProvider>
        </LanguageContextProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
