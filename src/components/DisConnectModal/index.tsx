import React, {useState, useCallback} from 'react';
import {Modal, ListGroup} from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { injected, bsc } from "../../utils/connector";
import './dcwstyle.css';

const DisConnectModal = (props) => {
  
    const { show, onHide, account } = props

    const { library, activate, deactivate } = useWeb3React();

    const disConnectWallet = useCallback(() => {
        if(localStorage.getItem("wallet"))
        {
          localStorage.removeItem("wallet");
          deactivate()
          onHide()
        }
    }, [deactivate, onHide]);

    return (
      <Modal show={show} onHide={onHide}  aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <p id="connect_modal_title">Disconnect wallet</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
              <div className="address-text">{account}</div> 
            <ListGroup.Item onClick={() => disConnectWallet()}> 
              <div className="disconnect-text">Logout</div> 
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    );
}

export default DisConnectModal;
