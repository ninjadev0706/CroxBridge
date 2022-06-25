import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, LinkExternal, Skeleton } from 'crox-new-uikit'
import { BsArrowLeftRight } from 'react-icons/bs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from "@mui/material/useMediaQuery";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StepProgress from './StepProgress';

const StyledModal = styled.div`
  background-color: #23242F;
  border-radius: 10px;
  text-align: center;
  width: 1000px;
  transition: all ease 200ms;
  @media screen and (max-width: 800px) {
    width: 350px;
    margin: auto;
  }
`

const ContainerWrap = styled.div`
  padding: 20px;
  color: white;
`

const Pending = styled.div`
  background-color: #3b82f6;
  padding: 3px 10px;
  border-radius: 5px;
  width: 100px;
  text-align: center;
  height: 30px;
  line-height: initial;
  @media screen and (max-width: 800px) {
    margin: 10px auto;
  }
`

const Prepared = styled.div`
  background-color: #f59e0b;
  padding: 3px 10px;
  border-radius: 5px;
  width: 100px;
  text-align: center;
  height: 30px;
  line-height: initial;
  @media screen and (max-width: 800px) {
    margin: 10px auto;
  }
`

const Fulfilled = styled.div`
  background-color: #34d399;
  padding: 3px 10px;
  border-radius: 5px;
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: initial;
  @media screen and (max-width: 800px) {
    margin: 10px auto;
  }
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

const ChainName = styled.p`
  display: flex;
  height: 100%;
  align-items: center;
`;

const SignModal = ({ sendPrepare, txId, fromChain, toChain, receivingToken, signToClaim, loading, WaitRouter, isWait, prepared, isSuccess, routerAddress, receivedAddress, sendingAddress, relayerFee }) => {

  const [isTxTooltipDisplayed, setTxTooltipDisplayed] = useState(false);
  const [isSendAddrTooltipDisplayed, setSendAddrTooltipDisplayed] = useState(false);
  const [isRouterAddrTooltipDisplayed, setRouterAddrTooltipDisplayed] = useState(false);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);
  const isSmMobile = useMediaQuery("(max-width: 1000px)");

  const token = receivingToken.assets[toChain.chainID]

  const addWatchToken = useCallback(async () => {
    // switchtoChain();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = window.ethereum;
    if (provider) {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token,
              symbol: receivingToken.name,
              decimals: "18",
              image: "https://app.croxswap.com/images/egg/logo.png",
            },
          },
        });

        if (wasAdded) {
          // eslint-disable-next-line
          console.log("Token was added");
        }
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
  }, [token]);

  useEffect(() => {
    WaitRouter()
  }, [])

  return (
    <StyledModal>
      <ContainerWrap>
        <Flex justifyContent='space-between'>
          <Text fontSize='18px' bold>
            <Flex color='white' style={{ position: 'relative' }}>
              <Text fontSize='18px' color='#67646c' mr='10px'>TX ID: </Text>
              {txId.slice(0, 10)}...{txId.slice(-10)}
              <ContentCopyIcon style={{ margin: '4px', fontSize: '18px', color: '#67646c' }} onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(txId);
                  setTxTooltipDisplayed(true);
                  setTimeout(() => {
                    setTxTooltipDisplayed(false);
                  }, 1000);
                }
              }} />
              <Tooltip isTooltipDisplayed={isTxTooltipDisplayed} style={{ width: "70px", left: "85px" }}>Copied</Tooltip>
            </Flex>
          </Text>
          <LinkExternal href="/explorer">{!isSmMobile && <Text fontSize='15px' color='#2d74c4'>View TX</Text>}</LinkExternal>
        </Flex>
        <Flex justifyContent='space-between' style={{display: isSmMobile ? 'block' : 'flex'}} m='20px 0'>
          <div>
            <Flex color='white' style={{ position: 'relative', justifyContent: isSmMobile && 'center' }} mb='5px'>
              {sendingAddress.slice(0, 5)}...{sendingAddress.slice(-5)}
              <ContentCopyIcon style={{ margin: ' 0 4px', fontSize: '18px', color: '#67646c' }} onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(sendingAddress);
                  setSendAddrTooltipDisplayed(true);
                  setTimeout(() => {
                    setSendAddrTooltipDisplayed(false);
                  }, 1000);
                }
              }} />
              <Tooltip isTooltipDisplayed={isSendAddrTooltipDisplayed} style={{ width: "70px", left: "85px" }}>Copied</Tooltip>
            </Flex>
            <Flex style={{justifyContent: isSmMobile && 'center'}}>
              <img src={`images/network/${fromChain.img}_net.png`} alt={`${fromChain.title} icon`} style={{ width: '25px' }} />
              <Text fontSize='15px'><ChainName>{fromChain.title}</ChainName></Text>
            </Flex>
          </div>
          {/* {
            !isSmMobile && <> */}
              {
                !sendPrepare ?
                  <Skeleton width='100px' height="30px" />
                  :
                  <Prepared>PREPARED</Prepared>
              }
              <div>
                <div style={{ marginBottom: '5px' }}>
                  <BsArrowLeftRight style={{ margin: '0px 20px', cursor: "pointer" }} />
                </div>
                <div>
                  <Flex color='white' style={{ position: 'relative', justifyContent: isSmMobile && 'center' }}>
                    {routerAddress.slice(0, 5)}...{routerAddress.slice(-5)}
                    <ContentCopyIcon style={{ margin: ' 0 4px', fontSize: '18px', color: '#67646c' }} onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(routerAddress);
                        setRouterAddrTooltipDisplayed(true);
                        setTimeout(() => {
                          setRouterAddrTooltipDisplayed(false);
                        }, 1000);
                      }
                    }} />
                    <Tooltip isTooltipDisplayed={isRouterAddrTooltipDisplayed} style={{ width: "70px", left: "85px" }}>Copied</Tooltip>
                  </Flex>
                </div>
              </div>
              {
                isWait ?
                  <Pending>PENDING</Pending>
                  :
                  <>
                    {
                      isSuccess ?
                        <Fulfilled>FULFILLED</Fulfilled>
                        :
                        <>
                          {
                            prepared ? <Prepared>PREPARED</Prepared>
                              :
                              <Skeleton width='100px' height="30px" />
                          }
                        </>
                    }
                  </>
              }
            {/* </> */}
          {/* } */}
          <div>
            <Flex color='white' mb='5px' style={{ position: 'relative', justifyContent: isSmMobile && 'center' }}>
              {receivedAddress.slice(0, 5)}...{receivedAddress.slice(-5)}
              <ContentCopyIcon style={{ margin: ' 0 4px', fontSize: '18px', color: '#67646c' }} onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(receivedAddress);
                  setIsTooltipDisplayed(true);
                  setTimeout(() => {
                    setIsTooltipDisplayed(false);
                  }, 1000);
                }
              }} />
              <Tooltip isTooltipDisplayed={isTooltipDisplayed} style={{ width: "70px", left: "85px" }}>Copied</Tooltip>
            </Flex>
            <Flex style={{justifyContent: isSmMobile ? 'center' : 'end' }}>
              <img src={`images/network/${toChain.img}_net.png`} alt={`${toChain.title} icon`} style={{ width: '25px' }} />
              <Text fontSize='15px' mr='5px'><ChainName>{toChain.title}</ChainName></Text>
            </Flex>
          </div>
        </Flex>
        <div style={{ marginTop: '50px', display: isSmMobile ? 'block' : 'flex' }}>
          <Flex style={{ width: !isSmMobile ? '55%' : '100%' }} justifyContent='center'>
            <StepProgress isSuccess={isSuccess} />
          </Flex>
          {
            isWait ?
              <div style={{ width: !isSmMobile ? '45%' : '100%', justifyContent: 'center' }}>
                <img src="/images/hourglass.gif" alt='' style={{ borderRadius: '20px', margin: '15px' }} width='70px' />
                <Flex style={{ fontSize: '18px' }} justifyContent="center">
                  Waiting for Router
                  <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginLeft: "10px" }} />
                </Flex>
              </div>
              :
              <>
                {
                  isSuccess ?
                    <div style={{ width: !isSmMobile ? '45%' : '100%', justifyContent: 'center' }}>
                      <CheckCircleOutlineIcon style={{ fontSize: '50px' }} />
                      <Text fontSize='20px'>Claim Successful</Text>
                      <LinkExternal style={{ margin: 'auto' }}><Text fontSize='18px' color='#2d74c4'>View on Explorer</Text></LinkExternal>
                      <Flex style={{display: 'flex', justifyContent: 'center'}}>
                        <Flex m='0 5px' p='5px 10px' style={{ background: '#00000033', borderRadius: '20px', justifyContent: 'center', width: 'fit-content' }} onClick={addWatchToken}>
                          <Text m='0 10px'>Add</Text>
                          <Text bold>{receivingToken.name}</Text>
                          <Text m='0 10px'>to MetaMask</Text>
                          <img src="./Metamask.svg" alt={receivingToken && receivingToken.name} style={{ width: '24px' }} />
                        </Flex>
                      </Flex>
                    </div>
                    :
                    <div style={{ width: !isSmMobile ? '45%' : '100%', justifyContent: 'center' }}>
                      <Flex m='10px' justifyContent='center'>
                        <Text bold><ChainName>Relayer Fee:</ChainName></Text>
                        <Flex m='0 5px' p='5px 10px' style={{ background: '#00000033', borderRadius: '20px' }}>
                          <img src={`images/coins/${receivingToken && receivingToken.name}.png`} alt={receivingToken && receivingToken.name} style={{ width: '24px' }} />
                          <Text m='0 10px'>{relayerFee}</Text>
                          <Text>{receivingToken.name}</Text>
                        </Flex>
                      </Flex>
                      <Flex justifyContent='center'>
                        {
                          loading ?
                            <>
                              <Button style={{ fontSize: '22px', width: '300px', borderRadius: '15px' }}>
                                <CircularProgress color="inherit" style={{ width: "20px", height: "20px", marginRight: "10px" }} />
                                <Text fontSize='20px'>Claiming Funds</Text>
                              </Button>
                            </>
                            :
                            <Button style={{ fontSize: '22px', width: '300px', borderRadius: '15px' }} onClick={signToClaim}>Sign to &nbsp;<b>Claim Funds</b></Button>
                        }
                      </Flex>
                    </div>
                }
              </>
          }
        </div>
      </ContainerWrap>
    </StyledModal>
  )
}

export default SignModal
