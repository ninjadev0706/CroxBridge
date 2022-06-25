import React from 'react'
import styled from 'styled-components'
import { Button } from 'crox-new-uikit';
import CircularProgress from '@mui/material/CircularProgress';
import { BridgeBtn } from './styles';
import '../walletButton.scss';


const ConnextBtn = ({ selectedBridge, ConfirmButton, loading, isProcess, requestedApproval, isWarning, auctionResponse, isApproved, sendingToken }) => {

    return (
        <BridgeBtn
            className='bridge-btn'
            onClick={ConfirmButton}
        >
            {(loading || isProcess || requestedApproval) && <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginRight: "10px" }} />}{' '}
            {
                isWarning ?
                    <>
                        {isWarning}
                    </>
                    :
                    <>
                        {!auctionResponse ? 'Get Transfer Quote' :
                            <>
                                {
                                    !isApproved ?
                                        <>
                                            {
                                                requestedApproval ?
                                                    <>Approving...</>
                                                    :
                                                    <>Approve {sendingToken.name}</>
                                            }
                                        </>
                                        :
                                        <>
                                            {isProcess ? 'In Process' : 'Bridge'}
                                        </>
                                }
                            </>
                        }
                    </>
            }
        </BridgeBtn>
    )
}

export default ConnextBtn;
