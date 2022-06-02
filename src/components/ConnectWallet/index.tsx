import React, {useState, useEffect, useCallback} from 'react'
import {Modal, ListGroup} from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { injected, bsc } from "../../utils/connector";
import WalletConnector from '../../hooks/useWalletConnector'
import './cwstyle.css';

const ConnectWallet = (props) => {
  
    const { show, onHide } = props
    const { library, activate, deactivate } = useWeb3React();
    // const walletconnect = WalletConnector()
    
    const handleWallet = useCallback((wallet) => {
      if (wallet === "metamask") {
        activate(injected)
        localStorage.setItem("wallet", "Metamask");
        onHide()
      }
      if (wallet === "binance") {
        activate(bsc)
        localStorage.setItem("wallet", "Binance Chain");
        onHide()
      }
      if (wallet === "trustwallet") {
        // activate(walletconnect)
        // localStorage.setItem("wallet", "WalletConnect");
        // onHide()
      }
    }, [activate, onHide]);

    return (
      <Modal show={show} onHide={onHide}  aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <p id="connect_modal_title">Connect wallet</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item onClick={() => handleWallet("metamask")}> 
              <div>
                <img alt="" className="wallet-logo" src="/images/wallet/meta-mask.png" />
              </div>
              <div className="wallet-text">Meta Mask</div> 
            </ListGroup.Item>
            <ListGroup.Item onClick={() => handleWallet("binance")}> 
              <div className="wallet-logo">
                <img alt="" className="wallet-logo" src="/images/wallet/BNB.png" />
              </div>
              <div className="wallet-text">Binance Chain Wallet</div>  
            </ListGroup.Item>
            <ListGroup.Item onClick={() => handleWallet("trustwallet")}> 
              <div className="wallet-logo">
                <img alt="" className="wallet-logo" src="/images/wallet/walletconnect.png" />
              </div>
              <div className="wallet-text">WalletConnect</div> 
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    );
}

export default ConnectWallet;
