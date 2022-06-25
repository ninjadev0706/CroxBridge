/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { injected, bsc, walletconnect } from "../../utils/connector";
// import WalletConnector from '../../hooks/useWalletConnector'
import { Menu as UikitMenu, Button as UiKitButton, useMatchBreakpoints, useWalletModal, Text, Flex, ConnectorId, Link } from 'crox-new-uikit'
import Menu, {
  Button,
  Dropdown,
  Separator,
  DropdownItem,
} from "@kenshooui/react-menu";
import BridgeIcon from './Icon/bridgeIcon'
import {
  Menu as MobileMenu,
  MenuItem,
  MenuButton,
  SubMenu
} from '@szhsin/react-menu';
import "./mobileMenu.css";
import SideBar from "./sidebar";
import styled from 'styled-components'
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import '@szhsin/react-menu/dist/index.css';
import { usePriceCakeBusd } from "state/hooks";
import CroxMasHeaderIcon from "./CroxMasHeaderIcon"

const StyledMenu = styled(Menu)`
  background-color:  #1A1B23;
  padding: 0px 10px;
  box-sizing: border-box;
  height: 62px;
  position: fixed;
  top: 0;
  z-index: 10
`

const NetworkMenu = styled(Menu)`
  width: 30px;
  background-color: #2c2d3a;
  top: 0;
  & .networkDropDown {
    padding: 0 5px;
  }
  & svg {
    display: none;
  }
`

const StyledMobileMenu = styled.div`
  width: 100%;
  display: flex;
  height: 62px;
  align-items: center;
  background-color:  #1A1B23;
  padding: 0px 10px;
  box-sizing: border-box;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 10
`

const StyledMenuItem = styled(MenuItem)`
  color: white;
  width: 180px;
  padding: 20px 20px;
  &:hover {
    background: #0498aec7;
  }
`
const StyledSubMenu = styled(SubMenu)`
  background-color:  #1A1B23;
`

const StyledButton = styled(Button)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: none;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 14px;
  font-weight: 100;
  &:hover {
    border-top: none;
  }
`

const SwitchNetButton = styled.div`
  margin: 0 24px;
  padding: 0;
  align-items: center;
  display: flex;
  background-color: #2C2D3A;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  img {
    margin-left: 4px;
  }
  z-index: 0;
`

const ConnectButton = styled(Button)`
  margin-left: 16px;
  padding: 9px 16px;
  background-color: #3B3C4E;
  color: white;
  font-size: 14px;
  border-radius: 20px;
  z-index: 1;
`

const AccountDisplayButton = styled(Button)`
  margin-right: 16px;
  padding: 9px 16px;
  background-color: #3B3C4E;
  color: white;
  font-size: 14px;
  border-radius: 12px;
  z-index: 1;
`

const AccountButton = styled(Button)`
  padding: 3px 8px;
  align-items: center;
  background-color: #3B3C4E;
  color: white;
  border-radius: 12px;
  padding-top: 7px;
`

const CroxPriceSection = styled.div`
  display: flex;
  padding: 9px 16px;
  align-items: center;
  background-color: #3B3C4E;
  color: white;
  border-radius: 16px;
`

const StyledDropDown = styled(Dropdown)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: none;
  box-sizing: border-box;
  padding: 0px 30px;
  font-size: 14px;
  font-weight: 100;
  &:hover {
    background-color: transparent;
    border-top: none;
  }
  & .itemContainer {
    background-color:  #23242F;
    border: none;
    border-radius: 8px;
  }
  `

const StyledDropDownNetwork = styled(Dropdown)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: none;
  box-sizing: border-box;
  padding: 0px 30px;
  font-size: 14px;
  font-weight: 100;
  &:hover {
    background-color: transparent;
    border-top: none;
  }
  & .itemContainer {
    margin-left: -25px;
    margin-top: 10px;
    background-color:  #23242F;
    border: none;
    border-radius: 8px;
  }
  `

const StyledDropDownGroup = styled.div`
  padding: 8px 0;
  background-color: #23242F;
  border-radius: 8px;
  & .swap {
    padding: 16px;
    display: flex;
  }
  & .liquidity {
    padding: 16px;
    display: flex;
  }
`

const StyledDropDownItem = styled(DropdownItem)`
  background-color:  #23242F;
  width: 300px;
  border: none;
  padding: 30px 20px;
  &:hover {
    background-color: #2C2D3A;;
    .changeText {
      color: #0177FB;
    }
  }
  `

const StyledDropDownNetworkItem = styled(DropdownItem)`
  background-color:  #23242F;
  width: 187px;
  border: none;
  padding: 30px 20px;
  &:hover {
    background-color: #2C2D3A;;
    .changeText {
      color: #0177FB;
    }
  }
  `

const StyledDropDownMenuItem = styled(Dropdown)`
  color: white;
  box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 100;
  background-color:  #23242F;
  border: none;
  padding: 30px 20px;
  & .itemContainer {
    background-color: #23242F;
    border: none;
`

let IsConnectConfirm = false;

const Header = (props) => {
  const history = useHistory();
  const { activate, deactivate, account, error } = useWeb3React();
  useEffect(() => {
    if (localStorage.getItem("accountStatus")) {
      activate(injected)
    }
  }, [])
  // const walletconnect = WalletConnector();
  const handleLogin = (connectorId: ConnectorId) => {
    IsConnectConfirm = true;
    if (connectorId === "walletconnect") {
      return activate(walletconnect);
    }
    if (connectorId === "bsc") {
      return activate(bsc);
    }
    return activate(injected);
  };
  const { onPresentNewAccountModal, onPresentNewConnectModal } = useWalletModal(
    handleLogin,
    deactivate,
    account as string
  );

  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();
  const cakePriceUsd = usePriceCakeBusd();

  return (
    <>
      {!isMd && !isSm && !isXs && !isLg ? (
        <StyledMenu className="menu">
          <img src="/logo1.png" width="65px" alt="logo1" style={{ margin: "20px 59px", marginRight: "23.41px", height: "23.64px" }} />
          <StyledButton className="button"><a href="https://app.croxswap.com/">Home</a></StyledButton>
          <StyledDropDown label="Trade" className="dropdown itemContainer" itemsClassName="itemContainer">
            <StyledDropDownGroup>
              <StyledDropDownItem className="menu-item swap">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://exchange.croxswap.com/#/swap">
                  <Flex alignItems='center'>
                    <SwapHorizontalCircleIcon sx={{ fontSize: '18px' }} />
                    <Text bold ml='3px'>Swap</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text style={{ lineHeight: '24px' }} mt="10px">Exchange your tokens using</Text>
                    <Text style={{ lineHeight: '24px' }}>CroxSwap DEX</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item liquidity">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://exchange.croxswap.com/#/pool">
                  <Flex alignItems='center'>
                    <MonetizationOnIcon sx={{ fontSize: '18px' }} />
                    <Text bold>Liquidity</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text style={{ lineHeight: '24px' }} mt='10px'>Provide liquidity to earn a share</Text>
                    <Text style={{ lineHeight: '24px' }}>of trade fees</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
            </StyledDropDownGroup>
          </StyledDropDown>
          <StyledButton className="button"><a href="https://app.croxswap.com/farms">Farms</a></StyledButton>
          <StyledButton className="button"><a href="https://app.croxswap.com/pools/crox">Pools</a></StyledButton>
          <StyledDropDown label="Bridge" className="dropdown itemContainer" itemsClassName="itemContainer">
            <StyledDropDownGroup>
              <StyledDropDownItem className="menu-item swap">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://www.iswap.com/en-us/?type=bridge">
                  <Flex alignItems='center'>
                    <div style={{ width: '16px', height: '16px' }}>
                      <BridgeIcon />
                    </div>
                    <Text color="white" bold ml='5px' fontSize="14px">HECO Bridge (iSwap)</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt="10px">Exchange your tokens using iSwap</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item swap">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://bridge.croxswap.com">
                  <Flex alignItems='center'>
                    <div style={{ width: '16px', height: '16px' }}>
                      <BridgeIcon />
                    </div>
                    <Text color="white" bold ml='5px' fontSize="14px">CROX Bridge (soon)</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt="10px">Exchange your tokens using CROXSWAP</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item swap">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="/explorer">
                  <Flex alignItems='center'>
                    <div style={{ width: '16px', height: '16px' }}>
                      <BridgeIcon />
                    </div>
                    <Text color="white" bold ml='5px' fontSize="14px">Tx Explorer (soon)</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
            </StyledDropDownGroup>
          </StyledDropDown>
          <StyledButton className="button"><a href="https://referral.croxswap.com">Referral</a></StyledButton>
          <StyledButton className="button"><a href="https://app.croxswap.com/ico">XPad</a></StyledButton>
          <Separator />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href='https://coinmarketcap.com/currencies/croxswap' external style={{ textDecoration: 'none' }}>
              <CroxPriceSection>
                <Text fontSize='14px' color="white">$CROX: </Text>
                <Text fontSize='14px' ml="5px" color="white">{cakePriceUsd.toFixed(3)}</Text>
              </CroxPriceSection>
            </Link>
            {!account ? (
              <SwitchNetButton>
                <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '18px', height: '17px' }} />
                <NetworkMenu className="menu">
                  <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer">
                    <StyledDropDownGroup>
                      <StyledDropDownNetworkItem className="menu-item swap">
                        <img src="/images/network/ethereum_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText" >Ethereum</a>
                        </div>
                      </StyledDropDownNetworkItem>
                      <StyledDropDownNetworkItem className="menu-item liquidity">
                        <img src="/images/network/polygon_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText">Polygon</a>
                        </div>
                      </StyledDropDownNetworkItem>
                    </StyledDropDownGroup>
                  </StyledDropDownNetwork>
                </NetworkMenu>
                <ConnectButton onClick={onPresentNewConnectModal}>Connect to a wallet</ConnectButton>
              </SwitchNetButton>
            ) : (
              <SwitchNetButton>
                <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '18px', height: '17px' }} />
                <NetworkMenu className="menu">
                  <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer">
                    <StyledDropDownGroup>
                      <StyledDropDownNetworkItem className="menu-item swap">
                        <img src="/images/network/ethereum_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText">Ethereum</a>
                        </div>
                      </StyledDropDownNetworkItem>
                      <StyledDropDownNetworkItem className="menu-item liquidity">
                        <img src="/images/network/polygon_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText">Polygon</a>
                        </div>
                      </StyledDropDownNetworkItem>
                    </StyledDropDownGroup>
                  </StyledDropDownNetwork>
                </NetworkMenu>
                <ConnectButton onClick={onPresentNewAccountModal}>{account.slice(0, 5)}...{account.slice(-5)}</ConnectButton>
              </SwitchNetButton>
            )}
            <AccountButton>
              <img src="/images/egg/menu.png" alt="menu icon" />
            </AccountButton>
          </div>
        </StyledMenu>
      ) : (
        <StyledMobileMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div id="App">
              <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            </div>
            <img src="/logo1.png" width="65pc" alt="logo1" style={{ margin: "8px 14px", marginRight: "80px" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <span style={{ color: "white", padding: "10px", background: "#253253", marginRight: "20px", borderRadius: '8px' }}>$CROX: $20.62</span> */}
            {!account ? (
              <SwitchNetButton>
                <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '18px', height: '17px' }} />
                <NetworkMenu className="menu">
                  <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer">
                    <StyledDropDownGroup>
                      <StyledDropDownNetworkItem className="menu-item swap">
                        <img src="/images/network/ethereum_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText" >Ethereum</a>
                        </div>
                      </StyledDropDownNetworkItem>
                      <StyledDropDownNetworkItem className="menu-item liquidity">
                        <img src="/images/network/polygon_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText">Polygon</a>
                        </div>
                      </StyledDropDownNetworkItem>
                    </StyledDropDownGroup>
                  </StyledDropDownNetwork>
                </NetworkMenu>
                <ConnectButton onClick={onPresentNewConnectModal}>Connect</ConnectButton>
              </SwitchNetButton>
            ) : (
              <SwitchNetButton>
                <img src="/images/network/bsc_icon.png" alt="ETH" style={{ width: '18px', height: '17px' }} />
                <NetworkMenu className="menu">
                  <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer">
                    <StyledDropDownGroup>
                      <StyledDropDownNetworkItem className="menu-item swap">
                        <img src="/images/network/ethereum_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText">Ethereum</a>
                        </div>
                      </StyledDropDownNetworkItem>
                      <StyledDropDownNetworkItem className="menu-item liquidity">
                        <img src="/images/network/polygon_icon.png" alt="arrow" style={{ width: '18px', height: '17px' }} />
                        <div style={{ marginLeft: '7px' }}>
                          <a href="#" style={{ fontWeight: 'bold' }} className="changeText">Polygon</a>
                        </div>
                      </StyledDropDownNetworkItem>
                    </StyledDropDownGroup>
                  </StyledDropDownNetwork>
                </NetworkMenu>
                <ConnectButton onClick={onPresentNewAccountModal}>{account.slice(0, 5)}...{account.slice(-5)}</ConnectButton>
              </SwitchNetButton>
            )}
          </div>
        </StyledMobileMenu>
      )}
      <div style={{ height: 62 }}></div>
    </>
  )
}

export default Header