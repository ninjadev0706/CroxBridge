import React, { useState } from 'react'
import { ethers } from 'ethers';
import styled from 'styled-components'
import { Text, Flex, Button } from 'crox-new-uikit'
import { BsArrowLeftRight } from 'react-icons/bs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from './Divider';

const StyledModal = styled.div`
  background-color: #23242F;
  border-radius: 10px;
  text-align: center;
  width: 500px;
  transition: all ease 200ms;
  @media screen and (max-width: 800px) {
    width: 350px;
    margin: auto;
  }
`

const ContainerWrap = styled.div`
  padding: 20px 20px 0px 20px;
`

const ButtonWrap = styled.div`
  padding: 15px 20px;
`

const Tooltip = styled.p<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "block" : "none")};
  bottom: -22px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: #3b3c4e;
  color: white;
  border-radius: 16px;
  opacity: 0.7;
  padding-top: 4px;
  position: absolute;
`;

const ConfirmModal = ({ auctionResponse, fromChain, toChain, sendingToken, receivingToken, handleBridge, loading }) => {

  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);
  // const [loading, setLoading] = useState(false);

  const receivingAddress = auctionResponse.bid.receivingAddress;
  const routerAddress = auctionResponse.bid.router;

  // const handleBridge = async () => {
  //   if (!sdk || !auctionResponse) {
  //     return;
  //   }

  //   setLoading(true);

  //   let transfer;
  //   try {
  //     transfer = await sdk.prepareTransfer(auctionResponse, true);
  //   } catch (err: any) {
  //     setError("User denied transaction signature");
  //     onDismiss();
  //   }
    
  //   onDismiss();
  // }

  return (
    <StyledModal>
      <ContainerWrap>
        <Text fontSize='22px' style={{ textAlign: 'left' }} bold>Bridge Confirmation</Text>
        <Flex justifyContent='center' m='10px 0'>
          <div>
            <div>
              <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} style={{ width: '40px' }} />
            </div>
            <Text color='#67646c' fontSize='15px'>{fromChain.title}</Text>
          </div>
          <BsArrowLeftRight style={{ margin: '10px 20px', cursor: "pointer", color: 'white' }} />
          <div>
            <div>
              <img src={`images/network/${toChain.img}_net.png`} alt={`${toChain.title} icon`} style={{ width: '40px' }} />
            </div>
            <Text color='#67646c' fontSize='15px'>{toChain.title}</Text>
          </div>
        </Flex>
        <Flex justifyContent='space-between' m='10px 0'>
          <Text fontSize='18px' color='#67646c'>Receiving Address:</Text>
          <Text fontSize='18px' bold>
            <Flex color='white' style={{ position: 'relative' }}>
              {receivingAddress.slice(0, 5)}...{receivingAddress.slice(-5)}
              <ContentCopyIcon style={{ margin: '4px', fontSize: '18px' }} onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(receivingAddress);
                  setIsTooltipDisplayed(true);
                  setTimeout(() => {
                    setIsTooltipDisplayed(false);
                  }, 1000);
                }
              }} />
              <Tooltip isTooltipDisplayed={isTooltipDisplayed} style={{ width: "70px", left: "85px" }}>Copied</Tooltip>
            </Flex>
          </Text>
        </Flex>
        <Flex justifyContent='space-between' m='10px 0'>
          <Text fontSize='18px' color='#67646c'>Router Address:</Text>
          <Text fontSize='18px' bold>
            <Flex color='white'>
              {routerAddress.slice(0, 5)}...{routerAddress.slice(-5)}
              <ContentCopyIcon style={{ margin: '4px', fontSize: '18px' }} onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(routerAddress);
                  setIsTooltipDisplayed(true);
                  setTimeout(() => {
                    setIsTooltipDisplayed(false);
                  }, 1000);
                }
              }} />
            </Flex>
          </Text>
          <Tooltip isTooltipDisplayed={isTooltipDisplayed} style={{ width: "70px", left: "-15px" }}>Copied</Tooltip>
        </Flex>
        <Divider style={{ margin: '10px 0' }} />
        <Flex justifyContent='space-between' m='10px 0'>
          <Text fontSize='18px' color='#67646c'>Send Amount:</Text>
          <Text fontSize='18px' bold>{ethers.utils.formatUnits(auctionResponse.bid.amount, 18)} {sendingToken.name}</Text>
        </Flex>
        <Flex justifyContent='space-between' m='10px 0'>
          <Text fontSize='18px' color='#67646c'>Fees:</Text>
          <Text fontSize='18px' bold>{ethers.utils.formatUnits(auctionResponse.totalFee, 18)} {receivingToken.name}</Text>
        </Flex>
        <Flex justifyContent='space-between' m='10px 0'>
          <Text fontSize='18px' color='#67646c'>Estimated Received:</Text>
          <Text fontSize='18px' bold>{ethers.utils.formatUnits(auctionResponse.bid.amountReceived, 18)} {receivingToken.name}</Text>
        </Flex>
      </ContainerWrap>
      <Divider style={{ margin: '0' }} />
      <ButtonWrap>
        <Button style={{ cursor: 'pointer' }} fullWidth 
          onClick={handleBridge}
        >
            {loading && <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginRight: '10px' }} />}{' '}
          <Text fontSize='20px' bold>
            Confirm
          </Text>
        </Button>
      </ButtonWrap>
      
    </StyledModal>
  )
}

export default ConfirmModal
