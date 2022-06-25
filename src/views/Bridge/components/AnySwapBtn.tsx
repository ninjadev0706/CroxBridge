import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { BridgeBtn } from './styles';
import '../walletButton.scss';


const AnySwapBtn = ({ selectedBridge, isWarning, loading, isAnyApprove, sendingToken, AnyConfirm, requestedApproval }) => {

    return (
        <BridgeBtn
            className='bridge-btn'
            onClick={AnyConfirm}
        >
            {(loading || requestedApproval) && <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginRight: "10px" }} />}{' '}
            {
                isWarning ?
                    <>
                        {isWarning}
                    </>
                    :
                    <>
                        {
                            !isAnyApprove ?
                                <>Approve {sendingToken && sendingToken.name}</>
                                :
                                <>Bridge</>
                        }
                    </>
            }
        </BridgeBtn>
    )
}

export default AnySwapBtn;
